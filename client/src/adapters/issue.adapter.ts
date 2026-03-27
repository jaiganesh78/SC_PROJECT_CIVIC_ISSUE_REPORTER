import { Issue } from '@/types';

const BASE_URL = 'http://localhost:5000';

export function adaptIssue(raw: any, currentUserId?: string): Issue {  return {
    id: raw._id,

    user_id: raw.user_id,

    category: raw.category,
    description: raw.description || '',

    // 🔥 SUMMARY (backend sends separately sometimes)
    summary: raw.summary || raw.description || 'No summary',

    // 🔥 IMAGE FIX (CRITICAL)
    image_url: raw.issue_image
      ? `${BASE_URL}/${raw.issue_image.replace(/\\/g, '/')}`
      : '',

    latitude: raw.latitude,
    longitude: raw.longitude,

    // 🔥 LOCATION FIX (REAL FIX)
    place:
      raw.place?.formatted ||
      [raw.place?.area, raw.place?.city, raw.place?.state]
        .filter(Boolean)
        .join(', ') ||
      'Location unavailable',

    // 🔥 STATUS NORMALIZATION
    status: normalizeStatus(raw.status),

    priority_score: raw.priority_score,
    time_escalation: raw.time_escalation || 0,

    confidence: raw.ai_confidence,

    // TEMP (next step we fix backend)
    vote_count: raw.vote_count || 0,
has_voted: raw.has_voted || false,
    is_own_issue: raw.user_id === currentUserId,

    assigned_department: raw.assigned_department_name || null,

    // 🔥 DATE FIX (THIS CAUSED "invalid time")
    created_at: raw.createdAt,
    updated_at: raw.updatedAt,

    resolution: raw.resolution_proof_image
      ? {
          id: '',
          issue_id: raw._id,
          staff_id: '',
          proof_image_url: `${BASE_URL}/${raw.resolution_proof_image}`,
          resolved_at: raw.resolved_at,
        }
      : undefined,

    fake_flag: undefined,
  };
}

function normalizeStatus(status: string): Issue['status'] {
  const map: Record<string, Issue['status']> = {
    open: 'pending',
    assigned_auto: 'assigned',
    resolved_pending_verification: 'resolved',
    closed: 'verified',
  };

  return map[status] || (status as Issue['status']);
}