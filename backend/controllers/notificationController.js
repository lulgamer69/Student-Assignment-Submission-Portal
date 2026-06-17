const { sendEmail } = require("../utils/sendEmail");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Send a reminder notification to a student
exports.sendReminder = async (req, res) => {
  try {
    const { studentId, title, message, email, assignmentId } = req.body;
    const teacherId = req.user._id;

    if (!studentId || !title || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get teacher details
    const teacher = await User.findById(teacherId);
    const teacherName = teacher?.name || "Your Teacher";

    // Get student details if studentId is provided
    let studentEmail = email;
    let studentName = "Student";

    if (studentId) {
      const student = await User.findById(studentId);
      if (student) {
        studentEmail = student.email;
        studentName = student.name;
      }
    }

    // Get assignment name if assignmentId is provided
    let assignmentName = "";
    if (assignmentId) {
      const Assignment = require("../models/Assignment");
      const assignment = await Assignment.findById(assignmentId);
      if (assignment) {
        assignmentName = ` for "${assignment.title}"`;
      }
    }

    // Send email to student
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">📬 ${title}</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Hi <strong>${studentName}</strong>,
          </p>
          
          <p style="color: #555; font-size: 15px; line-height: 1.8;">
            ${message}
          </p>

          ${assignmentName ? `<p style="color: #666; font-size: 14px; font-weight: bold; margin-top: 15px;">📝 Assignment: <strong>${assignmentName.substring(5)}</strong></p>` : ''}
          
          <p style="color: #666; font-size: 14px; margin-top: 15px;">
            From: <strong>${teacherName}</strong>
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <a href="http://localhost:3000/student/assignments" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              View Your Assignments
            </a>
          </div>
          
          <p style="color: #999; font-size: 13px; margin-top: 20px;">
            This is an automated message from Acadly. Please don't reply to this email.
          </p>
        </div>
      </div>
    `;

    // Send email
    await sendEmail(
      studentEmail,
      `Acadly - ${title}`,
      emailHTML
    );

    // Save notification to database with assignment and teacher info
    const notification = new Notification({
      recipientId: studentId,
      senderId: teacherId,
      title: title,
      message: message,
      type: "reminder",
      read: false,
      relatedId: assignmentId || null,
      senderName: teacherName,
      assignmentTitle: assignmentName.substring(5) || null
    });

    await notification.save();

    res.status(200).json({
      message: "Reminder sent successfully",
      sentTo: studentEmail,
      notification: notification
    });
  } catch (error) {
    console.error("Error sending reminder:", error);
    res.status(500).json({ message: "Failed to send reminder", error: error.message });
  }
};

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Fetch last 50 notifications for this user, sorted by newest first
    const notifications = await Notification.find({ recipientId: userId })
      .populate("senderId", "name email")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
};
