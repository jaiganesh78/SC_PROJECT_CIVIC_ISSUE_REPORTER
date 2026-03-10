const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    issue_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// 🔒 One vote per user per issue
voteSchema.index({ issue_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);
