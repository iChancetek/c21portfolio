'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Network,
  Database,
  Search,
  BrainCircuit,
  Mic,
  Radio,
  ShieldCheck,
  Sparkles,
  Zap,
  X,
  ChevronRight,
  Timer,
  Activity,
  Server,
  FileJson,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────

interface GraphNode {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  color: string;         // tailwind color prefix e.g. 'cyan'
  x: number;             // percentage x position (0-100)
  y: number;             // percentage y position (0-100)
}

interface GraphEdge {
  from: string;
  to: string;
}

interface ExecutionStep {
  nodeId: string;
  latencyMs: number;
  detail: string;
}

interface ExecutionScenario {
  id: string;
  label: string;
  description: string;
  steps: ExecutionStep[];
  mcpPayload: {
    tool: string;
    request: object;
    response: object;
  };
  ragScore: number;
}

// ─── Graph Data ──────────────────────────────────────────────────────

const NODES: GraphNode[] = [
  { id: 'user',       label: 'User Query',             sublabel: 'Voice / Text',             icon: Mic,          color: 'slate',   x: 50,  y: 2 },
  { id: 'supervisor', label: 'Supervisor Agent',        sublabel: 'iSynera StateGraph',       icon: Network,      color: 'cyan',    x: 50,  y: 20 },
  { id: 'pinecone',   label: 'Pinecone RAG',            sublabel: '512D Vector Index',        icon: Database,     color: 'purple',  x: 15,  y: 42 },
  { id: 'firestore',  label: 'Firestore Memory',        sublabel: 'Thread Recall',            icon: Search,       color: 'blue',    x: 50,  y: 42 },
  { id: 'mcp',        label: 'MCP Tool Gateway',        sublabel: 'JSON-RPC Bridge',          icon: Server,       color: 'amber',   x: 85,  y: 42 },
  { id: 'agents',     label: '9 Specialized Agents',    sublabel: 'Tool Node Execution',      icon: BrainCircuit, color: 'emerald', x: 50,  y: 64 },
  { id: 'guardrails', label: 'Guardrails & Eval',       sublabel: 'Safety Verification',      icon: ShieldCheck,  color: 'rose',    x: 15,  y: 80 },
  { id: 'voice',      label: 'Voice AI Engine',         sublabel: 'Whisper STT / TTS',        icon: Radio,        color: 'fuchsia', x: 85,  y: 80 },
  { id: 'output',     label: 'Grounded Response',       sublabel: 'Verified Output',          icon: Sparkles,     color: 'cyan',    x: 50,  y: 95 },
];

const EDGES: GraphEdge[] = [
  { from: 'user',       to: 'supervisor' },
  { from: 'supervisor', to: 'pinecone' },
  { from: 'supervisor', to: 'firestore' },
  { from: 'supervisor', to: 'mcp' },
  { from: 'pinecone',   to: 'agents' },
  { from: 'firestore',  to: 'agents' },
  { from: 'mcp',        to: 'agents' },
  { from: 'agents',     to: 'guardrails' },
  { from: 'agents',     to: 'voice' },
  { from: 'guardrails', to: 'output' },
  { from: 'voice',      to: 'output' },
];

// ─── Preset Execution Scenarios ──────────────────────────────────────

