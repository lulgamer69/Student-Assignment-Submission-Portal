const express = require("express");
const { sendReminder, getNotifications } = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Send a reminder to a student
router.post("/send", protect, sendReminder);

// Get notifications for current user
router.get("/", protect, getNotifications);

module.exports = router;
