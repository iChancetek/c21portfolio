
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Code, Cpu } from 'lucide-react';

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
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-4">
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
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    I build intelligent, AI-powered applications that redefine what's possible. From concept to code, let's create something extraordinary.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                >
                  <Button asChild size="lg" className="bg-primary-gradient">
                    <Link href="/home">
                      Explore My Work
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
              <motion.div 
                className="grid grid-cols-2 gap-4"
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={cardVariants} custom={0}>
                  <FeatureCard
                    icon={<Code className="w-8 h-8 text-accent" />}
                    title="Full-Stack Engineering"
                    description="Modern web applications using the latest technologies."
                  />
                </motion.div>
                <motion.div variants={cardVariants} custom={1}>
                  <FeatureCard
                    icon={<Bot className="w-8 h-8 text-accent" />}
                    title="AI-Powered Solutions"
                    description="Intelligent systems that learn and adapt."
                  />
                </motion.div>
                <motion.div variants={cardVariants} custom={2}>
                  <FeatureCard
                    icon={<Cpu className="w-8 h-8 text-accent" />}
                    title="GenAI Integration"
                    description="Harnessing the power of generative models."
                  />
                </motion.div>
                 <motion.div variants={cardVariants} custom={3}>
                  <FeatureCard
                    icon={<Code className="w-8 h-8 text-accent" />}
                    title="Custom Automations"
                    description="Streamlining workflows with intelligent code."
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group relative flex flex-col h-full overflow-hidden rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-slate-50">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}
