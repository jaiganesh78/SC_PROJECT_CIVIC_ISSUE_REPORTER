const express = require("express");
const router = express.Router();
const { sendSMS } = require("../services/sms.service");

router.get("/test-sms", async (req, res) => {
  await sendSMS({
    to: "+919940521669", // YOUR VERIFIED NUMBER
    message: "Twilio SMS test from backend",
  });

  res.json({ ok: true });
});

module.exports = router;
