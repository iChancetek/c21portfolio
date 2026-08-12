'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  Zap, 
  ShieldCheck, 
  Workflow, 
  BrainCircuit, 
  ExternalLink, 
  CheckCircle2, 
  Cloud, 
  Terminal, 
  Layers, 
  Cpu, 
  Server, 
  Code, 
  Database, 
  ArrowRight, 
  MessageSquare, 
  Activity, 
  Lock, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  Check, 
  Globe, 
  ChevronRight, 
  PhoneCall 
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import FdeKnowledgeAssistant from '@/components/fde/FdeKnowledgeAssistant';
import FdeVoiceExperience from '@/components/fde/FdeVoiceExperience';
import FdeDataVisualization from '@/components/fde/FdeDataVisualization';
import FloatingAIAssistant from '@/components/FloatingAIAssistant';

// ─── Engagement Model Stages Data ─────────────────────────────────────

const STAGES = [
  {
    num: '01',
    name: 'DISCOVER',
    title: 'Deep Workflow & Environment Discovery',
    desc: 'Chancellor sits down directly with your team to understand actual operations, business constraints, existing data pipelines, user pain points, security boundaries, and desired target outcomes.'
  },
  {
    num: '02',
    name: 'DEFINE',
    title: 'Opportunity Mapping & Value Definition',
    desc: 'Translating complex business challenges into concrete engineering opportunities where Agentic AI, traditional AI, cloud architecture, and data engineering deliver measurable ROI.'
  },
  {
    num: '03',
    name: 'ARCHITECT',
    title: 'Enterprise Architecture & Guardrails Design',
    desc: 'Designing end-to-end AI architecture including RAG, MCP tool servers, agentic orchestration, APIs, vector stores, cloud infrastructure, IAM permissions, security, and human oversight controls.'
  },
  {
    num: '04',
    name: 'PROTOTYPE',
    title: 'Rapid Interactive Prototype Validation',
    desc: 'Building working, interactive software prototypes that allow stake-holders and users to validate real-world behavior and experience rather than reviewing static slide decks.'
  },
  {
    num: '05',
    name: 'ENGINEER',
    title: 'Production-Grade System Engineering',
    desc: 'Transforming validated prototypes into scalable, resilient production platforms with clean TypeScript/Python codebases, automated tests, APIs, databases, and CI/CD pipelines.'
  },
  {
    num: '06',
    name: 'DEPLOY',
    title: 'Multi-Cloud Deployment & Infrastructure',
    desc: 'Deploying the production system into your GCP, AWS, or Azure cloud environments using Infrastructure as Code (Terraform, OpenTofu, Pulumi) and container orchestration (Kubernetes, Cloud Run).'
  },
  {
    num: '07',
    name: 'OPTIMIZE',
    title: 'Continuous Quality & FinOps Optimization',
    desc: 'Continuously monitoring and improving AI output quality, latency, token costs, security posture, scaling parameters, and user satisfaction over time.'
  }
];

// ─── Capabilities Grid Data ─────────────────────────────────────────

const CAPABILITIES = [
  { title: 'Agentic AI Platforms', desc: 'Custom AI agents and multi-agent systems performing complex, multi-step workflows autonomously using tools, APIs, and enterprise memory.' },
  { title: 'AI-Native Applications', desc: 'Full-stack web applications designed ground-up around AI autonomy rather than appending AI as a superficial afterthought.' },
  { title: 'Enterprise AI Assistants', desc: 'Secure, intelligent assistants connected directly to approved organizational knowledge, internal APIs, and line-of-business software.' },
  { title: 'RAG Systems', desc: 'Production Retrieval-Augmented Generation pipelines providing zero-hallucination, factual answers grounded in company documents.' },
  { title: 'GraphRAG & Knowledge Systems', desc: 'Advanced knowledge graph architectures connecting entity relationships, structured databases, and unstructured enterprise data.' },
  { title: 'AI Automation Workflows', desc: 'Automating multi-department operations through tool-using AI agents, API webhooks, and intelligent decision orchestration.' },
  { title: 'AI-Powered Business Software', desc: 'Custom ERP, CRM, HR, and financial operating systems tailored around specific business logic and regulatory compliance.' },
  { title: 'Cloud-Native AI Platforms', desc: 'Resilient AI infrastructure designed for auto-scaling on Google Cloud Platform, Amazon Web Services, and Microsoft Azure.' },
  { title: 'Data & ML Analytics Pipelines', desc: 'High-throughput data ingestion, vector indexing, feature engineering, model fine-tuning, and real-time observability pipelines.' }
];

