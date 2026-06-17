const express = require("express");
const router = express.Router();
const { register, login, getMe, sendOtp, verifyOtp, resetPassword, loginWithOtp, updateProfile, changePassword, getStudentCount, seedStudentData } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);
router.post("/change-password", protect, changePassword);
router.get("/students/count", protect, getStudentCount);
router.post("/seed-data", seedStudentData);

// OTP Routes
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/login-otp", loginWithOtp);

module.exports = router;