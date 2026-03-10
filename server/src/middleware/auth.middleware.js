const { verifyToken } = require("../utils/jwt");
const User = require("../models/User.model");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    // 🔥 LOAD FULL USER FROM DB (SOURCE OF TRUTH)
    const user = await User.findById(decoded.userId).lean();

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🚫 ENFORCE TEMP BAN
    // 🚫 TEMP BAN ENFORCEMENT
if (user.is_banned && user.ban_until) {
  if (new Date(user.ban_until) > new Date()) {
    return res.status(403).json({
      message: "User is temporarily banned from creating issues",
      ban_until: user.ban_until,
    });
  }
}


    // ✅ Attach FULL user context
    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
      department_name: user.department_name || null,
      trust_score: user.trust_score,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
