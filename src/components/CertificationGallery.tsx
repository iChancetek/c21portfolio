import { resumeData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { FileText, ExternalLink, BookOpen, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useState } from 'react';
import Link from 'next/link';

export default function CertificationGallery() {
  const certs = resumeData.education.filter(edu => edu.certificateUrl);

  if (certs.length === 0) return null;

  return (
    <section className="mt-20" data-no-read="true">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-black text-foreground uppercase tracking-tight flex items-center gap-2">
          <BookOpen className="text-primary h-6 w-6" />
          Course Certificates
        </h2>
        <div className="h-px bg-border flex-1"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certs.map((cert, index) => {
          const isPdf = cert.certificateUrl?.toLowerCase().endsWith('.pdf');
          
          return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Dialog>
              <DialogTrigger asChild>
                <div className="block h-full group cursor-pointer">
                  <Card className="h-full relative bg-secondary/10 border-border/20 overflow-hidden hover:border-primary/40 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <BookOpen className="h-16 w-16 text-primary rotate-12" />
                    </div>
                    
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <FileText className="h-5 w-5" />
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      
                      <div className="relative aspect-video mb-4 overflow-hidden rounded-lg border border-border/40 group-hover:border-primary/40 transition-colors bg-background/50">
                        {cert.thumbnailUrl ? (
                          <img 
                            src={cert.thumbnailUrl} 
                            alt={cert.course}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : isPdf ? (
                          <div className="w-full h-full flex items-center justify-center bg-secondary/20 relative group-hover:scale-105 transition-transform duration-500">
                             <iframe 
                                src={`${cert.certificateUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                                className="w-full h-full border-none pointer-events-none scale-[2] origin-top"
                                title={cert.course}
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end justify-center pb-2">
                                <span className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-tighter">
                                    <FileText className="w-3 h-3" /> PDF Document
                                </span>
                             </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary/20">
                            <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </div>

                      <CardTitle className="text-base font-bold leading-tight group-hover:text-primary transition-colors">
                        {cert.course}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{cert.institution}</p>
                      <div className="inline-flex items-center text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
                        View Certificate
                        <ExternalLink className="ml-2 h-3.5 w-3.5" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-primary/20">
                <DialogHeader className="p-6 bg-secondary/10 border-b border-border/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <DialogTitle className="text-xl font-black uppercase tracking-tight text-primary">{cert.course}</DialogTitle>
                      <p className="text-sm text-muted-foreground">{cert.institution}</p>
                    </div>
                    <div className="flex gap-2 mr-6">
                        <Button asChild variant="outline" size="sm" className="h-8">
                            <Link href={cert.certificateUrl!} target="_blank">
                                <ExternalLink className="w-3.5 h-3.5 mr-2" /> Open in New Tab
                            </Link>
                        </Button>
                    </div>
                  </div>
                </DialogHeader>
                <div className="flex-1 w-full h-full bg-slate-900/50 relative">
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
                        className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                      />
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        )})}
      </div>
    </section>
  );
}
