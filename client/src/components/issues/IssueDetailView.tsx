import { Issue, getStatusDisplayName, getCategoryDisplayName, getPriorityLevel } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MapPin, 
  Clock, 
  ThumbsUp, 
  AlertTriangle, 
  ExternalLink,
  Share2,
  Flag
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';

interface IssueDetailViewProps {
  issue: Issue;
  onVote?: (issueId: string) => void;
  showVoteButton?: boolean;
  showActions?: boolean;
}

export function IssueDetailView({ 
  issue, 
  onVote, 
  showVoteButton = true,
  showActions = true
}: IssueDetailViewProps) {
  const priorityLevel = getPriorityLevel(issue.priority_score);

  const categoryClasses: Record<string, string> = {
    garbage_overflow: 'category-garbage',
    pothole: 'category-pothole',
    water_stagnation: 'category-water',
    street_light_failure: 'category-streetlight',
    hospital_infrastructure: 'category-hospital',
    other: 'category-other',
  };

  const priorityConfig = {
    low: { label: 'Low Priority', className: 'bg-priority-low/15 text-priority-low border-priority-low/30' },
    medium: { label: 'Medium Priority', className: 'bg-priority-medium/15 text-priority-medium border-priority-medium/30' },
    high: { label: 'High Priority', className: 'bg-priority-high/15 text-priority-high border-priority-high/30' },
    critical: { label: 'Critical Priority', className: 'bg-priority-critical/15 text-priority-critical border-priority-critical/30' },
  };

  return (
    <div className="space-y-6">
      {/* Image */}
      {issue.image_url && (
        <div className="overflow-hidden rounded-xl">
          <img
            src={issue.image_url}
            alt="Issue"
            className="h-64 w-full object-cover sm:h-80"
          />
        </div>
      )}

      {/* Header info */}
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={cn('status-badge text-sm', categoryClasses[issue.category])}>
            {getCategoryDisplayName(issue.category)}
          </span>
          <Badge variant="outline" className={priorityConfig[priorityLevel].className}>
            <AlertTriangle className="mr-1 h-3 w-3" />
            {priorityConfig[priorityLevel].label}
          </Badge>
          <Badge variant="secondary">
            {getStatusDisplayName(issue.status)}
          </Badge>
        </div>

        <h1 className="text-2xl font-bold">{issue.summary}</h1>
        
        {issue.description && (
          <p className="mt-3 text-muted-foreground">{issue.description}</p>
        )}
      </div>

      {/* Meta info cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium">{issue.place}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Reported</p>
              <p className="text-sm font-medium">
                {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <AlertTriangle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Priority Score</p>
              <p className="text-sm font-medium">{issue.priority_score.toFixed(1)} / 100</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ThumbsUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Community Votes</p>
              <p className="text-sm font-medium">{issue.vote_count} votes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex flex-wrap items-center gap-3">
          {showVoteButton && !issue.is_own_issue && (
            <Button
              variant={issue.has_voted ? 'secondary' : 'default'}
              onClick={() => onVote?.(issue.id)}
              disabled={issue.has_voted}
            >
              <ThumbsUp className={cn('mr-2 h-4 w-4', issue.has_voted && 'fill-current')} />
              {issue.has_voted ? 'Voted' : 'Vote for this issue'}
            </Button>
          )}
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Map
          </Button>
          {!issue.is_own_issue && (
            <Button variant="ghost" className="text-muted-foreground">
              <Flag className="mr-2 h-4 w-4" />
              Report
            </Button>
          )}
        </div>
      )}

      {/* Coordinates for debugging/admin */}
      <Card className="bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Technical Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-3">
          <div>
            <span className="text-muted-foreground">Coordinates: </span>
            <span className="font-mono">{issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Issue ID: </span>
            <span className="font-mono">{issue.id}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Last Updated: </span>
            <span>{format(new Date(issue.updated_at), 'MMM d, yyyy h:mm a')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