const SCENARIOS: ExecutionScenario[] = [
  {
    id: 'rag-search',
    label: 'Multi-Cloud RAG Search',
    description: 'Visitor asks about Chancellor\'s cloud architecture experience',
    steps: [
      { nodeId: 'user',       latencyMs: 0,   detail: 'Query: "What cloud platforms does Chancellor use?"' },
      { nodeId: 'supervisor', latencyMs: 12,  detail: 'StateGraph routes → search_portfolio tool call' },
      { nodeId: 'pinecone',   latencyMs: 34,  detail: 'Top-K=5 cosine search → score: 0.912' },
      { nodeId: 'firestore',  latencyMs: 28,  detail: 'Thread context lookup → 0 prior threads' },
      { nodeId: 'agents',     latencyMs: 18,  detail: 'Tech Expert Agent synthesizes cloud expertise' },
      { nodeId: 'guardrails', latencyMs: 8,   detail: 'Groundedness: 99.2% — PASS' },
      { nodeId: 'output',     latencyMs: 4,   detail: 'GCP, AWS, Azure multi-cloud response delivered' },
    ],
    mcpPayload: {
      tool: 'search_portfolio',
      request: { jsonrpc: '2.0', method: 'tools/call', params: { name: 'search_portfolio', arguments: { query: 'cloud platforms architecture' } }, id: 1 },
      response: { jsonrpc: '2.0', result: { content: [{ type: 'text', text: '5 vectors matched (score: 0.912). Context: GCP Cloud Run, Vertex AI, Firebase; AWS Bedrock, SageMaker, EKS; Azure AI Foundry, AKS, Databricks.' }] }, id: 1 },
    },
    ragScore: 0.912,
  },
  {
    id: 'mcp-dispatch',
    label: 'MCP Tool Dispatch',
    description: 'Agent autonomously calls search_user_threads via MCP protocol',
    steps: [
      { nodeId: 'user',       latencyMs: 0,   detail: 'Query: "What did visitors say about iCareOS?"' },
      { nodeId: 'supervisor', latencyMs: 15,  detail: 'StateGraph routes → search_user_threads tool call' },
      { nodeId: 'mcp',        latencyMs: 22,  detail: 'MCP JSON-RPC dispatches to Firestore adapter' },
      { nodeId: 'firestore',  latencyMs: 45,  detail: '3 threads found matching "iCareOS"' },
      { nodeId: 'agents',     latencyMs: 20,  detail: 'Case Study Agent compiles visitor sentiment' },
      { nodeId: 'guardrails', latencyMs: 6,   detail: 'Groundedness: 98.7% — PASS' },
      { nodeId: 'output',     latencyMs: 3,   detail: 'Thread-grounded summary delivered' },
    ],
    mcpPayload: {
      tool: 'search_user_threads',
      request: { jsonrpc: '2.0', method: 'tools/call', params: { name: 'search_user_threads', arguments: { query: 'iCareOS feedback' } }, id: 2 },
      response: { jsonrpc: '2.0', result: { content: [{ type: 'text', text: '3 threads found. Users praised HIPAA-compliant SOAP note automation and clinical decision support capabilities.' }] }, id: 2 },
    },
    ragScore: 0.887,
  },
  {
    id: 'voice-pipeline',
    label: 'Voice & Thread Memory',
    description: 'Hands-free voice query with STT → RAG → TTS pipeline',
    steps: [
      { nodeId: 'user',       latencyMs: 0,    detail: 'Voice input: "Tell me about EliteBooks"' },
      { nodeId: 'supervisor', latencyMs: 10,   detail: 'Whisper STT transcription → text query' },
      { nodeId: 'pinecone',   latencyMs: 38,   detail: 'Top-K=5 cosine search → score: 0.934' },
      { nodeId: 'agents',     latencyMs: 22,   detail: 'Portfolio Agent synthesizes EliteBooks overview' },
      { nodeId: 'voice',      latencyMs: 120,  detail: 'OpenAI TTS generates audio (alloy voice)' },
      { nodeId: 'guardrails', latencyMs: 7,    detail: 'Groundedness: 99.8% — PASS' },
      { nodeId: 'output',     latencyMs: 5,    detail: 'Audio + text response delivered' },
    ],
    mcpPayload: {
      tool: 'search_portfolio',
      request: { jsonrpc: '2.0', method: 'tools/call', params: { name: 'search_portfolio', arguments: { query: 'EliteBooks AI financial platform' } }, id: 3 },
      response: { jsonrpc: '2.0', result: { content: [{ type: 'text', text: '5 vectors matched (score: 0.934). Context: EliteBooks.us — AI-powered financial operating system with autonomous agents for invoicing, expenses, payroll, reporting, and FinOps.' }] }, id: 3 },
    },
    ragScore: 0.934,
  },
];

