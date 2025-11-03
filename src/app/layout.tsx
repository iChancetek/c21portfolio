import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FirebaseClientProvider } from '@/firebase';
import { ThemeProvider } from '@/components/ThemeProvider';
import { UserPresenceProvider } from '@/hooks/UserPresenceProvider';
import { LocaleProvider, useLocale } from '@/hooks/useLocale';

// This is a new component to handle metadata within the provider context
const PageMetadata: React.FC = () => {
  const { t } = useLocale();
  return null; // This component doesn't render anything, it's just for metadata access
};

export const metadata: Metadata = {
  title: 'Chancellor Minus | Entrepreneur, AI Engineer & Full-Stack Developer',
  description: 'A full stack AI-powered portfolio showcasing the projects and skills of Chancellor Minus.',
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
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased flex flex-col')} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <UserPresenceProvider>
              <LocaleProvider>
                <Header />
                <main className="flex-1 container">{children}</main>
                <Footer />
                <Toaster />
              </LocaleProvider>
            </UserPresenceProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
