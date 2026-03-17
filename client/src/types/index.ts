// User roles
export type UserRole = 'user' | 'staff' | 'admin';

// Issue categories matching backend
export type IssueCategory = 
  | 'garbage_overflow'
  | 'pothole'
  | 'water_stagnation'
  | 'street_light_failure'
  | 'hospital_infrastructure'
  | 'other';

// Issue status
export type IssueStatus = 
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'verified'
  | 'rejected'
  | 'fake';

// Priority level derived from score
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  department?: string;
  trust_score?: number;
  created_at: string;
  avatar_url?: string;
}

// Issue interface matching backend API
export interface Issue {
  id: string;
  user_id: string;
  category: IssueCategory;
  description?: string;
  summary: string;
  image_url: string;
  latitude: number;
  longitude: number;
  place: string;
  status: IssueStatus;
  priority_score: number;
  time_escalation: number;
  confidence?: number;
  vote_count: number;
  has_voted?: boolean;
  is_own_issue?: boolean;
  assigned_department?: string;
  created_at: string;
  updated_at: string;
  resolution?: Resolution;
  fake_flag?: FakeFlag;
}

// Resolution submitted by staff
export interface Resolution {
  id: string;
  issue_id: string;
  staff_id: string;
  proof_image_url: string;
  notes?: string;
  resolved_at: string;
  verified_at?: string;
  verified_by?: string;
  rejected_at?: string;
  rejected_by?: string;
  rejection_reason?: string;
}

// Fake flag by staff
export interface FakeFlag {
  id: string;
  issue_id: string;
  flagged_by: string;
  reason: string;
  confirmed?: boolean;
  confirmed_by?: string;
  confirmed_at?: string;
}

// Notification
export interface Notification {
  id: string;
  user_id: string;
  type: 'status_update' | 'resolution' | 'vote' | 'assignment' | 'verification';
  title: string;
  message: string;
  issue_id?: string;
  read: boolean;
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// Analytics data for admin
export interface AnalyticsData {
  total_issues: number;
  resolved_issues: number;
  pending_issues: number;
  fake_reports: number;
  high_priority_count: number;
  issues_by_category: Record<IssueCategory, number>;
  issues_by_status: Record<IssueStatus, number>;
  resolution_rate: number;
  avg_resolution_time: number;
}

// Filter options
export interface IssueFilters {
  status?: IssueStatus[];
  category?: IssueCategory[];
  priority_min?: number;
  priority_max?: number;
  date_from?: string;
  date_to?: string;
  department?: string;
}

// Map bounds for API requests
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

// Geolocation
export interface GeoLocation {
  latitude: number;
  longitude: number;
  place?: string;
}

// Report issue form data
export interface ReportIssueData {
  image: File;
  description?: string;
  latitude: number;
  longitude: number;
}

// Resolve issue form data  
export interface ResolveIssueData {
  proof_image: File;
  notes?: string;
  flag_as_fake?: boolean;
  fake_reason?: string;
}

// Helper function to get priority level from score
export function getPriorityLevel(score: number): PriorityLevel {
  if (score < 40) return 'low';
  if (score < 60) return 'medium';
  if (score < 80) return 'high';
  return 'critical';
}

// Helper function to get category display name
export function getCategoryDisplayName(category: IssueCategory): string {
  const names: Record<IssueCategory, string> = {
    garbage_overflow: 'Garbage Overflow',
    pothole: 'Pothole',
    water_stagnation: 'Water Stagnation',
    street_light_failure: 'Street Light Failure',
    hospital_infrastructure: 'Hospital Infrastructure',
    other: 'Other',
  };
  return names[category];
}

// Helper function to get status display name
export function getStatusDisplayName(status: IssueStatus): string {
  const names: Record<IssueStatus, string> = {
    pending: 'Pending',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    verified: 'Verified',
    rejected: 'Rejected',
    fake: 'Fake Report',
  };
  return names[status];
}