// ─── Color Mapping Helpers ───────────────────────────────────────────

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string; ring: string }> = {
  cyan:    { bg: 'bg-cyan-500/15',    border: 'border-cyan-500/40',    text: 'text-cyan-400',    glow: 'shadow-cyan-500/30',    ring: 'ring-cyan-500/50' },
  purple:  { bg: 'bg-purple-500/15',  border: 'border-purple-500/40',  text: 'text-purple-400',  glow: 'shadow-purple-500/30',  ring: 'ring-purple-500/50' },
  blue:    { bg: 'bg-blue-500/15',    border: 'border-blue-500/40',    text: 'text-blue-400',    glow: 'shadow-blue-500/30',    ring: 'ring-blue-500/50' },
  amber:   { bg: 'bg-amber-500/15',   border: 'border-amber-500/40',   text: 'text-amber-400',   glow: 'shadow-amber-500/30',   ring: 'ring-amber-500/50' },
  emerald: { bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', text: 'text-emerald-400', glow: 'shadow-emerald-500/30', ring: 'ring-emerald-500/50' },
  rose:    { bg: 'bg-rose-500/15',    border: 'border-rose-500/40',    text: 'text-rose-400',    glow: 'shadow-rose-500/30',    ring: 'ring-rose-500/50' },
  fuchsia: { bg: 'bg-fuchsia-500/15', border: 'border-fuchsia-500/40', text: 'text-fuchsia-400', glow: 'shadow-fuchsia-500/30', ring: 'ring-fuchsia-500/50' },
  slate:   { bg: 'bg-slate-500/15',   border: 'border-slate-500/40',   text: 'text-slate-400',   glow: 'shadow-slate-500/30',   ring: 'ring-slate-500/50' },
};

// ─── SVG Edge Component ──────────────────────────────────────────────

function EdgeLine({ fromNode, toNode, isActive, beamProgress }: {
  fromNode: GraphNode;
  toNode: GraphNode;
  isActive: boolean;
  beamProgress: number;  // 0..1 — position of glow dot along edge
}) {
  const x1 = fromNode.x;
  const y1 = fromNode.y + 3;
  const x2 = toNode.x;
  const y2 = toNode.y - 1;

  // Curved path via quadratic bezier
  const midY = (y1 + y2) / 2;
  const path = `M ${x1} ${y1} Q ${x1} ${midY}, ${(x1 + x2) / 2} ${midY} Q ${x2} ${midY}, ${x2} ${y2}`;

  // Calculate beam position on the path
  const beamX = x1 + (x2 - x1) * beamProgress;
  const beamY = y1 + (y2 - y1) * beamProgress;

  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke={isActive ? 'rgba(56, 189, 248, 0.6)' : 'rgba(148, 163, 184, 0.15)'}
        strokeWidth={isActive ? 0.6 : 0.3}
        strokeDasharray={isActive ? undefined : '2 2'}
        className={isActive ? 'transition-all duration-500' : ''}
      />
      {isActive && beamProgress > 0 && beamProgress < 1 && (
        <>
          <circle cx={beamX} cy={beamY} r="1.2" fill="rgba(56, 189, 248, 1)" />
          <circle cx={beamX} cy={beamY} r="3" fill="rgba(56, 189, 248, 0.25)" />
        </>
      )}
    </g>
  );
}

// ─── SVG Node Component ──────────────────────────────────────────────

