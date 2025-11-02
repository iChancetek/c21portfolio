
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {embed} from 'genkit';
import {ventures} from '@/lib/data';
import type {Venture} from '@/lib/types';

const allVentures: Venture[] = ventures.map((v, i) => ({...v, id: `venture-${i}`}));

const SemanticProjectSearchInputSchema = z.object({
  query: z.string().describe("The user's search query for projects."),
});
export type SemanticProjectSearchInput = z.infer<typeof SemanticProjectSearchInputSchema>;

const SemanticProjectSearchOutputSchema = z.object({
  ventures: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      href: z.string(),
      description: z.string(),
    })
  ),
});
export type SemanticProjectSearchOutput = z.infer<typeof SemanticProjectSearchOutputSchema>;

function dotProduct(a: number[], b: number[]) {
  if (a.length !== b.length) {
    throw new Error('Vectors must be of the same length');
  }
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

export async function handleSemanticSearch(input: SemanticProjectSearchInput): Promise<SemanticProjectSearchOutput> {
  return semanticProjectSearchFlow(input);
}

const semanticProjectSearchFlow = ai.defineFlow(
  {
    name: 'semanticProjectSearchFlow',
    inputSchema: SemanticProjectSearchInputSchema,
    outputSchema: SemanticProjectSearchOutputSchema,
  },
  async ({ query }) => {
    const projectContent = allVentures.map(v => `Project Name: ${v.name}, Description: ${v.description}`);
    
    const [queryEmbedding, projectEmbeddings] = await Promise.all([
      embed({
        embedder: ai.embedder,
        content: query,
      }),
      embed({
        embedder: ai.embedder,
        content: projectContent,
      }),
    ]);

    const similarities = projectEmbeddings.map((projectEmbedding, i) => ({
      index: i,
      similarity: dotProduct(queryEmbedding, projectEmbedding),
    }));

    similarities.sort((a, b) => b.similarity - a.similarity);

    const topK = 5;
    const topResults = similarities.slice(0, topK).map(result => allVentures[result.index]);
    
    return {
      ventures: topResults,
    };
  }
);
