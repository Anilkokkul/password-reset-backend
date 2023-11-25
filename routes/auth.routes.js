const express = require("express");
const {
  registerUser,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");

const router = express.Router();

//register user
router.post("/register", registerUser);

//login user
router.post("/login", login);

//forgot password
router.post("/forgot-password", forgotPassword);

//reset Password
router.post("/reset-password", resetPassword);

module.exports = router;
