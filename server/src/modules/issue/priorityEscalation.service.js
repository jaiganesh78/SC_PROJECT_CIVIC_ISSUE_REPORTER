/**
 * Calculate time-based priority escalation
 * +2 per day unresolved, capped at +30
 */
const calculateTimeEscalation = (issue) => {
  const ACTIVE_STATUSES = ["open", "assigned", "assigned_auto"];

  if (!ACTIVE_STATUSES.includes(issue.status)) {
    return 0;
  }

  const createdAt = new Date(issue.createdAt);
  const now = new Date();

  const diffMs = now - createdAt;
  const daysUnresolved = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const escalation = Math.min(daysUnresolved * 2, 30);

  return escalation;
};

module.exports = { calculateTimeEscalation };
