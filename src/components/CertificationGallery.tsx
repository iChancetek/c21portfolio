import { resumeData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { FileText, ExternalLink, BookOpen, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
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
        {certs.map((cert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={cert.certificateUrl!} target="_blank" className="block h-full group">
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
                  
                  {cert.thumbnailUrl && (
                    <div className="relative aspect-video mb-4 overflow-hidden rounded-lg border border-border/40 group-hover:border-primary/40 transition-colors">
                      <img 
                        src={cert.thumbnailUrl} 
                        alt={cert.course}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                  )}

                  <CardTitle className="text-base font-bold leading-tight group-hover:text-primary transition-colors">
                    {cert.course}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{cert.institution}</p>
                  <div className="inline-flex items-center text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
                    View Completion Certificate
                    <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
