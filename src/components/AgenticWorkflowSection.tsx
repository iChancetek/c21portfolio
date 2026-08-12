'use client';

import { useState } from 'react';
import LangGraphVisualizer from '@/components/LangGraphVisualizer';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bot, 
  Database, 
  Workflow, 
  BrainCircuit, 
  Search, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Network, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Radio, 
  Mic
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AgenticWorkflowSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'orchestration',
      badge: 'Step 1: Multi-Agent Collaboration',
      title: 'Supervisor Agent & 9 Specialized AI Flows',
      icon: Network,
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-cyan-500/40',
      textColor: 'text-cyan-400',
      description:
        'The Supervisor Agent (iSynera) orchestrates 9 specialized AI agentic flows and agents working in concert to power the Chancellor Minus platform. The Supervisor routes tasks dynamically across iSynera Assistant, iChancellor Wellness, iSkylar Voice Therapy, Dynamic Case Study Generator, Tech Expert Analyst, Daily Affirmation Generator, Whisper STT Perception, OpenAI TTS Audio Synthesis, and Healthy Living Planner.',
      details: [
        'Stateful Supervisor directed execution graphs (LangGraph & OpenAI Agents SDK)',
        'Central Supervisor Agent (iSynera) orchestrating 9 specialized Chancellor Minus AI Agents',
        'Autonomous tool calling for Pinecone Vector DB search and Firestore long-term thread memory',
        'Built-in safety guardrails, state persistence, and fallbacks for reliable performance'
      ],
      diagram: [
        { label: 'User Query / Voice', icon: Mic, status: 'Trigger' },
        { label: 'Supervisor Agent (iSynera)', icon: Network, status: 'Orchestrating' },
        { label: '9 Specialized c21 Agents', icon: BrainCircuit, status: 'Executing' },
        { label: 'Grounded Output / TTS', icon: ShieldCheck, status: 'Verified' },
      ]
    },
    {
      id: 'vectordb',
      badge: 'Step 2: Vector DB Connection',
      title: 'Pinecone Vector Store & Semantic Embeddings',
      icon: Database,
      color: 'from-purple-500/20 to-indigo-500/20',
      borderColor: 'border-purple-500/40',
      textColor: 'text-purple-400',
      description:
        'All portfolio knowledge, resume details, product specs, and live platform data are converted into 512-dimensional dense vector embeddings via OpenAI text-embedding-3-small and stored in Pinecone vector database index (c21portfolio).',
      details: [
        'Real-time sub-100ms similarity search using cosine distance vector math',
        'Automatic document chunking and metadata tagging (products, ventures, experience, skills)',
        'Multi-cloud persistence (Pinecone + AWS S3 / GCP Cloud SQL)',
        'ASCII-sanitized vector indexing for cross-platform data safety'
      ],
      diagram: [
        { label: 'Raw Knowledge', icon: Layers, status: 'Ingestion' },
        { label: 'Text Chunking', icon: Cpu, status: 'Processing' },
        { label: 'OpenAI Embeddings', icon: Sparkles, status: '512D Vector' },
        { label: 'Pinecone Index', icon: Database, status: 'Stored' },
      ]
    },
    {
      id: 'rag',
      badge: 'Step 3: RAG & Context Injection',
      title: 'Retrieval-Augmented Generation (RAG)',
      icon: Search,
      color: 'from-emerald-500/20 to-teal-500/20',
      borderColor: 'border-emerald-500/40',
      textColor: 'text-emerald-400',
      description:
        'When a query is received, agents autonomously call the search_portfolio and search_user_threads tools. The RAG pipeline retrieves top-K vector matches from Pinecone and long-term thread memory from Firestore to inject grounded context directly into prompt memory.',
      details: [
        'Tool-calling autonomous agent nodes (search_portfolio, search_user_threads)',
        'Hybrid search combining keyword filtering, vector similarity, and Firestore thread memory',
        'Zero-hallucination guarantee by grounding model responses in verified facts',
        'Dynamic synthesis: transforms raw context into concise, natural professional answers'
      ],
      diagram: [
        { label: 'Agent Query', icon: Search, status: 'Tool Call' },
        { label: 'Vector & Thread Query', icon: Database, status: 'Top-K Match' },
        { label: 'Context Injection', icon: Zap, status: 'Prompt Fusion' },
        { label: 'Grounded Answer', icon: Bot, status: 'Synthesized' },
      ]
    },
    {
      id: 'execution',
      badge: 'Step 4: Real-Time Execution & Voice',
      title: 'Voice AI & Multi-Cloud Pipeline Execution',
      icon: Radio,
      color: 'from-amber-500/20 to-rose-500/20',
      borderColor: 'border-amber-500/40',
      textColor: 'text-amber-400',
      description:
        'Synthesized answers are rendered instantly in the web interface, read aloud via OpenAI Text-to-Speech (TTS), and can be triggered via hands-free Whisper STT voice commands — all hosted on Google Cloud Run and Firebase Serverless infrastructure.',
      details: [
        'Whisper STT audio transcription for seamless hands-free voice search',
        'OpenAI TTS integration with multi-language voice playback (English, Spanish, French, etc.)',
        'Multi-cloud deployment across Google Cloud Platform, AWS, and Azure',
        'Serverless Next.js App Router API routes with instant client streaming'
      ],
      diagram: [
        { label: 'Whisper STT', icon: Mic, status: 'Voice Input' },
        { label: 'RAG Pipeline', icon: Workflow, status: 'Agent Flow' },
        { label: 'TTS Speech', icon: Radio, status: 'Audio Output' },
        { label: 'Cloud Run', icon: Cpu, status: 'Deployed' },
      ]
    }
  ];

  return (
    <section className="relative w-full xl:w-[120%] 2xl:w-[140%] max-w-[1400px] py-24 md:py-32 mt-12 overflow-hidden pointer-events-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center space-y-6 text-center mb-16"
        >
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm shadow-[0_0_15px_rgba(var(--primary),0.2)]">
            <Network className="mr-2 h-4 w-4 text-cyan-400" />
            Agentic AI & RAG Architecture
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-primary-gradient">
            How Our 9 AI Agents Work Together & Connect to Vector DB
          </h2>

          <p className="max-w-[850px] text-muted-foreground md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed font-light">
            Discover how Chancellor Minus&apos;s 9 specialized AI agents, Pinecone vector search, dynamic RAG context injection, and voice AI combine into a unified enterprise platform.
          </p>
        </motion.div>

        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-5xl mx-auto">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-300 backdrop-blur-md relative overflow-hidden',
                  isActive
                    ? `bg-black/60 ${step.borderColor} shadow-[0_0_30px_-5px_rgba(var(--primary),0.3)]`
                    : 'bg-black/20 border-white/10 hover:border-white/20 hover:bg-black/40 text-muted-foreground'
                )}
              >
                <div
                  className={cn(
                    'p-2.5 rounded-lg border shrink-0 transition-transform duration-300',
                    isActive ? `bg-primary/20 ${step.borderColor} scale-110` : 'bg-white/5 border-white/10'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive ? step.textColor : 'text-slate-400')} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                    Step 0{idx + 1}
                  </div>
                  <div className={cn('text-sm font-bold truncate', isActive ? 'text-white' : 'text-slate-300')}>
                    {step.title.split(' ')[0]} {step.title.split(' ')[1]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Showcase Card */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <Card className="relative overflow-hidden bg-black/50 border-white/10 backdrop-blur-2xl rounded-3xl p-6 md:p-10 shadow-[0_0_60px_-15px_rgba(var(--primary),0.2)]">
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-br opacity-50 pointer-events-none',
                steps[activeStep].color
              )}
            />

            <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Information */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-semibold tracking-wider text-primary uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  {steps[activeStep].badge}
                </div>

                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                  {steps[activeStep].title}
                </h3>

                <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light">
                  {steps[activeStep].description}
                </p>

                <div className="space-y-3 pt-2">
                  {steps[activeStep].details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm md:text-base text-slate-200">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Visual Pipeline Diagram */}
              <div className="lg:col-span-5 flex flex-col gap-3 p-6 rounded-2xl bg-black/60 border border-white/10 shadow-2xl backdrop-blur-xl">
                <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2 flex items-center justify-between">
                  <span>Data & Execution Flow</span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    Live Pipeline
                  </span>
                </div>

                {steps[activeStep].diagram.map((node, idx) => {
                  const NodeIcon = node.icon;
                  return (
                    <div key={idx} className="relative">
                      <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/20 border border-primary/30 text-primary">
                            <NodeIcon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-semibold text-white">{node.label}</span>
                        </div>
                        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-primary font-medium">
                          {node.status}
                        </span>
                      </div>

                      {idx < steps[activeStep].diagram.length - 1 && (
                        <div className="flex justify-center my-1">
                          <ArrowRight className="w-4 h-4 text-slate-500 rotate-90" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Executive Architecture Specification & Agent Mapping */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 max-w-6xl mx-auto"
        >
          <Card className="bg-black/50 border-primary/30 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-[0_0_50px_-10px_rgba(var(--primary),0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Cpu className="w-48 h-48 text-primary" />
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 mb-2">
                  <Workflow className="w-3.5 h-3.5 mr-1.5" /> Full Pipeline Specification
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">Executive Architecture & Agent Mapping</h3>
              </div>
              <div className="text-xs font-mono bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-300 w-fit">
                Index: <span className="text-primary font-bold">c21portfolio</span> | Stack: <span className="text-cyan-400 font-bold">LangGraph JS + OpenAI SDK</span>
              </div>
            </div>

            {/* Interactive LangGraph DAG Execution Visualizer */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" /> Live LangGraph Execution Visualizer
              </h4>
              <LangGraphVisualizer />
            </div>

            {/* 9 Specialized Agents Grid */}
            <div className="mt-8">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-primary" /> Supervisor Agent & 9 Specialized AI Flows
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs">
                  <div className="font-bold text-cyan-400 text-sm mb-1 flex items-center gap-1.5">
                    <Network className="w-4 h-4" /> Supervisor Agent (iSynera)
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">ai-portfolio-assistant.ts</div>
                  <div className="text-slate-300 mt-1 font-medium">LangGraph JS StateGraph Orchestrator</div>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs">
                  <div className="font-bold text-purple-400 text-sm mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> iChancellor Wellness
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">ichancellor-flow.ts</div>
                  <div className="text-slate-300 mt-1 font-medium">Mindfulness & Guided Meditation</div>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs">
                  <div className="font-bold text-rose-400 text-sm mb-1 flex items-center gap-1.5">
                    <Mic className="w-4 h-4" /> iSkylar Voice Therapy
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">iskylar-search-flow.ts</div>
                  <div className="text-slate-300 mt-1 font-medium">Therapeutic Empathy & Dialogue</div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs">
                  <div className="font-bold text-blue-400 text-sm mb-1 flex items-center gap-1.5">
                    <Layers className="w-4 h-4" /> Dynamic Case Study Generator
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">dynamic-case-study-generator.ts</div>
                  <div className="text-slate-300 mt-1 font-medium">Real-Time Deep-Dive Synthesis</div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                  <div className="font-bold text-amber-400 text-sm mb-1 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" /> Tech Expert Analyst
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">tech-expert-flow.ts</div>
                  <div className="text-slate-300 mt-1 font-medium">GenAI, MLOps & Architecture</div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                  <div className="font-bold text-emerald-400 text-sm mb-1 flex items-center gap-1.5">
                    <Zap className="w-4 h-4" /> Daily Affirmation Generator
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">affirmation-generator.ts</div>
                  <div className="text-slate-300 mt-1 font-medium">Personalized Mindset Affirmations</div>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs">
                  <div className="font-bold text-indigo-400 text-sm mb-1 flex items-center gap-1.5">
                    <Mic className="w-4 h-4" /> Whisper STT Perception
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">whisper-flow.ts</div>
                  <div className="text-slate-300 mt-1 font-medium">Speech-to-Text Voice Input</div>
                </div>

                <div className="p-3.5 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-xs">
                  <div className="font-bold text-fuchsia-400 text-sm mb-1 flex items-center gap-1.5">
                    <Radio className="w-4 h-4" /> OpenAI Voice Synthesis TTS
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">openai-tts-flow.ts</div>
                  <div className="text-slate-300 mt-1 font-medium">Multi-Language Audio Playback</div>
                </div>

                <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-xs">
                  <div className="font-bold text-teal-400 text-sm mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Healthy Living Planner
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">menuSuggestionFlow.ts</div>
                  <div className="text-slate-300 mt-1 font-medium">Nutrition & Health Advice</div>
                </div>
              </div>
            </div>

            {/* Core Infrastructure Capabilities */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" /> Core Infrastructure Capabilities
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-bold text-purple-400 text-sm mb-1">Pinecone Vector Database (RAG)</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    512-dimensional dense embeddings (<code className="text-primary font-mono">text-embedding-3-small</code>) in Pinecone <code className="text-primary font-mono">c21portfolio</code> index for zero-hallucination context injection.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-bold text-cyan-400 text-sm mb-1">Persistent Long-Term Thread Memory</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Google Cloud Firestore <code className="text-cyan-400 font-mono">social_engagements</code> integration allowing iSynera (<code className="text-cyan-400 font-mono">search_user_threads</code>) to recall visitor comments across platforms.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-bold text-emerald-400 text-sm mb-1">Voice AI Perception & Speech</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    OpenAI Whisper STT audio recognition combined with OpenAI Speech TTS neural voice synthesis.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 9 Specialized Chancellor Minus AI Agents Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
          <Card className="bg-black/40 border-white/10 p-6 rounded-2xl backdrop-blur-md hover:border-primary/40 transition-colors">
            <CardHeader className="p-0 mb-3 flex flex-row items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Network className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-white">Supervisor & 9 AI Agents</CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-sm text-slate-400 leading-relaxed">
              The central Supervisor Agent (iSynera) coordinates 9 dedicated AI flows (iChancellor Wellness, iSkylar Therapy, Case Study Generator, Tech Analyst, Whisper STT, TTS Speech, Affirmations, and Nutrition Planner) in stateful directed execution graphs.
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10 p-6 rounded-2xl backdrop-blur-md hover:border-primary/40 transition-colors">
            <CardHeader className="p-0 mb-3 flex flex-row items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Database className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-white">Pinecone DB & Thread Memory</CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-sm text-slate-400 leading-relaxed">
              Connected to Pinecone Vector Database (<code className="text-primary font-mono">c21portfolio</code> index) and Firestore long-term thread memory to recall facts, experience, and visitor discussions.
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10 p-6 rounded-2xl backdrop-blur-md hover:border-primary/40 transition-colors">
            <CardHeader className="p-0 mb-3 flex flex-row items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-white">Zero Hallucination RAG</CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-sm text-slate-400 leading-relaxed">
              Factual vector chunks and thread history are retrieved and injected into agent context, guaranteeing accurate, grounded responses for every visitor query.
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
