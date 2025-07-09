import express from "express";
import {
  registeruser,
  verifyUser,
  login,
  logout,
  forgetPassword,
  resetPassword,
} from "../controller/user.controller.js";
const router = express.Router();

router.post("/register", registeruser);
router.get("/verify/:token", verifyUser);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPassword", forgetPassword);
router.post("/resetPassword/:token", resetPassword);

export default router;
