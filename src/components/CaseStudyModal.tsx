'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { generateProjectDeepDive } from '@/app/actions';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { useLocale } from '@/hooks/useLocale';

interface CaseStudyModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectTitle: string;
}

export default function CaseStudyModal({ isOpen, onOpenChange, projectId, projectTitle }: CaseStudyModalProps) {
  const [deepDive, setDeepDive] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLocale();

  useEffect(() => {
    if (isOpen && !deepDive) {
      setIsLoading(true);
      setError('');
      generateProjectDeepDive(projectId)
        .then((content) => {
          if (content.startsWith("I'm sorry")) {
            setError(content);
          } else {
            setDeepDive(content);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, projectId, deepDive]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('caseStudyTitle', { projectTitle })}</DialogTitle>
          <DialogDescription>
            {t('caseStudyDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0">
            <ScrollArea className="h-full pr-6">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p>{t('generatingDeepDive')}</p>
                </div>
                </div>
            ) : error ? (
              <div className="text-destructive p-4">{error}</div>
            ) : (
                <div 
                    className="prose prose-invert prose-sm sm:prose-base max-w-none" 
                    dangerouslySetInnerHTML={{ __html: deepDive.replace(/\n/g, '<br />') }} 
                />
            )}
            </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
