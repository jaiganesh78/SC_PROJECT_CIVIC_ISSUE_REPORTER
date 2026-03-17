import { useMutation, useQueryClient } from '@tanstack/react-query';
import { voteOnIssue } from '@/services/issue.service';

export function useVoteIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (issueId: string) => voteOnIssue(issueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });
}
