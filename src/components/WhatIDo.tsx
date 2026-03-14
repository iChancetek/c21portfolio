"use client";

import { Workflow, Bot, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Workflow className="w-8 h-8 text-primary" />,
    title: 'End-to-End AI Delivery',
    description:
      'I own the entire lifecycle: from initial problem-framing and rapid prototyping to production deployment, rigorous evaluation, and continuous monitoring.',
  },
  {
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: 'Custom AI Solutions & Copilots',
    description:
      'I build powerful internal tools (knowledge search, code/content generation) and client-facing products (conversational analytics, intelligent automation, recommendation engines).',
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: 'Enterprise-Grade AI Architecture',
    description:
      'I design robust RAG pipelines, implement strategic model orchestration, and embed critical guardrails for safety, efficiency, and cost-control.',
  },
];

export default function WhatIDo() {
  return (
    <section id="what-i-do" className="py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
            >
              <Card className="h-full bg-secondary/20 backdrop-blur-md border border-white/5 shadow-lg shadow-primary/5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-[0_0_30px_-5px_rgba(var(--primary),0.2)] transition-all duration-500 group">
                <CardHeader>
                  <div className="mb-4 p-3 bg-primary/10 w-fit rounded-xl border border-primary/20 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                  <CardDescription className="pt-2 text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
    </section>
  );
}
