
/**
 * @fileOverview Dynamic case study generator avoiding GenKit tool calling complexities.
 */

'use server';

import { openai } from '@/lib/openai';
import { z } from 'zod';
import { allVentures } from '@/lib/data';

const GenerateDeepDiveInputSchema = z.object({
  projectId: z.string().describe('The ID of the project to generate a deep dive for.'),
});
export type GenerateDeepDiveInput = z.infer<typeof GenerateDeepDiveInputSchema>;

const GenerateDeepDiveOutputSchema = z.object({
  deepDive: z.string().describe('The detailed technical deep-dive for the project.'),
});
export type GenerateDeepDiveOutput = z.infer<typeof GenerateDeepDiveOutputSchema>;

// Helper to get project details directly
function getProjectDetails(projectId: string) {
  const project = allVentures.find(v => v.id === projectId || v.name.toLowerCase() === projectId.toLowerCase());

  if (!project) {
    throw new Error(`Project with ID ${projectId} not found.`);
  }

  return {
    name: project.name,
    description: project.description,
    href: project.href,
  };
}

export async function generateDeepDive(input: GenerateDeepDiveInput): Promise<GenerateDeepDiveOutput> {
  const { projectId } = input;

  // Directly retrieve data
  const project = getProjectDetails(projectId);

  const systemPrompt = `You are an expert technical writer, specializing in creating deep-dive case studies of software projects.

The user has requested a deep-dive for the following project:
Name: ${project.name}
Description: ${project.description}
Link: ${project.href}

Write a detailed technical deep-dive, covering the following aspects:
- Project overview and goals
- Key Features and Functionality
- Potential technical implementation details (be creative and infer a possible tech stack if not provided)
- Challenges that might have been faced and how they could be solved
- Business impact and value proposition

Write in a clear, concise, and engaging style. Format the output as clean HTML markup, using headings (h3), paragraphs (p), and lists (ul/li) for readability.

IMPORTANT: Output strictly valid JSON in the format: { "deepDive": "html_string" }`;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate deep dive for ${project.name}` }
    ],
    model: 'gpt-4o',
    response_format: { type: 'json_object' }
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('No content received from OpenAI');
  }

  try {
    const result = JSON.parse(content);
    return { deepDive: result.deepDive };
  } catch (e) {
    console.error("Failed to parse JSON response:", content);
    return { deepDive: content };
  }
}