import { Issue, IssueCategory, IssueStatus } from '@/types';

// Demo issues for development/preview
export const demoIssues: Issue[] = [
  {
    id: '1',
    user_id: '1',
    category: 'garbage_overflow',
    description: 'Large pile of garbage accumulated near the main road junction. Has been here for over a week.',
    summary: 'Garbage overflow at MG Road junction causing health hazards',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
    latitude: 12.9716,
    longitude: 77.5946,
    place: 'MG Road, Bangalore',
    status: 'pending',
    priority_score: 72,
    time_escalation: 1.2,
    confidence: 0.89,
    vote_count: 24,
    has_voted: false,
    is_own_issue: false,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: '2',
    category: 'pothole',
    description: 'Deep pothole on the main highway causing accidents',
    summary: 'Dangerous pothole on NH-44 near toll plaza',
    image_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400',
    latitude: 12.9352,
    longitude: 77.6245,
    place: 'NH-44 Toll Plaza, Bangalore',
    status: 'assigned',
    priority_score: 85,
    time_escalation: 1.5,
    confidence: 0.95,
    vote_count: 56,
    has_voted: true,
    is_own_issue: false,
    assigned_department: 'Public Works',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: '1',
    category: 'water_stagnation',
    description: 'Rainwater logging creating mosquito breeding ground',
    summary: 'Severe water stagnation in residential area',
    image_url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400',
    latitude: 13.0358,
    longitude: 77.5970,
    place: 'Hebbal, Bangalore',
    status: 'in_progress',
    priority_score: 68,
    time_escalation: 1.1,
    confidence: 0.82,
    vote_count: 18,
    has_voted: false,
    is_own_issue: true,
    assigned_department: 'Water Department',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    user_id: '3',
    category: 'street_light_failure',
    description: 'Multiple street lights not working in this stretch',
    summary: 'Street lights out on Residency Road',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    latitude: 12.9698,
    longitude: 77.6067,
    place: 'Residency Road, Bangalore',
    status: 'resolved',
    priority_score: 45,
    time_escalation: 1.0,
    confidence: 0.91,
    vote_count: 12,
    has_voted: false,
    is_own_issue: false,
    assigned_department: 'Electricity Board',
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    resolution: {
      id: 'r1',
      issue_id: '4',
      staff_id: '2',
      proof_image_url: 'https://images.unsplash.com/photo-1573108037329-37aa135a142e?w=400',
      notes: 'Replaced 4 faulty bulbs and repaired wiring',
      resolved_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: '5',
    user_id: '4',
    category: 'hospital_infrastructure',
    description: 'Broken ramp for wheelchair access at government hospital',
    summary: 'Wheelchair ramp damaged at City Hospital',
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
    latitude: 12.9850,
    longitude: 77.5533,
    place: 'City Hospital, Rajajinagar',
    status: 'verified',
    priority_score: 78,
    time_escalation: 1.3,
    confidence: 0.88,
    vote_count: 34,
    has_voted: true,
    is_own_issue: false,
    assigned_department: 'Health Department',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    resolution: {
      id: 'r2',
      issue_id: '5',
      staff_id: '2',
      proof_image_url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400',
      notes: 'Ramp completely reconstructed with proper slope',
      resolved_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      verified_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      verified_by: '3',
    },
  },
  {
    id: '6',
    user_id: '5',
    category: 'garbage_overflow',
    description: 'Open dumping of waste near school premises',
    summary: 'Illegal dumping near Government School',
    image_url: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=400',
    latitude: 12.9165,
    longitude: 77.6101,
    place: 'Koramangala, Bangalore',
    status: 'pending',
    priority_score: 91,
    time_escalation: 1.8,
    confidence: 0.94,
    vote_count: 89,
    has_voted: false,
    is_own_issue: false,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    user_id: '6',
    category: 'pothole',
    description: 'Series of potholes making road impassable',
    summary: 'Multiple potholes on 80 Feet Road',
    image_url: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400',
    latitude: 12.9279,
    longitude: 77.6271,
    place: '80 Feet Road, Indiranagar',
    status: 'assigned',
    priority_score: 65,
    time_escalation: 1.0,
    confidence: 0.87,
    vote_count: 31,
    has_voted: false,
    is_own_issue: false,
    assigned_department: 'Public Works',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '8',
    user_id: '7',
    category: 'water_stagnation',
    description: 'Blocked drainage causing flooding during rains',
    summary: 'Drainage blockage in residential complex',
    image_url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400',
    latitude: 13.0012,
    longitude: 77.5650,
    place: 'Malleshwaram, Bangalore',
    status: 'in_progress',
    priority_score: 58,
    time_escalation: 1.1,
    confidence: 0.79,
    vote_count: 15,
    has_voted: false,
    is_own_issue: false,
    assigned_department: 'Water Department',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Helper function to filter issues
export function filterIssues(issues: Issue[], filters: {
  status?: IssueStatus[];
  category?: IssueCategory[];
  priority_min?: number;
  priority_max?: number;
  department?: string;
  userId?: string;
}): Issue[] {
  return issues.filter(issue => {
    if (filters.status?.length && !filters.status.includes(issue.status)) {
      return false;
    }
    if (filters.category?.length && !filters.category.includes(issue.category)) {
      return false;
    }
    if (filters.priority_min !== undefined && issue.priority_score < filters.priority_min) {
      return false;
    }
    if (filters.priority_max !== undefined && issue.priority_score > filters.priority_max) {
      return false;
    }
    if (filters.department && issue.assigned_department !== filters.department) {
      return false;
    }
    if (filters.userId && issue.user_id !== filters.userId) {
      return false;
    }
    return true;
  });
}

// Sort issues by priority
export function sortIssuesByPriority(issues: Issue[], order: 'asc' | 'desc' = 'desc'): Issue[] {
  return [...issues].sort((a, b) => {
    return order === 'desc' 
      ? b.priority_score - a.priority_score 
      : a.priority_score - b.priority_score;
  });
}
