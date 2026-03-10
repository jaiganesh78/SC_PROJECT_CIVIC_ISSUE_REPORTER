const twilio = require("twilio");

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
} = process.env;

let client = null;

if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  console.log("✅ Twilio client initialized");
} else {
  console.warn("⚠️ Twilio not configured. SMS disabled.");
}

const sendSMS = async ({ to, message }) => {
  console.log("📤 Attempting SMS to:", to);

  if (!client) {
    console.warn("❌ Twilio client not available");
    return;
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to,
    });

    console.log("📨 SMS sent. SID:", result.sid);
  } catch (err) {
    console.error("❌ SMS FAILED FULL ERROR:", err);
  }
};

module.exports = { sendSMS };
