import { skillCategories } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function Skills() {
    return (
        <section id="skills" className="py-16 md:py-24 lg:py-32">
            <div className="container">
                <div className="flex flex-col items-center text-center space-y-4 mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Skills & Expertise</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        A look at the technologies I work with to bring ideas to life, from frontend to deployment.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {skillCategories.map((category) => (
                        <Card key={category.title} className="transition-all duration-300 hover:shadow-md hover:shadow-primary/20">
                            <CardHeader>
                                <CardTitle className="text-xl text-primary">{category.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {category.skills.map((skill) => (
                                        <li key={skill.name} className="flex items-center gap-3">
                                            <skill.icon className="w-5 h-5 text-muted-foreground" />
                                            <span>{skill.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