// ─── Benefits Data ────────────────────────────────────────────────────

const BENEFITS = [
  { title: 'Faster Innovation', desc: 'Move from business problem discovery to working production prototype in weeks rather than quarters.' },
  { title: 'Business-Aligned Engineering', desc: 'Directly connect technical and architectural decisions to core business outcomes and ROI.' },
  { title: 'Hands-On Expertise', desc: 'Work directly alongside a senior engineer who writes code and deploys systems instead of delivering strategy decks.' },
  { title: 'Reduced Technology Risk', desc: 'Evaluate AI models, security, data pipelines, and cloud infrastructure holistically before scaling.' },
  { title: 'Production Focus', desc: 'Architect solutions with enterprise security, reliability, monitoring, scalability, and maintainability built-in.' },
  { title: 'AI-Native Thinking', desc: 'Embed intelligent agent autonomy into the core architectural foundation of your business software.' },
  { title: 'Continuous Collaboration', desc: 'Maintain tight feedback loops and continuous collaboration between Chancellor and your organization.' },
  { title: 'Measurable Outcomes', desc: 'Focus on clear operational improvements: hours reclaimed, cost reduction, response velocity, and automation.' }
];

// ─── Tech Ecosystem Data ─────────────────────────────────────────────

const TECH_CATEGORIES = [
  { title: 'Closed Flagship LLMs', items: ['OpenAI GPT-5.6 Sol / Cyber', 'Anthropic Claude Fable 5 & Opus 5', 'Google Gemini 3.5 Pro & Flash', 'xAI Grok 4.20 (Harper & Benjamin)'] },
  { title: 'Open-Weight Frontier Models', items: ['DeepSeek V4 & V4-Flash', 'Moonshot Kimi K3', 'Qwen3.8 Max', 'Meta Muse & Llama 4 Scout', 'NVIDIA Nemotron 3.5 Lightning'] },
  { title: 'Agentic AI Systems', items: ['LangGraph JS', 'LangChain', 'OpenAI Agents SDK', 'MCP Protocol', 'CrewAI'] },
  { title: 'Knowledge & RAG', items: ['Pinecone 512D', 'Chroma DB', 'GraphRAG', 'S3 Vector', 'text-embedding-3-small'] },
  { title: 'Cloud Infrastructure', items: ['Google Cloud (Cloud Run, Vertex AI)', 'AWS (Bedrock, EKS)', 'Azure (AKS, AI Foundry)', 'Firebase'] },
  { title: 'Engineering & Code', items: ['TypeScript', 'Python FastAPI', 'Next.js 15', 'React', 'PostgreSQL pgvector'] },
  { title: 'DevOps & MLOps', items: ['Terraform', 'OpenTofu', 'Pulumi', 'Docker & Kubernetes', 'GitHub Actions / ArgoCD', 'MLflow / Vertex AI'] }
];

// ─── Main FDE Page Component ─────────────────────────────────────────

