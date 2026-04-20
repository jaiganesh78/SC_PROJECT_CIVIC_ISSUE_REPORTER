import { useQuery } from '@tanstack/react-query';
import { getFakeIssues } from '@/services/admin.service';
import { adaptIssue } from '@/adapters/issue.adapter';

export function useAdminFakeIssues() {
  return useQuery({
    queryKey: ['admin-fake-issues'],
    queryFn: async () => {
      const data = await getFakeIssues();

      return {
        ...data,
        issues: data.issues.map((i: any) => adaptIssue(i)),
      };
    },
  });
}