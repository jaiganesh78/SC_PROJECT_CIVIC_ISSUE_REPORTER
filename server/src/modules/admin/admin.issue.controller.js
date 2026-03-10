const Issue = require("../../models/Issue.model");
const User = require("../../models/User.model");
const { notify } = require("../../services/notification.service");

/**
 * ADMIN: Get issues pending verification
 */
const getPendingVerificationIssues = async (req, res) => {
  try {
    const issues = await Issue.find({
      status: "resolved_pending_verification",
    }).sort({ resolved_at: -1 });

    return res.status(200).json({
      count: issues.length,
      issues,
    });
  } catch (error) {
    console.error("ADMIN FETCH PENDING ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADMIN: Approve resolved issue
 */
const approveIssueResolution = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (issue.status !== "resolved_pending_verification") {
      return res.status(400).json({
        message: "Issue is not pending verification",
      });
    }

    issue.status = "closed";
    await issue.save();

    const reporter = await User.findById(issue.user_id);

    // 🔔 Notify USER
    notify({
      type: "USER_ISSUE_VERIFIED",
      user: reporter,
      issue,
    });

    return res.status(200).json({
      message: "Issue verified and closed",
      issue,
    });
  } catch (error) {
    console.error("ADMIN APPROVE ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADMIN: Reject resolution (send back to staff)
 */
const rejectIssueResolution = async (req, res) => {
  try {
    const { reason } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (issue.status !== "resolved_pending_verification") {
      return res.status(400).json({
        message: "Issue is not pending verification",
      });
    }

    issue.status = "assigned";
    issue.admin_reject_reason = reason || "Rejected by admin";
    await issue.save();

    const reporter = await User.findById(issue.user_id);

    // 🔔 Notify USER
    notify({
      type: "USER_ISSUE_REJECTED",
      user: reporter,
      issue,
    });

    return res.status(200).json({
      message: "Issue rejected and sent back to staff",
      issue,
    });
  } catch (error) {
    console.error("ADMIN REJECT ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getPendingVerificationIssues,
  approveIssueResolution,
  rejectIssueResolution,
};
