
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Wifi, WifiOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { formatDistanceToNow } from 'date-fns';

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

  const onlineUsersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // Query for users who are currently 'online'
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
          <p className="ml-2 text-muted-foreground">Loading active users...</p>
        </div>
      );
    }

    if (error) {
      // The useCollection hook now throws the error, so we can rely on the error boundary
      // but we can still show a fallback UI if needed.
       return (
        <div className="flex flex-col items-center justify-center h-40 text-destructive">
          <WifiOff className="h-8 w-8 mb-2" />
          <p>Failed to load user activity.</p>
          <p className="text-xs">{error.message}</p>
        </div>
      );
    }

    if (!users || users.length === 0) {
      return (
        <div className="flex items-center justify-center h-40">
          <p className="text-muted-foreground">No users are currently active.</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Last Seen</TableHead>
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
                        <div className="font-medium">{user.displayName || 'Anonymous'}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={user.status === 'online' ? 'default' : 'secondary'} className={user.status === 'online' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}>
                    {user.status === 'online' ? <Wifi className="mr-2 h-3 w-3" /> : <WifiOff className="mr-2 h-3 w-3" />}
                    {user.status}
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
    <Card>
      <CardHeader>
        <CardTitle>Real-Time User Activity</CardTitle>
        <CardDescription>View users who are currently active on the site.</CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
