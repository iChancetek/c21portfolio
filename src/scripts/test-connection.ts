import 'dotenv/config';
import { queryVectorStore } from '../lib/rag';
import { openai } from '../lib/openai';

async function runTests() {
  console.log("=== 1. Testing OpenAI API (gpt-5.4-mini) Connection ===");
  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-5.4-mini',
      messages: [{ role: 'user', content: 'Ping connection test.' }],
    });
    console.log("✅ OpenAI gpt-5.4-mini API Response:", res.choices[0].message.content?.trim());
  } catch (err: any) {
    console.error("❌ OpenAI API Error:", err.message);
  }

  console.log("\n=== 2. Testing Pinecone Vector Store (c21portfolio) Connection ===");
  try {
    const results = await queryVectorStore('Chancellor Minus Agentic AI', 2);
    console.log(`✅ Pinecone Query Succeeded. Retreived ${results.length} matches:`);
    results.forEach((match, i) => {
      console.log(`  [${i + 1}] ID: ${match.id} | Score: ${match.score?.toFixed(3)} | Title:`, match.metadata?.title);
    });
  } catch (err: any) {
    console.error("❌ Pinecone Query Error:", err.message);
  }
}

runTests();
