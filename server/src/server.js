const env = require("./config/env"); // loads dotenv
const app = require("./app");
const connectDB = require("./config/db");
const seedAdmin = require("./utils/seedAdmin");

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // ✅ create admin in DB if not exists
    await seedAdmin();

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err.message);
    process.exit(1);
  }
};

startServer();
