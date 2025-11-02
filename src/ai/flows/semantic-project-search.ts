/**
 * @fileOverview Semantic project search flow.
 *
 * This file defines a Genkit flow that allows users to search for projects
 * using natural language queries. The flow uses embeddings to find relevant
 * projects and returns a ranked list of project IDs.
 */
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {embed} from 'genkit';
import {
  retrieve,
  defineIndexer,
  defineRetriever,
  vectorQuery,
} from 'genkit/experimental/retrieval';
import { ventures } from '@/lib/data';
import type { Venture } from '@/lib/types';

const allVentures: Venture[] = ventures.map((v, i) => ({...v, id: `venture-${i}`}));

const SearchProjectSchema = z.object({
  name: z.string().describe('The name of the project.'),
  description: z.string().describe('A detailed description of the project.'),
});

const getProjects = ai.defineTool(
  {
    name: 'getProjects',
    description: 'Retrieves all projects from the database.',
    outputSchema: z.array(SearchProjectSchema),
  },
  async () => {
    console.log('Calling getProjects tool');
    return allVentures;
  }
);

export const projectIndexer = defineIndexer(
  'project-indexer',
  async () => {
    const projects = await getProjects();
    return {
      documents: projects.map((project, index) => ({
        content: [
          {
            text: `Project: ${project.name}\nDescription: ${project.description}`,
          },
        ],
        metadata: {
          projectId: `venture-${index}`,
          name: project.name,
        },
      })),
    };
  }
);

export const projectRetriever = defineRetriever(
  'project-retriever',
  async (input, options) => {
    const embedding = await embed({
      embedder: 'text-embedding-004',
      content: input,
    });
    return {
      documents: await vectorQuery({
        query: embedding,
        collection: projectIndexer.collection,
        k: options?.k,
      }),
    };
  }
);


const SemanticProjectSearchInputSchema = z.object({
  query: z.string().describe('The natural language search query.'),
});
export type SemanticProjectSearchInput = z.infer<typeof SemanticProjectSearchInputSchema>;

const SemanticProjectSearchOutputSchema = z.array(
  z.object({
    projectId: z.string().describe('The ID of the project.'),
  })
);
export type SemanticProjectSearchOutput = z.infer<typeof SemanticProjectSearchOutputSchema>;

export async function semanticProjectSearch(input: SemanticProjectSearchInput): Promise<SemanticProjectSearchOutput> {
  return semanticProjectSearchFlow(input);
}

const semanticProjectSearchFlow = ai.defineFlow(
  {
    name: 'semanticProjectSearchFlow',
    inputSchema: SemanticProjectSearchInputSchema,
    outputSchema: SemanticProjectSearchOutputSchema,
  },
  async (input) => {
    const documents = await retrieve({
      retriever: projectRetriever,
      query: input.query,
      options: { k: 5 },
    });

    const projectIds = documents.map(doc => ({
        projectId: doc.metadata.projectId,
    }));
    
    // Remove duplicates
    const uniqueProjectIds = Array.from(new Set(projectIds.map(p => p.projectId)))
      .map(projectId => {
        return projectIds.find(p => p.projectId === projectId)!;
      });

    return uniqueProjectIds;
  }
);
