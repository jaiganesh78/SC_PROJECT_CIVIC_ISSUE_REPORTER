const Issue = require("../../models/Issue.model");

/**
 * STAFF: Get issues assigned to staff's department
 */
const getAssignedIssuesForStaff = async (req, res) => {
  try {
    const staff = req.user;

    if (!staff.department_name) {
      return res.status(400).json({
        message: "Staff department not configured",
      });
    }

    const issues = await Issue.find({
      assigned_department_name: staff.department_name,
      status: { $in: ["assigned", "assigned_auto"] },
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: issues.length,
      issues,
    });
  } catch (error) {
    console.error("GET STAFF ISSUES ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch assigned issues",
    });
  }
};

/**
 * STAFF: Resolve an issue with mandatory proof
 */
const resolveIssue = async (req, res) => {
  try {
    const issueId = req.params.id;
    const staff = req.user;

    const { is_fake, fake_reason } = req.body;

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // 🔒 Ensure issue belongs to staff's department
    if (
      issue.assigned_department_name !== staff.department_name
    ) {
      return res.status(403).json({
        message: "You are not authorized to resolve this issue",
      });
    }

    // 🔒 Ensure valid status
    if (
      issue.status !== "assigned" &&
      issue.status !== "assigned_auto"
    ) {
      return res.status(400).json({
        message: "Issue is not in a resolvable state",
      });
    }

    // 🔒 Proof image is mandatory
    if (!req.file?.path) {
      return res.status(400).json({
        message: "Resolution proof image is required",
      });
    }

    issue.resolution_proof_image = req.file.path;
    issue.resolved_by = staff.userId;
    issue.resolved_at = new Date();
    issue.status = "resolved_pending_verification";
    issue.timeline.push({
  status: "resolved_pending_verification",
  at: new Date()
});
    // Optional fake flag (staff opinion only)
    if (is_fake === "true") {
      issue.staff_flagged_fake = true;
      issue.staff_fake_reason = fake_reason || "No reason provided";
    }

    await issue.save();
    const io = req.app.get("io");

io.emit("issue_updated", {
  issueId: issue._id,
  status: issue.status,
  timeline: issue.timeline,
  priority_score: issue.priority_score,
});
const admin = await User.findOne({ role: "admin" });
const reporter = await User.findById(issue.user_id);

// ADMIN
notify({
  type: "ADMIN_ISSUE_RESOLVED",
  user: admin,
  issue,
});

// USER
notify({
  type: "USER_ISSUE_RESOLVED",
  user: reporter,
  issue,
});

    return res.status(200).json({
      message: "Issue resolved and sent for admin verification",
      issue,
    });
  } catch (error) {
    console.error("STAFF RESOLVE ISSUE ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAssignedIssuesForStaff,
  resolveIssue,
};
