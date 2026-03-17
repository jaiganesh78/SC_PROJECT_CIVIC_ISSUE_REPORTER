import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveIssue } from '@/services/staff.service';

export function useResolveIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ issueId, proofImage }: { issueId: string; proofImage: File }) =>
      resolveIssue(issueId, proofImage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-issues'] });
    },
  });
}
