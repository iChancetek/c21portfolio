'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart3, CheckCircle2, TrendingUp, ShieldCheck, Layers, Cpu, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonItem {
  dimension: string;
  traditional: number;  // 0 - 100
  fde: number;          // 0 - 100
  unit: string;
}

const COMPARISON_DATA: ComparisonItem[] = [
  { dimension: 'Strategic Discovery & Alignment', traditional: 90, fde: 95, unit: 'Focus' },
  { dimension: 'System & Cloud Architecture', traditional: 45, fde: 98, unit: 'Depth' },
  { dimension: 'Hands-On Engineering Execution', traditional: 15, fde: 99, unit: 'Output' },
  { dimension: 'Agentic AI & RAG Development', traditional: 20, fde: 96, unit: 'Capability' },
  { dimension: 'Production Cloud Deployment', traditional: 10, fde: 95, unit: 'Delivery' },
  { dimension: 'Continuous Optimization & Support', traditional: 25, fde: 92, unit: 'LTV' },
];

export default function FdeDataVisualization() {
  return (
    <section className="relative w-full py-12 pointer-events-auto">
      <div className="max-w-6xl mx-auto space-y-8 text-left">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-semibold text-cyan-400">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Illustrative Engagement Visualizations
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold text-primary-gradient tracking-tight">
            Traditional Consulting vs. Forward Deployed Engineering
          </h3>
          <p className="text-slate-300 max-w-2xl mx-auto text-xs md:text-sm font-light">
            Illustrative comparative breakdown illustrating how Forward Deployed Engineering extends beyond advisory strategy into production software execution.
          </p>
        </div>

        {/* Main Comparison Card */}
        <Card className="bg-slate-950/80 border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl space-y-8">
          
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <span className="h-3 w-3 rounded-full bg-cyan-400 inline-block" />
                Forward Deployed Engineering (Chancellor)
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="h-3 w-3 rounded-full bg-slate-600 inline-block" />
                Traditional Advisory Consulting
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              Label: Illustrative Engagement Model
            </span>
          </div>

          {/* Metrics Bars Grid */}
          <div className="space-y-6">
            {COMPARISON_DATA.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center text-xs md:text-sm font-semibold text-slate-200">
                  <span>{item.dimension}</span>
                  <span className="text-cyan-400 font-mono">FDE: {item.fde}% vs Trad: {item.traditional}%</span>
                </div>

                {/* Bar track */}
                <div className="space-y-1.5">
                  {/* FDE Bar */}
                  <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden p-0.5 border border-cyan-500/20">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.fde}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                    />
                  </div>

                  {/* Traditional Bar */}
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.traditional}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="h-full bg-slate-600 rounded-full opacity-60"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Callout */}
          <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>Chancellor's FDE model delivers continuous engineering velocity from day one.</span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/30">
              100% Production-Focused
            </span>
          </div>

        </Card>

      </div>
    </section>
  );
}
