import { useMemo, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { IssueDetailModal } from '@/components/issues/IssueDetailModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { demoIssues } from '@/data/demoIssues';
import { useAuth } from '@/contexts/AuthContext';
import { getCategoryDisplayName, getStatusDisplayName, Issue } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function MyIssuesPage() {
  const { user } = useAuth();
  
  // Modal state
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter to show only user's own issues
  const myIssues = useMemo(() => {
    // In demo, we'll show issues where is_own_issue is true
    return demoIssues.filter(issue => issue.is_own_issue || issue.user_id === user?.id);
  }, [user?.id]);

  const stats = useMemo(() => {
    const pending = myIssues.filter(i => ['pending', 'assigned', 'in_progress'].includes(i.status)).length;
    const resolved = myIssues.filter(i => ['resolved', 'verified'].includes(i.status)).length;
    const total = myIssues.length;
    return { pending, resolved, total };
  }, [myIssues]);

  const categoryClasses: Record<string, string> = {
    garbage_overflow: 'category-garbage',
    pothole: 'category-pothole',
    water_stagnation: 'category-water',
    street_light_failure: 'category-streetlight',
    hospital_infrastructure: 'category-hospital',
    other: 'category-other',
  };

  const statusClasses: Record<string, string> = {
    pending: 'status-pending',
    assigned: 'status-assigned',
    in_progress: 'status-in-progress',
    resolved: 'status-resolved',
    verified: 'status-verified',
    rejected: 'status-rejected',
    fake: 'bg-muted text-muted-foreground',
  };

  const handleViewDetails = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  return (
    <MainLayout requireAuth allowedRoles={['citizen']}>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Issues</h1>
            <p className="mt-1 text-muted-foreground">
              Track the progress of issues you've reported
            </p>
          </div>
          <Button asChild>
            <Link to="/report">
              <Plus className="mr-2 h-4 w-4" />
              Report New Issue
            </Link>
          </Button>
        </div>

        {/* Stats cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Reported</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-pending/10">
                <Clock className="h-6 w-6 text-status-pending" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
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
        </div>

        {/* Issues list */}
        {myIssues.length > 0 ? (
          <div className="space-y-4">
            {myIssues.map((issue) => (
              <Card 
                key={issue.id} 
                className="cursor-pointer overflow-hidden transition-shadow hover:shadow-md"
                onClick={() => handleViewDetails(issue)}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Image */}
                  {issue.image_url && (
                    <div className="lg:w-48">
                      <img
                        src={issue.image_url}
                        alt="Issue"
                        className="h-48 w-full object-cover lg:h-full"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-4 lg:p-6">
                    {/* Badges */}
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className={cn('status-badge', categoryClasses[issue.category])}>
                        {getCategoryDisplayName(issue.category)}
                      </span>
                      <span className={cn('status-badge', statusClasses[issue.status])}>
                        {getStatusDisplayName(issue.status)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mb-1 text-lg font-semibold">{issue.summary}</h3>

                    {/* Meta - Human readable location only */}
                    <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{issue.place}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Reported {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>

                    {/* Timeline preview */}
                    <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                      <div className="flex items-center gap-2">
                        {['pending', 'assigned', 'in_progress', 'resolved', 'verified'].map((status, idx) => {
                          const statusOrder = ['pending', 'assigned', 'in_progress', 'resolved', 'verified'];
                          const currentIdx = statusOrder.indexOf(issue.status);
                          const isCompleted = idx <= currentIdx;
                          const isCurrent = idx === currentIdx;
                          
                          return (
                            <div
                              key={status}
                              className={cn(
                                'h-2 w-2 rounded-full',
                                isCompleted ? 'bg-primary' : 'bg-muted',
                                isCurrent && 'ring-2 ring-primary/30'
                              )}
                            />
                          );
                        })}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {getStatusDisplayName(issue.status)}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <AlertTriangle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No issues reported yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Help improve your community by reporting civic issues
              </p>
              <Button className="mt-4" asChild>
                <Link to="/report">
                  <Plus className="mr-2 h-4 w-4" />
                  Report Your First Issue
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Issue Detail Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </MainLayout>
  );
}
