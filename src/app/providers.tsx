
'use client';

import { ThemeProvider } from '@/components/ThemeProvider';
import { FirebaseClientProvider } from '@/firebase';
import { UserPresenceProvider } from '@/hooks/UserPresenceProvider';
import { LocaleProvider } from '@/hooks/useLocale';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      themes={['light', 'dark', 'system']}
    >
      <FirebaseClientProvider>
        <UserPresenceProvider>
          <LocaleProvider>{children}</LocaleProvider>
        </UserPresenceProvider>
      </FirebaseClientProvider>
    </ThemeProvider>
  );
}

    