import { useQuery } from '@tanstack/react-query';
import { getIssues } from '@/services/issue.service';
import { adaptIssue } from '@/adapters/issue.adapter';

export function useIssues() {
  return useQuery({
    queryKey: ['issues'],
    queryFn: async () => {
      const data = await getIssues();

      return data.map((issue: any) => adaptIssue(issue));
    },
  });
}