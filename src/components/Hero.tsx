'use client';

import AIAssistant from './AIAssistant';
import { Button } from './ui/button';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="w-full border-b border-border/40">
      <div className="grid lg:grid-cols-2 gap-12 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              <span className="text-primary-gradient">From AI Concept to Production Reality</span>
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              I architect, build, and scale intelligent Generative AI solutions that solve complex
              business challenges.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="bg-primary-gradient">
              <Link href="#projects">View My Work</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#contact">
                Get in Touch
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <AIAssistant />
        </div>
      </div>
    </section>
  );
}
