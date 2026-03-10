const sgMail = require("@sendgrid/mail");
const { SENDGRID_API_KEY, SENDER_EMAIL } = require("../config/env");

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, html, text }) => {
  const msg = {
    to,
    from: SENDER_EMAIL,
    subject,
    text,
    html,
  };
console.log("✅ SENDGRID KEY LOADED?", !!process.env.SENDGRID_API_KEY);

  return sgMail.send(msg);
};


module.exports = { sendEmail };
console.log("SENDGRID KEY PREFIX:", process.env.SENDGRID_API_KEY?.slice(0, 3));

