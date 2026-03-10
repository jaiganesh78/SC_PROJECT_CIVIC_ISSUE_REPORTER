const User = require("../../models/User.model");
const PasswordResetOtp = require("../../models/PasswordResetOtp.model");

const { hashPassword, comparePassword } = require("../../utils/hash");
const { signToken } = require("../../utils/jwt");
const { sendEmail } = require("../../utils/mailer");

const bcrypt = require("bcrypt");

// ✅ REGISTER (Manual Signup)
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashed = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashed,
      provider: "local",
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGIN (Manual Login + JWT)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (user.provider !== "local") {
      return res
        .status(400)
        .json({ message: "Use Google login for this account" });
    }

    const match = await comparePassword(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({
  userId: user._id,
  email: user.email,
  role: user.role,
});


    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ FORGOT PASSWORD (Send OTP)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });

    // ✅ security: don't reveal if email exists
    if (!user) {
      return res.status(200).json({
        message: "If the email exists, OTP will be sent",
      });
    }

    if (user.provider !== "local") {
      return res.status(400).json({
        message: "This account uses Google login. Password reset not allowed.",
      });
    }

    // ✅ Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Hash OTP before storing (secure)
    const otpHash = await bcrypt.hash(otp, 10);

    // ✅ Expire in 10 mins
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // ✅ Remove old OTPs for this email
    await PasswordResetOtp.deleteMany({ email });

    // ✅ Store new OTP
    await PasswordResetOtp.create({
      email,
      otpHash,
      expiresAt,
    });

    // ✅ Send OTP via SendGrid
    await sendEmail({
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Password Reset OTP</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing: 2px;">${otp}</h1>
          <p>This OTP will expire in <b>10 minutes</b>.</p>
          <p>If you didn’t request this, ignore this email.</p>
        </div>
      `,
    });

    return res.status(200).json({
      message: "OTP sent to email (if account exists)",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ RESET PASSWORD (Verify OTP + Update Password)
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, OTP and newPassword are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const otpDoc = await PasswordResetOtp.findOne({ email });
    if (!otpDoc) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    // ✅ Check expiry
    if (otpDoc.expiresAt < new Date()) {
      await PasswordResetOtp.deleteMany({ email });
      return res.status(400).json({ message: "OTP expired" });
    }

    // ✅ Verify OTP
    const isOtpValid = await bcrypt.compare(otp, otpDoc.otpHash);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ Update password
    const hashed = await hashPassword(newPassword);

    await User.updateOne(
      { email },
      { password: hashed, provider: "local" } // provider stays local
    );

    // ✅ Delete OTP after success
    await PasswordResetOtp.deleteMany({ email });

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
