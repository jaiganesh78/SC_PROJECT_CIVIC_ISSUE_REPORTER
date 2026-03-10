const express = require("express");
const router = express.Router();
const { blockIfBanned } = require("./issueBan.guard");
const auth = require("../../middleware/auth.middleware");
const upload = require("../../middleware/upload.middleware");

const {
  createIssue,
  getIssues,
  getIssueById
} = require("./issue.controller");

router.get("/:id", auth, getIssueById);
router.post(
  "/",
  auth,
  blockIfBanned,
  upload.single("image"),
  createIssue
);
router.get("/", getIssues);

module.exports = router;
