import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  CheckCircle2, 
  XCircle, 
  Clock,
  MapPin,
  Eye,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { demoIssues } from '@/data/demoIssues';
import { getCategoryDisplayName, getPriorityLevel, Issue } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function AdminPendingVerificationPage() {
  const { toast } = useToast();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  // Get resolved issues pending verification
  const pendingIssues = useMemo(() => {
    return demoIssues.filter(issue => issue.status === 'resolved');
  }, []);

  const handleVerify = (issue: Issue) => {
    toast({
      title: 'Issue verified',
      description: `Issue #${issue.id} has been verified and closed.`,
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast({
        title: 'Reason required',
        description: 'Please provide a reason for rejection',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Issue rejected',
      description: `Issue #${selectedIssue?.id} has been sent back for re-resolution.`,
    });
    setShowRejectDialog(false);
    setSelectedIssue(null);
    setRejectReason('');
  };

  const priorityClasses: Record<string, string> = {
    low: 'bg-priority-low/15 text-priority-low',
    medium: 'bg-priority-medium/15 text-priority-medium',
    high: 'bg-priority-high/15 text-priority-high',
    critical: 'bg-priority-critical/15 text-priority-critical',
  };

  return (
    <MainLayout requireAuth allowedRoles={['admin']}>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Pending Verification</h1>
          <p className="mt-1 text-muted-foreground">
            Review resolved issues and verify or reject resolutions
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-resolved/10">
                <Clock className="h-6 w-6 text-status-resolved" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingIssues.length}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-verified/10">
                <CheckCircle2 className="h-6 w-6 text-status-verified" />
              </div>
              <div>
                <p className="text-2xl font-bold">47</p>
                <p className="text-sm text-muted-foreground">Verified Today</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-rejected/10">
                <XCircle className="h-6 w-6 text-status-rejected" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Rejected Today</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Issues list */}
        <div className="space-y-4">
          {pendingIssues.length > 0 ? (
            pendingIssues.map((issue) => {
              const priorityLevel = getPriorityLevel(issue.priority_score);

              return (
                <Card key={issue.id} className="overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    {/* Original image */}
                    <div className="flex lg:w-80">
                      <div className="w-1/2 lg:w-40">
                        <div className="relative h-full">
                          <img
                            src={issue.image_url}
                            alt="Original issue"
                            className="h-40 w-full object-cover lg:h-full"
                          />
                          <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                            Before
                          </span>
                        </div>
                      </div>
                      {/* Resolution proof */}
                      <div className="w-1/2 lg:w-40">
                        <div className="relative h-full">
                          <img
                            src={issue.resolution?.proof_image_url || issue.image_url}
                            alt="Resolution proof"
                            className="h-40 w-full object-cover lg:h-full"
                          />
                          <span className="absolute bottom-2 left-2 rounded bg-primary/80 px-2 py-0.5 text-xs text-primary-foreground">
                            After
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-4 lg:p-6">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="status-resolved">
                          <Clock className="mr-1 h-3 w-3" />
                          Awaiting Verification
                        </Badge>
                        <span className={cn('status-badge', priorityClasses[priorityLevel])}>
                          Priority: {issue.priority_score.toFixed(0)}
                        </span>
                        <Badge variant="secondary">
                          {getCategoryDisplayName(issue.category)}
                        </Badge>
                      </div>

                      <h3 className="mb-2 text-lg font-semibold">{issue.summary}</h3>

                      <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{issue.place}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            Resolved {formatDistanceToNow(
                              new Date(issue.resolution?.resolved_at || issue.updated_at),
                              { addSuffix: true }
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Resolution notes */}
                      {issue.resolution?.notes && (
                        <p className="mb-4 text-sm text-muted-foreground">
                          <span className="font-medium">Staff notes:</span> {issue.resolution.notes}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-4">
                        <Button
                          size="sm"
                          onClick={() => handleVerify(issue)}
                        >
                          <CheckCircle2 className="mr-1.5 h-4 w-4" />
                          Verify
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedIssue(issue);
                            setShowRejectDialog(true);
                          }}
                        >
                          <XCircle className="mr-1.5 h-4 w-4" />
                          Reject
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-1.5 h-4 w-4" />
                          Full Details
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
                <h3 className="mt-4 text-lg font-medium">All caught up!</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  No issues pending verification
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Reject dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Resolution</DialogTitle>
              <DialogDescription>
                Provide a reason for rejecting this resolution. The issue will be sent 
                back to the department staff for re-resolution.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                Reject Resolution
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
