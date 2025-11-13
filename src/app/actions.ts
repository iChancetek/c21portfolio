
'use server';

import { z } from 'zod';
import { aiPortfolioAssistant } from '@/ai/flows/ai-portfolio-assistant';
import { generateDeepDive } from '@/ai/flows/dynamic-case-study-generator';
import { getTechInsight } from '@/ai/flows/tech-expert-flow';
import type { Venture } from '@/lib/types';
import { Resend } from 'resend';
import { allVentures, techTopics, navLinks, skillCategories } from '@/lib/data';
import { embed } from 'genkit';
import { ai } from '@/ai/genkit';
import { initializeServerApp } from '@/firebase/server-config';


const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

const auditEventSchema = z.object({
  eventType: z.enum(['USER_LOGIN', 'USER_SIGNUP', 'ADMIN_ACTION']),
  actor: z.object({
    uid: z.string(),
    email: z.string(),
  }),
  details: z.string(),
});


export async function logAuditEvent(eventData: z.infer<typeof auditEventSchema>) {
    try {
        const { firestore } = initializeServerApp();
        const validatedEvent = auditEventSchema.safeParse(eventData);

        if (!validatedEvent.success) {
            console.error("Invalid audit event data:", validatedEvent.error);
            return;
        }
        
        const eventWithTimestamp = {
            ...validatedEvent.data,
            timestamp: new Date().toISOString(),
        };

        await firestore.collection('auditLogs').add(eventWithTimestamp);
    } catch (error) {
        console.error("Failed to log audit event:", error);
    }
}


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

export async function getAIAssistantResponse(query: string, context?: string) {
    try {
        const response = await aiPortfolioAssistant({ query, context });
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

function dotProduct(a: number[], b: number[]): number {
    return a.map((val, i) => val * b[i]).reduce((sum, current) => sum + current, 0);
}


async function semanticSearch(query: string): Promise<{ projects: Venture[], context: string }> {
    try {
        const projectContent = allVentures.map(v => `Project Name: ${v.name}, Description: ${v.description}`);
        const skillsContent = skillCategories.map(c => `Skill Category: ${c.title}, Skills: ${c.skills.map(s => s.name).join(', ')}`);
        const allContent = [...projectContent, ...skillsContent];

        const [queryEmbedding, contentEmbeddings] = await Promise.all([
            embed({
                embedder: ai.embedder,
                content: query,
            }),
            embed({
                embedder: ai.embedder,
                content: allContent,
            }),
        ]);

        const similarities = contentEmbeddings.map((embedding, i) => ({
            index: i,
            similarity: dotProduct(queryEmbedding, embedding),
        }));

        similarities.sort((a, b) => b.similarity - a.similarity);

        const topK = 5; 
        const topResults = similarities
            .slice(0, topK)
            .filter(result => result.similarity > 0.75);
            
        const relevantProjects = new Set<Venture>();
        let context = '';

        topResults.forEach(result => {
            if (result.index < allVentures.length) {
                const project = allVentures[result.index];
                relevantProjects.add(project);
                context += `Project: ${project.name} - ${project.description}\n`;
            } else {
                const skillIndex = result.index - allVentures.length;
                context += `Skills: ${skillsContent[skillIndex]}\n`;
            }
        });

        return { projects: Array.from(relevantProjects), context };
    } catch (error) {
        console.error("Semantic search AI flow failed:", error);
        return { projects: [], context: '' };
    }
}


export async function handleSearch(query: string): Promise<{ projects: Venture[]; navPath?: string; answer?: string }> {
    const lowercasedQuery = query.toLowerCase().trim();

    if (!lowercasedQuery) {
        return { projects: allVentures };
    }
    
    const directNavLink = navLinks.find(link => link.keywords.includes(lowercasedQuery));
    if (directNavLink) {
        return { projects: [], navPath: directNavLink.href };
    }

    try {
        const commandQueries = ['list all projects', 'show all projects', 'show me everything', 'list all', 'show all', 'list projects', 'projects list'];
        if(commandQueries.includes(lowercasedQuery)) {
            return { projects: allVentures };
        }
        
        const { projects: semanticProjects, context } = await semanticSearch(lowercasedQuery);
        
        const finalAnswer = await getAIAssistantResponse(query, context);

        return { projects: semanticProjects, answer: finalAnswer };

    } catch (error) {
        console.error("AI Search handler failed:", error);
        const filteredProjects = allVentures.filter(venture => 
            venture.name.toLowerCase().includes(lowercasedQuery) || 
            venture.description.toLowerCase().includes(lowercasedQuery)
        );
        return { projects: filteredProjects };
    }
}

    