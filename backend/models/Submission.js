const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  file: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["submitted", "evaluated"],
    default: "submitted"
  },
  marks: {
    TS: { type: Number, default: 0 },
    OM: { type: Number, default: 0 },
    PR: { type: Number, default: 0 },
    IA: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    feedback: { type: String, default: "" }
  }
}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);