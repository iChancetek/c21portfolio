
'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Code, Cloud, Mail, MapPin, Phone, Github, Link as LinkIcon, GraduationCap, Star, Building, Printer, BookOpen } from 'lucide-react';
import Link from 'next/link';
import FloatingAIAssistant from '@/components/FloatingAIAssistant';
import { resumeData } from '@/lib/data';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';


const Section = ({ title, icon: Icon, children, delay }: { title: string; icon: React.ElementType; children: React.ReactNode; delay: number; }) => (
  <motion.section
    className="mb-12"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, delay }}
  >
    <h2 className="text-2xl font-bold tracking-tight text-primary-gradient mb-6 flex items-center gap-3">
      <Icon className="w-6 h-6" />
      {title}
    </h2>
    <div className="space-y-6">{children}</div>
  </motion.section>
);


export default function ResumePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="py-12 md:py-24">
        <div id="resume-container" className="max-w-4xl mx-auto bg-secondary/30 rounded-2xl shadow-2xl shadow-primary/10 border border-border/20 backdrop-blur-sm overflow-hidden relative">
          
          <Button onClick={handlePrint} variant="outline" className="absolute top-6 right-6 print:hidden z-10">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>

          <header className="p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 -z-10 bg-primary-gradient/10 opacity-50 blur-2xl"></div>
              <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
              >
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/80">CHANCELLOR MINUS</h1>
                  <div className="mt-4 flex justify-center items-center flex-wrap gap-x-6 gap-y-2 text-muted-foreground">
                      <a href={`mailto:${resumeData.contact.email}`} className="flex items-center gap-2 hover:text-primary transition-colors"><Mail className="w-4 h-4" /> {resumeData.contact.email}</a>
                      <a href={`tel:${resumeData.contact.phone.replace(/-/g, '')}`} className="flex items-center gap-2 hover:text-primary transition-colors"><Phone className="w-4 h-4" /> {resumeData.contact.phone}</a>
                      <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {resumeData.contact.location}</span>
                  </div>
                  <div className="mt-4 flex justify-center items-center gap-4">
                      <Link href={resumeData.contact.github} target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                          <Github className="w-4 h-4" /> GitHub
                      </Link>
                      <Link href={resumeData.contact.portfolio} target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                          <LinkIcon className="w-4 h-4" /> Portfolio
                      </Link>
                  </div>
              </motion.div>
          </header>


          <main className="p-8 md:p-12">
            
            <Section title="Professional Summary" icon={Briefcase} delay={0.1}>
              <p className="text-foreground/80 leading-relaxed bg-background/50 p-6 rounded-lg border border-border/20 italic">
                  {resumeData.summary}
              </p>
            </Section>

            <Section title="Core Competencies" icon={Star} delay={0.2}>
               <div className="flex flex-wrap gap-3">
                  {resumeData.coreCompetencies.map(c => (
                      <motion.div key={c} whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
                          <Badge variant="secondary" className="text-base py-1 px-4 cursor-default transition-all duration-300 hover:bg-primary/20 hover:border-primary/50 border border-transparent">{c}</Badge>
                      </motion.div>
                  ))}
              </div>
            </Section>

            <Section title="Technical Expertise" icon={Code} delay={0.3}>
              <div className="grid md:grid-cols-2 gap-6">
                  {resumeData.technicalExpertise.map(cat => {
                      const maxLength = 150;
                      const isLongContent = cat.skills.length > maxLength;
                      const truncatedSkills = isLongContent ? cat.skills.substring(0, maxLength) + '...' : cat.skills;

                      return (
                      <motion.div key={cat.title} className="h-full" whileHover={{ y: -5, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                          <Card className="bg-background/50 border-border/20 transition-all duration-300 hover:shadow-primary/10 hover:border-primary/30 flex flex-col h-full">
                              <CardHeader>
                                  <CardTitle className="text-lg text-primary">{cat.title}</CardTitle>
                              </CardHeader>
                              <CardContent className="flex-grow flex flex-col justify-between">
                                  <p className="text-sm text-muted-foreground mb-4">{isLongContent ? truncatedSkills : cat.skills}</p>
                                  {isLongContent && (
                                      <Dialog>
                                          <DialogTrigger asChild>
                                              <Button variant="link" className="p-0 h-auto justify-start text-primary self-start mt-auto">
                                                  <BookOpen className="mr-2 h-4 w-4"/>
                                                  Read more...
                                              </Button>
                                          </DialogTrigger>
                                          <DialogContent className="sm:max-w-xl">
                                              <DialogHeader>
                                                  <DialogTitle className="text-2xl">{cat.title} Expertise</DialogTitle>
                                                  <DialogDescription>
                                                      Detailed overview of my capabilities within the {cat.title} ecosystem.
                                                  </DialogDescription>
                                              </DialogHeader>
                                              <ScrollArea className="max-h-[60vh] pr-4">
                                                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{cat.skills}</p>
                                              </ScrollArea>
                                          </DialogContent>
                                      </Dialog>
                                  )}
                              </CardContent>
                          </Card>
                      </motion.div>
                  )})}
              </div>
            </Section>

            <Section title="Professional Experience" icon={Briefcase} delay={0.4}>
              <div className="space-y-8">
                {resumeData.experience.map((job, index) => (
                  <div key={job.company} className="relative">
                     <div className="bg-background/20 p-4 sm:p-6 rounded-lg border border-border/20 hover:border-primary/30 transition-all">
                       <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                            <h3 className="text-lg sm:text-xl font-semibold text-foreground">{job.title}</h3>
                            <div className="text-xs sm:text-sm text-muted-foreground font-mono mt-1 sm:mt-0">{job.date}</div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center text-muted-foreground mb-3">
                           <p className="text-primary font-semibold">{job.company}</p>
                           <span className="text-sm mt-1 sm:mt-0">{job.location}</span>
                        </div>
                        <p className="text-foreground/80 mb-4 text-sm sm:text-base">{job.description}</p>
                         {job.highlights.length > 0 && (
                            <ul className="space-y-2">
                                {job.highlights.map((h, i) => (
                                    <li key={i} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                                        <span className="text-primary font-bold mt-1 flex-shrink-0">▹</span>
                                        <span className="flex-1">{h}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                     </div>
                  </div>
                ))}
              </div>
            </Section>
            
            <Section title="Education & Courses" icon={GraduationCap} delay={0.5}>
              <div className="space-y-3">
                {resumeData.education.map(edu => (
                  <motion.div key={edu.course} whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 400, damping: 12 }}>
                       <div className="p-4 bg-background/50 rounded-lg border border-border/20">
                          <p className="font-semibold text-foreground">{edu.course}</p>
                          <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      </div>
                   </motion.div>
                ))}
              </div>
            </Section>

             <Section title="Portfolio" icon={LinkIcon} delay={0.6}>
                  <div className="bg-background/50 p-6 rounded-lg border border-border/20 text-center">
                       <p className="text-foreground/80">
                          Explore full projects, skills, AI agents, and interactive demos at:
                          <Link href="https://chancellorminus.com" target="_blank" className="font-semibold text-primary hover:underline ml-2">
                             Chancellor
                          </Link>
                      </p>
                      <h3 className="text-xl font-bold text-primary-gradient mt-4">
                        <Link href="https://iChanceTEK.com" target="_blank" className="hover:underline">
                            iChanceTEK
                        </Link>
                      </h3>
                      <p className="text-muted-foreground">
                        Your AI Solutions Partner
                      </p>
                  </div>
              </Section>

          </main>
        </div>
      </div>
      <FloatingAIAssistant />
    </>
  );
}
