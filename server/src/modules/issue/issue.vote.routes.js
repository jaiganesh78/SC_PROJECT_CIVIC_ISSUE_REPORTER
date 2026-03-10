const express = require("express");
const router = express.Router();
const { voteOnIssue } = require("./issue.vote.controller");
const auth = require("../../middleware/auth.middleware");

router.post("/:id/vote", auth, voteOnIssue);

module.exports = router;
