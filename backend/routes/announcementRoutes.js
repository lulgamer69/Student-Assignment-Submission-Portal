const express = require("express");
const {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} = require("../controllers/announcementController");

const { protect } = require("../middleware/authMiddleware");
const { teacherOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// 📢 POST - Create announcement (Teachers only)
router.post("/", protect, teacherOnly, createAnnouncement);

// 📨 GET - Get all announcements (All authenticated users)
router.get("/", protect, getAnnouncements);

// 🗑️ DELETE - Delete announcement (Teachers only)
router.delete("/:id", protect, teacherOnly, deleteAnnouncement);

module.exports = router;
