'use server';
/**
 * @fileOverview Dynamic case study generator.
 *
 * - generateDeepDive - A function that generates a detailed technical deep-dive for a project.
 * - GenerateDeepDiveInput - The input type for the generateDeepDive function.
 * - GenerateDeepDiveOutput - The return type for the generateDeepDive function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDeepDiveInputSchema = z.object({
  projectId: z.string().describe('The ID of the project to generate a deep dive for.'),
});
export type GenerateDeepDiveInput = z.infer<typeof GenerateDeepDiveInputSchema>;

const GenerateDeepDiveOutputSchema = z.object({
  deepDive: z.string().describe('The detailed technical deep-dive for the project.'),
});
export type GenerateDeepDiveOutput = z.infer<typeof GenerateDeepDiveOutputSchema>;

const getProjectDetails = ai.defineTool(
  {
    name: 'getProjectDetails',
    description: 'Retrieves project details from the database.',
    inputSchema: z.object({
      projectId: z.string().describe('The ID of the project to retrieve.'),
    }),
    outputSchema: z.object({
      title: z.string().describe('The title of the project.'),
      description: z.string().describe('A detailed description of the project.'),
      techStack: z.array(z.string()).describe('The tech stack used in the project.'),
      oneLiner: z.string().describe('A one-line summary of the project'),
      githubLink: z.string().optional().describe('Link to the github repository'),
      liveDemoLink: z.string().optional().describe('Link to the live demo'),
    }),
  },
  async (input) => {
    // TODO: Implement the actual database retrieval logic here.
    // This is a placeholder. Replace with actual data fetching.
    console.log("Calling getProjectDetails tool");
    return {
      title: `Project ${input.projectId}`,
      description: `Detailed description of project ${input.projectId}.`,
      techStack: ['Next.js', 'Firebase', 'Genkit'],
      oneLiner: `A project with ID ${input.projectId}.`,
      githubLink: 'https://github.com/example',
      liveDemoLink: 'https://example.com',
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
  tools: [getProjectDetails],
  prompt: `You are an expert technical writer, specializing in creating deep-dive case studies of software projects.

  The user has requested a deep-dive for project with ID: {{{projectId}}}.

  First, use the getProjectDetails tool to get the project details.

  Then, write a detailed technical deep-dive, covering the following aspects:
  - Project overview and goals
  - Architecture and design choices
  - Tech stack and why each technology was chosen
  - Challenges faced and solutions implemented
  - Key learnings and future improvements

  Do not assume any information. Use the tool to get the project details. Write in a clear, concise, and engaging style.
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
