const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  deadline: Date,
  totalMarks: {
    type: Number,
    default: 0
  },
  // 🔥 TEACHER ATTACHMENT & MESSAGE
  file: {
    type: String // PDF/Word file path
  },
  message: {
    type: String // Teacher instructions
  },
  rubrics: {
    type: String // Rubrics PDF file path
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Assignment", assignmentSchema);