import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useIssues } from '@/hooks/useIssues';
import { IssueCard } from '@/components/issues/IssueCard';
import { IssueDetailModal } from '@/components/issues/IssueDetailModal';
import { Issue } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { updateIssuePriority, updateIssueDepartment, deleteIssue } from '@/services/admin.service';
const FILTERS = ['all', 'high', 'pending', 'assigned', 'fake'];

export default function AdminIssueFeedPage() {
  const { data: issues = [], isLoading } = useIssues();

  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [actionType, setActionType] = useState<string | null>(null);
const [actionIssue, setActionIssue] = useState<Issue | null>(null);
const [inputValue, setInputValue] = useState('');
  const filteredIssues = useMemo(() => {
    switch (activeFilter) {
      case 'high':
        return issues.filter(i => i.priority_score > 70);
      case 'pending':
        return issues.filter(i => i.status === 'pending');
      case 'assigned':
        return issues.filter(i => i.status === 'assigned');
      case 'fake':
        return issues.filter(i => i.status === 'fake');
      default:
        return issues;
    }
  }, [issues, activeFilter]);
 const handleAdminAction = (action: string, issue: Issue) => {
  setActionType(action);
  setActionIssue(issue);
};
  const handleViewDetails = (issue: Issue) => {
    setSelectedIssue(issue);
    setModalOpen(true);
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <MainLayout requireAuth allowedRoles={['admin']}>
      <div className="p-6 lg:p-8">

        {/* 🔥 HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Issue Feed</h1>
          <p className="text-muted-foreground">
            Monitor and manage all reported issues
          </p>
        </div>

        {/* 🔥 FILTER BAR */}
        <div className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map(filter => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setActiveFilter(filter)}
            >
              {filter.toUpperCase()}
            </Button>
          ))}
        </div>

        {/* 🔥 ISSUE LIST */}
        <div className="space-y-4">
          {filteredIssues.map(issue => (
            <div key={issue.id} className="relative">

              {/* 🔥 ISSUE CARD */}
              <IssueCard
                issue={issue}
                onViewDetails={handleViewDetails}
                isAdmin
                onAdminAction={handleAdminAction}
              />

              {/* 🔥 3 DOT MENU */}
              

            </div>
          ))}
        </div>

        {/* 🔥 MODAL */}
        <IssueDetailModal
          issue={selectedIssue}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
        <Dialog open={!!actionType} onOpenChange={() => setActionType(null)}>
  <DialogContent>

    <DialogHeader>
      <DialogTitle>
        {actionType === "priority" && "Change Priority"}
        {actionType === "department" && "Change Department"}
        {actionType === "delete" && "Delete Issue"}
      </DialogTitle>
    </DialogHeader>

    {/* 🔥 PRIORITY */}
    {actionType === "priority" && (
      <div className="space-y-4">
        <input
          type="number"
          placeholder="Enter priority (0-100)"
          className="w-full border p-2 rounded"
          onChange={(e) => setInputValue(e.target.value)}
        />

        <Button
          onClick={async () => {
            if (!actionIssue) return;

            await updateIssuePriority(actionIssue.id, Number(inputValue));
            setActionType(null);
          }}
        >
          Update Priority
        </Button>
      </div>
    )}

    {/* 🔥 DEPARTMENT */}
    {actionType === "department" && (
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter department name"
          className="w-full border p-2 rounded"
          onChange={(e) => setInputValue(e.target.value)}
        />

        <Button
          onClick={async () => {
            if (!actionIssue) return;

            await updateIssueDepartment(actionIssue.id, inputValue);
            setActionType(null);
          }}
        >
          Update Department
        </Button>
      </div>
    )}

    {/* 🔥 DELETE */}
    {actionType === "delete" && (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete this issue?
        </p>

        <Button
          variant="destructive"
          onClick={async () => {
            if (!actionIssue) return;

            await deleteIssue(actionIssue.id);
            setActionType(null);
          }}
        >
          Confirm Delete
        </Button>
      </div>
    )}

  </DialogContent>
</Dialog>

      </div>
    </MainLayout>
  );
}