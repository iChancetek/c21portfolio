
'use server';

import { z } from 'zod';
import { aiPortfolioAssistant } from '@/ai/flows/ai-portfolio-assistant';
import { generateDeepDive } from '@/ai/flows/dynamic-case-study-generator';
import { getTechInsight } from '@/ai/flows/tech-expert-flow';
import type { Venture } from '@/lib/types';
import { Resend } from 'resend';
import { ventures, techTopics } from '@/lib/data';
import { embed } from 'genkit';
import { ai } from '@/ai/genkit';


const allVentures: Venture[] = ventures.map((v, i) => ({...v, id: `venture-${i}`}));

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

export async function submitContactForm(prevState: any, formData: FormData) {
  const validatedFields = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
      success: false,
      data: null,
    };
  }

  const { name, email, message } = validatedFields.data;
  
  if (process.env.RESEND_API_KEY && process.env.RESEND_DOMAIN) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      try {
        const { data, error } = await resend.emails.send({
          from: `Portfolio <noreply@${process.env.RESEND_DOMAIN}>`,
          to: ['cm@chancellorminus.com'],
          subject: `New Contact Form Submission from ${name}`,
          html: `<p>You received a new message from your portfolio contact form.</p>
                 <p><strong>Name:</strong> ${name}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>Message:</strong></p>
                 <p>${message}</p>`,
        });

        if (error) {
            console.error("Resend API Error:", error);
            return {
                errors: {},
                message: `Could not send email. Error: ${error.message}`,
                success: false,
                data: null,
            }
        }
      } catch (exception) {
          const error = exception as Error;
          console.error("Resend failed:", error);
          return {
            errors: {},
            message: `Could not send email. Error: ${error.message}`,
            success: false,
            data: null,
          }
      }
  } else {
      console.warn("RESEND_API_KEY or RESEND_DOMAIN is not set. Skipping email notification.");
  }


  // The server action is now only responsible for validation and email sending.
  // The database submission is handled on the client.
  // We return the validated data to the client so it can be submitted to Firestore.
  return {
    message: "Thank you for your message! I'll get back to you soon.",
    success: true,
    errors: {},
    data: {
        name,
        email,
        message,
        submissionDate: new Date().toISOString(),
    }
  };
}

export async function getAIAssistantResponse(query: string) {
    try {
        const response = await aiPortfolioAssistant({ query });
        return response.answer;
    } catch (error: any) {
        console.error("AI assistant failed:", error);
        // Return the actual error message to the client for debugging.
        const errorMessage = error.message || "An unknown error occurred.";
        return `I'm sorry, but I'm having trouble connecting to my brain right now. Error: ${errorMessage}`;
    }
}

export async function generateProjectDeepDive(projectId: string) {
    try {
        const response = await generateDeepDive({ projectId });
        return response.deepDive;
    } catch (error: any) {
        console.error("Deep dive generation failed:", error);
         const errorMessage = error.message || "An unknown error occurred.";
        return `I'm sorry, but I was unable to generate a deep-dive for this project. Error: ${errorMessage}`;
    }
}

export async function generateTechInsight(topic: z.infer<typeof techTopics>[number], isDeeperDive = false) {
    try {
        const response = await getTechInsight({ topic, isDeeperDive });
        return response.insight;
    } catch (error: any) {
        console.error("Tech insight generation failed:", error);
        const errorMessage = error.message || "An unknown error occurred.";
        return `<p>I'm sorry, but I was unable to generate an insight for this topic. Error: ${errorMessage}</p>`;
    }
}

function dotProduct(a: number[], b: number[]) {
    if (a.length !== b.length) {
        throw new Error('Vectors must be of the same length');
    }
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

async function semanticSearch(query: string): Promise<Venture[]> {
    try {
        const projectContent = allVentures.map(v => `Project Name: ${v.name}, Description: ${v.description}`);

        const [queryEmbedding, projectEmbeddings] = await Promise.all([
            embed({
                embedder: ai.embedder,
                content: query,
            }),
            embed({
                embedder: ai.embedder,
                content: projectContent,
            }),
        ]);

        const similarities = projectEmbeddings.map((projectEmbedding, i) => ({
            index: i,
            similarity: dotProduct(queryEmbedding, projectEmbedding),
        }));

        similarities.sort((a, b) => b.similarity - a.similarity);

        const topK = 5; // Return top 5 results
        const topResults = similarities
            .slice(0, topK)
            .filter(result => result.similarity > 0.75) // Threshold to avoid irrelevant results
            .map(result => allVentures[result.index]);
        
        return topResults;
    } catch (error) {
        console.error("Semantic search AI flow failed:", error);
        return [];
    }
}


export async function handleSemanticSearch(query: string): Promise<Venture[]> {
    const lowercasedQuery = query.toLowerCase().trim();

    if (!lowercasedQuery) {
        return allVentures;
    }
    
    // 1. Handle command-like queries
    const commandQueries = ['list all projects', 'show all projects', 'show me everything', 'list all', 'show all'];
    if(commandQueries.includes(lowercasedQuery)) {
        return allVentures;
    }

    // 2. Exact and partial text search first
    const textSearchResults = allVentures.filter(venture => 
        venture.name.toLowerCase().includes(lowercasedQuery) || 
        venture.description.toLowerCase().includes(lowercasedQuery)
    );

    if (textSearchResults.length > 0) {
        return textSearchResults;
    }

    // 3. Fallback to AI-powered semantic search
    try {
        const semanticResults = await semanticSearch(query);
        const rankedVentures = semanticResults
            .map(result => allVentures.find(v => v.id === result.id))
            .filter((v): v is Venture => !!v); 

        return rankedVentures;
    } catch (error) {
        console.error("Semantic search failed:", error);
        return [];
    }
}
