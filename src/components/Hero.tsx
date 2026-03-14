'use client';

import AIAssistant from './AIAssistant';
import { Button } from './ui/button';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, Suspense, useState, useEffect } from 'react';
import { Network } from 'lucide-react';
import Spline from '@splinetool/react-spline';

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isScaled, setIsScaled] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Phase 1: Wait 1s then scale the typography mask autonomously
    const scaleTimer = setTimeout(() => setIsScaled(true), 1500);
    
    // Phase 2: Reveal the inner portal
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
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none z-0" />

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
                    Initializing Agentic Interface
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
          className="relative z-20 w-full max-w-7xl px-4 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 h-full"
        >
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-8 z-30 pt-16 lg:pt-0">
            <div className="inline-flex py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold tracking-widest uppercase backdrop-blur-md shadow-[0_0_25px_rgba(var(--primary),0.3)]">
               <Network className="w-4 h-4 mr-2 inline animate-spin-slow" /> Autonomous Intelligence
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl/none font-extrabold tracking-tight drop-shadow-lg">
               From AI Concept to <br/><span className="text-primary-gradient">Production Reality</span>
            </h2>
            
            <p className="max-w-[500px] text-lg lg:text-xl text-foreground/90 font-light leading-relaxed drop-shadow-md bg-background/60 backdrop-blur-md p-4 rounded-xl border border-border/50 shadow-sm">
              Experience the power of Agentic AI. This interface evolves and responds autonomously to your presence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" asChild className="h-14 px-8 text-lg bg-primary-gradient shadow-[0_0_30px_rgba(var(--primary),0.4)] hover:shadow-[0_0_50px_rgba(var(--primary),0.6)] hover:-translate-y-1 transition-all">
                <Link href="/projects">View My Work</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 px-8 text-lg hover:bg-primary/10 hover:text-primary transition-all border-primary/30 hover:border-primary/60 backdrop-blur-md bg-secondary/50">
                <Link href="/projects#contact">Get in Touch</Link>
              </Button>
            </div>
          </div>

          {/* Spline 3D Robot + AI Assistant Widget - Widened and Autonomous */}
          <div className="flex-1 lg:flex-[1.4] w-full h-[500px] lg:h-[800px] relative z-20">
            <motion.div
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ 
                 opacity: 1, 
                 scale: 1,
                 rotateY: [0, 360] // Very slow, graceful box orbit
               }}
               transition={{ 
                 opacity: { duration: 1.5, ease: "easeOut", delay: 0.2 },
                 scale: { duration: 1.5, ease: "easeOut", delay: 0.2 },
                 rotateY: { duration: 40, repeat: Infinity, ease: "linear" } 
               }}
               className="absolute inset-0 w-full h-full z-10 cursor-grab active:cursor-grabbing pointer-events-auto overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_center,rgba(3,7,18,0.9)_0%,rgba(3,7,18,0.2)_60%,transparent_100%)] shadow-[0_0_50px_rgba(0,0,0,0.3)] border border-white/5"
            >
               {/* Vibrant Glows */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/30 blur-[100px] rounded-full z-[-1] opacity-60 pointer-events-none" />
               <div className="absolute top-1/3 left-1/3 w-[250px] h-[250px] bg-accent/30 blur-[80px] rounded-full z-[-1] opacity-40 pointer-events-none animate-pulse" />

               {/* Sparkling "Vibe" Particles */}
               {mounted && [...Array(8)].map((_, i) => (
                 <motion.div
                   key={i}
                   animate={{
                     y: [0, -30, 0],
                     opacity: [0.2, 0.6, 0.2],
                     scale: [1, 1.4, 1],
                   }}
                   transition={{
                     duration: 4 + i,
                     repeat: Infinity,
                     delay: i * 0.4,
                   }}
                   className="absolute w-2 h-2 bg-primary rounded-full blur-[2px] shadow-[0_0_15px_rgba(var(--primary),0.8)]"
                   style={{
                     top: `${15 + (i * 12) % 70}%`,
                     left: `${15 + (i * 11) % 70}%`,
                     zIndex: 5
                   }}
                 />
               ))}

                <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-primary animate-pulse font-mono tracking-widest">Loading Neural Interface...</div>}>
                    {/* Advanced Spline 3D Scene - Autonomous AI Mode */}
                   <div className="w-full h-full brightness-110 contrast-110 light-mode-spline">
                     <Spline 
                       scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
                       onLoad={(spline) => {
                         // Autonomous Agentic Rotation Logic
                         const rotate = () => {
                           const cube = spline.findObjectByName('Cube') || spline.findObjectById('0');
                           if (cube) {
                             cube.rotation.y += 0.01;
                           }
                           requestAnimationFrame(rotate);
                         };
                         rotate();
                       }}
                     />
                   </div>
                </Suspense>
            </motion.div>

            {/* AI Assistant Chat Panel */}
            <div className="absolute -bottom-10 right-0 sm:-right-4 md:right-8 lg:-bottom-0 lg:right-[-60px] z-30 transform-gpu hover:scale-[1.02] transition-transform duration-500 shadow-2xl scale-[0.85] sm:scale-90 lg:scale-100 flex justify-end items-end pointer-events-none">
               <div className="relative pointer-events-auto">
                 <div className="absolute -inset-6 bg-primary/30 blur-[60px] rounded-full z-[-1] animate-pulse pointer-events-none" />
                 <AIAssistant />
               </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
