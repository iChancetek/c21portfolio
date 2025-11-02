
'use client';

import { useEffect, useRef } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

/**
 * A custom hook to manage a user's online presence in Firestore.
 * It updates the user's status to 'online' when they are active
 * and 'offline' when they close the tab/browser.
 */
export function useUserPresence() {
  const { user } = useUser();
  const firestore = useFirestore();
  const isOnlineRef = useRef(false);

  useEffect(() => {
    if (!user || !firestore) {
      return;
    }

    // A reference to the user's status document in Firestore
    const userStatusDocRef = doc(firestore, 'userStatus', user.uid);

    // Function to set user status to 'online'
    const goOnline = () => {
      if (isOnlineRef.current) return;
      isOnlineRef.current = true;
      setDoc(userStatusDocRef, {
        status: 'online',
        lastSeen: serverTimestamp(),
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      }, { merge: true });
    };

    // Function to set user status to 'offline'
    const goOffline = () => {
      if (!isOnlineRef.current) return;
      isOnlineRef.current = false;
      setDoc(userStatusDocRef, {
        status: 'offline',
        lastSeen: serverTimestamp(),
      }, { merge: true });
    };

    // Set status to online when the component mounts
    goOnline();
    
    // --- Handling Browser/Tab Close ---
    // Use 'beforeunload' to go offline. This is the most reliable cross-browser event.
    window.addEventListener('beforeunload', goOffline);

    // --- Handling Page Visibility Changes ---
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        goOffline();
      } else {
        goOnline();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function to remove listeners and set status to offline
    return () => {
      // This offline call might not always succeed on component unmount,
      // but 'beforeunload' is the primary mechanism.
      goOffline();
      window.removeEventListener('beforeunload', goOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

  }, [user, firestore]);
}
