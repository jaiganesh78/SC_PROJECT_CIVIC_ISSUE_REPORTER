const express = require("express");
const { googleAuth } = require("./google.controller");

const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("./auth.controller");


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google", googleAuth);

module.exports = router;
