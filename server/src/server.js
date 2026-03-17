const env = require("./config/env"); // loads dotenv

const app = require("./app");
const listEndpoints = require("express-list-endpoints");
const connectDB = require("./config/db");
const seedAdmin = require("./utils/seedAdmin");

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // ✅ create admin in DB if not exists
    await seedAdmin();
   function printRoutes(app) {
  const stack = app._router?.stack || app.router?.stack || [];

  stack.forEach((layer) => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods)
        .map((m) => m.toUpperCase())
        .join(", ");
      console.log(`${methods} ${layer.route.path}`);
    } else if (layer.name === "router" && layer.handle.stack) {
      layer.handle.stack.forEach((handler) => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods)
            .map((m) => m.toUpperCase())
            .join(", ");
          console.log(`${methods} ${handler.route.path}`);
        }
      });
    }
  });
}
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log("Registered endpoints:");
     printRoutes(app);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err.message);
    process.exit(1);
  }
};

startServer();
