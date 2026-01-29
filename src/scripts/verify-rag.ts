
import 'dotenv/config';
import { queryVectorStore } from '@/lib/rag';
import fs from 'fs';

async function verifyRag() {
    const logFile = 'verification_output.txt';
    const log = (msg: string) => {
        console.log(msg);
        fs.appendFileSync(logFile, msg + '\n');
    };

    // Clear previous log
    if (fs.existsSync(logFile)) fs.unlinkSync(logFile);

    log('Verifying RAG...');
    try {
        const query = "What AI platforms does Chancellor use?";
        log(`Querying: "${query}"`);

        const results = await queryVectorStore(query, 3);

        log(`Found ${results.length} matches.`);
        results.forEach((match, i) => {
            log(`\nMatch ${i + 1} (Score: ${match.score}):`);
            log(`Source: ${match.metadata.source}`);
            // Show snippet of text
            const text = match.metadata.text ? match.metadata.text.substring(0, 100) : 'No text';
            log(`Text: ${text}...`);
        });

        if (results.length > 0) {
            log('\n✅ Verification SUCCESS: Data found in Pinecone.');
        } else {
            log('\n❌ Verification FAILED: No data found.');
            process.exit(1);
        }

    } catch (error) {
        log(`Error during verification: ${error}`);
        process.exit(1);
    }
}

// Check if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    verifyRag();
}

export { verifyRag };
