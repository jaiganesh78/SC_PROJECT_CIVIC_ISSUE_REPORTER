const express = require("express");
const router = express.Router();
const { getFakeIssues } = require("./admin.fake.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const adminMiddleware = require("../../middleware/admin.middleware");
const { confirmFakeIssue } = require("./admin.fake.controller");
const {
  getPendingVerificationIssues,
  approveIssueResolution,
  rejectIssueResolution,
} = require("./admin.issue.controller");

router.get(
  "/issues/pending",
  authMiddleware,
  adminMiddleware,
  getPendingVerificationIssues
);

router.patch(
  "/issues/:id/approve",
  authMiddleware,
  adminMiddleware,
  approveIssueResolution
);

router.patch(
  "/issues/:id/reject",
  authMiddleware,
  adminMiddleware,
  rejectIssueResolution
);
router.patch(
  "/issues/:id/confirm-fake",
  authMiddleware,
  adminMiddleware,
  confirmFakeIssue
);


router.get(
  "/issues/fake",
  authMiddleware,
  adminMiddleware,
  getFakeIssues
);
module.exports = router;
