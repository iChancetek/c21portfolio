import { resumeData } from '@/lib/data';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { 
  FileText, 
  ExternalLink, 
  BookOpen, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  Cloud, 
  Database, 
  Code2, 
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'ai', label: 'AI & Agents', icon: Cpu },
  { id: 'cloud', label: 'Cloud & Infra', icon: Cloud },
  { id: 'blockchain', label: 'Blockchain', icon: Database },
  { id: 'dev', label: 'Development', icon: Code2 },
  { id: 'other', label: 'Foundations', icon: ShieldCheck },
];

export default function CourseGallery() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const certs = useMemo(() => {
    return resumeData.education.filter(edu => edu.certificateUrl);
  }, []);

  const filteredCerts = useMemo(() => {
    return certs.filter(cert => {
      const matchesSearch = cert.course.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           cert.institution.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;
      if (activeTab === 'all') return true;
      
      const course = cert.course.toLowerCase();

      if (activeTab === 'ai') {
        return course.includes('ai') || course.includes('llm') || course.includes('agent') || course.includes('machine learning');
      }
      if (activeTab === 'cloud') {
        return course.includes('azure') || course.includes('aws') || course.includes('gcp') || course.includes('cloud') || course.includes('devops');
      }
      if (activeTab === 'blockchain') {
        return course.includes('blockchain') || course.includes('ethereum') || course.includes('solidity') || course.includes('bitcoin') || course.includes('cryptocurrenc');
      }
      if (activeTab === 'dev') {
        return course.includes('node') || course.includes('django') || course.includes('python') || course.includes('c#') || course.includes('postgres') || course.includes('api');
      }
      if (activeTab === 'other') {
        return course.includes('cissp') || course.includes('statistic') || course.includes('foundation') || course.includes('data science');
      }
      return true;
    });
  }, [certs, activeTab, searchQuery]);

  if (certs.length === 0) return null;

  return (
    <section className="mt-20 py-8 border-t border-border/40" data-no-read="true">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-2">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-primary flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8" />
            Course Completion Gallery
          </h2>
          <p className="text-muted-foreground max-w-xl text-sm font-medium">
            A comprehensive record of training and course completion certificates across multiple technical domains.
          </p>
        </div>
        
        <div className="relative w-full md:w-72 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search certificates..." 
            className="pl-10 h-10 bg-secondary/5 border-border/40 focus:border-primary/40 focus:ring-primary/10 transition-all rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/10 border border-border/20 p-1 mb-8 flex flex-wrap h-auto gap-1 rounded-xl">
          {CATEGORIES.map(cat => (
            <TabsTrigger 
              key={cat.id} 
              value={cat.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg"
            >
              <cat.icon className="w-3.5 h-3.5 mr-2" />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence mode='popLayout'>
            {filteredCerts.map((cert, index) => {
              const isPdf = cert.certificateUrl?.toLowerCase().endsWith('.pdf');
              
              return (
              <motion.div
                key={cert.course}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="group cursor-pointer h-full">
                      <Card className="h-full relative bg-secondary/5 border-border/20 overflow-hidden hover:border-primary/40 transition-all duration-300 hover:bg-secondary/10 hover:shadow-xl hover:shadow-primary/5 rounded-xl">
                        <div className="p-4 flex flex-col gap-3 h-full">
                          <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border/40 bg-background/50">
                            {cert.thumbnailUrl ? (
                              <img 
                                src={cert.thumbnailUrl} 
                                alt={cert.course}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                            ) : isPdf ? (
                              <div className="w-full h-full flex items-center justify-center bg-secondary/20 relative">
                                 <div className="w-full h-full relative overflow-hidden bg-white">
                                   <iframe 
                                      src={`${cert.certificateUrl}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`} 
                                      className="absolute inset-0 w-[300%] h-[300%] border-none pointer-events-none origin-top-left scale-[0.333] opacity-70 group-hover:opacity-100 transition-all duration-700"
                                      title={cert.course}
                                   />
                                 </div>
                                 <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent flex items-end justify-center pb-2">
                                    <span className="text-[9px] font-black text-primary flex items-center gap-1 uppercase tracking-tighter">
                                        <FileText className="w-3 h-3" /> PDF PREVIEW
                                    </span>
                                 </div>
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-secondary/20">
                                <BookOpen className="h-8 w-8 text-muted-foreground/30" />
                              </div>
                            )}
                            <div className="absolute inset-0 ring-1 ring-inset ring-white/5" />
                          </div>

                          <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                            <h3 className="text-[11px] font-black leading-tight uppercase tracking-tight line-clamp-2 group-hover:text-primary transition-colors min-h-[2.2rem]">
                              {cert.course}
                            </h3>
                            <div className="flex items-center justify-between pt-2 border-t border-border/20">
                              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate max-w-[80%]">{cert.institution}</span>
                              <ExternalLink className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" />
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden bg-background/95 backdrop-blur-3xl border-primary/20 rounded-3xl">
                    <DialogHeader className="p-6 bg-secondary/10 border-b border-border/50">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <DialogTitle className="text-xl font-black uppercase tracking-tight text-primary leading-tight">{cert.course}</DialogTitle>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{cert.institution}</p>
                        </div>
                        <div className="flex gap-2 mr-10">
                            <Button asChild variant="outline" size="sm" className="h-9 px-4 rounded-full text-[10px] font-black uppercase tracking-widest border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all">
                                <Link href={cert.certificateUrl!} target="_blank">
                                    <ExternalLink className="w-3.5 h-3.5 mr-2" /> NEW TAB
                                </Link>
                            </Button>
                        </div>
                      </div>
                    </DialogHeader>
                    <div className="flex-1 w-full h-full bg-black/40 relative">
                      {isPdf ? (
                        <iframe 
                          src={`${cert.certificateUrl}#view=FitH`} 
                          className="w-full h-full border-none"
                          title={cert.course}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-8 overflow-auto">
                          <img 
                            src={cert.certificateUrl} 
                            alt={cert.course}
                            className="max-w-full max-h-full object-contain shadow-[0_0_80px_rgba(var(--primary-rgb),0.3)] rounded-sm"
                          />
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            )})}
          </AnimatePresence>
        </motion.div>
        
        {filteredCerts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center space-y-4"
          >
            <div className="inline-flex p-6 rounded-full bg-secondary/10 border border-border/20">
              <Search className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">No Results Found</p>
              <p className="text-muted-foreground/60 text-[10px] uppercase tracking-tighter">Try adjusting your filters or search query</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {setSearchQuery(''); setActiveTab('all');}} 
              className="text-primary uppercase font-black text-[10px] tracking-widest h-9 px-6 rounded-full border-primary/20 hover:bg-primary/5 transition-all"
            >
              Reset All Filters
            </Button>
          </motion.div>
        )}
      </Tabs>
    </section>
  );
}
