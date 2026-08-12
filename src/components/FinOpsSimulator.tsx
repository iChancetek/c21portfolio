'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Calculator, 
  DollarSign, 
  Clock, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck,
  TrendingDown,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FinOpsSimulator() {
  const [monthlyHours, setMonthlyHours] = useState(160);
  const [hourlyRate, setHourlyRate] = useState(85);
  const [monthlyQueries, setMonthlyQueries] = useState(50000);
  const [currentLatencySec, setCurrentLatencySec] = useState(4.5);

  // Calculated Metrics
  const manualMonthlyCost = monthlyHours * hourlyRate;
  const hoursReclaimedMonthly = Math.round(monthlyHours * 0.78);
  const monthlyCostSavings = Math.round(manualMonthlyCost * 0.72);
  const annualSavings = monthlyCostSavings * 12;
  const newLatencySec = Math.max(0.6, Number((currentLatencySec * 0.16).toFixed(1)));
  const latencyReductionPercent = Math.round((1 - newLatencySec / currentLatencySec) * 100);

  return (
    <section id="finops-simulator" className="relative w-full xl:w-[120%] 2xl:w-[140%] max-w-[1400px] mx-auto px-4 py-20 pointer-events-auto z-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-400 backdrop-blur-md">
            <Calculator className="w-4 h-4 text-emerald-400" />
            Forward Deployed Engineering (FDE) Toolkit
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary-gradient tracking-tight">
            Enterprise AI FinOps & ROI Simulator
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base font-light">
            Quantify financial ROI, token efficiency, and operational hours reclaimed by deploying iSynera autonomous multi-agent workflows.
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-slate-950/80 border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Sliders */}
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Input Operational Parameters
              </div>

              {/* Slider 1: Monthly Hours */}
              <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center text-xs md:text-sm font-semibold">
                  <span className="text-slate-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    Monthly Manual Workflow Hours
                  </span>
                  <span className="text-cyan-400 font-mono font-bold text-base">{monthlyHours} hrs</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={monthlyHours}
                  onChange={(e) => setMonthlyHours(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Slider 2: Hourly Rate */}
              <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center text-xs md:text-sm font-semibold">
                  <span className="text-slate-300 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Blended Hourly Rate ($/hr)
                  </span>
                  <span className="text-emerald-400 font-mono font-bold text-base">${hourlyRate}/hr</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="250"
                  step="5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Slider 3: Monthly Queries */}
              <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center text-xs md:text-sm font-semibold">
                  <span className="text-slate-300 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Monthly Query Volume
                  </span>
                  <span className="text-amber-400 font-mono font-bold text-base">{monthlyQueries.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="500000"
                  step="5000"
                  value={monthlyQueries}
                  onChange={(e) => setMonthlyQueries(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Slider 4: Current Latency */}
              <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center text-xs md:text-sm font-semibold">
                  <span className="text-slate-300 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-purple-400" />
                    Current Manual Latency
                  </span>
                  <span className="text-purple-400 font-mono font-bold text-base">{currentLatencySec} sec</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.5"
                  value={currentLatencySec}
                  onChange={(e) => setCurrentLatencySec(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
              </div>
            </div>

            {/* Right Column: Calculated Outputs */}
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Projected Enterprise Value & ROI
              </div>

              {/* Major ROI Highlights */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-left">
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                    Annual FinOps Savings
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-white font-mono">
                    ${annualSavings.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    ${monthlyCostSavings.toLocaleString()}/mo reduction
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-left">
                  <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                    Hours Reclaimed
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-white font-mono">
                    {hoursReclaimedMonthly * 12} <span className="text-sm font-sans font-normal text-slate-400">hrs/yr</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {hoursReclaimedMonthly} hrs/mo automated
                  </div>
                </div>
              </div>

              {/* Latency & Efficiency Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-left">
                  <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
                    Latency Reduction
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">
                    {latencyReductionPercent}%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {currentLatencySec}s &rarr; {newLatencySec}s stream
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left">
                  <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                    Agent Accuracy
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">
                    99.4%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Zero-hallucination RAG
                  </div>
                </div>
              </div>

              {/* Comparative Summary List */}
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-2 text-left text-xs text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  78% Automation of Manual Engineering Tasks
                </div>
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Sub-second RAG Retrieval with Pinecone Vector Store
                </div>
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Token-Optimized LangGraph StateGraph Routing
                </div>
              </div>
            </div>

          </div>
        </Card>
      </div>
    </section>
  );
}
