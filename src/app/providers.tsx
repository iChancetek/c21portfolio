'use client';

import { ThemeProvider } from '@/components/ThemeProvider';
import { FirebaseClientProvider } from '@/firebase';
import { UserPresenceProvider } from '@/hooks/UserPresenceProvider';
import { LocaleProvider } from '@/hooks/useLocale';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      themes={['light', 'dark']}
    >
      <FirebaseClientProvider>
        <UserPresenceProvider>
          <LocaleProvider>{children}</LocaleProvider>
        </UserPresenceProvider>
      </FirebaseClientProvider>
    </ThemeProvider>
  );
}
