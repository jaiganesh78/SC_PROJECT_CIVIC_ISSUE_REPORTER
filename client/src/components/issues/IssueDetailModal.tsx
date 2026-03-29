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
  showMapButton?: boolean; // ✅ NEW
}

function getProgressPercentage(status: string): number {
  const statusProgress: Record<string, number> = {
    open: 25,
    assigned: 50,
    assigned_auto: 50,
    resolved_pending_verification: 75,
    closed: 100,
    rejected: 100,
    fake: 0,
  };
  return statusProgress[status] ?? 25;
}

function getStageLabel(status: string): string {
  const stages: Record<string, string> = {
    open: 'Open',
    assigned: 'Assigned',
    assigned_auto: 'Auto Assigned',
    resolved_pending_verification: 'Pending Verification',
    closed: 'Closed',
    rejected: 'Rejected',
    fake: 'Marked as Fake',
  };
  return stages[status] ?? 'Processing';
}

export function IssueDetailModal({ 
  issue, 
  open, 
  onOpenChange, 
  showMapButton = true // ✅ default ON
}: IssueDetailModalProps){
  const navigate = useNavigate();
const { mutate: vote ,isPending} = useVoteIssue();
  if (!issue) return null;

  const priorityLevel = getPriorityLevel(issue.priority_score || 0);
  const progressPercentage = getProgressPercentage(issue.status);
const [localVotes, setLocalVotes] = useState(issue.vote_count || 0);
const [hasVoted, setHasVoted] = useState(issue.has_voted || false);
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
     console.log("MAP CLICKED", issue._id);
    onOpenChange(false);
navigate(`/map?issueId=${issue.id}`); // ✅ FIXED
  };
useEffect(() => {
  setLocalVotes(issue.vote_count || 0);
  setHasVoted(issue.has_voted || false);
}, [issue]);
const handleVote = () => {
  if (hasVoted || issue.is_own_issue) return;

  vote(issue.id);

  // 🔥 optimistic update
  setLocalVotes(prev => prev + 1);
  setHasVoted(true);
};
  // 🔥 SAFE DATE HANDLING
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

        {/* Image */}
        <div className="relative w-full">
          {issue.image_url ? (
            <img
             src={issue.image_url} // ✅ FIXED
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

        {/* Content */}
        <div className="p-6">

          {/* Progress */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Resolution Progress</span>
              <span className="text-sm font-medium text-primary">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <p className="mt-2 text-sm font-medium text-foreground">
              {getStageLabel(issue.status)}
            </p>
          </div>

          {/* Badges */}
          <div className="mb-4 flex flex-wrap gap-2">
            <span className={cn('status-badge', categoryClasses[issue.category])}>
              {getCategoryDisplayName(issue.category)}
            </span>
            <Badge variant="outline">{getStatusDisplayName(issue.status)}</Badge>
          </div>

          {/* Summary */}
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl">
              {issue.summary || issue.description?.slice(0, 80) || 'No description'}
            </DialogTitle>
          </DialogHeader>

          {/* Description */}
          {issue.description && (
            <div className="mb-4">
              <h4 className="mb-1 text-sm font-medium text-muted-foreground">Description</h4>
              <p className="text-sm text-foreground">{issue.description}</p>
            </div>
          )}

          {/* Location */}
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
            <MapPin className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h4 className="text-sm font-medium text-foreground">Location</h4>
              <p className="text-sm text-muted-foreground">
  {issue.place}
</p>
            </div>
          </div>

          {/* Meta */}
          <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Reported {timeAgo}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span>Priority Score: {Math.round(issue.priority_score || 0)}</span>
            </div>
          </div>

          {/* Resolution Proof */}
          {issue.resolution?.proof_image_url && (
            <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-600">Resolution Proof</h4>
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
       <Button
  variant={hasVoted ? 'secondary' : 'outline'}
  className="w-full mb-2 flex items-center justify-center gap-2"
  onClick={handleVote}
  disabled={hasVoted || issue.is_own_issue || isPending}
>
  <ThumbsUp className={hasVoted ? 'fill-current' : ''} />
  {localVotes}
</Button>
          {/* Action */}
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