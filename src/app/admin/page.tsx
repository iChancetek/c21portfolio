
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/useAdmin';
import { Loader2, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function AdminDashboardPage() {
  const { isAdmin, isLoading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      // If loading is finished and user is not an admin, redirect
      router.replace('/');
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center py-24">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Verifying permissions...</p>
      </div>
    );
  }

  if (!isAdmin) {
    // Render nothing while redirecting
    return null;
  }

  return (
    <div className="container py-12 md:py-24">
       <div className="text-center mb-12">
        <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4 text-primary-gradient">
          Admin Dashboard
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
          Manage users, view activity, and monitor the application.
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Active Users</TabsTrigger>
            <TabsTrigger value="logs">Audit Logs</TabsTrigger>
            <TabsTrigger value="reports">Reporting</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
            <Card>
            <CardHeader>
                <CardTitle>Real-Time User Activity</CardTitle>
                <CardDescription>
                View users currently active on the site. (Coming Soon)
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                 <p className="text-muted-foreground">Implementation for user activity is pending.</p>
            </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="logs">
            <Card>
            <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>
                Track important events and actions across the application. (Coming Soon)
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-muted-foreground">Implementation for audit logs display is pending.</p>
            </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="reports">
            <Card>
            <CardHeader>
                <CardTitle>Reporting Tools</CardTitle>
                <CardDescription>
                Generate reports on user engagement and system health. (Coming Soon)
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                 <p className="text-muted-foreground">Implementation for reporting is pending.</p>
            </CardContent>
            </Card>
        </TabsContent>
        </Tabs>
    </div>
  );
}

export default AdminDashboardPage;
