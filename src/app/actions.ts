
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

export async function handleSearch(query: string): Promise<{ 
  projects: Venture[]; 
  navPath?: string; 
  answer?: string;
  debug?: string; // Add debug info
}> {
    const lowercasedQuery = query.toLowerCase().trim();
    const debugSteps: string[] = [];

    if (!lowercasedQuery) {
        return { projects: allVentures, answer: "Here are all the projects." };
    }
    
    // Check for direct navigation keywords
    const directNavLink = navLinks.find(link => link.keywords.includes(lowercasedQuery));
    if (directNavLink) {
        return { projects: [], navPath: directNavLink.href };
    }

    // Check for commands
    const commandQueries = [
      'list all projects', 
      'show all projects', 
      'show me everything', 
      'list all', 
      'show all', 
      'list projects', 
      'projects list'
    ];
    if(commandQueries.includes(lowercasedQuery)) {
        return { projects: allVentures };
    }
    
    try {
        debugSteps.push('Step 1: Starting search');
        
        // 1. Build knowledge base
        debugSteps.push('Step 2: Building knowledge base');
        const knowledgeBase: { content: string; venture?: Venture }[] = [];
        
        knowledgeBase.push({ content: `My name is ${resumeData.name}.`});
        knowledgeBase.push({ content: `Professional Summary: ${resumeData.summary}`});
        
        resumeData.coreCompetencies.forEach(c => {
            knowledgeBase.push({ content: `A core competency is: ${c}`});
        });

        resumeData.technicalExpertise.forEach(t => {
            knowledgeBase.push({ 
              content: `Under the technical expertise category of ${t.title}, I have the following skills: ${t.skills}`
            });
        });

        resumeData.experience.forEach(e => {
            knowledgeBase.push({ 
              content: `Regarding work experience at ${e.company} as a ${e.title} (${e.date} in ${e.location}), the summary is: ${e.description}.`
            });
            e.highlights.forEach(h => {
                knowledgeBase.push({ content: `A key highlight at ${e.company} was: ${h}`});
            });
        });
        
        resumeData.education.forEach(e => {
            knowledgeBase.push({ 
              content: `Education and Courses: ${e.course} at ${e.institution}`
            });
        });
        
        allVentures.forEach(v => {
            knowledgeBase.push({ 
              content: `About the project or venture named ${v.name}: ${v.description}`, 
              venture: v 
            });
        });

        skillCategories.forEach(c => {
             c.skills.forEach(s => {
                knowledgeBase.push({ 
                  content: `I have a skill named ${s.name} in the ${c.title} category.`
                });
             });
        });

        debugSteps.push(`Step 3: Built knowledge base with ${knowledgeBase.length} entries`);

        // 2. Check if ai.embedder exists
        if (!ai.embedder) {
            throw new Error('ai.embedder is not defined. Check your Genkit configuration.');
        }
        debugSteps.push('Step 4: Embedder is available');

        // 3. Create embeddings with better error handling
        debugSteps.push('Step 5: Generating query embedding');
        let queryEmbedding: number[];
        let contentEmbeddings: number[][];
        
        try {
            queryEmbedding = await embed({
                embedder: ai.embedder,
                content: query,
            });
            debugSteps.push(`Step 6: Query embedding generated (${queryEmbedding.length} dimensions)`);
        } catch (embedError) {
            debugSteps.push(`Step 6 FAILED: Query embedding error - ${embedError}`);
            throw new Error(`Query embedding failed: ${embedError instanceof Error ? embedError.message : String(embedError)}`);
        }

        try {
            debugSteps.push('Step 7: Generating content embeddings');
            contentEmbeddings = await embed({
                embedder: ai.embedder,
                content: knowledgeBase.map(item => item.content),
            });
            debugSteps.push(`Step 8: Content embeddings generated (${contentEmbeddings.length} embeddings)`);
        } catch (embedError) {
            debugSteps.push(`Step 8 FAILED: Content embedding error - ${embedError}`);
            throw new Error(`Content embedding failed: ${embedError instanceof Error ? embedError.message : String(embedError)}`);
        }

        // 4. Calculate similarities
        debugSteps.push('Step 9: Calculating similarities');
        const similarities = contentEmbeddings.map((embedding, i) => ({
            index: i,
            similarity: dotProduct(queryEmbedding, embedding),
            ...knowledgeBase[i],
        }));

        similarities.sort((a, b) => b.similarity - a.similarity);
        
        const topK = 15;
        const topResults = similarities
            .slice(0, topK)
            .filter(result => result.similarity > 0.5);
        
        debugSteps.push(`Step 10: Found ${topResults.length} relevant results (threshold: 0.5)`);
        
        const context = topResults.length > 0 
          ? topResults.map(r => r.content).join('\n\n') 
          : 'No specific context found. Provide a general introduction.';
        
        debugSteps.push(`Step 11: Context length: ${context.length} characters`);
        
        // 5. Identify relevant projects
        const relevantProjects = new Set<Venture>();
        topResults.forEach(result => {
             if (result.venture) {
                 relevantProjects.add(result.venture);
             }
        });
        
        const directProjectMatch = allVentures.find(
          v => v.name.toLowerCase() === lowercasedQuery
        );
        if (directProjectMatch) {
            relevantProjects.add(directProjectMatch);
        }

        debugSteps.push(`Step 12: Found ${relevantProjects.size} relevant projects`);

        // 6. Call AI assistant
        debugSteps.push('Step 13: Calling AI assistant');
        let finalAnswer: string;
        
        try {
            const aiResponse = await aiPortfolioAssistant({ query, context });
            finalAnswer = aiResponse.answer;
            debugSteps.push(`Step 14: AI response received (${finalAnswer.length} characters)`);
        } catch (aiError) {
            debugSteps.push(`Step 14 FAILED: AI assistant error - ${aiError}`);
            throw new Error(`AI assistant failed: ${aiError instanceof Error ? aiError.message : String(aiError)}`);
        }
        
        console.log('Search completed successfully:', debugSteps.join(' → '));
        
        return { 
          projects: Array.from(relevantProjects), 
          answer: finalAnswer 
        };

    } catch (error) {
        console.error("=== AI Search Handler Failed ===");
        console.error('Debug steps completed:', debugSteps.join(' → '));
        console.error('Error details:', error);
        
        if (error instanceof Error) {
          console.error('Error name:', error.name);
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
        
        // Fallback to string matching
        const filteredProjects = allVentures.filter(venture => 
            venture.name.toLowerCase().includes(lowercasedQuery) || 
            venture.description.toLowerCase().includes(lowercasedQuery)
        );
        
        return { 
          projects: filteredProjects, 
          answer: `I encountered an error with my AI search (${error instanceof Error ? error.message : 'Unknown error'}), but here are some projects that might match your query.`,
          debug: debugSteps.join(' → ')
        };
    }
}
