import { useQuery } from '@tanstack/react-query';
import { getIssueById } from '@/services/issue.service';

export function useIssue(issueId: string | undefined) {
  return useQuery({
    queryKey: ['issue', issueId],
    queryFn: () => getIssueById(issueId!),
    enabled: !!issueId,
  });
}
