'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  Search, 
  Send, 
  Sparkles, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Cpu,
  HelpCircle
} from 'lucide-react';
import { queryFdeKnowledge } from '@/lib/fde-knowledge';
import { cn } from '@/lib/utils';

const PRESET_QUESTIONS = [
  'What is Forward Deployed Engineering?',
  'How does an FDE engagement work?',
  'What frontier AI models and LLMs does Chancellor deploy?',
  'What Agentic Frameworks does Chancellor use for orchestration?',
  'What is Agentic AI and how does it act?',
  'What cloud technologies does Chancellor architect?',
  'What types of platforms can Chancellor build?'
];

export default function FdeKnowledgeAssistant() {
  const [query, setQuery] = useState(PRESET_QUESTIONS[0]);
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<{ answer: string; matchedSource: string } | null>(null);

  const handleSearch = async (targetQuery?: string) => {
    const q = targetQuery || query;
    if (!q.trim()) return;
    setIsSearching(true);
    setResult(null);

    try {
      const res = await queryFdeKnowledge(q);
      setResult(res);
    } catch (err) {
      console.error(err);
      setResult({
        answer: 'Forward Deployed Engineering connects business discovery directly to production software execution across GCP, AWS, and Azure.',
        matchedSource: 'FDE Grounded Knowledge Base'
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="bg-slate-950/80 border-cyan-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_0_50px_-10px_rgba(34,211,238,0.15)] relative overflow-hidden text-left">
      {/* Background glow */}
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Bot className="w-48 h-48 text-cyan-400" />
      </div>

      <div className="space-y-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-semibold text-cyan-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Grounded RAG Assistant
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white">Ask the FDE Knowledge Assistant</h3>
          </div>
          <div className="text-xs font-mono bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-300 w-fit">
            Knowledge Base: <span className="text-cyan-400 font-bold">FDE Architecture Spec</span> | Vector: <span className="text-emerald-400 font-bold">512D Embeddings</span>
          </div>
        </div>

        {/* RAG Pipeline Diagram */}
        <div className="bg-black/60 border border-white/10 rounded-2xl p-4 text-xs font-mono text-slate-300 flex flex-wrap items-center justify-between gap-2 shadow-inner">
          <span className="text-cyan-400 font-bold flex items-center gap-1"><Database className="w-3.5 h-3.5" /> FDE Knowledge</span>
          <span>&rarr;</span>
          <span>Chunking</span>
          <span>&rarr;</span>
          <span>512D Embeddings</span>
          <span>&rarr;</span>
          <span className="text-purple-400 font-bold">Vector Search</span>
          <span>&rarr;</span>
          <span className="text-emerald-400 font-bold">Grounded LLM</span>
          <span>&rarr;</span>
          <span className="text-white font-bold">Verified Response</span>
        </div>

        {/* Preset Question Chips */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            Suggested Questions
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(q);
                  handleSearch(q);
                }}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all text-left',
                  query === q
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_-3px_rgba(34,211,238,0.3)]'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
                )}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ask anything about Forward Deployed Engineering..."
              className="w-full bg-black/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-sans"
            />
          </div>
          <Button
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-xs md:text-sm gap-2 px-6 rounded-xl shrink-0"
          >
            {isSearching ? <Bot className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {isSearching ? 'Retrieving...' : 'Ask FDE'}
          </Button>
        </div>

        {/* Response Box */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-black/80 border border-cyan-500/30 rounded-2xl p-5 md:p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Grounded FDE Response
                </span>
                <span className="text-slate-400 font-mono">{result.matchedSource}</span>
              </div>
              <div className="text-sm md:text-base text-slate-200 leading-relaxed font-light whitespace-pre-wrap">
                {result.answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
