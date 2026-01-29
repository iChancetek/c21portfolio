
'use server';

import { z } from 'zod';
import { aiPortfolioAssistant } from '@/ai/flows/ai-portfolio-assistant';
import { generateDeepDive } from '@/ai/flows/dynamic-case-study-generator';
import { getTechInsight } from '@/ai/flows/tech-expert-flow';
import type { Venture } from '@/lib/types';
import { Resend } from 'resend';
import { allVentures, techTopics, navLinks, skillCategories, resumeData } from '@/lib/data';
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

export async function handleSearch(query: string): Promise<{ 
  projects: Venture[]; 
  navPath?: string; 
  answer?: string 
}> {
    const lowercasedQuery = query.toLowerCase().trim();

    if (!lowercasedQuery) {
        return { projects: allVentures, answer: "Here are all the projects." };
    }
    
    // Check for direct navigation
    const directNavLink = navLinks.find(link => link.keywords.includes(lowercasedQuery));
    if (directNavLink) {
        return { projects: [], navPath: directNavLink.href };
    }

    // Check for commands
    const commandQueries = ['list all projects', 'show all projects', 'show me everything'];
    if(commandQueries.includes(lowercasedQuery)) {
        return { projects: allVentures };
    }
    
    try {
        // Build context using simple keyword matching
        const relevantContext: string[] = [];
        const relevantProjects = new Set<Venture>();
        
        // Search in resume data
        if (lowercasedQuery.includes('summary') || lowercasedQuery.includes('about')) {
            relevantContext.push(`Professional Summary: ${resumeData.summary}`);
        }
        
        // Search in competencies
        resumeData.coreCompetencies.forEach(c => {
            if (c.toLowerCase().includes(lowercasedQuery)) {
                relevantContext.push(`Core competency: ${c}`);
            }
        });
        
        // Search in technical expertise
        resumeData.technicalExpertise.forEach(t => {
            const skillsText = `${t.title} ${t.skills}`.toLowerCase();
            if (skillsText.includes(lowercasedQuery)) {
                relevantContext.push(`${t.title}: ${t.skills}`);
            }
        });
        
        // Search in experience
        resumeData.experience.forEach(e => {
            const expText = `${e.company} ${e.title} ${e.description}`.toLowerCase();
            if (expText.includes(lowercasedQuery)) {
                relevantContext.push(`Experience at ${e.company} as ${e.title}: ${e.description}`);
            }
        });
        
        // Search in projects
        allVentures.forEach(v => {
            const projectText = `${v.name} ${v.description}`.toLowerCase();
            if (projectText.includes(lowercasedQuery)) {
                relevantContext.push(`Project ${v.name}: ${v.description}`);
                relevantProjects.add(v);
            }
        });
        
        // If no specific matches, add general info
        if (relevantContext.length === 0) {
            relevantContext.push(
                `Name: ${resumeData.name}`,
                `Summary: ${resumeData.summary}`,
                `Core competencies: ${resumeData.coreCompetencies.join(', ')}`
            );
        }
        
        const context = relevantContext.join('\n\n');
        
        console.log('Calling AI assistant with context length:', context.length);
        
        // Call AI assistant
        const finalAnswer = await aiPortfolioAssistant({ query, context });
        
        return { 
          projects: Array.from(relevantProjects), 
          answer: finalAnswer.answer 
        };
        
    } catch (error) {
        console.error("AI Search handler failed:", error);
        
        // Fallback to string matching
        const filteredProjects = allVentures.filter(venture => 
            venture.name.toLowerCase().includes(lowercasedQuery) || 
            venture.description.toLowerCase().includes(lowercasedQuery)
        );
        
        return { 
          projects: filteredProjects, 
          answer: "I found some projects that match your search. Feel free to ask me more specific questions about Chancellor's experience!" 
        };
    }
}




