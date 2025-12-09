'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { getSdks } from '@/firebase';
import { getApps, getApp, initializeApp } from 'firebase/app';
import { firebaseConfig } from './config';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

// This function must be at the top level of the module
// to ensure it's a stable reference across re-renders.
function getFirebaseServices() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getSdks(app);
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // getFirebaseServices is called only once when the provider first mounts.
  const { firebaseApp, auth, firestore } = useMemo(getFirebaseServices, []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
