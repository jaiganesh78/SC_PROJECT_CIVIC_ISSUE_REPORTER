import api from './api';

export async function getPendingVerificationIssues() {
  const response = await api.get('/admin/issues/pending');
  return response.data;
}

export async function approveIssue(issueId: string) {
  const response = await api.patch(`/admin/issues/${issueId}/approve`);
  return response.data;
}

export async function rejectIssue(issueId: string, reason: string) {
  const response = await api.patch(`/admin/issues/${issueId}/reject`, { reason });
  return response.data;
}

export async function confirmFakeIssue(issueId: string) {
  const response = await api.patch(`/admin/issues/${issueId}/confirm-fake`);
  return response.data;
}
