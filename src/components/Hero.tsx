'use client';

import AIAssistant from './AIAssistant';
import { Button } from './ui/button';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, Suspense, useState, useEffect } from 'react';
import { Network } from 'lucide-react';
import AgenticLab from './3d/scenes/AgenticLab';

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isScaled, setIsScaled] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Phase 1: Wait 1.5s then scale the typography mask autonomously
    const scaleTimer = setTimeout(() => setIsScaled(true), 1500);
    
    // Phase 2: Reveal the inner portal at 2.2s
    const revealTimer = setTimeout(() => setIsRevealed(true), 2200);
    
    return () => {
      clearTimeout(scaleTimer);
      clearTimeout(revealTimer);
    };
  }, []);

  return (
    // Responsive immersive container
    <section ref={containerRef} className="relative w-full h-screen bg-background overflow-hidden">
      
      {/* Sticky viewport container */}
      <div className="relative h-full w-full flex flex-col items-center justify-center">
        
        {/* Ambient Animated Background Grid */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.05)_0%,transparent_100%)] opacity-50" />

        {/* Phase 1: Massive Scaling Text (The Autonomous Mask) */}
        <motion.div 
          initial={{ scale: 1, opacity: 1 }}
          animate={{ 
            scale: isScaled ? 60 : 1, 
            opacity: isScaled ? 0 : 1 
          }}
          transition={{ 
            duration: 2.5, 
            ease: [0.7, 0, 0.3, 1] 
          }}
          className="absolute inset-0 flex flex-col items-center justify-center z-50 origin-center pointer-events-none"
        >
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1.2, ease: "easeOut" }}
             className="text-center"
          >
             <h1 className="text-[10vw] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 drop-shadow-2xl mix-blend-plus-lighter uppercase">
               Chancellor
             </h1>
             <h1 className="text-[10vw] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 drop-shadow-2xl mix-blend-plus-lighter">
               AGENTIC
             </h1>
             <h1 className="text-[10vw] font-black tracking-tighter leading-none text-primary-gradient drop-shadow-[0_0_30px_rgba(var(--primary),0.5)]">
               REALITY.
             </h1>
             <div className="mt-8 flex items-center justify-center gap-4">
                <div className="h-[1px] w-12 bg-primary/30" />
                <p className="text-xl font-light text-primary/80 tracking-[0.3em] uppercase">
                    Deploying Triple Agentic Team
                </p>
                <div className="h-[1px] w-12 bg-primary/30" />
             </div>
          </motion.div>
        </motion.div>

        {/* Phase 2: The Inner Portal (Revealed Content) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ 
            opacity: isRevealed ? 1 : 0, 
            scale: isRevealed ? 1 : 0.8,
            y: isRevealed ? 0 : 50
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-20 w-full max-w-full px-0 flex flex-col lg:flex-row items-center justify-center h-full"
        >
          {/* Overlay Content (Left) */}
          <div className="absolute left-8 lg:left-20 max-w-[450px] flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-8 z-30 pointer-events-none">
            <div className="inline-flex py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold tracking-widest uppercase backdrop-blur-md shadow-[0_0_25px_rgba(var(--primary),0.3)]">
               <Network className="w-4 h-4 mr-2 inline animate-spin-slow" /> Agentic AI Collaboration
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-7xl/none font-extrabold tracking-tight drop-shadow-lg text-white">
               Autonomous <br/><span className="text-primary-gradient">Robotic Engineering</span>
            </h2>
            
            <p className="text-lg lg:text-xl text-white/90 font-light leading-relaxed drop-shadow-md bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-sm pointer-events-auto">
              Three specialized AI agents—Architect, Developer, and Supervisor—collaborating inside a holographic workspace. Watch them build, architect, and supervise your project in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pointer-events-auto">
              <Button size="lg" asChild className="h-14 px-8 text-lg bg-primary-gradient shadow-[0_0_30px_rgba(var(--primary),0.4)] hover:shadow-[0_0_50px_rgba(var(--primary),0.6)] hover:-translate-y-1 transition-all">
                <Link href="/projects">View Projects</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 px-8 text-lg hover:bg-primary/10 hover:text-primary transition-all border-white/20 hover:border-white/60 backdrop-blur-md bg-white/5 text-white">
                <Link href="/projects#contact">Get in Touch</Link>
              </Button>
            </div>
          </div>

          {/* Full-Screen 3D Agentic Lab Background */}
          <div className="absolute inset-0 z-10">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center text-primary animate-pulse bg-black font-mono tracking-widest uppercase">
                Initializing Agentic Neural Net...
              </div>
            }>
               <AgenticLab />
            </Suspense>
          </div>

          {/* AI Assistant Chat Panel */}
          <div className="absolute bottom-8 right-8 z-30 transform-gpu hover:scale-[1.02] transition-transform duration-500 shadow-2xl pointer-events-none">
             <div className="relative pointer-events-auto">
               <div className="absolute -inset-6 bg-primary/30 blur-[60px] rounded-full z-[-1] animate-pulse pointer-events-none" />
               <AIAssistant />
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
