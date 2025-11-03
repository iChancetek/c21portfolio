'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/useAdmin';
import { Loader2, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuditLogs from '@/components/AuditLogs';
import ActiveUsers from '@/components/ActiveUsers';
import { useLocale } from '@/hooks/useLocale';

function AdminDashboardPage() {
  const { isAdmin, isLoading } = useAdmin();
  const router = useRouter();
  const { t } = useLocale();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace('/');
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center py-24">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">{t('verifyingPermissions')}</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container py-12 md:py-24">
       <div className="text-center mb-12">
        <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4 text-primary-gradient">
          {t('adminDashboard')}
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
          {t('adminDescription')}
        </p>
      </div>

      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">{t('activeUsers')}</TabsTrigger>
            <TabsTrigger value="logs">{t('auditLogs')}</TabsTrigger>
            <TabsTrigger value="reports">{t('reporting')}</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
            <ActiveUsers />
        </TabsContent>
        <TabsContent value="logs">
            <AuditLogs />
        </TabsContent>
        <TabsContent value="reports">
            <Card>
            <CardHeader>
                <CardTitle>{t('reporting')}</CardTitle>
                <CardDescription>
                {t('reportingDescription')}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                 <p className="text-muted-foreground">{t('reportingPending')}</p>
            </CardContent>
            </Card>
        </TabsContent>
        </Tabs>
    </div>
  );
}

export default AdminDashboardPage;
