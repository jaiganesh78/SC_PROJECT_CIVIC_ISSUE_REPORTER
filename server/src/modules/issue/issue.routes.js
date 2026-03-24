const express = require("express");
const router = express.Router();
const { blockIfBanned } = require("./issueBan.guard");
const auth = require("../../middleware/auth.middleware");
const upload = require("../../middleware/upload.middleware");

const {
  createIssue,
  getIssues,
  getIssueById,
  getMyIssues,
} = require("./issue.controller");
router.get("/me", auth, getMyIssues);
router.get("/:id", auth, getIssueById);
router.post(
  "/",
  auth,
  blockIfBanned,
  upload.single("image"),
  createIssue
);
router.get("/", auth, getIssues);


module.exports = router;
