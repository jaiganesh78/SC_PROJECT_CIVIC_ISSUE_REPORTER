const Issue = require("../../models/Issue.model");
const Vote = require("../../models/Vote.model"); // ✅ MUST EXIST
const User = require("../../models/User.model");
const { calculateTimeEscalation } = require("./priorityEscalation.service");

const { findDuplicateIssues } = require("./duplicate.service");
const { analyzeIssueWithAI } = require("../ai/aiAnalysis.service");
const { analyzeImageWithVision } = require("../ai/visionAnalysis.service");
const { reverseGeocode } = require("../location/reverseGeocode.service");
const { getDepartmentForCategory } = require("../department/departmentMapping.service");
const { notify } = require("../../services/notification.service");

/**
 * CREATE ISSUE
 * Image mandatory
 * AI-assisted, backend-authoritative
 */
const createIssue = async (req, res) => {
  console.log("🚀 createIssue controller HIT");

  try {
    // ===============================
    // SAFE BODY ACCESS (multipart)
    // ===============================
    const description = req.body?.description || "";
    const latitude = Number(req.body?.latitude);
    const longitude = Number(req.body?.longitude);
    const force_duplicate = req.body?.force_duplicate === "true";
    const forced_against_issue_id = req.body?.forced_against_issue_id || null;
   console.log("REQ.FILE:", req.file);
    // ===============================
    // BASIC VALIDATION
    // ===============================
    if (description.trim().length < 5) {
      return res.status(400).json({ message: "Valid description is required" });
    }

    if (latitude == null || longitude == null) {
      return res.status(400).json({ message: "Location is required" });
    }

    if (!req.file?.path) {
      return res.status(400).json({ message: "Issue image is required" });
    }

    // ===============================
    // 1️⃣ TEXT AI ANALYSIS
    // ===============================
    const textAI = await analyzeIssueWithAI({
      raw_description: description,
    });

    const {
      summary,
      category,
      ai_confidence: text_confidence,
      priority_score: ai_priority_score,
    } = textAI;

    // ===============================
    // 2️⃣ IMAGE AI ANALYSIS
    // ===============================
    const imageAI = await analyzeImageWithVision(req.file.path);

    const {
      image_category,
      image_confidence,
      raw_predictions,
    } = imageAI;

    // ===============================
    // 3️⃣ g
    // ===============================
    const final_confidence =
      (text_confidence + image_confidence) / 2;

    // ===============================
    // 4️⃣ AUTO ASSIGNMENT
    // ===============================
    const AUTO_ASSIGN_THRESHOLD = 0.75;
    const IMAGE_MIN_THRESHOLD = 0.3;

    let assigned_department_name = null;
    let status = "open";

    if (
      final_confidence >= AUTO_ASSIGN_THRESHOLD &&
      image_confidence >= IMAGE_MIN_THRESHOLD &&
      category !== "other"
    ) {
      const department = await getDepartmentForCategory(category);

      if (department) {
        assigned_department_name = department.name;
        status = "assigned_auto";
      }
    }

    // ===============================
    // 5️⃣ REVERSE GEOCODING
    // ===============================
    const placeData = await reverseGeocode(latitude, longitude);

const place = {
  area: placeData?.area || null,
  city: placeData?.city || null,
  state: placeData?.state || null,
  formatted: [
    placeData?.area,
    placeData?.city,
    placeData?.state,
  ]
    .filter(Boolean)
    .join(", ") || null,
};

    // ===============================
    // 6️⃣ DUPLICATE DETECTION
    // ===============================
    const duplicates = await findDuplicateIssues({
      category,
      latitude,
      longitude,
    });

    if (duplicates.length > 0 && !force_duplicate) {
      return res.status(200).json({
        message: "Similar issues already exist nearby",
        summary,
        category,
        priority_score: ai_priority_score,
        place,
        possible_duplicates: duplicates,
      });
    }
    if (force_duplicate && forced_against_issue_id) {

  const originalIssue = await Issue.findById(forced_against_issue_id);

  if (!originalIssue) {
    return res.status(400).json({
      message: "Original issue for duplicate not found"
    });
  }

}
    // ===============================
    // 7️⃣ ISSUE CREATION (IMPORTANT)
    // ===============================
    const issue = await Issue.create({
      user_id: req.user.userId,
      category,
      description,
      latitude,
      longitude,
      place, 
      issue_image: req.file ? `uploads/issues/${req.file.filename}` : null,
      duplicates: [],
      // 🔥 BASE PRIORITY (IMMUTABLE)
      priority_score_base: ai_priority_score,

      // 🔥 CURRENT PRIORITY (MUTABLE)
      priority_score: ai_priority_score,

      text_confidence,
      image_confidence,
      ai_confidence: final_confidence,

      image_category,
      image_raw_predictions: raw_predictions,

      assigned_department_name,
      status,

      duplicate_forced: force_duplicate,
      forced_against_issue_id: force_duplicate
        ? forced_against_issue_id
        : null,
    });
    if (force_duplicate && forced_against_issue_id) {

  await Issue.findByIdAndUpdate(
    forced_against_issue_id,
    { $push: { duplicates: issue._id } }
  );

}

    // ===============================
    // 🔔 NOTIFICATIONS
    // ===============================
    const reporter = await User.findById(req.user.userId);
    const admin = await User.findOne({ role: "admin" });

    // USER
    notify({
      type: "USER_ISSUE_CREATED",
      user: reporter,
      issue,
    });

    // ADMIN
    notify({
      type: "ADMIN_NEW_ISSUE",
      user: admin,
      issue,
    });

    if (status === "assigned_auto") {
      const staff = await User.findOne({
        role: "staff",
        department_name: assigned_department_name,
      });

      // STAFF
      notify({
        type: "STAFF_ISSUE_ASSIGNED",
        user: staff,
        issue,
      });

      // USER
      notify({
        type: "USER_ISSUE_ASSIGNED",
        user: reporter,
        issue,
      });
    }

    // ===============================
    // RESPONSE
    // ===============================
    return res.status(201).json({
      issue,
      summary,
      place,
      autoAssigned: status === "assigned_auto",
    });
  } catch (error) {
    console.error("CREATE ISSUE ERROR:", error);

    if (
      error.message === "AI_SERVICE_FAILED" ||
      error.message === "AI_INVALID_JSON" ||
      error.message === "AI_INVALID_OUTPUT" ||
      error.message === "IMAGE_AI_FAILED"
    ) {
      return res.status(503).json({
        message:
          "AI analysis temporarily unavailable. Issue sent for manual review.",
      });
    }

    return res.status(500).json({ message: "Server error" });
  }
};
/**
 * GET SINGLE ISSUE (DETAILED VIEW)
 * Used for modal / popup view
 */
