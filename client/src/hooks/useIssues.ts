import { useQuery } from '@tanstack/react-query';
import { getIssues } from '@/services/issue.service';

export function useIssues() {
  return useQuery({
    queryKey: ['issues'],
    queryFn: getIssues,
  });
}
