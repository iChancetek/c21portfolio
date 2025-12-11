import { skillCategories } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Code, BookOpen } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

const M365_DETAILS = "Identity and Access Management (IAM), Multi-Factor Authentication (MFA), Conditional Access policies, and identity protection capabilities to safeguard user accounts and control access. Threat protection is strengthened through the Microsoft Defender family, Microsoft Entra for identity and access security, Microsoft Intune for endpoint management, and the Microsoft Purview suite for compliance and data governance. Key solutions include Microsoft Defender XDR, Microsoft Sentinel, Microsoft Purview Compliance Manager, and Microsoft Priva for privacy and risk management.";

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
                        <Card key={category.title} className="group relative flex flex-col h-full overflow-hidden rounded-xl border-border/20 bg-secondary/30 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20">
                            <CardHeader>
                                <CardTitle className="text-xl text-primary transition-colors duration-300 group-hover:text-accent">{t(category.title) || category.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col flex-grow">
                                <ul className="space-y-3 flex-grow">
                                    {category.skills.slice(0, 5).map((skill, index) => {
                                        const IconComponent = skill.icon || Code;
                                        return (
                                            <li key={`${category.title}-${skill.name}-${index}`} className="flex items-center gap-3 text-slate-400">
                                                <IconComponent className="w-5 h-5 text-primary/80 transition-colors duration-300 group-hover:text-accent" />
                                                <span>{skill.name}</span>
                                            </li>
                                        );
                                    })}
                                    {category.skills.length > 5 && (
                                        <li className="text-slate-500 text-sm">...and {category.skills.length - 5} more.</li>
                                    )}
                                </ul>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="link" className="mt-4 p-0 h-auto justify-start text-primary">
                                            <BookOpen className="mr-2 h-4 w-4"/>
                                            Read more...
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl">{t(category.title) || category.title} Expertise</DialogTitle>
                                            <DialogDescription>
                                                Detailed overview of my capabilities within the {t(category.title) || category.title} ecosystem.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <ScrollArea className="max-h-[60vh] pr-4">
                                             {category.title === "Microsoft 365" ? (
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {M365_DETAILS}
                                                </p>
                                            ) : (
                                                <ul className="space-y-3">
                                                    {category.skills.map((skill, index) => {
                                                        const IconComponent = skill.icon || Code;
                                                        return (
                                                            <li key={`modal-${skill.name}-${index}`} className="flex items-center gap-3 text-sm text-muted-foreground">
                                                                <IconComponent className="w-5 h-5 text-primary/80" />
                                                                <span>{skill.name}</span>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            )}
                                        </ScrollArea>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
