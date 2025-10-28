/**
 * @fileOverview Server-side Firebase Admin SDK initialization.
 *
 * This file provides a function to initialize the Firebase Admin SDK,
 * ensuring that it is only initialized once (singleton pattern).
 * This is crucial for server environments like Next.js server components,
 * API routes, and Genkit flows.
 */

import * as admin from 'firebase-admin';
import { firebaseConfig } from '@/firebase/config';

/**
 * Initializes the Firebase Admin SDK if it hasn't been already.
 * This function is a singleton and can be called multiple times safely.
 * It returns the initialized firestore instance.
 */
export function initializeServerApp() {
  // Prevent re-initialization in a hot-reloading server environment.
  if (!admin.apps.length) {
    try {
      // Try to initialize using Google Application Default Credentials (ADC).
      // This is the recommended approach for production environments (e.g., Cloud Run).
      admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
      });
      console.log("Firebase Admin SDK initialized with Application Default Credentials.");
    } catch (e) {
      console.warn(
        'Firebase Admin SDK initialization with Application Default Credentials failed. ' +
        'This is normal for local development. Falling back to service account key.',
        e
      );
      // Fallback for local development: Use a service account key if the env var is set.
      const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      if (serviceAccountKey) {
        try {
          const serviceAccount = JSON.parse(serviceAccountKey);
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
          });
          console.log("Firebase Admin SDK initialized with service account key.");
        } catch (parseError) {
          console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it's a valid JSON string.", parseError);
        }
      } else {
        console.error(
          'Firebase Admin SDK initialization failed. ' + 
          'For local development, set the FIREBASE_SERVICE_ACCOUNT_KEY environment variable. ' +
          'In production, ensure Application Default Credentials are configured.'
        );
      }
    }
  }

  return { firestore: admin.firestore(), admin };
}