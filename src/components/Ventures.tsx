'use client';

import { collection, Firestore } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { ExternalLink, Loader2 } from "lucide-react";
import type { Venture } from '@/lib/types';

export default function Ventures() {
    const firestore = useFirestore();

    const venturesCollectionRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'ventures');
    }, [firestore]);

    const { data: ventures, isLoading, error } = useCollection<Venture>(venturesCollectionRef);

    return (
        <section id="ventures" className="py-16 md:py-24 lg:py-32 bg-secondary">
            <div className="container">
                <div className="flex flex-col items-center text-center space-y-4 mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">My Ventures</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        A collection of companies and products I have developed.
                    </p>
                </div>
                {isLoading && (
                    <div className="flex justify-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                )}
                {error && <p className="text-center text-destructive">Error loading ventures: {error.message}</p>}
                {!isLoading && !error && ventures && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {ventures.map((venture) => (
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
                 {!isLoading && ventures?.length === 0 && (
                    <p className="text-center text-muted-foreground">No ventures found.</p>
                )}
            </div>
        </section>
    );
}
