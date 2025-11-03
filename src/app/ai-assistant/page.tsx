'use client';

import AIAssistant from '@/components/AIAssistant';
import { Button } from '@/components/ui/button';
import Transcriber from '@/components/Transcriber';
import Link from 'next/link';
import { useLocale } from '@/hooks/useLocale';

export default function AIAssistantPage() {
  const { t } = useLocale();

  return (
    <section className="w-full">
      <div className="grid lg:grid-cols-2 gap-12 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              <span className="text-primary-gradient">{t('aiAssistantTitle')}</span>
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              {t('aiAssistantDescription')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="bg-primary-gradient">
              <Link href="/projects#projects">{t('viewMyWork')}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/projects#contact">
                {t('getInTouch')}
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <AIAssistant />
        </div>
      </div>
      <Transcriber />
    </section>
  );
}
