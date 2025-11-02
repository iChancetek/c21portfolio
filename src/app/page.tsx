
'use client';

import { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import ProjectShowcase from '@/components/ProjectShowcase';
import type { Venture } from '@/lib/types';
import { handleSemanticSearch } from '@/app/actions';

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState<Venture[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const [hasSearched, setHasSearched] = useState(false);

  const onSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setHasSearched(true);
    startTransition(async () => {
      const searchResults = await handleSemanticSearch(searchQuery);
      setProjects(searchResults);
    });
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-16 md:py-24 lg:py-32">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full max-w-3xl"
        >
            {!hasSearched && (
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none mb-4">
                        <span className="text-primary-gradient">
                        The Future of Development, Today.
                        </span>
                    </h1>
                    <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl">
                        I build intelligent, AI-powered applications that redefine what's possible. From concept to code, let's create something extraordinary.
                    </p>
                </div>
            )}

            <form onSubmit={onFormSubmit} className="w-full flex gap-2 items-center mb-6">
            <Input
                type="text"
                name="query"
                placeholder="e.g., 'Healthcare automation' or 'list all'"
                className="flex-grow bg-black/20 backdrop-blur-sm border-white/10 h-12 text-base"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isPending}
            />
            <Button type="submit" size="lg" disabled={isPending} className="bg-primary-gradient">
                {isPending ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                <Wand2 className="mr-2 h-5 w-5" />
                )}
                AI Search
            </Button>
            </form>
        </motion.div>

        {hasSearched && (
            <div className="w-full mt-12">
                {isPending ? (
                     <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p>Searching...</p>
                        </div>
                    </div>
                ) : (
                    projects && <ProjectShowcase projects={projects} searchQuery={query} />
                )}
            </div>
        )}
    </div>
  );
}
