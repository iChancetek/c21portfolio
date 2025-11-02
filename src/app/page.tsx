'use client';

import { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2, RefreshCw } from 'lucide-react';
import { getMenuSuggestion } from '@/ai/flows/menuSuggestionFlow';
import { handleSemanticSearch } from '@/app/actions';
import ProjectShowcase from '@/components/ProjectShowcase';
import type { Venture } from '@/lib/types';
import FloatingAIAssistant from '@/components/FloatingAIAssistant';
import WhatIDo from '@/components/WhatIDo';
import Skills from '@/components/Skills';
import Transcriber from '@/components/Transcriber';
import Contact from '@/components/Contact';
import { useUser } from '@/firebase';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket } from 'lucide-react';

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const [isSuggesting, startSuggestionTransition] = useTransition();
  const [isSearching, startSearchTransition] = useTransition();
  const [aiSuggestion, setAiSuggestion] = useState('e.g., "AI in healthcare"');
  const [projects, setProjects] = useState<Venture[] | null>(null);
  const [searchedQuery, setSearchedQuery] = useState<string>('');
  const { user } = useUser();

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) {
      setProjects(null);
      setSearchedQuery('');
      return;
    }

    setSearchedQuery(query);
    startSearchTransition(async () => {
      const results = await handleSemanticSearch(query);
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
    setProjects(null);
    setSearchedQuery('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center">
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
          {projects && (
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

      {isSearching && (
        <div className="mt-16 text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Searching for projects...</p>
        </div>
      )}

      {!isSearching && projects && (
        <div className="w-full mt-8">
          <ProjectShowcase projects={projects} searchQuery={searchedQuery} />
        </div>
      )}

      {!projects && (
        <>
          <div className="w-full mt-16">
            {!user && (
                 <Card className="bg-secondary border-primary/20">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Rocket className="w-8 h-8 text-primary" />
                        <CardTitle>Unlock the GenAI Dashboard!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4 text-left">
                            Create a free account or sign in to access an exclusive dashboard with AI-powered insights and the latest trends in GenAI, Data Science, MLOps, and more.
                        </p>
                        <div className="flex gap-4">
                            <Button asChild className="bg-primary-gradient">
                                <Link href="/signup">Create Account</Link>
                            </Button>
                             <Button asChild variant="outline">
                                <Link href="/login">Sign In</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
            </div>
            <WhatIDo />
            <Skills />
            <Transcriber />
            <Contact />
        </>
      )}


      <FloatingAIAssistant />
    </div>
  );
}
