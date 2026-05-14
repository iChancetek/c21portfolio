'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2, Activity, Users, ShieldAlert, BarChart3 } from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { format, subDays, isAfter, startOfDay, parseISO } from 'date-fns';
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

interface UserStatus {
  id: string;
  status: 'online' | 'offline';
}

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b'];

export default function ReportingDashboard() {
  const firestore = useFirestore();
  const { t } = useLocale();

  // Queries
  const auditLogsQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return query(collection(firestore, 'auditLogs'), orderBy('timestamp', 'desc'));
  }, [firestore]);

  const activeUsersQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return query(collection(firestore, 'userStatus'));
  }, [firestore]);

  // Fetch Data
  const { data: logs, isLoading: loadingLogs, error: logsError } = useCollection<AuditLog>(auditLogsQuery);
  const { data: userStatusData, isLoading: loadingUsers } = useCollection<UserStatus>(activeUsersQuery);

  const isLoading = loadingLogs || loadingUsers;

  // Process Data for Charts
  const chartData = useMemo(() => {
    if (!logs) return { timeline: [], pieData: [], kpis: { total: 0, online: 0, actions: 0 } };

    // KPIs
    const onlineUsers = userStatusData?.filter(u => u.status === 'online').length || 0;
    const totalLogs = logs.length;
    const adminActions = logs.filter(l => l.eventType === 'ADMIN_ACTION').length;

    // Pie Chart Data (Events by Type)
    const eventCounts = logs.reduce((acc, log) => {
        acc[log.eventType] = (acc[log.eventType] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const pieData = Object.entries(eventCounts).map(([name, value]) => ({ name, value }));

    // Timeline Data (Last 7 Days)
    const today = startOfDay(new Date());
    const sevenDaysAgo = subDays(today, 6); // Includes today + 6 previous days
    
    // Initialize empty days array
    const timelineMap = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
        timelineMap.set(format(subDays(today, i), 'MMM dd'), 0);
    }

    logs.forEach(log => {
        const logDate = parseISO(log.timestamp);
        if (isAfter(logDate, sevenDaysAgo) || logDate.getTime() === sevenDaysAgo.getTime()) {
            const dayKey = format(startOfDay(logDate), 'MMM dd');
            if (timelineMap.has(dayKey)) {
                timelineMap.set(dayKey, timelineMap.get(dayKey)! + 1);
            }
        }
    });

    const timeline = Array.from(timelineMap.entries()).map(([date, count]) => ({ date, count }));

    return { timeline, pieData, kpis: { total: totalLogs, online: onlineUsers, actions: adminActions } };
  }, [logs, userStatusData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">{t('loadingReporting') || 'Loading Reports...'}</p>
      </div>
    );
  }

  if (logsError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-4">
        <p className="text-destructive font-semibold mb-2">{t('insufficientPermissions') || 'Insufficient Permissions'}</p>
        <p className="text-xs text-muted-foreground">
          {logsError.message || 'You do not have permission to view reporting data.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-secondary/30 border-border/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Online Users</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chartData.kpis.online}</div>
            <p className="text-xs text-muted-foreground">Currently active on the platform</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/30 border-border/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Audit Events</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chartData.kpis.total}</div>
            <p className="text-xs text-muted-foreground">Recorded system interactions</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/30 border-border/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Actions</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chartData.kpis.actions}</div>
            <p className="text-xs text-muted-foreground">Privileged operations performed</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 bg-secondary/30 border-border/20">
          <CardHeader>
            <CardTitle>Activity Timeline (Last 7 Days)</CardTitle>
            <CardDescription>Daily count of system events and logins.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.timeline} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <RechartsTooltip 
                     contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                     itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3 bg-secondary/30 border-border/20">
          <CardHeader>
            <CardTitle>Event Distribution</CardTitle>
            <CardDescription>Breakdown of event types.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
