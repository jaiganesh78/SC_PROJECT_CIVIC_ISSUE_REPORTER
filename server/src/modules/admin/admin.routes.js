const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const adminMiddleware = require("../../middleware/admin.middleware");

const {
  getPendingVerificationIssues,
  approveIssueResolution,
  rejectIssueResolution,
  updateIssuePriority,
  updateIssueDepartment,
  deleteIssue,
} = require("./admin.issue.controller");

const router = express.Router();

// ✅ Test
router.get("/dashboard", authMiddleware, adminMiddleware, (req, res) => {
  return res.status(200).json({
    message: "Welcome Admin ✅",
    admin: req.user,
  });
});

// ===============================
// 🔥 EXISTING
// ===============================
router.get("/issues/pending", authMiddleware, adminMiddleware, getPendingVerificationIssues);
router.patch("/issues/:id/approve", authMiddleware, adminMiddleware, approveIssueResolution);
router.patch("/issues/:id/reject", authMiddleware, adminMiddleware, rejectIssueResolution);

// ===============================
// 🔥 NEW (THIS FIXES YOUR 404)
// ===============================
router.patch("/issues/:id/priority", authMiddleware, adminMiddleware, updateIssuePriority);

router.patch("/issues/:id/department", authMiddleware, adminMiddleware, updateIssueDepartment);

router.delete("/issues/:id", authMiddleware, adminMiddleware, deleteIssue);

module.exports = router;