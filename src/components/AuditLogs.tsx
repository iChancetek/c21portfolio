'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, AlertTriangle } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from './ui/badge';
import { useLocale } from '@/hooks/useLocale';

interface AuditLog {
  id: string;
  eventType: 'USER_LOGIN' | 'USER_SIGNUP' | 'ADMIN_ACTION';
  actor: {
    uid: string;
    email: string;
  };
  details: string;
  timestamp: string; // ISO 8601 string
}

const eventTypeVariant: Record<AuditLog['eventType'], 'default' | 'secondary' | 'destructive'> = {
    USER_LOGIN: 'default',
    USER_SIGNUP: 'secondary',
    ADMIN_ACTION: 'destructive',
};

export default function AuditLogs() {
  const firestore = useFirestore();
  const { t } = useLocale();
  
  const auditLogsQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return query(collection(firestore, 'auditLogs'), orderBy('timestamp', 'desc'));
  }, [firestore]);

  const { data: logs, isLoading, error } = useCollection<AuditLog>(auditLogsQuery);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">{t('loadingAuditLogs')}</p>
        </div>
      );
    }

    if (error) {
        throw error;
    }

    if (!logs || logs.length === 0) {
      return (
        <div className="flex items-center justify-center h-40">
          <p className="text-muted-foreground">{t('noAuditLogs')}</p>
        </div>
      );
    }

    return (
        <ScrollArea className="h-[60vh]">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>{t('event')}</TableHead>
                    <TableHead>{t('actor')}</TableHead>
                    <TableHead>{t('details')}</TableHead>
                    <TableHead className="text-right">{t('timestamp')}</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {logs.map((log) => (
                    <TableRow key={log.id}>
                    <TableCell>
                        <Badge variant={eventTypeVariant[log.eventType] || 'default'}>
                            {log.eventType}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <div className="font-medium">{log.actor.email}</div>
                        <div className="text-xs text-muted-foreground">{log.actor.uid}</div>
                    </TableCell>
                    <TableCell>{log.details}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </ScrollArea>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('auditLogs')}</CardTitle>
        <CardDescription>{t('auditLogsDescription')}</CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
