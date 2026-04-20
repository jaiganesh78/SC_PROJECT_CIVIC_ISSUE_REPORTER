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
export async function getFakeIssues() {
  const response = await api.get('/admin/issues/fake');
  return response.data;
}
export async function updateIssuePriority(issueId: string, priority: number) {
  const res = await api.patch(`/admin/issues/${issueId}/priority`, {
    priority_score: priority,
  });
  return res.data;
}

export async function updateIssueDepartment(issueId: string, department: string) {
  const res = await api.patch(`/admin/issues/${issueId}/department`, {
    department_name: department,
  });
  return res.data;
}

export async function deleteIssue(issueId: string) {
  const res = await api.delete(`/admin/issues/${issueId}`);
  return res.data;
}
