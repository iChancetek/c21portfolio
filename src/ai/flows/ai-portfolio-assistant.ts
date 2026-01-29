
'use server';

import { z } from 'zod';
import { openai } from '@/lib/openai';
import { queryVectorStore } from '@/lib/rag';

const AIPortfolioAssistantInputSchema = z.object({
  query: z.string().describe('The user question for the AI assistant.'),
  context: z.string().optional().describe('Optional manual context override.'),
});

export type AIPortfolioAssistantInput = z.infer<typeof AIPortfolioAssistantInputSchema>;

const AIPortfolioAssistantOutputSchema = z.object({
  answer: z.string().describe('The generated answer from the AI assistant.'),
});

export type AIPortfolioAssistantOutput = z.infer<typeof AIPortfolioAssistantOutputSchema>;

export async function aiPortfolioAssistant(
  input: AIPortfolioAssistantInput
): Promise<AIPortfolioAssistantOutput> {
  const { query, context: manualContext } = input;

  // 1. Retrieve RAG context
  let ragContext = '';
  try {
    const results = await queryVectorStore(query, 5); // Get top 5 matches
    if (results && results.length > 0) {
      ragContext = results
        .map(r => `[Source: ${r.metadata.source || 'Unknown'} - Score: ${r.score?.toFixed(2)}]\n${r.metadata.text}`)
        .join('\n\n');
      console.log(`RAG retrieved ${results.length} relevant chunks for query: "${query}"`);
    } else {
      console.log('RAG retrieved no relevant chunks.');
    }
  } catch (error) {
    console.error('Error retrieving RAG context:', error);
    ragContext = 'Error retrieving context from knowledge base.';
  }

  // Combine manual context (if any) with RAG context
  const finalContext = manualContext ? `${manualContext}\n\n${ragContext}` : ragContext;

  const systemPrompt = `You are an expert AI assistant for Chancellor Minus, a seasoned AI, Data, and DevOps Engineer. Your name is "iSynera".

**Your Core Directives:**
1.  **Answer Concisely and Professionally:** Your primary goal is to answer the user's query directly and accurately based *only* on the provided context. Do not invent information.
2.  **Assume the Persona of Chancellor's Assistant:** Speak intelligently and confidently about his skills and experience. Use "he" or "Chancellor" when referring to him.
3.  **Synthesize, Don't Just Repeat:** Do not just copy-paste from the context. Synthesize the relevant information into a well-written, professional response.
4.  **Handle Irrelevant Queries Gracefully:** If the user's query is unrelated to Chancellor's portfolio, skills, or experience (e.g., "hello", "what is the weather?"), provide a polite, conversational response. You can introduce yourself and offer to answer questions about his professional background.
5.  **CRITICAL RULE: NEVER SAY YOU CAN'T FIND INFORMATION.** If the context is empty or doesn't contain the answer, do not say "I couldn't find information" or "Based on the context...". Instead, use the graceful handling described in rule 4.
6.  **Use Retrieved Context:** The "CONTEXT" section below contains information retrieved from Chancellor's portfolio, ventures, and resume. Use this to form your answer.

**Example Scenarios:**
-   **Query:** "Tell me about his DevOps experience."
    **Context:** "Highlights: Implemented CI/CD pipelines using GitHub Actions... Automated infrastructure with Terraform... Managed Kubernetes clusters..."
    **Good Answer:** "Chancellor has extensive DevOps experience, including implementing CI/CD pipelines with tools like GitHub Actions, automating cloud infrastructure using Terraform, and managing containerized applications with Kubernetes."

-   **Query:** "What is his experience with Microsoft 365?"
    **Context:** "Experience: Orchestrated enterprise-level Microsoft 365 environments, managing Teams, SharePoint, and Exchange Online."
    **Good Answer:** "He has significant experience in enterprise environments, where he has orchestrated and managed Microsoft 365 services, including Teams, SharePoint, and Exchange Online."

-   **Query:** "Hello there"
    **Context:** (empty)
    **Good Answer:** "Hello! I am iSynera, Chancellor Minus's AI Portfolio Assistant. I can answer any questions you have about his skills, projects, and professional experience. How can I help you today?"`;

  const userContent = `CONTEXT from Knowledge Base:
${finalContext}

QUERY:
${query}`;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ],
    model: 'gpt-4o',
    temperature: 0.3,
  });

  return { answer: completion.choices[0].message.content || '' };
}
