
'use client';

import Contact from '@/components/Contact';
import Skills from '@/components/Skills';
import FloatingAIAssistant from '@/components/FloatingAIAssistant';
import ProductShowcase from '@/components/ProductShowcase';
import { allVentures } from '@/lib/data';
import { motion } from 'framer-motion';

export default function ProductsPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Premium Cinematic Video Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-7xl mx-auto mt-6 rounded-2xl overflow-hidden border border-primary/20 shadow-[0_0_50px_-15px_rgba(var(--primary),0.3)] bg-background/30 backdrop-blur-xl relative aspect-video md:max-h-[480px] group"
      >
        {/* Soft glowing cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none z-10" />
        <div className="absolute inset-0 bg-black/20 pointer-events-none z-10" />

        <video
          src="/ChanceTEK.mp4"
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Cinematic subtle branding title card inside the banner */}
        <div className="absolute bottom-8 left-8 right-8 z-20 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col gap-2 max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-xs font-semibold tracking-wider text-primary uppercase w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
              Live Demonstration
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              Agentic Ecosystem
            </h1>
            <p className="text-white/80 text-sm md:text-base font-light drop-shadow-[0_1px_5px_rgba(0,0,0,0.8)] leading-relaxed">
              Explore the autonomous product fleet collaborating and generating production-ready solutions in real-time.
            </p>
          </motion.div>
        </div>
      </motion.div>

      <ProductShowcase products={allVentures} />
      <Skills />
      <Contact />
      <FloatingAIAssistant />
    </div>
  );
}
