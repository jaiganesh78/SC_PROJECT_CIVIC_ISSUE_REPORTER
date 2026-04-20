const Issue = require("../../models/Issue.model");
const User = require("../../models/User.model");
const {
  TRUST_BAN_THRESHOLD,
  TRUST_BAN_DAYS,
} = require("../../config/trustPolicy");
const { notify } = require("../../services/notification.service");

/**
 * ADMIN: Confirm issue as fake
 * - Marks issue as fake
 * - Penalizes user trust score
 * - Auto-bans user if below threshold
 * - Triggers notifications
 */
const confirmFakeIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (issue.admin_confirmed_fake) {
      return res.status(400).json({
        message: "Issue already confirmed as fake",
      });
    }

    // ===============================
    // 🚨 MARK ISSUE AS FAKE
    // ===============================
    issue.admin_confirmed_fake = true;
    issue.status = "fake";
    issue.timeline.push({
  status: "fake",
  at: new Date()
});
const io = req.app.get("io");

io.emit("issue_updated", {
  issueId: issue._id,
  status: issue.status,
  timeline: issue.timeline,
  priority_score: issue.priority_score,
});
    issue.fake_confirmed_by = req.user.userId;
    issue.fake_confirmed_at = new Date();

    await issue.save();

    // ===============================
    // 🔥 PENALIZE REPORTER
    // ===============================
    const user = await User.findById(issue.user_id);

    let userBanned = false;

    if (user) {
      // Reduce trust score
      user.trust_score = Math.max(0, user.trust_score - 20);

      // 🚫 AUTO-BAN IF BELOW THRESHOLD
      if (user.trust_score < TRUST_BAN_THRESHOLD) {
        user.is_banned = true;
        user.ban_until = new Date(
          Date.now() + TRUST_BAN_DAYS * 24 * 60 * 60 * 1000
        );
        userBanned = true;
      }

      await user.save();

      // ===============================
      // 🔔 NOTIFICATIONS
      // ===============================
      notify({
        type: "USER_ISSUE_FAKE",
        user,
        issue,
      });

      if (userBanned) {
        notify({
          type: "USER_BANNED",
          user,
          issue,
        });
      }
    }

    return res.status(200).json({
      message: "Issue confirmed as fake and user penalized",
      issue,
      updated_trust_score: user?.trust_score,
      user_banned: userBanned,
      ban_until: user?.ban_until || null,
    });
  } catch (error) {
    console.error("ADMIN CONFIRM FAKE ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
/**
 * ADMIN: Get fake flagged issues
 */
const getFakeIssues = async (req, res) => {
  try {
    const issues = await Issue.find({
      status: "fake",
    }).sort({ fake_confirmed_at: -1 });

    return res.status(200).json({
      count: issues.length,
      issues,
    });
  } catch (error) {
    console.error("ADMIN FETCH FAKE ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { confirmFakeIssue, getFakeIssues };


