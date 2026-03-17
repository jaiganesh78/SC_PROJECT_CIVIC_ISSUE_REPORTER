import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Clock,
  User,
  Flag,
  ShieldAlert
} from 'lucide-react';
import { demoIssues } from '@/data/demoIssues';
import { getCategoryDisplayName, Issue } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Demo fake flagged issues
const fakeFlaggedIssues = [
  {
    ...demoIssues[0],
    id: 'fake-1',
    fake_flag: {
      reason: 'The location shown in the image does not match the GPS coordinates provided.',
      flagged_by_name: 'Sarah Staff',
    },
  },
  {
    ...demoIssues[2],
    id: 'fake-2',
    fake_flag: {
      reason: 'This appears to be an old image from 2 years ago.',
      flagged_by_name: 'Mike Johnson',
    },
  },
];

export default function AdminFakeReportsPage() {
  const { toast } = useToast();

  const handleConfirmFake = (issue: typeof fakeFlaggedIssues[0]) => {
    toast({
      title: 'Report marked as fake',
      description: 'User trust score has been adjusted accordingly.',
    });
  };

  const handleDismissFlag = (issue: typeof fakeFlaggedIssues[0]) => {
    toast({
      title: 'Flag dismissed',
      description: 'The issue has been returned to normal processing.',
    });
  };

  return (
    <MainLayout requireAuth allowedRoles={['admin']}>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Fake Reports Review</h1>
          <p className="mt-1 text-muted-foreground">
            Review staff-flagged issues and take action on potential fake reports
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-pending/10">
                <Flag className="h-6 w-6 text-status-pending" />
              </div>
              <div>
                <p className="text-2xl font-bold">{fakeFlaggedIssues.length}</p>
                <p className="text-sm text-muted-foreground">Flagged for Review</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-fake/10">
                <ShieldAlert className="h-6 w-6 text-status-fake" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Confirmed Fake (Month)</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-verified/10">
                <CheckCircle2 className="h-6 w-6 text-status-verified" />
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">Flags Dismissed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Flagged issues */}
        <div className="space-y-4">
          {fakeFlaggedIssues.length > 0 ? (
            fakeFlaggedIssues.map((issue) => (
              <Card key={issue.id} className="overflow-hidden">
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
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant="destructive" className="gap-1">
                        <Flag className="h-3 w-3" />
                        Flagged as Fake
                      </Badge>
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
                        <span>{formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>

                    {/* Flag reason */}
                    <div className="mb-4 rounded-lg bg-destructive/5 border border-destructive/20 p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Flagged by:</span>
                        <span>{issue.fake_flag.flagged_by_name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Reason:</span> {issue.fake_flag.reason}
                      </p>
                    </div>

                    {/* User trust score indicator */}
                    <div className="mb-4 flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Reporter trust score:</span>
                      <span className="font-semibold text-status-pending">72/100</span>
                      <span className="text-xs text-muted-foreground">(2 previous flags)</span>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleConfirmFake(issue)}
                      >
                        <ShieldAlert className="mr-1.5 h-4 w-4" />
                        Confirm as Fake
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDismissFlag(issue)}
                      >
                        <CheckCircle2 className="mr-1.5 h-4 w-4" />
                        Dismiss Flag
                      </Button>
                      <Button variant="ghost" size="sm">
                        View Full History
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No flagged reports</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  All clear! No issues have been flagged as potentially fake.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
