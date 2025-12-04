
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
        // Deeper, more granular knowledge base construction
        const knowledgeBase: string[] = [];
        
        // 1. Basic Info and Summary
        knowledgeBase.push(`My name is ${resumeData.name}.`);
        knowledgeBase.push(`Professional Summary: ${resumeData.summary}`);

        // 2. Core Competencies (individually)
        resumeData.coreCompetencies.forEach(c => knowledgeBase.push(`A core competency is: ${c}`));

        // 3. Technical Expertise (by category and skill)
        resumeData.technicalExpertise.forEach(t => {
            knowledgeBase.push(`In the category of ${t.title}, my expertise includes: ${t.skills}`);
        });

        // 4. Professional Experience (by company, and each highlight individually)
        resumeData.experience.forEach(e => {
            const experienceIntro = `Regarding work experience at ${e.company} as a ${e.title} (${e.date} in ${e.location}), the summary is: ${e.description}.`;
            knowledgeBase.push(experienceIntro);
            e.highlights.forEach(h => {
                knowledgeBase.push(`A key highlight at ${e.company} was: ${h}`);
            });
        });

        // 5. Education
        resumeData.education.forEach(e => knowledgeBase.push(`Education and Courses: ${e.course} at ${e.institution}`));
        
        // 6. Projects/Ventures
        allVentures.forEach(v => knowledgeBase.push(`About the project or venture named ${v.name}: ${v.description}`));

        // 7. Skill Categories
        skillCategories.forEach(c => {
             c.skills.forEach(s => knowledgeBase.push(`I have a skill named ${s.name} in the ${c.title} category.`))
        });


        const [queryEmbedding, contentEmbeddings] = await Promise.all([
            embed({
                embedder: ai.embedder,
                content: query,
            }),
            embed({
                embedder: ai.embedder,
                content: knowledgeBase,
            }),
        ]);

        const similarities = contentEmbeddings.map((embedding, i) => ({
            index: i,
            similarity: dotProduct(queryEmbedding, embedding),
            content: knowledgeBase[i],
        }));

        similarities.sort((a, b) => b.similarity - a.similarity);

        const topK = 10;
        const topResults = similarities
            .slice(0, topK)
            .filter(result => result.similarity > 0.6); // Stricter threshold
        
        const context = topResults.map(r => r.content).join('\n\n');

        const relevantProjects = new Set<Venture>();
        topResults.forEach(result => {
             const content = result.content.toLowerCase();
             allVentures.forEach(venture => {
                 if(content.includes(venture.name.toLowerCase())) {
                     relevantProjects.add(venture);
                 }
             })
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

        // If semantic search finds projects, return them with the answer.
        if (semanticProjects.length > 0) {
             return { projects: semanticProjects, answer: finalAnswer };
        }
        
        // If no semantic results, check for a direct name match.
        const directProjectMatch = allVentures.find(v => v.name.toLowerCase() === lowercasedQuery);
        if (directProjectMatch) {
            return { projects: [directProjectMatch], answer: finalAnswer };
        }
        
        // If no projects are found by any method, just return the answer.
        return { projects: [], answer: finalAnswer };

    } catch (error) {
        console.error("AI Search handler failed:", error);
        const filteredProjects = allVentures.filter(venture => 
            venture.name.toLowerCase().includes(lowercasedQuery) || 
            venture.description.toLowerCase().includes(lowercasedQuery)
        );
        return { projects: filteredProjects };
    }
}

    
