import { Issue, getCategoryDisplayName, getStatusDisplayName, getPriorityLevel } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useVoteIssue } from '@/hooks/useVoteIssue';
import {
  MapPin,
  AlertTriangle,
  Clock,
  Map,
  CheckCircle2,
  X,
  ThumbsUp,
  ImageIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface IssueDetailModalProps {
  issue: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showMapButton?: boolean;
}

function getProgressPercentage(status: string): number {
  const map: Record<string, number> = {
    open: 25,
    assigned: 50,
    assigned_auto: 50,
    resolved_pending_verification: 75,
    closed: 100,
    rejected: 100,
    fake: 0,
  };
  return map[status] ?? 25;
}

function getStageLabel(status: string): string {
  const map: Record<string, string> = {
    open: 'Open',
    assigned: 'Assigned',
    assigned_auto: 'Auto Assigned',
    resolved_pending_verification: 'Pending Verification',
    closed: 'Closed',
    rejected: 'Rejected',
    fake: 'Marked as Fake',
  };
  return map[status] ?? 'Processing';
}
function getTimeline(issue: any) {
  if (issue.timeline && issue.timeline.length > 0) {
    return issue.timeline;
  }

  // fallback (old data support)
  const timeline = [
    { status: 'open', at: issue.created_at || issue.createdAt },
  ];

  if (issue.status !== 'open') {
    timeline.push({ status: issue.status, at: new Date() });
  }

  return timeline;
}
export function IssueDetailModal({
  issue,
  open,
  onOpenChange,
  showMapButton = true
}: IssueDetailModalProps) {

  const navigate = useNavigate();
  const { mutate: vote, isPending } = useVoteIssue();

  // ✅ STATE
  const [localVotes, setLocalVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);

  // ✅ SYNC
  useEffect(() => {
    if (!issue) return;
    setLocalVotes(issue.vote_count || 0);
    setHasVoted(issue.has_voted || false);
  }, [issue]);

  // ✅ FIX: prevent crash BEFORE using issue
  if (!issue) return null;

  const priorityLevel = getPriorityLevel(issue.priority_score || 0);
  const progressPercentage = getProgressPercentage(issue.status);
  const timeline = getTimeline(issue);
  const priorityClasses: Record<string, string> = {
    low: 'priority-low',
    medium: 'priority-medium',
    high: 'priority-high',
    critical: 'priority-critical',
  };

  const categoryClasses: Record<string, string> = {
    garbage_overflow: 'category-garbage',
    pothole: 'category-pothole',
    water_stagnation: 'category-water',
    street_light_failure: 'category-streetlight',
    hospital_infrastructure: 'category-hospital',
    other: 'category-other',
  };

  const handleViewOnMap = () => {
    onOpenChange(false);
    navigate(`/map?issueId=${issue.id}`);
  };

  const handleVote = () => {
    if (hasVoted || issue.is_own_issue) return;

    vote(issue.id);

    // optimistic update
    setLocalVotes(prev => prev + 1);
    setHasVoted(true);
  };

  // ✅ SAFE DATE
  let timeAgo = 'Unknown';
  try {
    const created = issue.created_at || issue.createdAt;
    if (created) {
      timeAgo = formatDistanceToNow(new Date(created), { addSuffix: true });
    }
  } catch {}

  let resolvedAgo = null;
  try {
    if (issue.resolved_at) {
      resolvedAgo = formatDistanceToNow(new Date(issue.resolved_at), { addSuffix: true });
    }
  } catch {}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-0">

        {/* IMAGE */}
        <div className="relative w-full">
          {issue.image_url ? (
            <img
              src={issue.image_url}
              alt="Issue"
              className="h-56 w-full object-cover sm:h-72"
            />
          ) : (
            <div className="flex h-56 w-full items-center justify-center bg-muted sm:h-72">
              <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
            </div>
          )}

          <div className="absolute left-4 top-4">
            <Badge className={cn('text-sm', priorityClasses[priorityLevel])}>
              Priority: {Math.round(issue.priority_score || 0)}
            </Badge>
          </div>

          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-4 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* CONTENT */}
        <div className="p-6">

          {/* PROGRESS */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Resolution Progress
              </span>
              <span className="text-sm font-medium text-primary">
                {progressPercentage}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <p className="mt-2 text-sm font-medium text-foreground">
              {getStageLabel(issue.status)}
            </p>
          </div>
          {/* 🔥 TIMELINE (VERTICAL — PRODUCT STYLE) */}
<div className="mb-6">
  <h4 className="mb-4 text-sm font-medium text-muted-foreground">
    Activity Timeline
  </h4>

  <div className="space-y-4">
    {timeline.map((step: any, index: number) => {
      const date = step.at ? new Date(step.at) : null;

      return (
        <div key={index} className="flex gap-4">

          {/* DATE */}
          <div className="w-16 text-xs text-muted-foreground text-right">
            {date && (
              <>
                <div>{date.getDate()}</div>
                <div>{date.toLocaleString('default', { month: 'short' })}</div>
              </>
            )}
          </div>

          {/* LINE + DOT */}
          <div className="flex flex-col items-center">
            <div className="w-[2px] flex-1 bg-border" />
            <div className="h-3 w-3 rounded-full bg-primary border-2 border-background" />
            <div className="w-[2px] flex-1 bg-border" />
          </div>

          {/* CARD */}
          <div className="flex-1 rounded-lg border border-border p-3 bg-muted/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">
                {getStageLabel(step.status)}
              </span>

              <span className="text-xs text-muted-foreground">
                {date &&
                  formatDistanceToNow(date, { addSuffix: true })}
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              Status changed to <strong>{step.status}</strong>
            </p>
          </div>
        </div>
      );
    })}
  </div>
</div>

          {/* BADGES */}
          <div className="mb-4 flex flex-wrap gap-2">
            <span className={cn('status-badge', categoryClasses[issue.category])}>
              {getCategoryDisplayName(issue.category)}
            </span>
            <Badge variant="outline">
              {getStatusDisplayName(issue.status)}
            </Badge>
          </div>

          {/* TITLE */}
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl">
              {issue.summary || issue.description?.slice(0, 80) || 'No description'}
            </DialogTitle>
          </DialogHeader>

          {/* DESCRIPTION */}
          {issue.description && (
            <div className="mb-4">
              <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                Description
              </h4>
              <p className="text-sm text-foreground">
                {issue.description}
              </p>
            </div>
          )}

          {/* LOCATION */}
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
            <MapPin className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h4 className="text-sm font-medium text-foreground">Location</h4>
              <p className="text-sm text-muted-foreground">
                {issue.place}
              </p>
            </div>
          </div>

          {/* META */}
          <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Reported {timeAgo}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span>
                Priority Score: {Math.round(issue.priority_score || 0)}
              </span>
            </div>
          </div>

          {/* RESOLUTION PROOF */}
          {issue.resolution?.proof_image_url && (
            <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-600">
                  Resolution Proof
                </h4>
              </div>

              <img
                src={issue.resolution.proof_image_url}
                alt="Resolution proof"
                className="h-40 w-full rounded-lg object-cover"
              />

              {resolvedAgo && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Resolved {resolvedAgo}
                </p>
              )}
            </div>
          )}

          {/* VOTE */}
          <Button
            variant={hasVoted ? 'secondary' : 'outline'}
            className="w-full mb-2 flex items-center justify-center gap-2"
            onClick={handleVote}
            disabled={hasVoted || issue.is_own_issue || isPending}
          >
            <ThumbsUp className={hasVoted ? 'fill-current' : ''} />
            {localVotes}
          </Button>

          {/* MAP */}
          {showMapButton && (
            <Button onClick={handleViewOnMap} className="w-full" size="lg">
              <Map className="mr-2 h-5 w-5" />
              View on Map
            </Button>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}