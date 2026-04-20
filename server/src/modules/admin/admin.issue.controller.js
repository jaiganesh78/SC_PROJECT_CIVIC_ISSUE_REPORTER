const Issue = require("../../models/Issue.model");
const User = require("../../models/User.model");
const { notify } = require("../../services/notification.service");
const { closeDuplicateIssues } =
  require("../issue/duplicateResolution.service");
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
    issue.timeline.push({
  status: "closed",
  at: new Date()
});
    issue.resolved_at = new Date();
    await issue.save();
const closedDuplicates = await closeDuplicateIssues(issue._id);
    const reporter = await User.findById(issue.user_id);

    // 🔔 Notify USER
    notify({
      type: "USER_ISSUE_VERIFIED",
      user: reporter,
      issue,
    });
   const io = req.app.get("io");

io.emit("issue_updated", {
  issueId: issue._id,
  status: issue.status,
  resolved_at: issue.resolved_at,
  timeline: issue.timeline,
  priority_score: issue.priority_score,
});
    return res.status(200).json({
      message: "Issue verified and closed",
      duplicates_closed: closedDuplicates,
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
    issue.timeline.push({
  status: "assigned",
  at: new Date()
});
    issue.admin_reject_reason = reason || "Rejected by admin";
    await issue.save();

    const reporter = await User.findById(issue.user_id);

    // 🔔 Notify USER
    notify({
      type: "USER_ISSUE_REJECTED",
      user: reporter,
      issue,
    });
const io = req.app.get("io");

io.emit("issue_updated", {
  issueId: issue._id,
  status: issue.status,
  timeline: issue.timeline,
  priority_score: issue.priority_score,
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
// 🔥 CHANGE PRIORITY
const updateIssuePriority = async (req, res) => {
  try {
    const { priority_score } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    issue.priority_score = priority_score;

    await issue.save();

    const io = req.app.get("io");
    io.emit("issue_updated", {
      issueId: issue._id,
      status: issue.status,
      timeline: issue.timeline,
      priority_score: issue.priority_score,
    });

    res.json({ message: "Priority updated", issue });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔥 CHANGE DEPARTMENT
const updateIssueDepartment = async (req, res) => {
  try {
    const { department_name } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    issue.assigned_department_name = department_name;
    issue.status = "assigned";

    issue.timeline.push({
      status: "assigned",
      at: new Date(),
    });

    await issue.save();

    const io = req.app.get("io");
    io.emit("issue_updated", {
      issueId: issue._id,
      status: issue.status,
      timeline: issue.timeline,
      priority_score: issue.priority_score,
    });

    res.json({ message: "Department updated", issue });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔥 DELETE ISSUE
const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);

    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const io = req.app.get("io");
    io.emit("issue_deleted", { issueId: req.params.id });

    res.json({ message: "Issue deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getPendingVerificationIssues,
  approveIssueResolution,
  rejectIssueResolution,
  updateIssuePriority,
  updateIssueDepartment,
  deleteIssue,
};
