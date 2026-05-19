
'use client';

import { useState } from 'react';
import Contact from '@/components/Contact';
import Skills from '@/components/Skills';
import FloatingAIAssistant from '@/components/FloatingAIAssistant';
import ProductShowcase from '@/components/ProductShowcase';
import { allVentures } from '@/lib/data';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProductsPage() {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="flex flex-col w-full">
      {/* Premium Cinematic Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-7xl mx-auto mt-6 rounded-2xl overflow-hidden border border-primary/20 shadow-[0_0_50px_-15px_rgba(var(--primary),0.3)] bg-background/30 backdrop-blur-xl relative flex flex-col md:flex-row items-center justify-between p-6 md:p-10 lg:p-12 gap-8 md:gap-12 group animate-glow"
      >
        {/* Soft glowing cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary),0.1),transparent_70%)] pointer-events-none z-0" />

        {/* Cinematic subtle branding title card inside the banner */}
        <div className="relative z-10 flex-1 flex flex-col gap-4 text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col gap-5 max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-xs font-semibold tracking-wider text-primary uppercase w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
              Featured Platform
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] leading-none">
              Agentic Ecosystem
            </h1>
            <p className="text-white/80 text-sm md:text-base lg:text-lg font-light leading-relaxed">
              Explore the autonomous product fleet collaborating and generating production-ready solutions in real-time.
            </p>
            
            {/* CTA Platform Link */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Button asChild className="bg-primary-gradient hover:shadow-[0_0_25px_rgba(var(--primary),0.4)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl px-6 py-5 font-semibold text-white">
                <a href="https://WorkSpaceIQ.us" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  Visit WorkSpaceIQ <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Showcase Video (Widescreen 16:9 Aspect Ratio) */}
        <div className="relative z-10 w-full md:w-[580px] lg:w-[720px] shrink-0 aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40 group-hover:border-primary/30 transition-all duration-500 shadow-2xl">
          <video
            src="/WorkSpaceIQ1.mp4"
            className="w-full h-full object-cover"
            autoPlay
            muted={isMuted}
            loop
            playsInline
          />
          {/* Mute/Unmute Overlay Button to Listen */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-4 right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 hover:border-primary/50 text-white backdrop-blur-md transition-all duration-300 shadow-lg hover:scale-105 animate-fade-in"
            title={isMuted ? "Unmute to Listen" : "Mute Video"}
          >
            {isMuted ? <VolumeX className="h-5 w-5 text-red-400" /> : <Volume2 className="h-5 w-5 text-primary animate-pulse" />}
          </button>
        </div>
      </motion.div>

      <ProductShowcase products={allVentures} />
      <Skills />
      <Contact />
      <FloatingAIAssistant />
    </div>
  );
}
