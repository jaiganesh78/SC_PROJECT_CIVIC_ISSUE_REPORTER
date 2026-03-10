require("dotenv").config();

const requiredVars = [
  "PORT",
  "MONGO_URI",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "CLIENT_URL",
  "SENDGRID_API_KEY",
  "SENDER_EMAIL",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "ADMIN_NAME",
  "GOOGLE_CLIENT_ID"
];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ Missing env variable: ${key}`);
  }
});

module.exports = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  CLIENT_URL: process.env.CLIENT_URL,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDER_EMAIL: process.env.SENDER_EMAIL,
  ADMIN_EMAIL:process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD:process.env.ADMIN_PASSWORD,
  ADMIN_NAME:process.env.ADMIN_NAME,
  GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID
};
