'use server';

import { z } from 'zod';
import { semanticProjectSearch } from '@/ai/flows/semantic-project-search';
import { aiPortfolioAssistant } from '@/ai/flows/ai-portfolio-assistant';
import { generateDeepDive } from '@/ai/flows/dynamic-case-study-generator';
import type { Project } from '@/lib/types';
import { handleContactForm } from '@/ai/flows/contact-form-flow';

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
    };
  }

  try {
    const result = await handleContactForm(validatedFields.data);
    
    if (!result.success) {
        return {
            message: result.error || 'An unexpected error occurred. Please try again.',
            success: false,
            errors: {},
        }
    }

    return {
      message: "Thank you for your message! I'll get back to you soon.",
      success: true,
      errors: {},
    };
  } catch (e) {
    console.error('Failed to handle contact form:', e);
    return {
      message: 'A critical unexpected error occurred. Please try again later.',
      success: false,
      errors: {},
    };
  }
}

// This function is now problematic as it relies on a static list of projects.
// It will need to be updated to work with Firestore data for ventures.
export async function handleSemanticSearch(query: string, projects: Project[]) {
    if (!query) {
        return projects;
    }
    try {
        const searchResults = await semanticProjectSearch({ query });
        const matchedProjects = searchResults
            .map(result => projects.find(p => p.id === result.projectId))
            .filter((p): p is NonNullable<typeof p> => p !== undefined);
        return matchedProjects;
    } catch (error) {
        console.error("Semantic search failed:", error);
        // Fallback to simple text search
        const lowerCaseQuery = query.toLowerCase();
        return projects.filter(p => 
            p.title.toLowerCase().includes(lowerCaseQuery) ||
            p.oneLiner.toLowerCase().includes(lowerCaseQuery)
        );
    }
}

export async function getAIAssistantResponse(query: string) {
    try {
        const response = await aiPortfolioAssistant({ query });
        return response.answer;
    } catch (error) {
        console.error("AI assistant failed:", error);
        return "I'm sorry, but I'm having trouble connecting to my brain right now. Please try again later.";
    }
}

export async function generateProjectDeepDive(projectId: string) {
    try {
        const response = await generateDeepDive({ projectId });
        return response.deepDive;
    } catch (error) {
        console.error("Deep dive generation failed:", error);
        return "I'm sorry, but I was unable to generate a deep-dive for this project. Please try again later.";
    }
}
