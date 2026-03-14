'use client';

import AIAssistant from './AIAssistant';
import { Button } from './ui/button';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { Network } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Track scroll within this specific tall section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Spring animations for smoother scrubbing
  const smoothProgress = useSpring(scrollYProgress, { mass: 0.1, stiffness: 100, damping: 20 });

  // Extremely large scaling effect: Starts at 1x, grows to 40x so the inner "O" or whitespace engulfs the screen.
  const scale = useTransform(smoothProgress, [0, 0.4], [1, 40]);
  // Fade out the massive text as it engulfs the user
  const textOpacity = useTransform(smoothProgress, [0.2, 0.35], [1, 0]);
  // As text scales up and fades, reveal the inner portal (AI Assistant)
  const portalOpacity = useTransform(smoothProgress, [0.35, 0.5], [0, 1]);
  const portalScale = useTransform(smoothProgress, [0.35, 0.6], [0.8, 1]);
  const portalY = useTransform(smoothProgress, [0.35, 0.6], [100, 0]);

  return (
    // Tall container to create scroll distance
    <section ref={containerRef} className="relative w-full h-[250vh] bg-background">
      
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Ambient Animated Background Grid */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.05)_0%,transparent_100%)] opacity-50" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none z-0" />

        {/* Phase 1: Massive Scaling Text (The Mask) */}
        <motion.div 
          style={{ scale, opacity: textOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center z-10 origin-center pointer-events-none"
        >
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1.2, ease: "easeOut" }}
             className="text-center"
          >
             <h1 className="text-[10vw] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 drop-shadow-2xl mix-blend-plus-lighter">
               AGENTIC
             </h1>
             <h1 className="text-[10vw] font-black tracking-tighter leading-none text-primary-gradient drop-shadow-[0_0_30px_rgba(var(--primary),0.5)]">
               REALITY.
             </h1>
             <p className="mt-8 text-2xl font-light text-slate-300 tracking-widest uppercase opacity-80">
                <span className="animate-pulse mr-2">↓</span> Scroll to Enter
             </p>
          </motion.div>
        </motion.div>

        {/* Phase 2: The Inner Portal (Revealed Content) */}
        <motion.div 
          style={{ opacity: portalOpacity, scale: portalScale, y: portalY }}
          className="relative z-20 w-full max-w-6xl px-4 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 h-full"
        >
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
            <div className="inline-flex py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold tracking-widest uppercase backdrop-blur-md shadow-[0_0_25px_rgba(var(--primary),0.3)]">
               <Network className="w-4 h-4 mr-2" /> Engineering The Future
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl/none font-extrabold tracking-tight">
               From AI Concept to <br/><span className="text-primary-gradient">Production Reality</span>
            </h2>
            
            <p className="max-w-[500px] text-lg lg:text-xl text-slate-300 font-light leading-relaxed">
              I architect, build, and scale intelligent Generative AI solutions that solve complex business challenges with zero compromise.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" asChild className="h-14 px-8 text-lg bg-primary-gradient shadow-[0_0_30px_rgba(var(--primary),0.4)] hover:shadow-[0_0_50px_rgba(var(--primary),0.6)] hover:-translate-y-1 transition-all">
                <Link href="#projects">View My Work</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 px-8 text-lg hover:bg-primary/10 hover:text-primary transition-all border-primary/30 hover:border-primary/60 backdrop-blur-md">
                <Link href="#contact">Get in Touch</Link>
              </Button>
            </div>
          </div>

          {/* The AI Assistant acts as the literal heart of the portal */}
          <div className="flex-1 w-full max-w-md relative">
             <div className="absolute -inset-4 bg-primary/20 blur-[60px] rounded-full z-0 animate-pulse" />
             <div className="relative z-10 transform-gpu hover:scale-[1.02] transition-transform duration-500">
               <AIAssistant />
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
