
import { Pinecone } from '@pinecone-database/pinecone';
import { openai } from '@/lib/openai';

if (!process.env.PINECONE_API_KEY) {
    console.warn('Missing PINECONE_API_KEY environment variable.');
}

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || '',
});

export const indexName = 'c21portfolio';

export type VectorMetadata = {
    text: string;
    source?: string;
    type?: string;
    [key: string]: any;
};

// Generate embeddings for a string
export async function getEmbeddings(text: string) {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text.replace(/\n/g, ' '),
        dimensions: 512,
    });
    return response.data[0].embedding;
}

// Query Pinecone for similar vectors
export async function queryVectorStore(query: string, topK: number = 5) {
    const embedding = await getEmbeddings(query);
    const index = pinecone.index(indexName);

    const queryResponse = await index.query({
        vector: embedding,
        topK,
        includeMetadata: true,
    });

    return queryResponse.matches.map((match) => ({
        score: match.score,
        metadata: match.metadata as VectorMetadata,
    }));
}

// Ingest vector
export async function upsertVector(id: string, text: string, metadata: VectorMetadata) {
    const embedding = await getEmbeddings(text);
    const index = pinecone.index(indexName);

    await index.upsert([
        {
            id,
            values: embedding,
            metadata: {
                ...metadata,
                text,
            },
        },
    ]);
}
