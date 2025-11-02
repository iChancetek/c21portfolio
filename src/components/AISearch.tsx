
'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { handleSemanticSearch } from '@/app/actions';
import type { Venture } from '@/lib/types';

interface AISearchProps {
  onSearch?: (results: Venture[]) => void;
}

export default function AISearch({ onSearch }: AISearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = (formData: FormData) => {
    const query = formData.get('query') as string;
    setSearchQuery(query);
    const params = new URLSearchParams(window.location.search);

    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    
    // If we're on the landing page, navigate to home with the query
    if (!onSearch) {
        router.push(`/home?${params.toString()}`);
        return;
    }

    startTransition(async () => {
      setIsSearching(true);
      window.history.replaceState(null, '', `?${params.toString()}`);
      const searchResults = await handleSemanticSearch(query);
      if(onSearch) {
        onSearch(searchResults);
      }
      setIsSearching(false);
    });
  };

  return (
    <form action={performSearch} className="w-full flex gap-2 items-center">
      <Input
        type="text"
        name="query"
        placeholder="e.g., 'Healthcare automation' or 'list all'"
        className="flex-grow bg-black/20 backdrop-blur-sm border-white/10 h-12 text-base"
        onChange={(e) => setSearchQuery(e.target.value)}
        value={searchQuery}
      />
      <Button type="submit" size="lg" disabled={isPending || isSearching}>
        {isPending || isSearching ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-5 w-5" />
        )}
        AI Search
      </Button>
    </form>
  );
}
