
'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2, Wand2 } from 'lucide-react';

interface AISearchProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  isSearching: boolean;
}

export default function AISearch({ onSearch, initialQuery = '', isSearching }: AISearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const performSearch = (formData: FormData) => {
    const query = formData.get('query') as string;
    onSearch(query);
  };

  return (
    <form action={performSearch} className="w-full flex gap-2 items-center">
      <Input
        type="text"
        name="query"
        placeholder="e.g., 'Healthcare automation' or 'list all'"
        className="flex-grow bg-black/20 backdrop-blur-sm border-white/10 h-12 text-base"
        onChange={(e) => setSearchQuery(e.target.value)}
        defaultValue={initialQuery}
      />
      <Button type="submit" size="lg" disabled={isSearching}>
        {isSearching ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-5 w-5" />
        )}
        AI Search
      </Button>
    </form>
  );
}
