const { sendSMS } = require("./sms.service");

/**
 * Central notification dispatcher
 */
const notify = async ({ type, user, staff, admin, issue }) => {
  try {
    switch (type) {
      case "USER_ISSUE_CREATED":
        if (user?.phone) {
          await sendSMS({
            to: user.phone,
            message: `Your issue has been submitted. Status: ${issue.status}`,
          });
        }
        break;

      case "STAFF_ISSUE_ASSIGNED":
        if (staff?.phone) {
          await sendSMS({
            to: staff.phone,
            message: `New issue assigned. Category: ${issue.category}`,
          });
        }
        break;

      case "USER_ISSUE_RESOLVED":
        if (user?.phone) {
          await sendSMS({
            to: user.phone,
            message:
              "Your issue has been resolved and is pending verification.",
          });
        }
        break;

      case "ADMIN_VERIFY_REQUIRED":
        if (admin?.phone) {
          await sendSMS({
            to: admin.phone,
            message: "An issue requires verification.",
          });
        }
        break;

      case "USER_ISSUE_APPROVED":
        if (user?.phone) {
          await sendSMS({
            to: user.phone,
            message:
              "Your issue has been verified and closed. Thank you.",
          });
        }
        break;

      case "USER_ISSUE_FAKE":
        if (user?.phone) {
          await sendSMS({
            to: user.phone,
            message:
              "Your issue was confirmed as fake. Trust score updated.",
          });
        }
        break;

      case "USER_BANNED":
        if (user?.phone) {
          await sendSMS({
            to: user.phone,
            message: `You are temporarily banned until ${user.ban_until}.`,
          });
        }
        break;

      default:
        return;
    }
  } catch (err) {
    console.error("NOTIFICATION ERROR:", err.message);
  }
};

module.exports = { notify };
