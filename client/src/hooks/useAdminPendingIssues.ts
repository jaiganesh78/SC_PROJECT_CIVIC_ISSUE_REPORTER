import { useQuery } from '@tanstack/react-query';
import { getPendingVerificationIssues } from '@/services/admin.service';

export function useAdminPendingIssues() {
  return useQuery({
    queryKey: ['admin-pending-issues'],
    queryFn: getPendingVerificationIssues,
  });
}
