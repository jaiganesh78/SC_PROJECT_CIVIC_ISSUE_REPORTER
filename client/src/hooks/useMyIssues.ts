import { useQuery } from '@tanstack/react-query';
import { getMyIssues } from '@/services/issue.service';
import { adaptIssue } from '@/adapters/issue.adapter';

export function useMyIssues() {
  return useQuery({
    queryKey: ['my-issues'],
    queryFn: async () => {
      const data = await getMyIssues();
      return data.map((i: any) => adaptIssue(i));
    },
  });
}