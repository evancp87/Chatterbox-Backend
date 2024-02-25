/* eslint-disable no-console */
import express from "express";
import checkToken from "../lib/helpers";
const router = express.Router();

import {
  loginValidator,
  createValidator,
  emailValidator,
  otpValidator,
  passwordValidator,
} from "../lib/validation";

import {
  registerUser,
  loginUser,
  logoutUser,
  friendsList,
  friend,
  verifyOtp,
  resetPassword,
  updatePassword,
  initiateOtpSignIn,
  githubSignIn,
  googleSignIn,
  refreshToken,
} from "../controllers/users";

router.post("/register", createValidator, registerUser);
router.get("/logout", logoutUser);
// router.get("/profile", userDetails);
router.get("/friends", checkToken, friendsList);
router.get("/friends/:id", checkToken, friend);
router.post("/login", loginValidator, loginUser);
router.post("/verifyOtp", otpValidator, verifyOtp);
router.post("/reset", emailValidator, resetPassword);
router.put("/update", passwordValidator, checkToken, updatePassword);
router.post("/github", githubSignIn);
router.post("/google", googleSignIn);
router.post("/refresh", checkToken, refreshToken);
router.post("/oneTimePassword", emailValidator, initiateOtpSignIn);

export default router;
