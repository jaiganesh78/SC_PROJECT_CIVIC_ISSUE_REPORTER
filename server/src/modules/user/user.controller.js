const User = require("../../models/User.model");

const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user });
  } catch (error) {
    console.error("GET ME ERROR:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMe };
