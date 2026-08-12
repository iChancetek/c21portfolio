
import 'dotenv/config'; // Ensure env vars are loaded
import { products, allVentures, resumeData, skillCategories } from '@/lib/data';
import { upsertVector } from '@/lib/rag';
import { chunkText } from '@/lib/chunking';

async function ingestData() {
    console.log('Starting ingestion...');

    try {
        // 0. Ingest Platform & Company Knowledge
        console.log('Ingesting Platform & Company Knowledge...');
        
        const ichancetekText = `iChanceTEK (ichancetek.com) is Chancellor Minus's parent innovation platform and technology company. It serves as the central hub for all AI-powered products, SaaS platforms, and enterprise solutions. iChanceTEK encompasses the full portfolio of ventures: EliteBooks, ChancellorHR, WorkSpaceIQ, Chancellor Work OS, iCareOS, Evolvable, ModeliQ, MediScribe, MemoiQ, WoundiQ, iSydney, iHailey, iSkylar, StrideIQ, Famio, Nesto Banks, The PotLuxE, and Enterprise AI Agents. The company specializes in Agentic AI, Cloud Architecture, Data Engineering, MLOps, DevOps, and Full-Stack AI Development across healthcare, finance, HR, fitness, social media, music, and enterprise sectors.`;
        await upsertVector('platform-ichancetek', ichancetekText, {
            type: 'platform',
            source: 'company',
            title: 'iChanceTEK',
        });

        const isyneraText = `iSynera (isynera.us) is Chancellor Minus's Enterprise Agentic AI & Cloud Architecture Consultancy and Platform. iSynera is where Chancellor delivers production-grade AI systems, multi-agent architectures, RAG pipelines, and cloud-native platforms for enterprise clients. The name 'iSynera' also represents the AI assistant persona embedded in the portfolio. iSynera specializes in building agentic AI systems using LangChain, LangGraph, OpenAI Agents SDK, CrewAI, and MCP (Model Context Protocol). The platform delivers solutions across Google Cloud (Cloud Run, Vertex AI, Firebase), AWS (Bedrock, SageMaker, EKS), and Azure (AI Foundry, AKS, Databricks). iSynera's core services include: AI Agentic Systems Engineering, Full-Stack AI Application Development, Data Engineering & ML Analytics, Cloud Architecture & Data Systems, DevOps & Platform Engineering, and Microsoft 365 & Azure Administration.`;
        await upsertVector('platform-isynera', isyneraText, {
            type: 'platform',
            source: 'company',
            title: 'iSynera',
        });

        const platformArchText = `Chancellor's Platform Technology Stack: AI Frameworks (LangChain, LangGraph, OpenAI Agents SDK, CrewAI, Genkit, MCP), LLMs (OpenAI GPT-5.6 Sol/Cyber, Anthropic Claude Fable 5 & Opus 5, Google Gemini 3.5 Pro/Flash, xAI Grok 4.20, DeepSeek V4 & Flash, Moonshot Kimi K3, Qwen3.8 Max, Meta Muse & Llama 4 Scout, NVIDIA Nemotron 3.5 Lightning), Voice AI (OpenAI Whisper STT, TTS pipelines), RAG & Embeddings (Pinecone, Chroma, S3 Vector, text-embedding-3-small), Frontend (React, Next.js, TypeScript, Tailwind CSS, ShadCN UI), Backend (Python FastAPI/Flask/Django, Node.js, C#), Cloud (GCP Cloud Run/Vertex AI/Firebase, AWS Bedrock/SageMaker/EKS, Azure AI Foundry/AKS/Databricks), Data (Snowflake, Cosmos DB, PostgreSQL, MongoDB, Apache Kafka, RabbitMQ), DevOps (Docker, Kubernetes, Terraform, OpenTofu, Pulumi, GitHub Actions, Azure DevOps, ArgoCD, Helm), ML/Data Science (NumPy, Pandas, Scikit-learn, TensorFlow, PyTorch), MLOps (SageMaker, Azure ML, Vertex AI, MLflow, Databricks, PySpark, Airflow).`;
        await upsertVector('platform-architecture', platformArchText, {
            type: 'platform',
            source: 'architecture',
            title: 'Platform Technology Stack',
        });

        const partnerText = `Chancellor Minus has worked with major companies and organizations: Condé Nast (premier global media company, Vogue, GQ, Vanity Fair, Wired), Advance (diversified global media and technology company, parent of Condé Nast), Simon Property Group (world's largest shopping mall owner and operator), Braiva Capital (private investment firm), Couristan (leading global manufacturer of luxury floor coverings since 1926), tBrexa Bio Inc. (biotechnology company), NAMA Harlem (oldest African-American musical organization in the US, founded 1904), WNDR (cloud-gaming and user-generated content platform), Alpharma Pharmaceuticals (global specialty pharmaceutical company), Novartis Pharmaceuticals (one of the world's largest pharmaceutical companies), Manhattan College (private Catholic liberal arts college, founded 1853), and Cayenne Pepper Productions (creative media and production company).`;
        await upsertVector('platform-partners', partnerText, {
            type: 'platform',
            source: 'partners',
            title: 'Partner Companies',
        });

        // 1. Ingest Products
        console.log('Ingesting Products...');
        for (const product of products) {
            const text = `Project: ${product.title}\nDescription: ${product.oneLiner}\nTech Stack: ${product.techStack.join(', ')}`;
            await upsertVector(`product-${product.id}`, text, {
                type: 'product',
                source: 'products',
                title: product.title,
            });
        }

        // 2. Ingest Ventures (all products, agents, and companies)
        console.log('Ingesting Ventures...');
        for (const venture of allVentures) {
            const text = `Venture: ${venture.name}\nURL: ${venture.href}\nDescription: ${venture.description}`;
            await upsertVector(`venture-${venture.id}`, text, {
                type: 'venture',
                source: 'allVentures',
                title: venture.name,
            });
        }

        // 3. Ingest Resume Data (Summary & Experience)
        console.log('Ingesting Resume...');

        // Summary
        await upsertVector('resume-summary', `Chancellor Minus Summary: ${resumeData.summary}`, {
            type: 'resume',
            section: 'summary'
        });

        // Experience
        for (const exp of resumeData.experience) {
            const text = `Role: ${exp.title} at ${exp.company}\nDate: ${exp.date}\nLocation: ${exp.location}\nDescription: ${exp.description}\nHighlights: ${exp.highlights.join('\n- ')}`;

            // Chunk long experience entries if needed, but for now we'll store as one block as they're not massive
            // If they are huge, we would use chunkText(text)
            await upsertVector(`exp-${exp.company.normalize('NFD').replace(/[^\x00-\x7F]/g, '').replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase()}`, text, {
                type: 'resume',
                section: 'experience',
                company: exp.company
            });
        }

        // Skills
        console.log('Ingesting Skills...');
        for (const category of skillCategories) {
            const skillsList = category.skills.map(s => s.name).join(', ');
            const text = `Skills in ${category.title}: ${skillsList}`;
            await upsertVector(`skills-${category.title.replace(/\s+/g, '-').toLowerCase()}`, text, {
                type: 'resume',
                section: 'skills',
                category: category.title
            });
        }

        // Technical Expertise from Resume
        for (const expertise of resumeData.technicalExpertise) {
            const text = `Technical Expertise - ${expertise.title}: ${expertise.skills}`;
            await upsertVector(`tech-expert-${expertise.title.replace(/\s+/g, '-').toLowerCase()}`, text, {
                type: 'resume',
                section: 'technicalExpertise',
                category: expertise.title
            });
        }

        console.log('Ingestion complete!');
    } catch (error) {
        console.error('Error during ingestion:', error);
    }
}

// Check if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    ingestData();
}

export { ingestData };
