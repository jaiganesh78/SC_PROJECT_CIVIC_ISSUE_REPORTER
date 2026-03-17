import { Issue, IssueStatus, getStatusDisplayName } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Clock, AlertCircle, XCircle, Shield } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';

interface IssueTimelineProps {
  issue: Issue;
  className?: string;
}

interface TimelineStep {
  status: IssueStatus;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  date?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

const statusOrder: IssueStatus[] = ['pending', 'assigned', 'in_progress', 'resolved', 'verified'];

export function IssueTimeline({ issue, className }: IssueTimelineProps) {
  const currentStatusIndex = statusOrder.indexOf(issue.status);
  
  // Handle special cases (rejected, fake)
  const isRejectedOrFake = issue.status === 'rejected' || issue.status === 'fake';

  const getTimelineSteps = (): TimelineStep[] => {
    const baseSteps: TimelineStep[] = [
      {
        status: 'pending',
        label: 'Reported',
        icon: Circle,
        date: issue.created_at,
        isCompleted: true,
        isCurrent: issue.status === 'pending',
      },
      {
        status: 'assigned',
        label: 'Assigned',
        icon: Clock,
        isCompleted: currentStatusIndex >= 1 || isRejectedOrFake,
        isCurrent: issue.status === 'assigned',
      },
      {
        status: 'in_progress',
        label: 'In Progress',
        icon: AlertCircle,
        isCompleted: currentStatusIndex >= 2,
        isCurrent: issue.status === 'in_progress',
      },
      {
        status: 'resolved',
        label: 'Resolved',
        icon: CheckCircle2,
        date: issue.resolution?.resolved_at,
        isCompleted: currentStatusIndex >= 3,
        isCurrent: issue.status === 'resolved',
      },
      {
        status: 'verified',
        label: 'Verified',
        icon: Shield,
        date: issue.resolution?.verified_at,
        isCompleted: issue.status === 'verified',
        isCurrent: issue.status === 'verified',
      },
    ];

    if (isRejectedOrFake) {
      // Replace the last step with rejected/fake
      return [
        ...baseSteps.slice(0, 3),
        {
          status: issue.status,
          label: issue.status === 'rejected' ? 'Rejected' : 'Marked as Fake',
          icon: XCircle,
          date: issue.resolution?.rejected_at,
          isCompleted: true,
          isCurrent: true,
        },
      ];
    }

    return baseSteps;
  };

  const steps = getTimelineSteps();

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Status Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {steps.map((step, index) => (
            <div key={step.status} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute left-[15px] top-8 h-[calc(100%-20px)] w-0.5',
                    step.isCompleted ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}

              {/* Icon */}
              <div
                className={cn(
                  'relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                  step.isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : step.isCompleted
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                )}
              >
                <step.icon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <p
                  className={cn(
                    'font-medium',
                    step.isCurrent ? 'text-foreground' : step.isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
                {step.date && (
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(step.date), 'MMM d, yyyy h:mm a')}
                    <span className="ml-1 text-xs">
                      ({formatDistanceToNow(new Date(step.date), { addSuffix: true })})
                    </span>
                  </p>
                )}
                {step.isCurrent && !step.date && (
                  <p className="text-sm text-primary">Current status</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Resolution proof */}
        {issue.resolution?.proof_image_url && (
          <div className="mt-4 border-t border-border pt-4">
            <p className="mb-2 text-sm font-medium">Resolution Proof</p>
            <img
              src={issue.resolution.proof_image_url}
              alt="Resolution proof"
              className="h-40 w-full rounded-lg object-cover"
            />
            {issue.resolution.notes && (
              <p className="mt-2 text-sm text-muted-foreground">{issue.resolution.notes}</p>
            )}
          </div>
        )}

        {/* Rejection reason */}
        {issue.status === 'rejected' && issue.resolution?.rejection_reason && (
          <div className="mt-4 rounded-lg bg-destructive/10 p-3">
            <p className="text-sm font-medium text-destructive">Rejection Reason</p>
            <p className="mt-1 text-sm text-foreground">{issue.resolution.rejection_reason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
