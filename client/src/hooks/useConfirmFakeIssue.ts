import { useMutation, useQueryClient } from '@tanstack/react-query';
import { confirmFakeIssue } from '@/services/admin.service';

export function useConfirmFakeIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (issueId: string) => confirmFakeIssue(issueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-issues'] });
    },
  });
}
