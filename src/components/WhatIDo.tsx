import { Workflow, Bot, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';

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
          {features.map((feature) => (
            <Card key={feature.title} className="bg-card border-none shadow-lg shadow-primary/5 transition-all duration-300 hover:shadow-primary/10 hover:-translate-y-1">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-xl font-semibold text-foreground">{feature.title}</CardTitle>
                <CardDescription className="pt-2">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
    </section>
  );
}