export default function ForwardDeployedEngineerPage() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <div className="flex flex-col w-full items-center justify-center py-10 space-y-20 pointer-events-auto">
      
      {/* ─── HERO SECTION ───────────────────────────────────────────── */}
      <section className="w-full max-w-7xl px-4 md:px-6 relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full rounded-3xl overflow-hidden border border-cyan-500/30 bg-slate-950/80 backdrop-blur-2xl p-8 md:p-14 relative flex flex-col items-center text-center shadow-[0_0_60px_-15px_rgba(34,211,238,0.2)]"
        >
          {/* Ambient Glow Effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-6">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            Forward Deployed Engineering (FDE) Flagship Service
          </div>

          {/* Primary Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-5xl leading-[1.1] mb-6">
            Forward Deployed Engineering for the Agentic AI Era
          </h1>

          {/* Supporting Headline */}
          <p className="text-slate-300 text-base md:text-xl max-w-3xl leading-relaxed font-light mb-8">
            From business problem to AI architecture to production-ready software, Chancellor works directly with organizations to understand their challenges, architect intelligent solutions, and engineer what comes next.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-sm px-8 rounded-xl shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all">
              <a href="/products#contact" className="flex items-center gap-2">
                Start an FDE Conversation <ArrowRight className="w-4 h-4" />
              </a>
            </Button>

            <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 font-semibold text-sm px-7 rounded-xl">
              <Link href="/ai-assistant" className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" /> Talk With Chancellor
              </Link>
            </Button>

            <Button asChild variant="ghost" size="lg" className="text-slate-300 hover:text-white font-medium text-sm px-6">
              <Link href="/ai-agents">
                Explore AI Solutions &rarr;
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>


      {/* ─── SECTION 01: WHAT IS FORWARD DEPLOYED ENGINEERING? ───────── */}
      <section className="w-full max-w-6xl px-4 md:px-6 space-y-10 text-left">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            Section 01 &bull; Model Definition
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary-gradient tracking-tight">
            What is Forward Deployed Engineering?
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6 text-slate-300 text-base md:text-lg leading-relaxed font-light">
            <p>
              A Forward Deployed Engineer (FDE) is a senior engineering partner who embeds directly within an organization. Rather than operating from remote isolation or delivering theoretical advice, an FDE gains deep familiarity with your actual operational environment.
            </p>
            <p>
              The FDE takes time to understand your core business objectives, user workflows, technology infrastructure, data assets, operational bottlenecks, security constraints, cloud environments, and desired outcomes.
            </p>
            <p>
              Traditional consulting frequently ends where real value begins — delivering strategy documents, assessments, and slide decks. Forward Deployed Engineering extends beyond advice into hands-on implementation, bridging technical strategy with production software execution.
            </p>
          </div>

          {/* Comparison Card */}
          <div className="lg:col-span-5 bg-slate-950/90 border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 pb-3 border-b border-white/10 flex items-center justify-between">
              <span>Traditional vs FDE Model</span>
              <span className="text-cyan-400 font-mono text-xs">Comparison</span>
            </h4>

            <div className="space-y-4 text-xs md:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <div className="font-bold text-slate-400">Traditional Consulting</div>
                <div className="text-slate-400 font-light">&bull; Strategy &bull; Recommendations &bull; Assessments &bull; Roadmaps &bull; Slide Decks</div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/40 space-y-1.5">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Forward Deployed Engineering (Chancellor)
                </div>
                <div className="text-slate-200 font-medium leading-relaxed">
                  &bull; Discovery &bull; Architecture &bull; Prototyping &bull; Production Engineering &bull; Agentic Workflows &bull; Cloud Deployment &bull; Optimization
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ─── SECTION 02: ADVISING VS ENGINEERING ─────────────────────── */}
      <section className="w-full max-w-6xl px-4 md:px-6 text-left">
        <Card className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-cyan-500/30 rounded-3xl p-8 md:p-12 shadow-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            Section 02 &bull; Value Execution
          </div>

          <h3 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            The Difference Between Advising and Engineering
          </h3>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light max-w-4xl">
            Advice is valuable. But working software creates value. Chancellor's FDE model connects strategic thinking directly to engineering execution. Engagements move rapidly from:
          </p>

          <div className="grid md:grid-cols-2 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-black/50 border border-white/10 space-y-2">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Traditional Question</div>
              <div className="text-xl font-bold text-slate-300">"What should we build?"</div>
              <div className="text-xs text-slate-400 font-light">Ends with a strategy recommendation report.</div>
            </div>

            <div className="p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 space-y-2">
              <div className="text-xs font-bold uppercase tracking-widest text-cyan-400">Chancellor FDE Execution</div>
              <div className="text-xl font-bold text-white">"What should we build, how should we architect it, and how quickly can we make it real?"</div>
              <div className="text-xs text-cyan-300 font-medium">Delivers production-ready software into your cloud environment.</div>
            </div>
          </div>
        </Card>
      </section>


      {/* ─── SECTION 03: THE 7-STAGE FDE ENGAGEMENT MODEL ───────────── */}
      <section className="w-full max-w-6xl px-4 md:px-6 space-y-10 text-left">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            Section 03 &bull; Methodology
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary-gradient tracking-tight">
            The 7-Stage FDE Engagement Model
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl font-light">
            A structured, repeatable engineering journey designed to take enterprise organizations from problem discovery to continuous production value.
          </p>
        </div>

        {/* Stage Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {STAGES.map((stage, idx) => (
            <button
              key={stage.num}
              onClick={() => setActiveStage(idx)}
              className={cn(
                'p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between h-24',
                activeStage === idx
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_20px_-5px_rgba(34,211,238,0.4)]'
                  : 'bg-slate-950/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
              )}
            >
              <div className="text-xs font-mono font-bold text-slate-500">{stage.num}</div>
              <div className="text-xs font-bold tracking-wider">{stage.name}</div>
            </button>
          ))}
        </div>

        {/* Selected Stage Detail Display */}
        <Card className="bg-slate-950/90 border-cyan-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs font-mono text-cyan-400 font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40">
                STAGE {STAGES[activeStage].num}
              </span>
              <span>{STAGES[activeStage].name}</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold text-white">
              {STAGES[activeStage].title}
            </h3>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light max-w-3xl">
              {STAGES[activeStage].desc}
            </p>
          </div>
        </Card>
      </section>


      {/* ─── SECTION 04: HUMAN-CENTERED CONVERSATION ─────────────────── */}
      <section className="w-full max-w-6xl px-4 md:px-6 text-left">
        <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-8 md:p-12 space-y-8 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-mono text-amber-400 uppercase tracking-widest">
            Section 04 &bull; Human-Centered Engineering
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            The Most Important Technology is the Conversation
          </h2>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light max-w-3xl">
            An FDE engagement begins with human conversation. Chancellor sits down directly with the domain experts who understand the business, observing actual workflows and listening to user challenges before writing code.
          </p>

          {/* Editorial Pull Quote */}
          <div className="p-6 md:p-8 rounded-2xl bg-amber-500/10 border-l-4 border-amber-400 text-amber-200 text-lg md:text-2xl font-serif italic leading-relaxed">
            "The most important technology is the conversation that happens before the code."
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-300 pt-2">
            {['Listen', 'Understand', 'Question', 'Observe', 'Architect', 'Build', 'Deploy', 'Learn', 'Improve'].map((step, idx) => (
              <span key={idx} className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-bold">{step}</span>
                {idx < 8 && <span className="text-slate-600">&rarr;</span>}
              </span>
            ))}
          </div>
        </div>
      </section>


      {/* ─── SECTION 05: AGENTIC AI ───────────────────────────────────── */}
      <section className="w-full max-w-6xl px-4 md:px-6 space-y-8 text-left">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-mono text-purple-400 uppercase tracking-widest">
            Section 05 &bull; Agentic Paradigm Shift
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary-gradient tracking-tight">
            The Enterprise Is Moving From Software That Waits to Software That Acts
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-3xl font-light leading-relaxed">
            Traditional software waits for explicit human instructions. Agentic systems operate autonomously toward defined business goals using reasoning, tool calling, enterprise data, vector memory, and human oversight.
          </p>
        </div>

        {/* Agentic Architecture Flow Visualizer */}
        <Card className="bg-slate-950/90 border-purple-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
          <div className="text-xs font-mono text-purple-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-purple-400" />
            Agentic AI Execution Topology
          </div>

          <div className="bg-black/80 border border-purple-500/20 rounded-2xl p-4 md:p-6 font-mono text-xs md:text-sm text-purple-300 overflow-x-auto leading-relaxed shadow-inner">
            User Query &rarr; AI Orchestrator (StateGraph) &rarr; Agent &rarr; Reasoning / Multi-Step Planning &rarr; MCP Tools &rarr; Enterprise Data (RAG / Firestore) &rarr; APIs &rarr; Other Agents &rarr; Execution &rarr; Verification &rarr; Human Oversight
          </div>
        </Card>
      </section>


      {/* ─── SECTION 06: AGENTIC CODING ───────────────────────────────── */}
      <section className="w-full max-w-6xl px-4 md:px-6 text-left">
        <Card className="bg-slate-950/80 border-emerald-500/30 rounded-3xl p-8 md:p-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-mono text-emerald-400 uppercase tracking-widest">
            Section 06 &bull; Accelerated Engineering
          </div>

          <h3 className="text-2xl md:text-4xl font-extrabold text-white">
            Agentic Coding & Engineering Velocity
          </h3>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light max-w-3xl">
            Modern AI-assisted engineering and agentic coding workflows accelerate application development, refactoring, test generation, API development, and infrastructure deployment. AI accelerates development speed, but Chancellor retains absolute responsibility for architecture, security, code quality, testing, validation, and production readiness.
          </p>
        </Card>
      </section>


      {/* ─── SECTION 07: CLOUD ARCHITECTURE ──────────────────────────── */}
      <section className="w-full max-w-6xl px-4 md:px-6 space-y-6 text-left">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            Section 07 &bull; Cloud Architect Foundation
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary-gradient tracking-tight">
            Cloud Architecture for Production AI
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl font-light">
            Modern AI platforms require resilient infrastructure foundations. Chancellor architects multi-cloud solutions tailored around your actual operational and security requirements.
          </p>
        </div>
      </section>


      {/* ─── SECTION 08: WHAT CHANCELLOR BUILDS ───────────────────────── */}
      <section className="w-full max-w-6xl px-4 md:px-6 space-y-8 text-left">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            Section 08 &bull; Capabilities
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            What Chancellor Builds
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CAPABILITIES.map((cap, idx) => (
            <Card key={idx} className="bg-slate-950/80 border-white/10 p-6 rounded-2xl backdrop-blur-md hover:border-cyan-500/40 transition-colors space-y-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">{cap.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">{cap.desc}</p>
            </Card>
          ))}
        </div>
      </section>


      {/* ─── SECTION 09: ASK THE FDE KNOWLEDGE ASSISTANT ──────────────── */}
      <section className="w-full max-w-6xl px-4 md:px-6">
        <FdeKnowledgeAssistant />
      </section>


      {/* ─── SECTION 10: OPENAI VOICE EXPERIENCE ──────────────────────── */}
      <section className="w-full max-w-6xl px-4 md:px-6">
        <FdeVoiceExperience />
      </section>


      {/* ─── SECTION 11: THE BENEFITS OF FDE CONSULTING ──────────────── */}
      <section className="w-full max-w-6xl px-4 md:px-6 space-y-8 text-left">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-mono text-emerald-400 uppercase tracking-widest">
            Section 11 &bull; Value Proposition
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary-gradient tracking-tight">
            The Benefits of FDE Consulting
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BENEFITS.map((ben, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {ben.title}
              </div>
              <p className="text-xs text-slate-400 font-light leading-relaxed">{ben.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* ─── SECTION 12: DATA VISUALIZATION ──────────────────────────── */}
      <section className="w-full max-w-6xl px-4 md:px-6">
        <FdeDataVisualization />
      </section>


      {/* ─── SECTION 13: CHANCELLOR TECHNOLOGY ECOSYSTEM ──────────────── */}
      <section className="w-full max-w-6xl px-4 md:px-6 space-y-8 text-left">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            Section 13 &bull; Ecosystem
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Chancellor Technology Ecosystem
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TECH_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
              <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">{cat.title}</h4>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((item, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ─── SECTION 14 & 15: WHY CHANCELLOR & FINAL CTA ─────────────── */}
      <section className="w-full max-w-6xl px-4 md:px-6 text-center">
        <Card className="bg-gradient-to-br from-slate-950 via-slate-900 to-black border-cyan-500/40 rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-[0_0_60px_-15px_rgba(34,211,238,0.25)] space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-xs font-bold text-cyan-400 uppercase tracking-widest">
            Your AI & Media Solutions Partner for the Agentic Future
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Let's Build What Comes Next.
          </h2>

          <p className="text-slate-300 text-base md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
            Bring us your business problem, operational workflow, idea, or technology challenge. Chancellor will work with you directly to understand it, architect the solution, and engineer what comes next.
          </p>

          <div className="p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 max-w-2xl mx-auto text-cyan-200 font-serif italic text-lg">
            "Chancellor does not simply tell organizations what AI could become. Chancellor helps build it."
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-base px-8 py-6 rounded-xl shadow-[0_0_30px_rgba(34,211,238,0.4)]">
              <a href="/products#contact" className="flex items-center gap-2">
                Start an FDE Conversation <ArrowRight className="w-5 h-5" />
              </a>
            </Button>

            <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 font-semibold text-base px-8 py-6 rounded-xl">
              <Link href="/ai-assistant">
                Talk With Chancellor
              </Link>
            </Button>
          </div>
        </Card>
      </section>

      <FloatingAIAssistant />
    </div>
  );
}
