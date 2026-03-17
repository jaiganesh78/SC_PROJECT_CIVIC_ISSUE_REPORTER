import { Issue, getCategoryDisplayName, getStatusDisplayName, getPriorityLevel } from '@/types';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, ThumbsUp, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface IssuePopupContentProps {
  issue: Issue;
}

export function IssuePopupContent({ issue }: IssuePopupContentProps) {
  const priorityLevel = getPriorityLevel(issue.priority_score);
  
  const priorityConfig = {
    low: { label: 'Low', className: 'bg-priority-low/15 text-priority-low' },
    medium: { label: 'Medium', className: 'bg-priority-medium/15 text-priority-medium' },
    high: { label: 'High', className: 'bg-priority-high/15 text-priority-high' },
    critical: { label: 'Critical', className: 'bg-priority-critical/15 text-priority-critical' },
  };

  const statusConfig: Record<string, string> = {
    pending: 'status-pending',
    assigned: 'status-assigned',
    in_progress: 'status-in-progress',
    resolved: 'status-resolved',
    verified: 'status-verified',
    rejected: 'status-rejected',
    fake: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="p-3">
      {/* Image */}
      {issue.image_url && (
        <div className="mb-3 overflow-hidden rounded-lg">
          <img 
            src={issue.image_url} 
            alt="Issue" 
            className="h-32 w-full object-cover"
          />
        </div>
      )}
      
      {/* Badges */}
      <div className="mb-2 flex flex-wrap gap-1.5">
        <span className={`status-badge ${statusConfig[issue.status]}`}>
          {getStatusDisplayName(issue.status)}
        </span>
        <span className={`status-badge ${priorityConfig[priorityLevel].className}`}>
          <AlertTriangle className="h-3 w-3" />
          {priorityConfig[priorityLevel].label}
        </span>
      </div>
      
      {/* Category */}
      <h3 className="mb-1 font-semibold text-foreground">
        {getCategoryDisplayName(issue.category)}
      </h3>
      
      {/* Summary */}
      <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
        {issue.summary}
      </p>
      
      {/* Description if exists */}
      {issue.description && (
        <p className="mb-3 text-sm text-foreground line-clamp-2">
          {issue.description}
        </p>
      )}
      
      {/* Meta info */}
      <div className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{issue.place}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          <span>{formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ThumbsUp className="h-3 w-3" />
          <span>{issue.vote_count} votes</span>
        </div>
      </div>
      
      {/* Priority score */}
      <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
        <span className="text-xs text-muted-foreground">Priority Score</span>
        <span className="text-sm font-semibold">{issue.priority_score.toFixed(0)}</span>
      </div>
    </div>
  );
}
