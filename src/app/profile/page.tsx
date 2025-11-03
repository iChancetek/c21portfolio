'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useLocale } from '@/hooks/useLocale';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { t } = useLocale();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="container flex items-center justify-center py-24">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-24">
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                        <AvatarFallback className="text-3xl">
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-3xl">{user.displayName || t('profileWelcome')}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground mb-1">UID: {user.uid}</p>
                    <p className="text-muted-foreground text-sm">
                        {user.isAnonymous ? t('guestUser') : t('registeredUser')}
                    </p>
                    <p className="text-muted-foreground text-sm mt-4">
                        {t('accountCreated', { date: user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A' })}
                    </p>
                     <p className="text-muted-foreground text-sm">
                        {t('lastSignIn', { date: user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'N/A' })}
                    </p>
                    <Button onClick={handleSignOut} className="mt-8">
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('signOut')}
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
