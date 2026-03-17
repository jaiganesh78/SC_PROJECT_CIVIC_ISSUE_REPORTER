import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createIssue, CreateIssueData } from '@/services/issue.service';

export function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIssueData) => createIssue(data),
    onSuccess: (data) => {
  if (!data?.duplicateDetected) {
    queryClient.invalidateQueries({ queryKey: ['issues'] });
  }
},
  });
}
