
'use client';

import { useState, useEffect, useTransition } from 'react';
import WhatIDo from '@/components/WhatIDo';
import Contact from '@/components/Contact';
import ProjectShowcase from '@/components/ProjectShowcase';
import Skills from '@/components/Skills';
import Transcriber from '@/components/Transcriber';
import FloatingAIAssistant from '@/components/FloatingAIAssistant';
import type { Venture } from '@/lib/types';
import { ventures } from '@/lib/data';
import { handleSemanticSearch } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2, Sparkles } from 'lucide-react';
import { getMenuSuggestion } from '@/ai/flows/menuSuggestionFlow';
import { motion } from 'framer-motion';

const allVentures: Venture[] = ventures.map((v, i) => ({...v, id: `venture-${i}`}));

const SearchSuggestion = ({
  text,
  onSelect,
}: {
  text: string;
  onSelect: (text: string) => void;
}) => (
  <motion.button
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.05 }}
    onClick={() => onSelect(text)}
    className="bg-primary/10 text-primary-foreground/80 hover:bg-primary/20 hover:text-primary-foreground backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 text-sm transition-colors"
  >
    {text}
  </motion.button>
);

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState<Venture[]>(allVentures);
  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsGeneratingSuggestions(true);
      try {
        const prompt = "Generate exactly three concise, creative, and distinct search query examples for a portfolio of AI software projects. The queries should hint at different capabilities, like 'AI-driven healthcare automation', 'generative art with code', or 'intelligent marketing analytics'. Return only the three queries, separated by a pipe character (|). Do not include any other text or numbering.";
        const result = await getMenuSuggestion(prompt);
        const suggestionArray = result.split('|').map(s => s.trim()).filter(Boolean);
        setSuggestions(suggestionArray.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch AI suggestions:", error);
        setSuggestions(['Healthcare automation', 'AI-driven marketing', 'Intelligent chatbots']);
      } finally {
        setIsGeneratingSuggestions(false);
      }
    };
    
    fetchSuggestions();
  }, []);

  const onSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
        setProjects(allVentures);
        setHasSearched(false);
        return;
    }
    startTransition(async () => {
        const searchResults = await handleSemanticSearch(searchQuery);
        setProjects(searchResults);
        setHasSearched(true);
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSearch(suggestion);
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="flex flex-col">
       <div className="flex flex-col min-h-[calc(100vh-57px)] items-center justify-center text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="w-full max-w-3xl"
            >
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

                <div className="flex flex-wrap items-center justify-center gap-3">
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isGeneratingSuggestions ? 0 : 1 }}
                    className="text-sm text-muted-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    AI Suggests:
                </motion.p>
                {isGeneratingSuggestions ? (
                    <div className="flex gap-2">
                        <div className="h-8 w-32 bg-primary/10 animate-pulse rounded-full"></div>
                        <div className="h-8 w-36 bg-primary/10 animate-pulse rounded-full"></div>
                        <div className="h-8 w-28 bg-primary/10 animate-pulse rounded-full"></div>
                    </div>
                ) : (
                    suggestions.map((suggestion, index) => (
                    <SearchSuggestion key={index} text={suggestion} onSelect={handleSuggestionClick} />
                    ))
                )}
                </div>
            </motion.div>
        </div>
      
      <WhatIDo />
      <ProjectShowcase projects={projects} searchQuery={hasSearched ? query : undefined} />
      <Skills />
      <Transcriber />
      <Contact />
      <FloatingAIAssistant />
    </div>
  );
}