function GraphNodeElement({ node, isActive, isExecuting, onClick }: {
  node: GraphNode;
  isActive: boolean;
  isExecuting: boolean;
  onClick: () => void;
}) {
  const colors = colorMap[node.color] || colorMap.slate;
  const Icon = node.icon;

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      onClick={onClick}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
    >
      {/* Glow ring on active */}
      {isActive && (
        <circle cx="0" cy="2" r="6" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="0.4">
          <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Executing pulse */}
      {isExecuting && (
        <circle cx="0" cy="2" r="4" fill="rgba(56, 189, 248, 0.15)">
          <animate attributeName="r" values="4;8;4" dur="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="1s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Node background */}
      <rect
        x="-10"
        y="-3.5"
        width="20"
        height="10"
        rx="2"
        fill={isActive ? 'rgba(15, 23, 42, 0.9)' : 'rgba(15, 23, 42, 0.6)'}
        stroke={isActive ? 'rgba(56, 189, 248, 0.6)' : 'rgba(148, 163, 184, 0.15)'}
        strokeWidth={isActive ? 0.5 : 0.3}
        className="transition-all duration-300"
      />

      {/* Icon circle */}
      <circle cx="-5.5" cy="2" r="2.5" fill={isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(148, 163, 184, 0.1)'} />

      {/* Labels */}
      <text x="-1.5" y="1" fontSize="1.6" fontWeight="700" fill={isActive ? '#38bdf8' : '#e2e8f0'} textAnchor="start" className="select-none">
        {node.label}
      </text>
      <text x="-1.5" y="3.8" fontSize="1.1" fill="#94a3b8" textAnchor="start" className="select-none">
        {node.sublabel}
      </text>

      {/* Icon placeholder marker */}
      <text x="-5.5" y="3" fontSize="2.5" textAnchor="middle" fill={isActive ? '#38bdf8' : '#94a3b8'} className="select-none">
        ◆
      </text>
    </g>
  );
}

// ─── Main LangGraphVisualizer Component ──────────────────────────────

export default function LangGraphVisualizer() {
  const [selectedScenario, setSelectedScenario] = useState<ExecutionScenario>(SCENARIOS[0]);
  const [executionStep, setExecutionStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [beamEdges, setBeamEdges] = useState<Map<string, number>>(new Map());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get active node IDs up to current step
  const activeNodeIds = new Set(
    selectedScenario.steps.slice(0, executionStep + 1).map(s => s.nodeId)
  );
  const executingNodeId = executionStep >= 0 && executionStep < selectedScenario.steps.length
    ? selectedScenario.steps[executionStep].nodeId
    : null;

  // Get active edges based on visited nodes
  const activeEdgeKeys = new Set<string>();
  const steps = selectedScenario.steps;
  for (let i = 1; i <= executionStep && i < steps.length; i++) {
    const fromId = steps[i - 1].nodeId;
    const toId = steps[i].nodeId;
    // Find actual edge matching this trajectory
    for (const edge of EDGES) {
      if (edge.from === fromId && edge.to === toId) {
        activeEdgeKeys.add(`${edge.from}-${edge.to}`);
      }
      // Check indirect connections via shared layer
      if (activeNodeIds.has(edge.from) && activeNodeIds.has(edge.to)) {
        activeEdgeKeys.add(`${edge.from}-${edge.to}`);
      }
    }
  }

  // Total latency up to current step
  const totalLatency = selectedScenario.steps
    .slice(0, executionStep + 1)
    .reduce((sum, s) => sum + s.latencyMs, 0);

  // Playback controls
  const playExecution = useCallback(() => {
    setExecutionStep(-1);
    setIsPlaying(true);
    setShowInspector(false);
    setBeamEdges(new Map());

    let step = 0;
    intervalRef.current = setInterval(() => {
      if (step >= selectedScenario.steps.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsPlaying(false);
        setShowInspector(true);
        return;
      }
      setExecutionStep(step);
      step++;
    }, 600);
  }, [selectedScenario]);

  const resetExecution = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setExecutionStep(-1);
    setIsPlaying(false);
    setShowInspector(false);
    setBeamEdges(new Map());
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Auto-play first scenario on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      playExecution();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const nodeMap = new Map(NODES.map(n => [n.id, n]));

  return (
    <div className="relative w-full">
      {/* Scenario Selector */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 shrink-0 pt-1.5">
          <Activity className="w-4 h-4 text-cyan-400" />
          Execution Trace
        </div>
        <div className="flex flex-wrap gap-2 flex-1">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => {
                setSelectedScenario(scenario);
                resetExecution();
              }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200',
                selectedScenario.id === scenario.id
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_-3px_rgba(34,211,238,0.3)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300'
              )}
            >
              {scenario.label}
            </button>
          ))}
        </div>
      </div>

      {/* Play / Reset Controls */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={playExecution}
          disabled={isPlaying}
          className={cn(
            'px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-300 flex items-center gap-2',
            isPlaying
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 cursor-wait'
              : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_-5px_rgba(34,211,238,0.4)]'
          )}
        >
          {isPlaying ? (
            <>
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              Executing...
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5" />
              Run Trace
            </>
          )}
        </button>

        <button
          onClick={resetExecution}
          className="px-3 py-2 rounded-xl text-xs font-semibold border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all"
        >
          Reset
        </button>

        {/* Live stats */}
        <div className="flex items-center gap-4 ml-auto text-xs font-mono">
          {executionStep >= 0 && (
            <>
              <span className="text-slate-400 flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-amber-400" />
                {totalLatency}ms
              </span>
              <span className="text-slate-400">
                Step {Math.min(executionStep + 1, selectedScenario.steps.length)}/{selectedScenario.steps.length}
              </span>
              {!isPlaying && executionStep >= selectedScenario.steps.length - 1 && (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  RAG: {selectedScenario.ragScore.toFixed(3)}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* SVG DAG Graph */}
      <div className="relative w-full rounded-2xl bg-slate-950/80 border border-white/10 overflow-hidden backdrop-blur-xl shadow-2xl">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[200px] h-[200px] bg-purple-500/5 blur-[80px] rounded-full pointer-events-none" />

        <svg viewBox="0 0 100 100" className="w-full h-auto min-h-[380px] md:min-h-[420px]" preserveAspectRatio="xMidYMid meet">
          {/* Edges */}
          {EDGES.map((edge) => {
            const fromNode = nodeMap.get(edge.from);
            const toNode = nodeMap.get(edge.to);
            if (!fromNode || !toNode) return null;
            const edgeKey = `${edge.from}-${edge.to}`;
            const isActive = activeEdgeKeys.has(edgeKey);
            return (
              <EdgeLine
                key={edgeKey}
                fromNode={fromNode}
                toNode={toNode}
                isActive={isActive}
                beamProgress={beamEdges.get(edgeKey) ?? 0}
              />
            );
          })}

          {/* Nodes */}
          {NODES.map((node) => (
            <GraphNodeElement
              key={node.id}
              node={node}
              isActive={activeNodeIds.has(node.id)}
              isExecuting={executingNodeId === node.id}
              onClick={() => setSelectedNodeId(selectedNodeId === node.id ? null : node.id)}
            />
          ))}
        </svg>

        {/* Execution step log overlay */}
        {executionStep >= 0 && (
          <div className="absolute bottom-3 left-3 right-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={executionStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black/80 border border-cyan-500/30 backdrop-blur-xl text-xs"
              >
                <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0 animate-pulse" />
                <span className="text-cyan-300 font-mono font-semibold shrink-0">
                  {selectedScenario.steps[Math.min(executionStep, selectedScenario.steps.length - 1)].latencyMs}ms
                </span>
                <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                <span className="text-slate-200 truncate">
                  {selectedScenario.steps[Math.min(executionStep, selectedScenario.steps.length - 1)].detail}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* MCP Inspector Drawer */}
      <AnimatePresence>
        {showInspector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mt-4 overflow-hidden"
          >
            <div className="rounded-2xl bg-slate-950/80 border border-amber-500/30 backdrop-blur-xl p-5 relative">
              {/* Close button */}
              <button
                onClick={() => setShowInspector(false)}
                className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30">
                  <FileJson className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">MCP Tool Execution Inspector</h4>
                  <p className="text-xs text-slate-400">
                    Model Context Protocol JSON-RPC — <code className="text-amber-400 font-mono">{selectedScenario.mcpPayload.tool}</code>
                  </p>
                </div>
              </div>

              {/* Metrics Bar */}
              <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs">
                  <Timer className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-slate-400">Total Latency:</span>
                  <span className="text-white font-mono font-bold">{totalLatency}ms</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Database className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-slate-400">Vector Score:</span>
                  <span className="text-white font-mono font-bold">{selectedScenario.ragScore.toFixed(3)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-400">Groundedness:</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {(selectedScenario.ragScore * 100 + Math.random() * 5).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* JSON Payloads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 text-cyan-400" />
                    MCP Request (JSON-RPC 2.0)
                  </div>
                  <pre className="text-[11px] font-mono text-cyan-300 bg-black/60 rounded-xl p-4 border border-cyan-500/20 overflow-x-auto leading-relaxed whitespace-pre-wrap break-all">
                    {JSON.stringify(selectedScenario.mcpPayload.request, null, 2)}
                  </pre>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 text-emerald-400" />
                    MCP Response
                  </div>
                  <pre className="text-[11px] font-mono text-emerald-300 bg-black/60 rounded-xl p-4 border border-emerald-500/20 overflow-x-auto leading-relaxed whitespace-pre-wrap break-all">
                    {JSON.stringify(selectedScenario.mcpPayload.response, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Execution Trace Table */}
              <div className="mt-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Activity className="w-3 h-3 text-cyan-400" />
                  Step-by-Step Execution Trace
                </div>
                <div className="bg-black/60 rounded-xl border border-white/10 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400">
                        <th className="text-left px-3 py-2 font-semibold">#</th>
                        <th className="text-left px-3 py-2 font-semibold">Node</th>
                        <th className="text-left px-3 py-2 font-semibold">Latency</th>
                        <th className="text-left px-3 py-2 font-semibold">Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedScenario.steps.map((step, idx) => {
                        const node = nodeMap.get(step.nodeId);
                        const colors = node ? colorMap[node.color] : colorMap.slate;
                        return (
                          <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="px-3 py-2 font-mono text-slate-500">{idx + 1}</td>
                            <td className={cn('px-3 py-2 font-semibold', colors?.text || 'text-slate-300')}>
                              {node?.label || step.nodeId}
                            </td>
                            <td className="px-3 py-2 font-mono text-amber-400">{step.latencyMs}ms</td>
                            <td className="px-3 py-2 text-slate-300 truncate max-w-[200px] md:max-w-none">{step.detail}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
