const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const adminMiddleware = require("../../middleware/admin.middleware");

const router = express.Router();

// ✅ Test admin route
router.get("/dashboard", authMiddleware, adminMiddleware, (req, res) => {
  return res.status(200).json({
    message: "Welcome Admin ✅",
    admin: req.user, // shows role in token
  });
});

module.exports = router;
