const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");
const User = require("../models/User");
const PDFDocument = require("pdfkit");

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.body;
    const studentId = req.user._id;

    // 🔥 assignment exist check
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // 🔥 deadline check
    if (new Date() > new Date(assignment.deadline)) {
      return res.status(400).json({ message: "Deadline passed ❌" });
    }

    // 🔥 already submitted check
    const existing = await Submission.findOne({
      assignment: assignmentId,
      student: studentId
    });

    if (existing) {
      return res.status(400).json({ message: "Already submitted ⚠️" });
    }

    // 🔥 file check
    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const submission = new Submission({
      assignment: assignmentId,
      student: studentId,
      file: req.file.path.replace(/\\/g, "/")
    });

    await submission.save();

    res.status(201).json({
      message: "Assignment submitted ✅",
      submission
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const submissions = await Submission.find({ assignment: assignmentId })
      .populate("student", "name email rollNumber branch year division")
      .populate("assignment", "title totalMarks")
      .sort({ createdAt: -1 });

    res.json({
      count: submissions.length,
      submissions
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔥 GET SINGLE SUBMISSION BY ID
exports.getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findById(id)
      .populate("student", "name email rollNumber branch year division")
      .populate("assignment", "title description totalMarks deadline");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.json({
      submission
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔥 GET NON-SUBMITTED (PENDING) STUDENTS FOR ASSIGNMENT
exports.getNonSubmittedStudents = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    // Get all students
    const allStudents = await User.find({ role: "student" })
      .select("_id name email rollNumber branch year division");

    // Get all submissions for this assignment
    const submissions = await Submission.find({ assignment: assignmentId })
      .select("student");

    // Create a set of student IDs who have submitted
    const submittedStudentIds = new Set(submissions.map(sub => sub.student.toString()));

    // Filter out students who have submitted
    const nonSubmittedStudents = allStudents.filter(student => 
      !submittedStudentIds.has(student._id.toString())
    );

    res.json({
      count: nonSubmittedStudents.length,
      students: nonSubmittedStudents
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { TS, OM, PR, IA, feedback } = req.body;

    const total = TS + OM + PR + IA;

    const submission = await Submission.findByIdAndUpdate(
      id,
      {
        marks: { TS, OM, PR, IA, total, feedback: feedback || "" },
        status: "evaluated"
      },
      { new: true }
    );

    res.json({
      message: "Submission graded ✅",
      submission
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      student: req.user.id
    })
      .populate("assignment", "title description deadline totalMarks file message rubrics createdBy")
      .populate({
        path: "assignment",
        populate: {
          path: "createdBy",
          select: "name email"
        }
      })
      .sort({ createdAt: -1 });

    // Transform submissions to match frontend expectations
    const transformedSubmissions = submissions.map(sub => {
      let displayStatus = "pending";
      if (sub.status === "evaluated" && sub.marks && sub.marks.total !== undefined) {
        displayStatus = "graded";
      } else if (sub.status === "submitted") {
        displayStatus = "submitted";
      }

      return {
        _id: sub._id,
        assignmentTitle: sub.assignment?.title,
        assignmentDescription: sub.assignment?.description,
        status: displayStatus,
        submittedAt: sub.createdAt,
        createdAt: sub.createdAt,
        file: sub.file,
        rubrics: sub.assignment?.rubrics,
        marks: sub.marks && (sub.marks.TS || sub.marks.OM || sub.marks.PR || sub.marks.IA || sub.marks.total) ? {
          TS: sub.marks.TS || 0,
          OM: sub.marks.OM || 0,
          PR: sub.marks.PR || 0,
          IA: sub.marks.IA || 0,
          total: sub.marks.total || 0,
          totalMarks: sub.assignment?.totalMarks || 100,
          feedback: sub.marks.feedback || ""
        } : null
      };
    });

    res.json({
      count: transformedSubmissions.length,
      submissions: transformedSubmissions
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.downloadReport = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findById(id)
      .populate("student", "name email")
      .populate("assignment", "title");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (submission.status !== "evaluated") {
      return res.status(400).json({ message: "Not graded yet ❌" });
    }

    const doc = new PDFDocument();

    // 🔥 headers (download force)
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report-${id}.pdf`
    );

    doc.pipe(res);

    // 🧾 CONTENT
    doc.fontSize(20).text("Assignment Report", { align: "center" });

    doc.moveDown();
    doc.fontSize(12).text(`Student: ${submission.student.name}`);
    doc.text(`Email: ${submission.student.email}`);
    doc.text(`Assignment: ${submission.assignment.title}`);

    doc.moveDown();
    doc.text("Marks:");

    doc.text(`TS: ${submission.marks.TS}`);
    doc.text(`OM: ${submission.marks.OM}`);
    doc.text(`PR: ${submission.marks.PR}`);
    doc.text(`IA: ${submission.marks.IA}`);

    doc.moveDown();
    doc.fontSize(14).text(`Total: ${submission.marks.total}`, {
      underline: true
    });

    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};