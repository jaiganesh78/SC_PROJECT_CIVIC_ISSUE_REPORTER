import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  MapPin, 
  Clock, 
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { demoIssues, sortIssuesByPriority } from '@/data/demoIssues';
import { useAuth } from '@/contexts/AuthContext';
import { getCategoryDisplayName, getStatusDisplayName, getPriorityLevel, Issue } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function StaffAssignedIssuesPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'recent'>('priority');

  // Filter issues assigned to user's department
  const assignedIssues = useMemo(() => {
    let issues = demoIssues.filter(
      issue => issue.assigned_department === user?.department || 
               ['assigned', 'in_progress'].includes(issue.status)
    );

    if (statusFilter !== 'all') {
      issues = issues.filter(i => i.status === statusFilter);
    }

    if (sortBy === 'priority') {
      issues = sortIssuesByPriority(issues);
    } else {
      issues.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return issues;
  }, [user?.department, statusFilter, sortBy]);

  const stats = useMemo(() => {
    const assigned = assignedIssues.filter(i => i.status === 'assigned').length;
    const inProgress = assignedIssues.filter(i => i.status === 'in_progress').length;
    const resolved = assignedIssues.filter(i => i.status === 'resolved').length;
    return { assigned, inProgress, resolved, total: assignedIssues.length };
  }, [assignedIssues]);

  const priorityClasses: Record<string, string> = {
    low: 'bg-priority-low/15 text-priority-low',
    medium: 'bg-priority-medium/15 text-priority-medium',
    high: 'bg-priority-high/15 text-priority-high',
    critical: 'bg-priority-critical/15 text-priority-critical',
  };

  const statusClasses: Record<string, string> = {
    pending: 'status-pending',
    assigned: 'status-assigned',
    in_progress: 'status-in-progress',
    resolved: 'status-resolved',
    verified: 'status-verified',
    rejected: 'status-rejected',
  };

  return (
    <MainLayout requireAuth allowedRoles={['department_staff']}>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Assigned Issues</h1>
          <p className="mt-1 text-muted-foreground">
            {user?.department ? `${user.department} Department` : 'Your department'} - Manage and resolve assigned issues
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <AlertTriangle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Assigned</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-assigned/10">
                <Clock className="h-5 w-5 text-status-assigned" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.assigned}</p>
                <p className="text-xs text-muted-foreground">New</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-in-progress/10">
                <Eye className="h-5 w-5 text-status-in-progress" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-resolved/10">
                <CheckCircle2 className="h-5 w-5 text-status-resolved" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.resolved}</p>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'priority' | 'recent')}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Issues list */}
        <div className="space-y-4">
          {assignedIssues.length > 0 ? (
            assignedIssues.map((issue) => {
              const priorityLevel = getPriorityLevel(issue.priority_score);
              
              return (
                <Card key={issue.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex">
                    {/* Image */}
                    {issue.image_url && (
                      <div className="w-32 flex-shrink-0 sm:w-40">
                        <img
                          src={issue.image_url}
                          alt="Issue"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-4">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className={cn('status-badge', statusClasses[issue.status])}>
                          {getStatusDisplayName(issue.status)}
                        </span>
                        <span className={cn('status-badge', priorityClasses[priorityLevel])}>
                          Priority: {issue.priority_score.toFixed(0)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {getCategoryDisplayName(issue.category)}
                        </Badge>
                      </div>

                      <h3 className="mb-1 font-semibold">{issue.summary}</h3>
                      
                      <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{issue.place}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                        <span className="text-sm text-muted-foreground">
                          {issue.vote_count} community votes
                        </span>
                        <Button size="sm" asChild>
                          <Link to={`/staff/resolve/${issue.id}`}>
                            {issue.status === 'resolved' ? 'View' : 'Resolve Issue'}
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No issues to display</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  All caught up! Check back later for new assignments.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
