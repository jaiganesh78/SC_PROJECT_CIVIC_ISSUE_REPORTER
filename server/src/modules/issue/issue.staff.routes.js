const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/auth.middleware");
const staffMiddleware = require("../../middleware/staff.middleware");
const upload=require("../../middleware/upload.middleware");
const {
  getAssignedIssuesForStaff,
  resolveIssue,
} = require("./issue.staff.controller");

router.get(
  "/",
  authMiddleware,
  staffMiddleware,
  getAssignedIssuesForStaff
);

router.patch(
  "/:id/resolve",
  authMiddleware,
  staffMiddleware,
  upload.single("proof_image"), // 🔥 REQUIRED
  resolveIssue
);


module.exports = router;
