
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
  const [isClaimLoading, setIsClaimLoading] = useState(true);

  useEffect(() => {
    // If user loading is in progress, we are definitely loading.
    if (isUserLoading) {
      setIsClaimLoading(true);
      return;
    }

    // If there is no user, they are not an admin.
    if (!user) {
      setIsAdmin(false);
      setIsClaimLoading(false);
      return;
    }

    // --- Start of the fix ---
    // Perform a fast, client-side check first for immediate UI feedback in development.
    const isClientSideAdmin = ADMIN_EMAILS.includes(user.email || '');
    if (isClientSideAdmin) {
      setIsAdmin(true);
    }
    // --- End of the fix ---

    // Now, check for the authoritative custom claim from Firebase.
    // This will override the client-side check if a claim is explicitly present or absent in production.
    setIsClaimLoading(true);
    getIdTokenResult(user, true) // Force refresh the token
      .then((idTokenResult) => {
        const isAdminClaim = idTokenResult.claims.admin === true;
        // The final state is the logical OR of the client-side check and the claim.
        // This ensures the dev experience is fast, while claims are respected.
        setIsAdmin(isClientSideAdmin || isAdminClaim);
      })
      .catch((error) => {
        console.error("Error getting user token result:", error);
        // If claims fail to load, fall back to the client-side check.
        setIsAdmin(isClientSideAdmin);
      })
      .finally(() => {
        setIsClaimLoading(false);
      });

  }, [user, isUserLoading]);

  // The overall loading state is true if either the user is loading or the claims are loading.
  return { isAdmin, isLoading: isUserLoading || isClaimLoading };
}
