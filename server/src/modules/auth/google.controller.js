const { OAuth2Client } = require("google-auth-library");
const User = require("../../models/User.model");
const { signToken } = require("../../utils/jwt");
const env = require("../../config/env");

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body; // ID token from frontend

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    if (!env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "Google Client ID missing in env" });
    }

    // ✅ verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const email = payload.email;
    const name = payload.name || "Google User";
    const googleId = payload.sub;

    let user = await User.findOne({ email });

    // ✅ If email already exists as manual account → block Google login
    if (user && user.provider === "local") {
      return res.status(400).json({
        message: "This email is registered with password. Use manual login.",
      });
    }

    // ✅ create user if not exists
    if (!user) {
      user = await User.create({
        name,
        email,
        provider: "google",
        googleId,
        role: "user",
      });
    }

    // ✅ issue your JWT
    const token = signToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      message: "Google login success ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.error("GOOGLE AUTH ERROR:", error.message);
    return res.status(500).json({ message: "Google auth failed" });
  }
};

module.exports = { googleAuth };
