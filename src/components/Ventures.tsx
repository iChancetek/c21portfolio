import { ventures } from "@/lib/data";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { ExternalLink } from "lucide-react";

export default function Ventures() {
    return (
        <section id="ventures" className="py-16 md:py-24 lg:py-32 bg-secondary">
            <div className="container">
                <div className="flex flex-col items-center text-center space-y-4 mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">My Ventures</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        A collection of companies and products I have developed.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ventures.map((venture) => (
                        <Card key={venture.name} className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
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
            </div>
        </section>
    );
}
