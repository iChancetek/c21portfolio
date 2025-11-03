import { skillCategories } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Code } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";

export default function Skills() {
    const { t } = useLocale();

    return (
        <section id="skills" className="py-16 md:py-24 lg:py-32 relative bg-background overflow-hidden">
             <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary to-transparent"></div>
            <div className="container relative z-10">
                <div className="flex flex-col items-center text-center space-y-4 mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary-gradient">{t('skillsTitle')}</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        {t('skillsDescription')}
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {skillCategories.map((category) => (
                        <Card key={category.title} className="group relative flex flex-col h-full overflow-hidden rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                            <CardHeader>
                                <CardTitle className="text-xl text-primary transition-colors duration-300 group-hover:text-accent">{category.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {category.skills.map((skill, index) => {
                                        const IconComponent = skill.icon || Code; // Fallback to Code icon
                                        return (
                                            <li key={`${category.title}-${skill.name}-${index}`} className="flex items-center gap-3 text-slate-400">
                                                <IconComponent className="w-5 h-5 text-primary/80 transition-colors duration-300 group-hover:text-accent" />
                                                <span>{skill.name}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
