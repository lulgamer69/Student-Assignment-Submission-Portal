const express = require("express");
const router = express.Router();

const { submitAssignment, getSubmissionsByAssignment, getSubmissionById, getNonSubmittedStudents, gradeSubmission, getMySubmissions, downloadReport } = require("../controllers/submissionController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

// 🔥 STUDENT SUBMIT
router.post("/", protect, authorizeRoles("student"), upload.single("file"), submitAssignment);

// 🔥 STUDENT VIEW MY SUBMISSIONS
router.get("/my", protect, authorizeRoles("student"), getMySubmissions);

// 🔥 DOWNLOAD REPORT (PDF) - must come before /:id
router.get("/:id/download", protect, downloadReport);

// 🔥 TEACHER VIEW SUBMISSIONS FOR SPECIFIC ASSIGNMENT - more specific path
router.get("/assignment/:assignmentId", protect, authorizeRoles("teacher"), getSubmissionsByAssignment);

// 🔥 TEACHER VIEW NON-SUBMITTED (PENDING) STUDENTS - more specific path
router.get("/pending/:assignmentId", protect, authorizeRoles("teacher"), getNonSubmittedStudents);

// 🔥 TEACHER GET SINGLE SUBMISSION BY ID (for grading)
router.get("/:id", protect, authorizeRoles("teacher"), getSubmissionById);

// 🔥 TEACHER GRADE SUBMISSION
router.put("/:id", protect, authorizeRoles("teacher"), gradeSubmission);

console.log("Submission route loaded ✅");

module.exports = router;