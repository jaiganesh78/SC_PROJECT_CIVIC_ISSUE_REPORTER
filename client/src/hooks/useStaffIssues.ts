import { useQuery } from '@tanstack/react-query';
import { getAssignedIssues } from '@/services/staff.service';

export function useStaffIssues() {
  return useQuery({
    queryKey: ['staff-issues'],
    queryFn: getAssignedIssues,
  });
}
