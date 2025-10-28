'use server';

import { z } from 'zod';
import { semanticProjectSearch } from '@/ai/flows/semantic-project-search';
import { aiPortfolioAssistant } from '@/ai/flows/ai-portfolio-assistant';
import { generateDeepDive } from '@/ai/flows/dynamic-case-study-generator';
import type { Project } from '@/lib/types';

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

  // The server action is now only responsible for validation.
  // The actual database submission will be handled on the client.
  // We return the validated data to the client so it can be submitted.
  return {
    message: "Thank you for your message! I'll get back to you soon.",
    success: true,
    errors: {},
    data: {
        ...validatedFields.data,
        submissionDate: new Date().toISOString(),
    }
  };
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
