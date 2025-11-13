
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
    description: 'Retrieves details for a specific project or company when the user asks a question about it. Use this tool even for broad, single-word queries like "Simon" or "Condé Nast".',
    inputSchema: z.object({
      projectId: z.string().describe("The ID or name of the project or company to retrieve, extracted from the user's query. It can be a project name like 'iSkylar' or a company name like 'SIMON'."),
    }),
    outputSchema: z.object({
      name: z.string().describe('The name of the project.'),
      description: z.string().describe('A detailed description of the project.'),
      href: z.string().describe('Link to the live demo or website'),
    }),
  },
  async (input) => {
    const project = allVentures.find(v => v.name.toLowerCase() === input.projectId.toLowerCase());
    
    if (!project) {
        throw new Error(`Project or company with name '${input.projectId}' not found.`);
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
    ${input.context || 'No context provided. Use your tools to find an answer.'}
    
    ## QUESTION
    ${input.query}`,
    model: 'openai/gpt-4o',
    tools: [getProjectDetails],
    system: `You are a world-class technology analyst and strategist, acting as an expert AI assistant for Chancellor, a software and AI engineer. Your goal is to provide insightful, well-structured, and professional answers about his skills, projects, and experience.

**CRITICAL, UNBREAKABLE RULES:**
1.  **NEVER Ask for Clarification:** Your primary directive is to ALWAYS find an answer. If a user's query is broad, vague, or a single word (e.g., "Simon," "Braiva," "WNDR"), you MUST immediately use the 'getProjectDetails' tool to find a match. Do NOT ask for more context. It is your job to retrieve the information.
2.  **STRICT Formatting:** ALL responses MUST follow this exact format:
    -   Start with a bullet point (using '•' or '–').
    -   Follow the bullet point with a comprehensive, explanatory paragraph.
    -   Repeat this pattern for all points.
    -   NEVER use asterisks ('*'). NEVER deviate from this bullet-point-then-paragraph structure.

**RESPONSE STYLE & TONE:**
-   **Tone:** Articulate, insightful, and professional. Avoid overly casual language.
-   **Structure:** If comparing concepts (e.g., 'X vs. Y'), first define X, then define Y, then elaborate on their relationship and importance.

**TOOL USAGE PROTOCOL:**
1.  **For Project/Company Questions:** If the user asks about a specific entity (e.g., "What is iSkylar?", "Tell me about Simon"), you MUST use the 'getProjectDetails' tool. After fetching the details, formulate a comprehensive and engaging answer that elaborates on the entity's purpose and significance, following the strict formatting rules.
2.  **For Skill-Based Questions:** If the user asks about a skill (e.g., "What is Context Engineering?"), acknowledge it's one of Chancellor's skills, then provide a helpful, structured definition and explain its importance, as per the style guide.

Do not go off-topic. If the user's query contains spelling errors, infer their intent and answer the corrected query.`,
  });

  const text = llmResponse.text;
  if (text) {
      return { answer: text };
  }

  const toolResponse = llmResponse.toolRequest;
  if(toolResponse) {
    const toolOutput = llmResponse.toolOutput(toolResponse.name);
    if(toolOutput) {
        const followupResponse = await ai.generate({
          prompt: `The user asked about a project/company and I have retrieved the following details. Please formulate a polished, professional answer based ONLY on this information.

          DETAILS:
          ${JSON.stringify(toolOutput, null, 2)}
          `,
          model: 'openai/gpt-4o',
          system: `You are a world-class technology analyst and strategist. Your ONLY job is to synthesize the provided details into a clear, insightful answer.
           - **Formatting:** Adhere STRICTLY to the bullet-point-then-paragraph format. Use '•' or '–' for bullets. Do not use asterisks (*). Each bullet must be followed by a full, explanatory paragraph.
          `
        });
        return { answer: followupResponse.text! };
    }
  }
  
  return { answer: "I'm sorry, I couldn't find a direct answer to your question. Please try rephrasing your query." };
}

    