import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rejectIssue } from '@/services/admin.service';

export function useRejectIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ issueId, reason }: { issueId: string; reason: string }) =>
      rejectIssue(issueId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-issues'] });
    },
  });
}
