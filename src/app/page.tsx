'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setAnswer(null);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      console.error(err);
      setAnswer('Sorry, something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full"
      >
        {!answer && !loading && (
            <div className='text-center mb-8'>
                <h1 className="text-3xl font-semibold mb-6 text-primary-gradient">iSkylar Search</h1>
            </div>
        )}

        <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto flex gap-2 items-center mb-6">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask iSkylar anything..."
            className="flex-grow bg-black/20 backdrop-blur-sm border-white/10 h-12 text-base"
            disabled={loading}
          />
          <Button type="submit" size="lg" disabled={loading} className="bg-primary-gradient h-12">
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-5 w-5" />
            )}
            {loading ? 'Thinking...' : 'Search'}
          </Button>
        </form>
      </motion.div>

      <section className="mt-8 w-full max-w-3xl text-foreground">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Generating answer...</p>
            </div>
          </div>
        )}
        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-card/50 border border-border/50 rounded-xl shadow p-6 text-lg leading-relaxed"
          >
            {answer}
          </motion.div>
        )}
      </section>
    </main>
  );
}
