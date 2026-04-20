import { useQuery } from '@tanstack/react-query';
import { getIssues } from '@/services/issue.service';
import { adaptIssue } from '@/adapters/issue.adapter';
import { useEffect } from 'react';
import { socket } from '@/lib/socket';
import { useQueryClient } from '@tanstack/react-query';
export function useIssues() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['issues'],
    queryFn: async () => {
      const data = await getIssues();
      return data.map((issue: any) => adaptIssue(issue));
    },
  });

  // 🔥 REAL-TIME LISTENER
  useEffect(() => {
  // 🔼 VOTE UPDATE
  socket.on("vote_updated", (data) => {
    queryClient.setQueryData(['issues'], (old: any) => {
      if (!old) return old;

      return old.map((issue: any) =>
        issue.id === data.issueId
          ? {
              ...issue,
              vote_count: data.totalVotes,
              priority_score: data.priority,
            }
          : issue
      );
    });
  });
  

  // 🆕 NEW ISSUE
  socket.on("issue_created", (newIssueRaw) => {
    const newIssue = adaptIssue(newIssueRaw);

    queryClient.setQueryData(['issues'], (old: any) => {
      if (!old) return [newIssue];

      return [newIssue, ...old];
    });
  });

  // 🔄 STATUS UPDATE
  socket.on("issue_updated", (data) => {
    queryClient.setQueryData(['issues'], (old: any) => {
      if (!old) return old;

      return old.map((issue: any) =>
        issue.id === data.issueId
          ? {
              ...issue,
              status: data.status,
              resolved_at: data.resolved_at || issue.resolved_at,
            }
          : issue
      );
    });
  });
  socket.on("issue_deleted", (data) => {
  queryClient.setQueryData(['issues'], (old: any) => {
    if (!old) return old;
    return old.filter((issue: any) => issue.id !== data.issueId);
  });
});

  return () => {
    socket.off("vote_updated");
    socket.off("issue_created");
    socket.off("issue_updated");
    socket.off("issue_deleted");
  };
}, [queryClient]);

  return query;
}