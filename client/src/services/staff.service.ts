import api from './api';

export async function getAssignedIssues() {
  const response = await api.get('/staff/issues');
  return response.data;
}

export async function resolveIssue(issueId: string, proofImage: File) {
  const formData = new FormData();
  formData.append('proof_image', proofImage);

  const response = await api.patch(`/staff/issues/${issueId}/resolve`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}
