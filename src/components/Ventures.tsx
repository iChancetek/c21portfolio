import { ventures } from "@/lib/data";
import { Link2 } from "lucide-react";
import Link from "next/link";

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
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {ventures.map((venture) => (
                            <Link href={venture.href} key={venture.name} target="_blank" rel="noopener noreferrer" 
                                className="flex items-center justify-center p-4 rounded-lg bg-card text-card-foreground transition-all duration-300 hover:bg-card/80 hover:shadow-md hover:shadow-primary/10">
                                <span className="text-center font-medium">{venture.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
