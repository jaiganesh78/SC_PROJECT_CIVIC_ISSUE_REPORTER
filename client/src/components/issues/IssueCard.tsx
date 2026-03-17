import { Issue, getCategoryDisplayName, getStatusDisplayName, getPriorityLevel } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, ThumbsUp, AlertTriangle, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
interface IssueCardProps {
  issue: any; // 🔥 allow flexible backend shape
  onVote?: (issueId: string) => void;
  onViewDetails?: (issue: any) => void;
  showVoteButton?: boolean;
  className?: string;
}

export function IssueCard({
  issue,
  onVote,
  onViewDetails,
  showVoteButton = true,
  className
}: IssueCardProps) {

  const priorityLevel = getPriorityLevel(issue.priority_score || 0);

  const categoryClasses: Record<string, string> = {
    garbage_overflow: 'category-garbage',
    pothole: 'category-pothole',
    water_stagnation: 'category-water',
    street_light_failure: 'category-streetlight',
    hospital_infrastructure: 'category-hospital',
    other: 'category-other',
  };
console.log("ISSUE OBJECT:", issue);

  const statusClasses: Record<string, string> = {
    open: 'status-pending',
    assigned: 'status-assigned',
    assigned_auto: 'status-assigned',
    resolved_pending_verification: 'status-in-progress',
    closed: 'status-verified',
    rejected: 'status-rejected',
    fake: 'bg-muted text-muted-foreground',
  };

  const priorityClasses: Record<string, string> = {
    low: 'priority-low',
    medium: 'priority-medium',
    high: 'priority-high',
    critical: 'priority-critical',
  };

  const handleViewDetails = () => {
    onViewDetails?.(issue);
  };

  // 🔥 SAFE DATE HANDLING
  let timeAgo = 'Unknown';
  try {
    if (issue.createdAt) {
      timeAgo = formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true });
    }
  } catch {}

  return (
    <Card className={cn('issue-card overflow-hidden', className)}>
      <CardContent className="p-0">
        <div className="flex">

          {/* Image */}
          {issue.issue_image && (
            <div
              className="relative w-32 flex-shrink-0 cursor-pointer sm:w-40"
              onClick={handleViewDetails}
            >
              <img
               src={`http://localhost:5000/${issue.issue_image?.replace(/^\/+/, '')}`}
                alt="Issue"
                className="h-full w-full object-cover"
              />
              <div className="absolute left-2 top-2">
                <div className={cn('priority-indicator', priorityClasses[priorityLevel])} />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex flex-1 flex-col p-4">

            {/* Badges */}
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <span className={cn('status-badge', categoryClasses[issue.category])}>
                {getCategoryDisplayName(issue.category)}
              </span>
              <span className={cn('status-badge', statusClasses[issue.status])}>
                {getStatusDisplayName(issue.status)}
              </span>
            </div>

            {/* 🔥 SUMMARY (safe fallback) */}
            <h3 className="mb-1 line-clamp-1 font-medium text-foreground">
              {issue.summary || issue.description?.slice(0, 60) || 'No description'}
            </h3>

            {/* Description */}
            {issue.description && (
              <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                {issue.description}
              </p>
            )}

            {/* Meta */}
            <div className="mt-auto flex flex-wrap items-center gap-3 text-xs text-muted-foreground">

              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate max-w-[120px]">
                  {issue.place?.formatted || 'Unknown location'}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{timeAgo}</span>
              </div>

              <div className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Priority: {Math.round(issue.priority_score || 0)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">

              <div className="flex items-center gap-2">

                {showVoteButton && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onVote?.(issue._id)}
                    className="h-8 flex items-center gap-1"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    {issue.vote_count || 0}
                  </Button>
                )}

              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={handleViewDetails}
              >
                View Details
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>

            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}