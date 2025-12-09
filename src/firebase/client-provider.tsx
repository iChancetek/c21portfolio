'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { getSdks } from '@/firebase';
import { getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from './config';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

// This function must be at the top level of the module
// to ensure it's a stable reference across re-renders.
function getFirebaseServices() {
  if (getApps().length === 0) {
     try {
      // Production: App Hosting provides config via env vars
      const app = initializeApp();
      return getSdks(app);
    } catch (e) {
      // Development: Use the local config file
      const app = initializeApp(firebaseConfig);
      return getSdks(app);
    }
  }
  // If already initialized, just get the existing instance
  return getSdks(getApps()[0]);
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // getFirebaseServices is called only once when the provider first mounts.
  const { firebaseApp, auth, firestore } = getFirebaseServices();

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