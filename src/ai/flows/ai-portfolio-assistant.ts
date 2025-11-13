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
import { ventures } from '@/lib/data';
import type { Venture } from '@/lib/types';

const allVentures: Venture[] = ventures.map((v, i) => ({...v, id: `venture-${i}`}));

const AIPortfolioAssistantInputSchema = z.object({
  query: z.string().describe("The user's question about Chancellor's skills and experience."),
  context: z.string().optional().describe("Retrieved context from a vector search to help answer the query."),
  isNavQuery: z.boolean().optional().describe("Set to true if the primary goal is to check for a navigational keyword."),
});
export type AIPortfolioAssistantInput = z.infer<typeof AIPortfolioAssistantInputSchema>;

const AIPortfolioAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
  navKeyword: z.string().optional().describe("If the user's query is a misspelled navigational keyword, this field will contain the corrected keyword (e.g., 'Projects', 'Skills', 'Contact', 'Affirmations')."),
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
    const project = allVentures.find(v => v.id === input.projectId || v.name.toLowerCase() === input.projectId.toLowerCase());
    
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
  return aiPortfolioAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPortfolioAssistantPrompt',
  input: {schema: AIPortfolioAssistantInputSchema},
  output: {schema: AIPortfolioAssistantOutputSchema},
  tools: [getProjectDetails],
  system: `You are a helpful and friendly AI assistant for a software engineer named Chancellor. 
           Your goal is to answer questions about his skills, projects, and experience.

           **CRITICAL INSTRUCTION: If the user's query is about a specific project (e.g., "What is iSkylar?", "Tell me about WoundiQ"), you MUST use the 'getProjectDetails' tool to fetch the project's information.**
           Do not try to answer from the general context. Once you have the details from the tool, use them to formulate a helpful and comprehensive answer. Elaborate on the information and provide it in a clear, engaging way.

           If 'isNavQuery' is true, your absolute first priority is to check if the user's query is a misspelled version of a navigational keyword.
           The valid navigational keywords are: "Projects", "Skills", "Contact", "Affirmations".
           If it is a misspelled keyword, set the 'navKeyword' field to the corrected keyword and provide a very short, confirmatory answer (e.g., "Redirecting to Skills...").
           If it is not a navigational keyword, leave 'navKeyword' empty and proceed with answering the question as per the rules above.
           
           For general questions about skills or experience that are NOT about a specific project, use the context provided below.
           
           If the user's query contains spelling errors, try to infer their intent and answer based on the corrected query.
           Keep your answers concise, professional, and directly related to the provided information. 
           Do not go off-topic or provide information not found in the tools or context.`,
  prompt: `Use the following context (if available) to answer the user's question.

  ## CONTEXT 
  {{{context}}}
  
  Question: {{{query}}}
  `,
});

const aiPortfolioAssistantFlow = ai.defineFlow(
  {
    name: 'aiPortfolioAssistantFlow',
    inputSchema: AIPortfolioAssistantInputSchema,
    outputSchema: AIPortfolioAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
