const User = require("../models/User.model");
const { hashPassword } = require("./hash");
const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = require("../config/env");

const seedAdmin = async () => {
  try {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.log("⚠️ Admin seeding skipped (ADMIN_EMAIL or ADMIN_PASSWORD missing)");
      return;
    }

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log("✅ Admin already exists in DB");
      return;
    }

    const hashed = await hashPassword(ADMIN_PASSWORD);

    await User.create({
      name: ADMIN_NAME || "Admin",
      email: ADMIN_EMAIL,
      password: hashed,
      provider: "local",
      role: "admin",
    });

    console.log("✅ Admin user created successfully");
  } catch (error) {
    console.error("❌ Admin seeding failed:", error.message);
  }
};

module.exports = seedAdmin;
