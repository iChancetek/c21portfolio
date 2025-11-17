'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, LogOut, ArrowLeft, Star, Trash2 } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useLocale } from '@/hooks/useLocale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { collection, query, where, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface FavoriteAffirmation {
    id: string;
    affirmation: string;
    timestamp: any;
}

function FavoriteAffirmations() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const favoritesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'userInteractions'),
      where('userId', '==', user.uid),
      where('interaction', '==', 'favorite'),
      orderBy('timestamp', 'desc')
    );
  }, [firestore, user]);

  const { data: favorites, isLoading } = useCollection<FavoriteAffirmation>(favoritesQuery);

  const handleDelete = async (favoriteId: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'userInteractions', favoriteId));
      toast({ title: "Removed from favorites." });
    } catch (error) {
      toast({ variant: 'destructive', title: "Failed to remove favorite." });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  if (!favorites || favorites.length === 0) {
      return <p className="text-muted-foreground text-center p-8">You haven't saved any favorite affirmations yet.</p>
  }

  return (
    <ScrollArea className="h-72">
        <ul className="space-y-4">
        {favorites.map((fav) => (
            <li key={fav.id} className="p-4 bg-secondary/50 rounded-lg flex justify-between items-center">
                <blockquote className="italic text-left">&ldquo;{fav.affirmation}&rdquo;</blockquote>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove this affirmation from your favorites.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(fav.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </li>
        ))}
        </ul>
    </ScrollArea>
  );
}


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
            <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="favorites">My Favorites</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
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
                            <div className="mt-8 flex justify-center gap-4">
                                <Button onClick={() => router.back()} variant="outline">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Go Back
                                </Button>
                                <Button onClick={handleSignOut}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    {t('signOut')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="favorites">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 justify-center">
                                <Star className="text-primary"/> Favorite Affirmations
                            </CardTitle>
                            <CardDescription>A collection of affirmations you've saved.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FavoriteAffirmations />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    </div>
  );
}
