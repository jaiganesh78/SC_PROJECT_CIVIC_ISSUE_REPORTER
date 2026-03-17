const Issue = require("../../models/Issue.model");

/**
 * Close duplicate issues when the original issue is resolved
 */
async function closeDuplicateIssues(issueId) {

  const duplicates = await Issue.find({
    forced_against_issue_id: issueId,
    status: { $nin: ["closed", "fake"] }
  });

  if (!duplicates.length) return 0;

  for (const dup of duplicates) {
    dup.status = "closed";
    dup.resolved_at = new Date();
    dup.admin_reject_reason =
      "Closed automatically (duplicate of resolved issue)";
    await dup.save();
  }

  return duplicates.length;
}

module.exports = { closeDuplicateIssues };