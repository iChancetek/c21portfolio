'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Wifi, WifiOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useLocale } from '@/hooks/useLocale';

interface UserStatus {
  id: string;
  status: 'online' | 'offline';
  lastSeen: {
    seconds: number;
    nanoseconds: number;
  } | null;
  displayName: string;
  email: string;
  photoURL?: string;
}

export default function ActiveUsers() {
  const firestore = useFirestore();
  const { t } = useLocale();

  const onlineUsersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
        collection(firestore, 'userStatus'), 
        where('status', '==', 'online'),
        orderBy('lastSeen', 'desc')
    );
  }, [firestore]);

  const { data: users, isLoading, error } = useCollection<UserStatus>(onlineUsersQuery);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">{t('loadingActiveUsers')}</p>
        </div>
      );
    }

    if (error) {
       throw error;
    }

    if (!users || users.length === 0) {
      return (
        <div className="flex items-center justify-center h-40">
          <p className="text-muted-foreground">{t('noActiveUsers')}</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('user')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead className="text-right">{t('lastSeen')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                        <AvatarImage src={user.photoURL} alt={user.displayName} />
                        <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{user.displayName || t('anonymous')}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={user.status === 'online' ? 'default' : 'secondary'} className={user.status === 'online' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}>
                    {user.status === 'online' ? <Wifi className="mr-2 h-3 w-3" /> : <WifiOff className="mr-2 h-3 w-3" />}
                    {t(user.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {user.lastSeen ? formatDistanceToNow(new Date(user.lastSeen.seconds * 1000), { addSuffix: true }) : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card className="bg-secondary/30 border-border/20">
      <CardHeader>
        <CardTitle>{t('activeUsers')}</CardTitle>
        <CardDescription>{t('activeUsersDescription')}</CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
