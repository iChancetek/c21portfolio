
'use client';

import { useUserPresence } from './useUserPresence';

export const UserPresenceProvider = ({ children }: { children: React.ReactNode }) => {
  // This hook will manage the user's presence state automatically.
  useUserPresence();
  
  // It doesn't render any UI, it just provides the presence logic to its children.
  return <>{children}</>;
};
