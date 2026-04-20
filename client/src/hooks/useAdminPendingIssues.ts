import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPendingVerificationIssues } from '@/services/admin.service';
import { adaptIssue } from '@/adapters/issue.adapter';
import { useEffect } from 'react';
import { socket } from '@/lib/socket';

export function useAdminPendingIssues() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin-pending-issues'],
    queryFn: async () => {
      const data = await getPendingVerificationIssues();

      return {
        ...data,
        issues: data.issues.map((i: any) => adaptIssue(i)),
      };
    },
  });

  // 🔥 REAL-TIME LISTENER
  useEffect(() => {
    socket.on('issue_updated', (data) => {
      queryClient.setQueryData(['admin-pending-issues'], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          issues: old.issues.map((issue: any) =>
            issue.id === data.issueId
              ? {
                  ...issue,
                  status: data.status,
                  resolved_at: data.resolved_at || issue.resolved_at,
                }
              : issue
          ),
        };
      });
    });

    return () => {
      socket.off('issue_updated');
    };
  }, [queryClient]);

  return query;
}