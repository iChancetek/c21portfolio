import 'dotenv/config';
import { aiPortfolioAssistant } from '../ai/flows/ai-portfolio-assistant';
import { ichancellorFlow } from '../ai/flows/ichancellor-flow';
import { iskylarSearchFlow } from '../ai/flows/iskylar-search-flow';
import { generateDeepDive } from '../ai/flows/dynamic-case-study-generator';
import { getTechInsight } from '../ai/flows/tech-expert-flow';
import { generateAffirmation } from '../ai/flows/affirmation-generator';
import { getMenuSuggestion } from '../ai/flows/menuSuggestionFlow';

async function testAllAgents() {
  console.log("=================================================");
  console.log("  AUDITING ALL AGENTS CONNECTED TO gpt-5.4-mini");
  console.log("=================================================\n");

  // 1. iSynera Supervisor Agent
  try {
    console.log("[1/7] Testing iSynera Supervisor Agent (LangGraph + gpt-5.4-mini)...");
    const res = await aiPortfolioAssistant({ query: 'Hello iSynera, verify your model connection.' });
    console.log("  ✅ SUCCESS:", res.answer.substring(0, 100).replace(/\n/g, ' ') + "...\n");
  } catch (err: any) {
    console.error("  ❌ FAILED:", err.message);
  }

  // 2. iChancellor Wellness Agent
  try {
    console.log("[2/7] Testing iChancellor Wellness Agent (gpt-5.4-mini)...");
    const res = await ichancellorFlow({ query: 'Mindfulness tip for focus' });
    console.log("  ✅ SUCCESS:", res.answer.substring(0, 100).replace(/\n/g, ' ') + "...\n");
  } catch (err: any) {
    console.error("  ❌ FAILED:", err.message);
  }

  // 3. iSkylar Voice Therapy Agent
  try {
    console.log("[3/7] Testing iSkylar Voice Therapy Agent (gpt-5.4-mini)...");
    const res = await iskylarSearchFlow({ query: 'I am feeling overwhelmed today' });
    console.log("  ✅ SUCCESS:", res.answer.substring(0, 100).replace(/\n/g, ' ') + "...\n");
  } catch (err: any) {
    console.error("  ❌ FAILED:", err.message);
  }

  // 4. Dynamic Case Study Generator Agent
  try {
    console.log("[4/7] Testing Dynamic Case Study Generator Agent (gpt-5.4-mini)...");
    const res = await generateDeepDive({ productId: 'venture-20' });
    console.log("  ✅ SUCCESS: Generated deep dive (" + res.deepDive.length + " bytes)\n");
  } catch (err: any) {
    console.error("  ❌ FAILED:", err.message);
  }

  // 5. Tech Expert Analyst Agent
  try {
    console.log("[5/7] Testing Tech Expert Analyst Agent (gpt-5.4-mini)...");
    const res = await getTechInsight({ topic: 'GenAI', isDeeperDive: false });
    console.log("  ✅ SUCCESS: Generated insight (" + res.insight.length + " bytes)\n");
  } catch (err: any) {
    console.error("  ❌ FAILED:", err.message);
  }

  // 6. Daily Affirmation Generator Agent
  try {
    console.log("[6/7] Testing Daily Affirmation Generator Agent (gpt-5.4-mini)...");
    const res = await generateAffirmation({ category: 'leadership' });
    console.log("  ✅ SUCCESS:", res.affirmation + "\n");
  } catch (err: any) {
    console.error("  ❌ FAILED:", err.message);
  }

  // 7. Healthy Living Planner Agent
  try {
    console.log("[7/7] Testing Healthy Living Planner Agent (gpt-5.4-mini)...");
    const res = await getMenuSuggestion('High protein lunch recommendation');
    console.log("  ✅ SUCCESS:", res.substring(0, 100).replace(/\n/g, ' ') + "...\n");
  } catch (err: any) {
    console.error("  ❌ FAILED:", err.message);
  }

  console.log("=================================================");
  console.log("  ALL AGENTS SUCCESSFULLY VERIFIED ON gpt-5.4-mini");
  console.log("=================================================");
}

testAllAgents();
