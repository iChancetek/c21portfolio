/**
 * @fileOverview Dynamic case study generator.
 *
 * - generateDeepDive - A function that generates a detailed technical deep-dive for a project.
 * - GenerateDeepDiveInput - The input type for the generateDeepDive function.
 * - GenerateDeepDiveOutput - The return type for the generateDeepDive function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ventures } from '@/lib/data';
import type { Venture } from '@/lib/types';

const GenerateDeepDiveInputSchema = z.object({
  projectId: z.string().describe('The ID of the project to generate a deep dive for.'),
});
export type GenerateDeepDiveInput = z.infer<typeof GenerateDeepDiveInputSchema>;

const GenerateDeepDiveOutputSchema = z.object({
  deepDive: z.string().describe('The detailed technical deep-dive for the project.'),
});
export type GenerateDeepDiveOutput = z.infer<typeof GenerateDeepDiveOutputSchema>;

const allVentures: Venture[] = ventures.map((v, i) => ({...v, id: `venture-${i}`}));

const getProjectDetails = ai.defineTool(
  {
    name: 'getProjectDetails',
    description: 'Retrieves project details from the database.',
    inputSchema: z.object({
      projectId: z.string().describe('The ID of the project to retrieve.'),
    }),
    outputSchema: z.object({
      name: z.string().describe('The name of the project.'),
      description: z.string().describe('A detailed description of the project.'),
      href: z.string().describe('Link to the live demo'),
    }),
  },
  async (input) => {
    console.log(`Calling getProjectDetails tool for projectId: ${input.projectId}`);
    const project = allVentures.find(v => v.id === input.projectId);
    
    if (!project) {
        throw new Error(`Project with ID ${input.projectId} not found.`);
    }

    return {
      name: project.name,
      description: project.description,
      href: project.href,
    };
  }
);

export async function generateDeepDive(input: GenerateDeepDiveInput): Promise<GenerateDeepDiveOutput> {
  return generateDeepDiveFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDeepDivePrompt',
  input: {schema: GenerateDeepDiveInputSchema},
  output: {schema: GenerateDeepDiveOutputSchema},
  model: 'gpt-4o',
  tools: [getProjectDetails],
  prompt: `You are an expert technical writer, specializing in creating deep-dive case studies of software projects.

  The user has requested a deep-dive for project with ID: {{{projectId}}}.

  First, use the getProjectDetails tool to get the project details.

  Then, write a detailed technical deep-dive, covering the following aspects:
  - Project overview and goals
  - Key Features and Functionality
  - Potential technical implementation details (be creative and infer a possible tech stack if not provided)
  - Challenges that might have been faced and how they could be solved
  - Business impact and value proposition

  Do not assume any information not present in the tool output. Use the tool to get the project details. 
  Write in a clear, concise, and engaging style. Format the output as clean HTML markup, using headings (h3), paragraphs (p), and lists (ul/li) for readability.
  `,
});

const generateDeepDiveFlow = ai.defineFlow(
  {
    name: 'generateDeepDiveFlow',
    inputSchema: GenerateDeepDiveInputSchema,
    outputSchema: GenerateDeepDiveOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      deepDive: output!.deepDive,
    };
  }
);
