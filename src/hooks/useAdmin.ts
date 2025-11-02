
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { getIdTokenResult } from 'firebase/auth';

interface UseAdminResult {
  isAdmin: boolean;
  isLoading: boolean;
}

const ADMIN_EMAILS = ['chancellor@ichancetek.com', 'chanceminus@gmail.com'];

export function useAdmin(): UseAdminResult {
  const { user, isUserLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isUserLoading) {
      // Still waiting for the user object to be determined
      setIsLoading(true);
      return;
    }

    if (!user) {
      // No user is logged in
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    // This is a temporary client-side check for development.
    // In production, the custom claim check is the source of truth.
    if (ADMIN_EMAILS.includes(user.email || '')) {
        setIsAdmin(true);
    }

    // Check for custom claims on the ID token
    setIsLoading(true);
    getIdTokenResult(user, true) // Force refresh the token
      .then((idTokenResult) => {
        const isAdminClaim = idTokenResult.claims.admin === true;
        setIsAdmin(isAdminClaim);
      })
      .catch((error) => {
        console.error("Error getting user token result:", error);
        setIsAdmin(false);
      })
      .finally(() => {
        setIsLoading(false);
      });

  }, [user, isUserLoading]);

  return { isAdmin, isLoading: isUserLoading || isLoading };
}
