export async function chunkText(text: string, chunkSize: number = 1000, chunkOverlap: number = 200): Promise<string[]> {
    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.slice(start, end));
        start += chunkSize - chunkOverlap;
    }
    return chunks;
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
