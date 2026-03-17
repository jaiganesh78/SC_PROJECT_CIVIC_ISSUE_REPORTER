import { useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Flag,
  Users
} from 'lucide-react';
import { demoIssues } from '@/data/demoIssues';
import { getCategoryDisplayName, IssueCategory, IssueStatus } from '@/types';

export default function AdminAnalyticsPage() {
  // Calculate stats
  const stats = useMemo(() => {
    const total = demoIssues.length;
    const resolved = demoIssues.filter(i => ['resolved', 'verified'].includes(i.status)).length;
    const pending = demoIssues.filter(i => ['pending', 'assigned', 'in_progress'].includes(i.status)).length;
    const highPriority = demoIssues.filter(i => i.priority_score >= 70).length;
    const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : '0';
    
    return { total, resolved, pending, highPriority, resolutionRate };
  }, []);

  // Category breakdown
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    demoIssues.forEach(issue => {
      counts[issue.category] = (counts[issue.category] || 0) + 1;
    });
    
    return Object.entries(counts).map(([category, count]) => ({
      name: getCategoryDisplayName(category as IssueCategory),
      value: count,
    }));
  }, []);

  // Status breakdown
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    demoIssues.forEach(issue => {
      counts[issue.status] = (counts[issue.status] || 0) + 1;
    });
    
    return Object.entries(counts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
      value: count,
    }));
  }, []);

  // Weekly trend data (mock)
  const trendData = [
    { week: 'Week 1', reported: 45, resolved: 32 },
    { week: 'Week 2', reported: 52, resolved: 41 },
    { week: 'Week 3', reported: 38, resolved: 35 },
    { week: 'Week 4', reported: 61, resolved: 48 },
  ];

  // Colors
  const COLORS = ['#0d9488', '#a16207', '#0ea5e9', '#eab308', '#ef4444', '#6b7280'];
  const STATUS_COLORS = ['#eab308', '#0ea5e9', '#0d9488', '#22c55e', '#16a34a', '#ef4444'];

  return (
    <MainLayout requireAuth allowedRoles={['admin']}>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            System-wide statistics and insights
          </p>
        </div>

        {/* Summary stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Issues</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-verified/10">
                <CheckCircle2 className="h-6 w-6 text-status-verified" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.resolved}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-priority-high/10">
                <TrendingUp className="h-6 w-6 text-priority-high" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.highPriority}</p>
                <p className="text-sm text-muted-foreground">High Priority</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.resolutionRate}%</p>
                <p className="text-sm text-muted-foreground">Resolution Rate</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts row 1 */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Issues by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Issues by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Issues by Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Issues by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="reported" 
                    stroke="hsl(var(--status-pending))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--status-pending))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="resolved" 
                    stroke="hsl(var(--status-verified))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--status-verified))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
