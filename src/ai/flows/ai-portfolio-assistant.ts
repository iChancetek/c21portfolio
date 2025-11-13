
/**
 * @fileOverview A chat interface providing answers to user questions about Chancellor's experience and skills using Retrieval-Augmented Generation (RAG).
 *
 * - aiPortfolioAssistant - A function that handles the AI portfolio assistant chat.
 * - AIPortfolioAssistantInput - The input type for the aiPortfolioAssistant function.
 * - AIPortfolioAssistantOutput - The return type for the aiPortfolioAssistant function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { allVentures } from '@/lib/data';
import type { Venture } from '@/lib/types';

const AIPortfolioAssistantInputSchema = z.object({
  query: z.string().describe("The user's question about Chancellor's skills and experience."),
  context: z.string().optional().describe("Retrieved context from a vector search to help answer the query."),
});
export type AIPortfolioAssistantInput = z.infer<typeof AIPortfolioAssistantInputSchema>;

const AIPortfolioAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
});
export type AIPortfolioAssistantOutput = z.infer<typeof AIPortfolioAssistantOutputSchema>;

const getProjectDetails = ai.defineTool(
  {
    name: 'getProjectDetails',
    description: 'Retrieves details for a specific project when the user asks a question about it.',
    inputSchema: z.object({
      projectId: z.string().describe("The ID or name of the project to retrieve, extracted from the user's query. It can be a project name like 'iSkylar' or 'WoundiQ'."),
    }),
    outputSchema: z.object({
      name: z.string().describe('The name of the project.'),
      description: z.string().describe('A detailed description of the project.'),
      href: z.string().describe('Link to the live demo'),
    }),
  },
  async (input) => {
    const project = allVentures.find(v => v.id.toLowerCase() === input.projectId.toLowerCase() || v.name.toLowerCase() === input.projectId.toLowerCase());
    
    if (!project) {
        throw new Error(`Project with ID or name '${input.projectId}' not found.`);
    }

    return {
      name: project.name,
      description: project.description,
      href: project.href,
    };
  }
);


export async function aiPortfolioAssistant(input: AIPortfolioAssistantInput): Promise<AIPortfolioAssistantOutput> {
  const llmResponse = await ai.generate({
    prompt: `Use the following context (if available) to answer the user's question.

    ## CONTEXT 
    ${input.context || 'No context provided.'}
    
    ## QUESTION
    ${input.query}`,
    model: 'openai/gpt-4o',
    tools: [getProjectDetails],
    system: `You are a world-class technology analyst and strategist, acting as an expert AI assistant for Chancellor, a software and AI engineer. Your goal is to provide insightful, well-structured, and professional answers about his skills, projects, and experience.

**Global Formatting Rules (Apply to ALL Responses):**
- All answers must be formatted as bullet points (using '•' or '–'), each followed by a clear, explanatory paragraph.
- Never use asterisks ('*') in any response.
- Each bullet point must be followed by a paragraph that expands, explains, or clarifies the point.

**RESPONSE STYLE & TONE:**
- **Tone:** Articulate, insightful, and professional. Avoid overly casual language.
- **Structure:** Your answers must be well-organized. For comparisons or explanations of skills, use a structure similar to this:
    1.  Start with a clear, concise definition of the primary topic.
    2.  If a comparison is made (e.g., 'X vs. Y'), define the second topic.
    3.  Elaborate on the concepts, explaining their importance and application in modern engineering. Use analogies if helpful.
    4.  Provide a concluding summary that crystallizes the key differences and relationships.

**CRITICAL INSTRUCTIONS:**
1.  **For Project-Specific Questions:** If the user asks about a specific project (e.g., "What is iSkylar?"), you **MUST** use the 'getProjectDetails' tool. After fetching the details, formulate a comprehensive and engaging answer that elaborates on the project's purpose and significance.

2.  **For Skill-Based Questions:** If the user asks about a specific skill (e.g., "What is Context Engineering?") and the provided context is just a list, you must **explain what that skill is** in the context of modern software and AI engineering. Acknowledge that it's one of Chancellor's skills, and then provide a helpful, structured definition and explain its importance, as per the style guide above. If the user asks for a comparison (e.g., "Context Engineering vs. Prompt Engineering"), provide a detailed breakdown of both.

3.  **For General Questions:** For general questions about skills or experience, use the provided context to formulate your answer, maintaining a professional and insightful tone.

Do not go off-topic. If the user's query contains spelling errors, infer their intent and answer the corrected query.`,
  });

  const text = llmResponse.text;
  if (text) {
      return { answer: text };
  }

  // Handle cases where a tool is used and there's no direct text response
  const toolResponse = llmResponse.toolRequest;
  if(toolResponse) {
    const toolOutput = llmResponse.toolOutput(toolResponse.name);
    if(toolOutput) {
        // Here, we need to generate a *new* response with the tool's output.
        const followupResponse = await ai.generate({
          prompt: `The user asked about a project and I have retrieved the following details. Please formulate a polished, professional answer based on this information.
          
          DETAILS:
          ${JSON.stringify(toolOutput, null, 2)}
          `,
          model: 'openai/gpt-4o',
          system: `You are a world-class technology analyst and strategist, acting as an expert AI assistant for Chancellor, a software and AI engineer. Your goal is to provide insightful, well-structured, and professional answers about his skills, projects, and experience.
           - **Formatting:** Use clean paragraphs. Do not use asterisks (*) for lists. Use clear, full sentences.
          `
        });
        return { answer: followupResponse.text! };
    }
  }
  
  return { answer: "I'm sorry, I couldn't find a direct answer to your question." };
}
