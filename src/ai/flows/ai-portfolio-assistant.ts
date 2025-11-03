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
  isNavQuery: z.boolean().optional().describe("Set to true if the primary goal is to check for a navigational keyword."),
});
export type AIPortfolioAssistantInput = z.infer<typeof AIPortfolioAssistantInputSchema>;

const AIPortfolioAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
  navKeyword: z.string().optional().describe("If the user's query is a misspelled navigational keyword, this field will contain the corrected keyword (e.g., 'Projects', 'Skills', 'Contact', 'Affirmations')."),
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
           
           If 'isNavQuery' is true, your absolute first priority is to check if the user's query is a misspelled version of a navigational keyword.
           The valid navigational keywords are: "Projects", "Skills", "Contact", "Affirmations".
           If it is a misspelled keyword, set the 'navKeyword' field to the corrected keyword and provide a very short, confirmatory answer (e.g., "Redirecting to Skills...").
           If it is not a navigational keyword, leave 'navKeyword' empty and proceed with answering the question based on the context below.

           If the user's query contains spelling errors, try to infer their intent and answer based on the corrected query.
           Keep your answers concise, professional, and directly related to the provided context. 
           Do not go off-topic or provide information not found in the context.`,
  prompt: `Use the following context to answer the user's question.

  ## CONTEXT DOCUMENT: CHANCELLORMINUS.COM

  ### User Persona: Chancellor Minus
  - **Role:** AI Engineer & Full-Stack Developer
  - **Specialization:** Architecting, building, and scaling intelligent Generative AI solutions.
  - **Experience:** Extensive experience across the entire project lifecycle, from rapid prototyping to production deployment and monitoring.

  ### Key Skill Areas
  - **Frontend:** React, Next.js, TypeScript, ShadCN UI, Tailwind CSS
  - **Backend:** Node.js, Python (Flask, FastAPI, Django), Firebase, Supabase, PostgreSQL, MongoDB, Stripe, Resend
  - **AI Platforms:** GCP Vertex AI, AWS Bedrock, Azure Machine Learning, Gemini, GPT, Claude, Hugging Face
  - **AI Engineering:** Prompt Engineering, Agentic Workflows, RAG, AI Chatbots, Fine-tuning, Voice AI Agents
  - **Data Engineering:** ETL/ELT, Microsoft Fabric, AWS Glue, Azure DataBricks/Spark
  - **Cloud & DevOps:** Docker, Kubernetes (EKS, AKS, GKE), Serverless (Lambda, Cloud Run), Terraform, AWS, Azure, GCP, Vercel, CI/CD
  - **AI Dev Tools:** Firebase Studio AI, Genkit, LangChain, CrewAI, Vibe Coding, Cursor AI
  - **Microsoft Enterprise:** M365, Teams, SharePoint, Power Automate, AutoPilot/InTune

  ### Ventures & Projects
  This section details companies and products built by Chancellor.
  - **iChanceTEK (iChanceTEK.com):** AI systems and digital transformation consultancy.
  - **ChanceTEK Health (chancetekhealth.us):** Healthcare automation platform (smart referrals, patient intake).
  - **iQMarketing (iQMarketing.us):** AI-driven marketing analytics and campaign management.
  - **MediScribe (MediScribe.us):** AI medical documentation assistant with live transcription and EHR integration.
  - **MemoiQ (MemoiQ.us):** Personal AI memory and journaling assistant.
  - **ModeliQ (ModeliQ.us):** AI model training and deployment automation.
  - **WoundiQ (WoundiQ.us):** AI wound care management system with image analysis.
  - **iSydney (iSydney.us):** Conversational AI voice companion for therapy and lifestyle.
  - **iHailey (iHailey.us):** AI emotional support and mental wellness companion.
  - **iSkylar (iSkylar.us):** AI Voice Therapist combining generative empathy and therapeutic dialogue.
  - **Nesto Banks (Nestobanks.com):** Fintech platform with AI-based fraud detection.
  - **The Potluxe (ThePotluxe.com):** AI-powered luxury product marketplace.

  ### Core Site Features & Functionality
  - **AI Search:** The main search bar on the homepage uses this RAG-based AI to answer user questions about Chancellor's portfolio.
  - **AI Deep-Dive:** On project cards, this feature uses a Genkit flow to dynamically generate a detailed technical case study for any selected project.
  - **Projects, Skills, Contact Pages:** Standard portfolio sections.
  - **Affirmations Page:** A page that uses an AI flow to generate positive affirmations, with an option for a "Deeper Dive" and text-to-speech narration.
  - **User System:** Users can sign up and log in (Email/Password & Google). This provides access to dashboard features.
  - **Dashboard/Tech Insight Generator:** An authenticated page where users can select a tech topic (e.g., 'GenAI', 'DevOps') and receive a detailed, AI-generated report. It also features text-to-speech.
  - **Healthy Living / iChancellor:** An authenticated page featuring a multi-modal AI wellness guide named iChancellor. It supports text and voice chat (transcription and TTS), guided meditation with a timer, and is bilingual (English/Spanish).
  - **Admin Dashboard:** A protected route for admins to view user presence and audit logs from Firestore.
  - **User Presence:** The site tracks real-time user online/offline status in Firestore.
  - **Localization (i18n):** The entire site supports English and Spanish, managed via JSON files and a React Context.
  
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
