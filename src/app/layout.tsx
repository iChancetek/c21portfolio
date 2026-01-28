import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Chancellor Minus | Entrepreneur • AI & Data Engineer • DevOps & MLOps Specialist • Full-Stack Developer',
  description: 'A full stack AI-powered portfolio showcasing the projects and skills of Chancellor Minus.',
  manifest: '/manifest.json',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
        <meta name="application-name" content="Chancellor" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Chancellor" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#01091f" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased flex flex-col')} suppressHydrationWarning>
        <Providers>
            <Header />
            <main id="main-content" className="flex-1 container">{children}</main>
            <Footer />
            <Toaster />
        </Providers>
      </body>
    </html>
  );
}
