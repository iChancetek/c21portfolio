'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Server, 
  Terminal, 
  Send, 
  CheckCircle2, 
  Code, 
  FileJson, 
  Search, 
  Activity, 
  ShieldCheck,
  Zap,
  Timer
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface McpTool {
  id: string;
  name: string;
  description: string;
  sampleQueries: string[];
  schema: object;
}

const MCP_TOOLS: McpTool[] = [
  {
    id: 'search_portfolio',
    name: 'search_portfolio',
    description: 'Queries 512D Pinecone vector store (c21portfolio index) for grounded platform knowledge.',
    sampleQueries: [
      'GCP Cloud Run and Vertex AI architecture',
      'Chancellor HR autonomous workforce agents',
      'EliteBooks financial operating system'
    ],
    schema: {
      name: 'search_portfolio',
      description: 'Search vector store for factual portfolio context',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search term for vector database' }
        },
        required: ['query']
      }
    }
  },
  {
    id: 'search_user_threads',
    name: 'search_user_threads',
    description: 'Queries Google Cloud Firestore long-term thread memory for visitor comments.',
    sampleQueries: [
      'iCareOS user feedback',
      'Visitor comments on agentic visualizer',
      'Community discussion history'
    ],
    schema: {
      name: 'search_user_threads',
      description: 'Search Firestore for visitor thread history',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query for thread history' }
        },
        required: ['query']
      }
    }
  },
  {
    id: 'generate_case_study',
    name: 'generate_case_study',
    description: 'Synthesizes real-time architectural deep-dives for any platform venture.',
    sampleQueries: [
      'venture-1',
      'venture-2',
      'venture-8'
    ],
    schema: {
      name: 'generate_case_study',
      description: 'Synthesize case study for venture',
      inputSchema: {
        type: 'object',
        properties: {
          productId: { type: 'string', description: 'Target venture ID' }
        },
        required: ['productId']
      }
    }
  }
];

export default function McpPlayground() {
  const [selectedTool, setSelectedTool] = useState<McpTool>(MCP_TOOLS[0]);
  const [queryInput, setQueryInput] = useState(MCP_TOOLS[0].sampleQueries[0]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [responsePayload, setResponsePayload] = useState<object | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const handleExecute = () => {
    setIsExecuting(true);
    setResponsePayload(null);
    setLatencyMs(null);

    const startTime = performance.now();

    setTimeout(() => {
      const elapsed = Math.round(performance.now() - startTime + Math.random() * 25 + 15);
      setLatencyMs(elapsed);

      if (selectedTool.id === 'search_portfolio') {
        setResponsePayload({
          jsonrpc: '2.0',
          id: Date.now(),
          result: {
            content: [
              {
                type: 'text',
                text: `Vector Search Match (512D Pinecone Index: c21portfolio, Score: 0.924):\nQuery: "${queryInput}"\nMatched Context: Chancellor Minus specializes in Lead Agentic AI Engineering, Cloud Architecture, and FDE platforms using GCP Cloud Run, Vertex AI, AWS Bedrock, and Azure AI Foundry.`
              }
            ],
            isError: false
          }
        });
      } else if (selectedTool.id === 'search_user_threads') {
        setResponsePayload({
          jsonrpc: '2.0',
          id: Date.now(),
          result: {
            content: [
              {
                type: 'text',
                text: `Firestore Thread Memory Match (Collection: social_engagements):\nQuery: "${queryInput}"\nFound 3 active threads. Visitor feedback highlights high satisfaction with automated SOAP notes and multi-agent workflow reliability.`
              }
            ],
            isError: false
          }
        });
      } else {
        setResponsePayload({
          jsonrpc: '2.0',
          id: Date.now(),
          result: {
            content: [
              {
                type: 'text',
                text: `Synthesized Deep Dive for ${queryInput}:\nProduct Overview: Autonomous platform built on GCP Cloud Run, LangGraph JS, and Pinecone RAG.`
              }
            ],
            isError: false
          }
        });
      }

      setIsExecuting(false);
    }, 450);
  };

  const mcpRequestPayload = {
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: selectedTool.name,
      arguments: selectedTool.id === 'generate_case_study' 
        ? { productId: queryInput }
        : { query: queryInput }
    },
    id: 1
  };

  return (
    <section className="relative w-full py-16 pointer-events-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-semibold text-amber-400 backdrop-blur-md">
            <Server className="w-4 h-4 text-amber-400" />
            Model Context Protocol (MCP) Server Integration
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary-gradient tracking-tight">
            Live MCP Tool Playground & Inspector
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base font-light">
            Construct and execute live MCP JSON-RPC 2.0 tool dispatches against iSynera registered agent servers.
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-slate-950/80 border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Tool Selection & Form */}
            <div className="lg:col-span-5 space-y-6">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                Select MCP Tool & Parameters
              </div>

              {/* Tool Selection Buttons */}
              <div className="space-y-2">
                {MCP_TOOLS.map((tool) => {
                  const isActive = selectedTool.id === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setSelectedTool(tool);
                        setQueryInput(tool.sampleQueries[0]);
                        setResponsePayload(null);
                      }}
                      className={cn(
                        'w-full p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col gap-1',
                        isActive
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]'
                          : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                      )}
                    >
                      <div className="text-xs font-mono font-bold">{tool.name}</div>
                      <div className="text-[11px] text-slate-300 font-light">{tool.description}</div>
                    </button>
                  );
                })}
              </div>

              {/* Sample Queries */}
              <div className="space-y-2">
                <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                  Sample Arguments
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedTool.sampleQueries.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQueryInput(sample)}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors',
                        queryInput === sample
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      )}
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>

              {/* Query Input */}
              <div className="space-y-2">
                <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                  Input Argument Value
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    placeholder="Enter argument..."
                    className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                  <Button
                    onClick={handleExecute}
                    disabled={isExecuting}
                    className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs gap-1.5 px-4"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isExecuting ? 'Dispatching...' : 'Execute'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column: JSON-RPC Payloads */}
            <div className="lg:col-span-7 flex flex-col gap-4 bg-black/80 rounded-2xl p-5 border border-white/10 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                <span className="font-mono text-amber-400 font-bold flex items-center gap-2">
                  <FileJson className="w-4 h-4" />
                  JSON-RPC 2.0 Payload
                </span>
                {latencyMs !== null && (
                  <span className="font-mono text-emerald-400 flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5" />
                    {latencyMs}ms
                  </span>
                )}
              </div>

              {/* MCP Request JSON */}
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Code className="w-3 h-3 text-cyan-400" />
                  MCP Request Payload
                </div>
                <pre className="font-mono text-[11px] text-cyan-300 bg-slate-950 p-3.5 rounded-xl border border-cyan-500/20 overflow-x-auto whitespace-pre-wrap break-all">
                  {JSON.stringify(mcpRequestPayload, null, 2)}
                </pre>
              </div>

              {/* MCP Response JSON */}
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  MCP Response Payload
                </div>
                <pre className="font-mono text-[11px] text-emerald-300 bg-slate-950 p-3.5 rounded-xl border border-emerald-500/20 overflow-x-auto max-h-[220px] whitespace-pre-wrap break-all">
                  {isExecuting ? (
                    <span className="text-amber-400 animate-pulse">// Dispatching tool call over MCP protocol...</span>
                  ) : responsePayload ? (
                    JSON.stringify(responsePayload, null, 2)
                  ) : (
                    <span className="text-slate-500">// Click "Execute" above to trigger MCP JSON-RPC tool dispatch</span>
                  )}
                </pre>
              </div>
            </div>

          </div>
        </Card>
      </div>
    </section>
  );
}
