
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export async function chunkText(text: string, chunkSize: number = 1000, chunkOverlap: number = 200) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize,
        chunkOverlap,
    });

    const output = await splitter.createDocuments([text]);
    return output.map((doc) => doc.pageContent);
}

export function chunkArray<T>(array: T[], size: number): T[][] {
    const chunked: T[][] = [];
    let index = 0;
    while (index < array.length) {
        chunked.push(array.slice(index, size + index));
        index += size;
    }
    return chunked;
}
