'use client';

import Link from 'next/link';
import { Code } from 'lucide-react';
import { socialLinks } from '@/lib/data';
import { Button } from './ui/button';
import { useLocale } from '@/hooks/useLocale';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLocale();

  return (
    <footer className="border-t border-border/40">
      <div className="container flex flex-col-reverse items-center justify-between gap-4 py-8 sm:flex-row">
        <p className="text-center text-sm text-muted-foreground">
          {t('footerText', { year: currentYear })}
        </p>
        <div className="flex items-center gap-2">
          {socialLinks.map((link) => (
            <Button key={link.name} variant="ghost" size="icon" asChild>
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                <link.icon className="h-5 w-5" />
                <span className="sr-only">{link.name}</span>
              </a>
            </Button>
          ))}
        </div>
      </div>
    </footer>
  );
}
