
const express = require("express");
const cors = require("cors");
const path = require("path"); 
const testSMS = require("./routes/test.sms");
const { CLIENT_URL } = require("./config/env");
const issueRoutes = require("./modules/issue/issue.routes");

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/user/user.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const adminIssueRoutes = require("./modules/admin/admin.issue.routes");
const app = express();

app.use(express.json());
// ❌ DO NOT parse JSON globally before file uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(express.urlencoded({ extended: true }));

// ✅ Only parse JSON for non-multipart requests
app.use((req, res, next) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    return next();
  }
  express.json()(req, res, next);
});

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("✅ Hackathon Auth API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/staff/issues", require("./modules/issue/issue.staff.routes"));
app.use("/api/admin", adminIssueRoutes);
app.use("/api", testSMS);
app.use("/api/issues", require("./modules/issue/issue.vote.routes"));
const listEndpoints = require("express-list-endpoints")
console.log(listEndpoints(app))

module.exports = app;
