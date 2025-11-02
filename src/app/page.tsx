
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Code, Cpu } from 'lucide-react';
import AISearch from '@/components/AISearch';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="space-y-4"
              >
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  <span className="text-primary-gradient">
                    The Future of Development, Today.
                  </span>
                </h1>
                <p className="max-w-[800px] text-muted-foreground md:text-xl">
                  I build intelligent, AI-powered applications that redefine what's possible. From concept to code, let's create something extraordinary. Use the AI-powered search below to discover my work.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                className="w-full max-w-2xl"
              >
                <AISearch />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
