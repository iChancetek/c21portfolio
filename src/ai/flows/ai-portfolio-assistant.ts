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

const AIPortfolioAssistantInputSchema = z.object({
  query: z.string().describe("The user's question about Chancellor's skills and experience."),
});
export type AIPortfolioAssistantInput = z.infer<typeof AIPortfolioAssistantInputSchema>;

const AIPortfolioAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
});
export type AIPortfolioAssistantOutput = z.infer<typeof AIPortfolioAssistantOutputSchema>;

export async function aiPortfolioAssistant(input: AIPortfolioAssistantInput): Promise<AIPortfolioAssistantOutput> {
  return aiPortfolioAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPortfolioAssistantPrompt',
  input: {schema: AIPortfolioAssistantInputSchema},
  output: {schema: AIPortfolioAssistantOutputSchema},
  system: `You are a helpful and friendly AI assistant for a software engineer named Chancellor. 
           Your goal is to answer questions about his skills, projects, and experience based on the context provided.
           If the user's query contains spelling errors, try to infer their intent and answer based on the corrected query.
           Keep your answers concise, professional, and directly related to the provided context. 
           Do not go off-topic or provide information not found in the context.`,
  prompt: `Use the following context to answer the user's question.

  ## CONTEXT DOCUMENT: CHANCELLOR MINUS - AI ENGINEER & FULL-STACK DEVELOPER

  ### Summary
  Chancellor is an AI Engineer and Full-Stack Developer who specializes in architecting, building, and scaling intelligent Generative AI solutions. He has extensive experience across the entire project lifecycle, from rapid prototyping to production deployment and monitoring.

  ### Key Skill Areas
  - **Frontend:** React, Next.js, TypeScript, ShadCN UI, Tailwind CSS
  - **Backend:** Node.js, Python (Flask, FastAPI, Django), Firebase, Supabase, PostgreSQL, MongoDB
  - **AI Platforms:** GCP Vertex AI, AWS Bedrock, Azure Machine Learning, Gemini, GPT, Claude, Hugging Face
  - **AI Engineering:** Prompt Engineering, Agentic Workflows, RAG, Chatbots, Fine-tuning, Voice AI Agents
  - **Data Engineering:** ETL/ELT, Microsoft Fabric, AWS Glue, Azure DataBricks/Spark
  - **Cloud & DevOps:** Docker, Kubernetes (EKS, AKS, GKE), Serverless (Lambda, Cloud Run), Terraform, AWS, Azure, GCP, Vercel, CI/CD
  - **AI Dev Tools:** Firebase Studio AI, Genkit, LangChain

  ### Ventures & Projects
  - **iChanceTEK:** AI systems and digital transformation consultancy.
  - **ChanceTEK Health:** Healthcare automation platform (smart referrals, patient intake).
  - **iQMarketing:** AI-driven marketing analytics and campaign management.
  - **MediScribe:** AI medical documentation assistant with live transcription and EHR integration.
  - **MemoiQ:** Personal AI memory and journaling assistant.
  - **ModeliQ:** AI model training and deployment automation.
  - **WoundiQ:** AI wound care management system with image analysis.
  - **iSydney, iHailey, iSkylar:** Conversational AI companions for therapy, wellness, and emotional support.
  - **Nesto Banks:** Fintech platform with AI-based fraud detection.
  - **The Potluxe:** AI-powered luxury product marketplace.
  
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
