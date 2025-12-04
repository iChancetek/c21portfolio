
'use server';

import { z } from 'zod';
import { aiPortfolioAssistant } from '@/ai/flows/ai-portfolio-assistant';
import { generateDeepDive } from '@/ai/flows/dynamic-case-study-generator';
import { getTechInsight } from '@/ai/flows/tech-expert-flow';
import type { Venture } from '@/lib/types';
import { Resend } from 'resend';
import { allVentures, techTopics, navLinks, skillCategories, resumeData } from '@/lib/data';
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

export async function handleSearch(query: string): Promise<{ projects: Venture[]; navPath?: string; answer?: string }> {
    const lowercasedQuery = query.toLowerCase().trim();

    if (!lowercasedQuery) {
        return { projects: allVentures, answer: "Here are all the projects." };
    }
    
    // Check for direct navigation keywords
    const directNavLink = navLinks.find(link => link.keywords.includes(lowercasedQuery));
    if (directNavLink) {
        return { projects: [], navPath: directNavLink.href };
    }

    // Check for commands
    const commandQueries = ['list all projects', 'show all projects', 'show me everything', 'list all', 'show all', 'list projects', 'projects list'];
    if(commandQueries.includes(lowercasedQuery)) {
        return { projects: allVentures };
    }
    
    try {
        // 1. Build a comprehensive, flat knowledge base from all data sources
        const knowledgeBase: { content: string; venture?: Venture }[] = [];
        
        knowledgeBase.push({ content: `My name is ${resumeData.name}.`});
        knowledgeBase.push({ content: `Professional Summary: ${resumeData.summary}`});
        
        resumeData.coreCompetencies.forEach(c => {
            knowledgeBase.push({ content: `A core competency is: ${c}`});
        });

        resumeData.technicalExpertise.forEach(t => {
            knowledgeBase.push({ content: `Under the technical expertise category of ${t.title}, I have the following skills: ${t.skills}`});
        });

        resumeData.experience.forEach(e => {
            knowledgeBase.push({ content: `Regarding work experience at ${e.company} as a ${e.title} (${e.date} in ${e.location}), the summary is: ${e.description}.`});
            e.highlights.forEach(h => {
                knowledgeBase.push({ content: `A key highlight at ${e.company} was: ${h}`});
            });
        });
        
        resumeData.education.forEach(e => {
            knowledgeBase.push({ content: `Education and Courses: ${e.course} at ${e.institution}`});
        });
        
        allVentures.forEach(v => {
            knowledgeBase.push({ content: `About the project or venture named ${v.name}: ${v.description}`, venture: v });
        });

        skillCategories.forEach(c => {
             c.skills.forEach(s => {
                knowledgeBase.push({ content: `I have a skill named ${s.name} in the ${c.title} category.`});
             });
        });

        // 2. Create embeddings for the query and the knowledge base
        const [queryEmbedding, contentEmbeddings] = await Promise.all([
            embed({
                embedder: ai.embedder,
                content: query,
            }),
            embed({
                embedder: ai.embedder,
                content: knowledgeBase.map(item => item.content),
            }),
        ]);

        // 3. Calculate similarities and find the most relevant context
        const similarities = contentEmbeddings.map((embedding, i) => ({
            index: i,
            similarity: dotProduct(queryEmbedding, embedding),
            ...knowledgeBase[i],
        }));

        similarities.sort((a, b) => b.similarity - a.similarity);
        
        const topK = 15;
        const topResults = similarities
            .slice(0, topK)
            .filter(result => result.similarity > 0.6); 
        
        const context = topResults.length > 0 ? topResults.map(r => r.content).join('\n\n') : '';
        
        // 4. Identify relevant projects from the search results
        const relevantProjects = new Set<Venture>();
        topResults.forEach(result => {
             if (result.venture) {
                 relevantProjects.add(result.venture);
             }
        });
        
        const directProjectMatch = allVentures.find(v => v.name.toLowerCase() === lowercasedQuery);
        if (directProjectMatch) {
            relevantProjects.add(directProjectMatch);
        }

        // 5. Call the AI assistant with the curated context
        const finalAnswer = await aiPortfolioAssistant({ query, context });
        
        return { projects: Array.from(relevantProjects), answer: finalAnswer.answer };

    } catch (error) {
        console.error("AI Search handler failed:", error);
        // Fallback to a simple string-matching search if the AI fails
        const filteredProjects = allVentures.filter(venture => 
            venture.name.toLowerCase().includes(lowercasedQuery) || 
            venture.description.toLowerCase().includes(lowercasedQuery)
        );
        return { projects: filteredProjects, answer: "I encountered an error with my AI search, but here are some projects that might match your query." };
    }
}

