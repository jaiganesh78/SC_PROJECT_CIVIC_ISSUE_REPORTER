const { TRUST_BAN_THRESHOLD } = require("../../config/trustPolicy");

const blockIfBanned = (req, res, next) => {
  // Only citizens are blocked
  if (req.user.role !== "user") return next();

  if (req.user.trust_score < TRUST_BAN_THRESHOLD) {
    return res.status(403).json({
      message: "Trust score too low. You are temporarily banned.",
    });
  }

  next();
};

module.exports = { blockIfBanned };
