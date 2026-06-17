const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { createAssignment, getStudentAssignments, getTeacherAssignments, getAllAssignments, updateAssignment, getAssignmentById } = require("../controllers/assignmentController");

// 🔥 GET ALL ASSIGNMENTS (for teachers)
router.get(
  "/",
  protect,
  authorizeRoles("teacher"),
  getTeacherAssignments
);

// 🔥 STUDENT VIEW ASSIGNMENTS
router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  getStudentAssignments
);

// 🔥 CREATE ASSIGNMENT WITH FILE UPLOAD
router.post(
  "/create",
  protect,
  authorizeRoles("teacher"),
  upload.single("file"),
  createAssignment
);

// 🔥 GET SINGLE ASSIGNMENT BY ID
router.get(
  "/:id",
  protect,
  getAssignmentById
);

// 🔥 UPDATE ASSIGNMENT
router.put(
  "/:id",
  protect,
  authorizeRoles("teacher"),
  updateAssignment
);

// test route
router.get("/teacher-only", protect, authorizeRoles("teacher"), (req, res) => {
  res.json({
    message: "Welcome teacher 👨‍🏫"
  });
});

console.log("Assignment route loaded ✅");

module.exports = router;