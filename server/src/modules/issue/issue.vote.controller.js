const Issue = require("../../models/Issue.model");
const Vote = require("../../models/Vote.model");

/**
 * USER: Vote on an issue
 * Priority increases using log-based formula
 */
const voteOnIssue = async (req, res) => {
  try {
    const issueId = req.params.id;
    const userId = req.user.userId;

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // 🔒 Cannot vote on own issue
    if (issue.user_id.toString() === userId) {
      return res
        .status(400)
        .json({ message: "You cannot vote on your own issue" });
    }

    // 🔒 Voting allowed only on active issues
    if (["closed", "fake"].includes(issue.status)) {
      return res
        .status(400)
        .json({ message: "Voting not allowed on this issue" });
    }

    // 🔒 Register vote (unique index enforces one vote)
    await Vote.create({
      issue_id: issueId,
      user_id: userId,
    });

    // ===============================
    // 🔥 PRIORITY RECALCULATION
    // ===============================

    const totalVotes = await Vote.countDocuments({
      issue_id: issueId,
    });

    // log-based boost
    const voteBoost = Math.log2(totalVotes + 1) * 10;

    // base priority should already be from AI
    const basePriority = issue.priority_score_base || issue.priority_score;

    const newPriority = Math.round(basePriority + voteBoost);

    issue.priority_score = newPriority;
    await issue.save();

    return res.status(200).json({
      message: "Vote registered",
      total_votes: totalVotes,
      updated_priority: issue.priority_score,
    });
  } catch (error) {
    // 🛑 Duplicate vote
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already voted on this issue" });
    }

    console.error("VOTE ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { voteOnIssue };
