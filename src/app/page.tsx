'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wand2 } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/home?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/home');
    }
  };

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
                  I build intelligent, AI-powered applications that redefine what's possible. From concept to code, let's create something extraordinary.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                className="w-full max-w-2xl"
              >
                <form 
                  onSubmit={handleSearch}
                  className="w-full flex gap-2 items-center"
                >
                  <Input
                    type="text"
                    name="query"
                    placeholder="e.g., 'Healthcare automation' or 'list all'"
                    className="flex-grow bg-black/20 backdrop-blur-sm border-white/10 h-12 text-base"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <Button type="submit" size="lg">
                    <Wand2 className="mr-2 h-5 w-5" />
                    AI Search
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