const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("user_id", "name email")
      .populate("resolved_by", "name role");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    return res.status(200).json({
  _id: issue._id,

  category: issue.category,
  description: issue.description,

  // 🧭 Map usage
  location: {
  latitude: issue.latitude,
  longitude: issue.longitude,
  place: issue.place?.formatted || null,
},

  // 📊 Priority & status
  priority_score: issue.priority_score,
  priority_score_base: issue.priority_score_base,
  ai_confidence: issue.ai_confidence,
  status: issue.status,

  // 🧱 Progress info
  createdAt: issue.createdAt,
  resolved_at: issue.resolved_at || null,

  // 🖼️ Images
  issue_image: issue.issue_image || null,
  resolution_proof_image: issue.resolution_proof_image || null,

  // 🏢 Assignment
  assigned_department_name: issue.assigned_department_name || null,
});

  } catch (error) {
    console.error("GET ISSUE BY ID ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET ISSUES (sorted by priority)
 */


const getIssues = async (req, res) => {
  const issues = await Issue.find();

  // 🔥 get user (if logged in)
  const userId = req.user?.userId || null;

  const enrichedIssues = await Promise.all(
    issues.map(async (issue) => {
      const timeEscalation = calculateTimeEscalation(issue);

      // 🔥 COUNT VOTES
      const voteCount = await Vote.countDocuments({
        issue_id: issue._id,
      });

      // 🔥 CHECK USER VOTED
      let hasVoted = false;
      if (userId) {
        const vote = await Vote.findOne({
          issue_id: issue._id,
          user_id: userId,
        });
        hasVoted = !!vote;
      }

      return {
        ...issue.toObject(),

        priority_score:
          issue.priority_score + timeEscalation,

        time_escalation: timeEscalation,

        // 🔥 NEW FIELDS
        vote_count: voteCount,
        has_voted: hasVoted,
      };
    })
  );

  enrichedIssues.sort(
    (a, b) => b.priority_score - a.priority_score
  );

  res.json({ issues: enrichedIssues });
};

const getMyIssues = async (req, res) => {
  try {
    const userId = req.user.userId;

    const issues = await Issue.find({ user_id: userId });

    const enriched = await Promise.all(
      issues.map(async (issue) => {
        const voteCount = await Vote.countDocuments({
          issue_id: issue._id,
        });

        return {
          ...issue.toObject(),
          vote_count: voteCount,
          has_voted: false, // always false (own issue)
          is_own_issue: true,
        };
      })
    );

    res.json({ issues: enriched });
  } catch (err) {
    console.error("GET MY ISSUES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createIssue,
  getIssues,
  getIssueById,
  getMyIssues,
};
