import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveIssue } from '@/services/admin.service';

export function useApproveIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (issueId: string) => approveIssue(issueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-issues'] });
    },
  });
}
