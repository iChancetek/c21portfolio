
'use client';

import { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2, RefreshCw } from 'lucide-react';
import { getMenuSuggestion } from '@/ai/flows/menuSuggestionFlow';
import { handleSemanticSearch } from '@/app/actions';
import ProjectShowcase from '@/components/ProjectShowcase';
import { ventures } from '@/lib/data';
import type { Venture } from '@/lib/types';

const allVentures: Venture[] = ventures.map((v, i) => ({...v, id: `venture-${i}`}));

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Venture[]>(allVentures);
  const [isSuggesting, startSuggestionTransition] = useTransition();
  const [isSearching, startSearchTransition] = useTransition();
  const [aiSuggestion, setAiSuggestion] = useState('e.g., "AI in healthcare"');
  
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newQuery = query.trim();
    if (!newQuery) {
      setProjects(allVentures);
      setSearchQuery('');
      return;
    }
    
    setSearchQuery(newQuery);
    startSearchTransition(async () => {
      const results = await handleSemanticSearch(newQuery);
      setProjects(results);
    });
  };

  const handleSuggestion = () => {
    startSuggestionTransition(async () => {
      const suggestion = await getMenuSuggestion(
        "Suggest a creative project search query for a portfolio, like 'AI in healthcare' or 'decentralized finance apps'."
      );
      setAiSuggestion(suggestion);
    });
  };

  const handleReset = () => {
    setQuery('');
    setProjects(allVentures);
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6">
          <span className="text-primary-gradient">The Future of Development — Today</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-10">
          I build intelligent, enterprise-grade AI solutions that drive business value. Explore my
          work or ask my AI assistant about my experience.
        </p>

        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 mb-4">
          <Input
            type="text"
            name="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={aiSuggestion}
            className="bg-black/20 backdrop-blur-sm border-white/10 h-12 text-base"
          />
          <Button type="submit" size="lg" className="bg-primary-gradient h-12" disabled={isSearching}>
            {isSearching ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
            AI Search
          </Button>
          {query && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleReset}
              className="h-12 w-12"
              title="Reset Search"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          )}
        </form>

        <Button variant="link" onClick={handleSuggestion} disabled={isSuggesting}>
          {isSuggesting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Get another suggestion
        </Button>
      </motion.div>
      <div className="w-full mt-16">
        <ProjectShowcase projects={projects} searchQuery={searchQuery} />
      </div>
    </div>
  );
}
