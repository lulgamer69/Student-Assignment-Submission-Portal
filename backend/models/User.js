const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["student", "teacher"],
    default: "student"
  },
  // 🔥 STUDENT DETAILS (ONLY FOR STUDENTS)
  rollNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  branch: String,
  year: String,
  division: String,
  // 🔐 OTP FOR PASSWORD RESET & OTP LOGIN
  otp: String,
  otpExpiry: Date,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);