const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    // ===============================
    // 👤 REPORTER
    // ===============================
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ===============================
    // 🧠 AI CLASSIFICATION
    // ===============================
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ===============================
    // 📍 LOCATION
    // ===============================
    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    // ===============================
    // 🔄 STATUS FLOW (LOCKED)
    // ===============================
    status: {
      type: String,
      enum: [
        "open",
  "assigned",
  "assigned_auto",
  "resolved_pending_verification",
  "closed",
  "rejected",
  "fake" // 🚨 ADMIN CONFIRMED FAKE
      ],
      default: "open",
      index: true,
    },

    // ===============================
    // 🔥 PRIORITY & CONFIDENCE
    // ===============================
    priority_score: {
      type: Number,
      required: true,
      default: 0,
      index: true,
    },
    priority_score_base: {
  type: Number,
  required: true,
},


    text_confidence: {
      type: Number,
      required: true,
    },

    image_confidence: {
      type: Number,
      required: true,
      default: 0,
    },

    ai_confidence: {
      type: Number,
      required: true,
      index: true,
    },

    // ===============================
    // 🏢 DEPARTMENT ASSIGNMENT (RULE-BASED)
    // ===============================
    assigned_department_name: {
      type: String,
      default: null,
      index: true,
    },

    // ===============================
    // 🔁 DUPLICATE HANDLING (AUDITABLE)
    // ===============================
    duplicate_forced: {
      type: Boolean,
      default: false,
    },
place: {
  type: String,
  default: null,
},

    forced_against_issue_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      default: null,
    },

    // ===============================
    // 🖼 IMAGE AUDIT (DEBUG ONLY)
    // ===============================
    image_category: {
      type: String,
      default: "other",
    },

    image_raw_predictions: {
      type: Array,
      default: [],
    },

    // ===============================
    // 🧑‍🔧 STAFF RESOLUTION
    // ===============================
    resolution_proof_image: {
      type: String,
      default: null,
    },

    resolved_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    resolved_at: {
      type: Date,
      default: null,
    },

    // ===============================
    // 🚩 STAFF FAKE FLAG (OPINION ONLY)
    // ===============================
    staff_flagged_fake: {
      type: Boolean,
      default: false,
    },
    admin_reject_reason: {
  type: String,
  default: null,
},

    staff_fake_reason: {
      type: String,
      default: null,
    },
    // ===============================
// 🚨 ADMIN CONFIRMED FAKE
// ===============================
admin_confirmed_fake: {
  type: Boolean,
  default: false,
},

fake_confirmed_by: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},

fake_confirmed_at: {
  type: Date,
  default: null,
},

  },
  { timestamps: true }
);

// 🔥 Index for duplicate detection & feeds
issueSchema.index({ category: 1, createdAt: -1 });
issueSchema.index({ latitude: 1, longitude: 1 });

module.exports = mongoose.model("Issue", issueSchema);
