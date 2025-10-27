'use client';

import { useState, useTransition, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2, Search, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import type { Venture } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';


export default function ProjectShowcase() {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState('');
  
  const firestore = useFirestore();

  const venturesCollectionRef = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'ventures');
  }, [firestore]);

  const { data: initialProjects, isLoading: isLoadingProjects } = useCollection<Venture>(venturesCollectionRef);
  
  const [displayedProjects, setDisplayedProjects] = useState<Venture[] | null>(null);

  useEffect(() => {
    setDisplayedProjects(initialProjects);
  }, [initialProjects]);


  const onSearch = (formData: FormData) => {
    const query = formData.get('query') as string;
    setSearchQuery(query);
    
    if(!initialProjects) return;
    
    if (!query) {
        setDisplayedProjects(initialProjects);
        return;
    }

    startTransition(async () => {
      // NOTE: Semantic search is expecting project structure, not venture.
      // This will need to be adapted if semantic search is to work on ventures.
      // For now, we'll do a simple client-side filter.
      const lowerCaseQuery = query.toLowerCase();
      const results = initialProjects.filter(p => 
            p.name.toLowerCase().includes(lowerCaseQuery) ||
            p.description.toLowerCase().includes(lowerCaseQuery)
        );
      setDisplayedProjects(results);
    });
  };

  useEffect(() => {
    if (searchQuery === '' && initialProjects) {
        setDisplayedProjects(initialProjects);
    }
  }, [searchQuery, initialProjects])

  return (
    <section id="projects" className="py-16 md:py-24 lg:py-32 bg-secondary">
      <div className="container">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">My Work</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Here are some of the projects I'm proud of. Use the search to ask about projects in natural language.
          </p>
        </div>
        
        <form action={onSearch} className="max-w-xl mx-auto mb-12 flex gap-2">
          <Input 
            type="text" 
            name="query"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g., 'Projects using AI' or 'real-time applications'" 
            className="flex-grow"
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Search
          </Button>
        </form>

        {isLoadingProjects && (
            <div className="flex justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )}

        {!isLoadingProjects && displayedProjects && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedProjects.map((venture) => (
                  <Card key={venture.id} className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
                      <CardHeader>
                          <CardTitle className="text-primary-gradient">{venture.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                          <p className="text-muted-foreground">{venture.description}</p>
                      </CardContent>
                      <CardFooter>
                          <Button asChild className="w-full bg-primary-gradient">
                              <a href={venture.href} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Visit Site
                              </a>
                          </Button>
                      </CardFooter>
                  </Card>
              ))}
            </div>
        )}


        {!isLoadingProjects && displayedProjects?.length === 0 && (
             <div className="text-center col-span-full mt-8 text-muted-foreground">
                <p>No projects found for "{searchQuery}". Try a different search.</p>
            </div>
        )}
      </div>
    </section>
  );
}
