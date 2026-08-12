'use server';

import { openai } from '@/lib/openai';

export interface FdeFaqItem {
  question: string;
  answer: string;
  category: string;
}

export const FDE_KNOWLEDGE_BASE: FdeFaqItem[] = [
  {
    category: 'Fundamentals',
    question: 'What is Forward Deployed Engineering?',
    answer: 'Forward Deployed Engineering (FDE) is an elite engineering model where a senior engineer embeds directly within an organization to understand actual workflows, data, security constraints, and business goals. Unlike traditional consulting, which ends at recommendations and strategy decks, an FDE moves directly from problem discovery to architecture, rapid prototyping, production engineering, deployment, and continuous optimization.'
  },
  {
    category: 'Engagement Model',
    question: 'How does an FDE engagement work?',
    answer: 'An FDE engagement follows a continuous seven-stage journey: 1. Discover (understanding the business problem, users, and data), 2. Define (translating business challenges into AI & engineering opportunities), 3. Architect (designing RAG, MCP, multi-agent, and cloud infrastructure), 4. Prototype (building a working prototype users can test), 5. Engineer (transforming prototypes into production-grade systems), 6. Deploy (deploying into GCP, AWS, or Azure with CI/CD), and 7. Optimize (continuously refining latency, security, and accuracy).'
  },
  {
    category: 'Agentic AI',
    question: 'What is Agentic AI?',
    answer: 'Agentic AI represents a paradigm shift from software that waits for explicit commands to software that acts toward defined goals. Agentic systems combine LLM reasoning, multi-step planning, tool invocation, enterprise APIs, vector memory, and human oversight to execute complex business workflows autonomously.'
  },
  {
    category: 'Agentic Coding',
    question: 'What is Agentic Coding and how does it accelerate development?',
    answer: 'Agentic Coding leverages AI-assisted development tools and autonomous coding agents to accelerate refactoring, test generation, API development, and cloud infrastructure deployment. Chancellor uses agentic coding to multiply engineering speed while maintaining total architectural responsibility for security, code quality, testing, and production readiness.'
  },
  {
    category: 'Capabilities',
    question: 'What can Chancellor build during an FDE engagement?',
    answer: 'Chancellor builds custom Agentic AI Platforms, AI-Native Web Applications, Enterprise AI Assistants connected to approved data, Traditional & GraphRAG Systems, Automated Workflow Systems, Cloud-Native AI Platforms on GCP/AWS/Azure, and petabyte-scale Data & ML Pipelines.'
  },
  {
    category: 'Cloud Architecture',
    question: 'What cloud technologies and frameworks does Chancellor use?',
    answer: 'Chancellor specializes in multi-cloud architecture across Google Cloud Platform (Cloud Run, Vertex AI, GKE, Cloud SQL), Amazon Web Services (EKS, Bedrock, SageMaker, S3 Vector), and Microsoft Azure (AKS, AI Foundry, Databricks, Cosmos DB). Infrastructure is automated using Terraform, OpenTofu, Pulumi, Docker, Kubernetes, and Helm.'
  },
  {
    category: 'Traditional vs FDE',
    question: 'What is the main difference between traditional consulting and FDE?',
    answer: 'Traditional consulting delivers strategy, roadmaps, assessments, and presentations. Forward Deployed Engineering delivers working production software. Chancellor connects strategic business understanding directly with hands-on technical execution, building intelligent solutions custom-tailored to the organization.'
  },
  {
    category: 'Frontier AI Stack',
    question: 'What AI and LLM models does Chancellor use during an FDE engagement?',
    answer: 'Chancellor deploys both closed flagship models and open-weight frontier systems tailored to client requirements:\n\n• Closed Flagships: OpenAI GPT-5 & GPT-5.6 series (GPT-5.6 Sol for autonomous agentic workflows and GPT-5.6 Cyber), Anthropic Claude 5 / Fable series (Claude Fable 5 and Claude Opus 5 for code generation and reasoning), Google Gemini 3.5 series (Gemini 3.5 Pro for deep problem solving and Gemini 3.5 Flash for high-throughput API tasks), and xAI Grok 4.20 (multi-agent system with Harper and Benjamin sub-agents).\n\n• Open-Weight Frontier Models: DeepSeek V4 & DeepSeek-V4-Flash (cost-efficient reasoning), Moonshot AI Kimi K3 (multi-hour autonomous software engineering), Alibaba Qwen3.8 Max (multilingual benchmark leader), Meta Muse & Llama 4 series (Llama 4 Scout and Muse Spark/Glimmer), and NVIDIA Nemotron 3.5 Lightning (enterprise search, routing, and tool-use).'
  }
];

export async function queryFdeKnowledge(query: string): Promise<{ answer: string; matchedSource: string }> {
  try {
    const systemPrompt = `You are the official FDE Knowledge Assistant for Chancellor Minus, a Lead Agentic AI Engineer, Cloud Architect, & FDE.
Your core mission is to answer questions about Forward Deployed Engineering (FDE), Chancellor's engagement model, Agentic AI, Cloud Architecture, and technical capabilities based strictly on the approved FDE knowledge base below.

APPROVED FDE KNOWLEDGE BASE:
${JSON.stringify(FDE_KNOWLEDGE_BASE, null, 2)}

PROSE & FORMATTING DIRECTIVES:
- Write with the intelligence, polish, and authoritative prose of an elite Time magazine article.
- Use well-structured paragraphs with flawless grammar, syntax, and punctuation.
- Present structured key points using clean bullet points (use • unicode bullets).
- CRITICAL RULE: DO NOT use any asterisk (*) or hash (#) characters anywhere in your response. Do not use Markdown asterisks for bolding or italics, and do not use hashtag symbols (#) for headings.
- If the requested information is not in the approved knowledge base, state politely that the requested detail is outside the FDE knowledge context.`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      model: 'gpt-5.4-mini',
      temperature: 0.5,
    });

    const answer = completion.choices[0]?.message?.content || 'Information unavailable in FDE knowledge base.';
    return {
      answer,
      matchedSource: 'FDE Grounded Knowledge Base (7 Stages & Agentic Architecture)'
    };
  } catch (error) {
    console.error('FDE Knowledge query error:', error);
    return {
      answer: 'Forward Deployed Engineering embeds senior AI and cloud engineering expertise directly into enterprise workflows to deliver production-ready software from discovery to deployment.',
      matchedSource: 'FDE Knowledge Base (Fallback)'
    };
  }
}
