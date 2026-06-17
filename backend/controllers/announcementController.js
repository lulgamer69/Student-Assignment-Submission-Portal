const Announcement = require("../models/Announcement");
const User = require("../models/User");
const { sendEmail } = require("../utils/sendEmail");
const { announcementEmailTemplate } = require("../utils/emailTemplate");

// 📢 CREATE ANNOUNCEMENT + SEND EMAILS
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    // Save announcement in DB
    const announcement = new Announcement({
      title,
      message,
      createdBy: req.user._id,
    });

    await announcement.save();
    console.log("✅ Announcement saved to DB");

    // Get all students
    const students = await User.find({ role: "student" });
    console.log(`📨 Sending emails to ${students.length} students...`);

    // Send email to all students
    await Promise.all(
      students.map((student) =>
        sendEmail(
          student.email,
          `📢 ${title}`,
          announcementEmailTemplate(title, message, req.user.name)
        ).catch(err => console.log(`Warning: Failed to send to ${student.email}`))
      )
    );

    res.status(201).json({
      message: "✅ Announcement created + emails sent to all students",
      announcement,
      emailsSent: students.length
    });

  } catch (error) {
    console.log("❌ Error:", error);
    res.status(500).json({ message: "Error creating announcement", error: error.message });
  }
};

// 📨 GET ALL ANNOUNCEMENTS
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.json({
      count: announcements.length,
      announcements
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching announcements" });
  }
};

// 🗑️ DELETE ANNOUNCEMENT (Teachers only)
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    // Check if teacher is the creator
    if (announcement.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own announcements" });
    }

    await Announcement.findByIdAndDelete(id);
    res.json({ message: "✅ Announcement deleted" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting announcement" });
  }
};
