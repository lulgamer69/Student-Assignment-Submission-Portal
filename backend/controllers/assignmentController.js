const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");

exports.getStudentAssignments = async (req, res) => {
  try {
    const studentId = req.user._id;

    // 🔥 fetch all assignments
    const assignments = await Assignment.find().sort({ createdAt: -1 });

    // 🔥 fetch all submissions for this student
    const submissions = await Submission.find({ student: studentId });

    // 🔥 create map for fast O(1) lookup
    const submissionMap = {};
    submissions.forEach(sub => {
      submissionMap[sub.assignment.toString()] = sub;
    });

    // 🔥 merge logic - return full assignment data with status
    const result = assignments.map(assignment => {
      const submission = submissionMap[assignment._id.toString()];

      // Base assignment data
      const assignmentData = {
        _id: assignment._id,
        id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        deadline: assignment.deadline,
        totalMarks: assignment.totalMarks,
        file: assignment.file,
        message: assignment.message,
        createdAt: assignment.createdAt
      };

      // Add status based on submission
      if (!submission) {
        assignmentData.status = "not_submitted";
      } else if (submission.status === "submitted") {
        assignmentData.status = "submitted";
        assignmentData.submittedOn = submission.createdAt;
      } else {
        assignmentData.status = "evaluated";
        assignmentData.submittedOn = submission.createdAt;
        assignmentData.marks = submission.marks;
      }

      return assignmentData;
    });

    res.status(200).json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTeacherAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(assignments);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .sort({ createdAt: -1 });

    res.status(200).json(assignments);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, deadline, totalMarks, message } = req.body;
    const filePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

    const assignment = await Assignment.create({
      title,
      description,
      deadline,
      totalMarks,
      message,
      file: filePath,
      createdBy: req.user._id
    });

    res.status(201).json({
      message: "Assignment created ✅",
      assignment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, deadline, totalMarks, message } = req.body;

    // Find assignment and verify ownership
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Verify teacher ownership
    if (assignment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this assignment" });
    }

    // Update only provided fields
    if (title) assignment.title = title;
    if (description) assignment.description = description;
    if (deadline) assignment.deadline = deadline;
    if (totalMarks) assignment.totalMarks = totalMarks;
    if (message) assignment.message = message;

    await assignment.save();

    res.status(200).json({
      message: "Assignment updated ✅",
      assignment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({ assignment });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};