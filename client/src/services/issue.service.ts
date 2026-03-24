import api from './api';

export async function getIssues() {
  const response = await api.get('/issues');
  return response.data.issues;
}

export async function getIssueById(issueId: string) {
  const response = await api.get(`/issues/${issueId}`);
  return response.data;
}

export interface CreateIssueData {
  description: string;
  latitude: number;
  longitude: number;
  image: File;
  force_duplicate?: boolean;
  forced_against_issue_id?: string;
}
export interface DuplicateIssue {
  issue_id: string;
  distance_meters: number;
  status: string;
  created_at: string;
}

export interface CreateIssueDuplicateResponse {
  duplicateDetected: true;
  duplicates: DuplicateIssue[];
  summary: string;
  category: string;
  place: any;
}

export interface CreateIssueSuccessResponse {
  duplicateDetected: false;
  issue: any;
  summary: string;
  place: any;
}

export type CreateIssueResponse =
  | CreateIssueDuplicateResponse
  | CreateIssueSuccessResponse;

export async function createIssue(
  data: CreateIssueData
): Promise<CreateIssueResponse> {

  const formData = new FormData();
  formData.append("description", data.description);
  formData.append("latitude", String(data.latitude));
  formData.append("longitude", String(data.longitude));
  formData.append("image", data.image);

  if (data.force_duplicate) {
    formData.append("force_duplicate", "true");
  }

  if (data.forced_against_issue_id) {
    formData.append("forced_against_issue_id", data.forced_against_issue_id);
  }

  const response = await api.post("/issues", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const responseData = response.data;

  if (responseData?.possible_duplicates) {
    return {
      duplicateDetected: true,
      duplicates: responseData.possible_duplicates,
      summary: responseData.summary,
      category: responseData.category,
      place: responseData.place,
    };
  }

  return {
    duplicateDetected: false,
    issue: responseData.issue,
    summary: responseData.summary,
    place: responseData.place,
  };
}
export async function voteOnIssue(issueId: string) {
  const response = await api.post(`/issues/${issueId}/vote`,{});
  return response.data;
}
export async function getMyIssues() {
  const response = await api.get('/issues/me');
  return response.data.issues;
}