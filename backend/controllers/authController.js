const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOtp } = require("../utils/generateOtp");
const { sendEmail } = require("../utils/sendEmail");
const { otpEmailTemplate } = require("../utils/emailTemplate");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, division, year, branch } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user object
    const userData = {
      name,
      email,
      password: hashedPassword,
      role
    };

    // Add student details if role is student and fields are not empty
    if (role === "student") {
      if (rollNumber && rollNumber.trim() !== "") userData.rollNumber = rollNumber.trim();
      if (division && division.trim() !== "") userData.division = division.trim();
      if (year && year.trim() !== "") userData.year = year.trim();
      if (branch && branch.trim() !== "") userData.branch = branch.trim();
    }

    // create user
    const user = await User.create(userData);

    const { password: _, ...userWithoutPassword } = user._doc;

    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

   const { password: _, ...userWithoutPassword } = user._doc;

res.json({
  message: "Login successful",
  token,
  user: userWithoutPassword
});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ME
exports.getMe = (req, res) => {
  res.status(200).json({
    user: req.user
  });
};

// 🔹 SEND OTP (for forgot password OR login)
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    await sendEmail(
      email,
      "Your Acadly OTP",
      otpEmailTemplate(otp)
    );

    res.json({ message: "OTP sent to email" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// 🔹 VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    res.json({ message: "OTP verified successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

// 🔹 RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    // clear OTP
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "Password reset successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error resetting password" });
  }
};

// 🔹 LOGIN WITH OTP
exports.loginWithOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // clear OTP
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const { password: _, ...userWithoutPassword } = user._doc;

    res.json({
      message: "Login with OTP successful",
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error logging in with OTP" });
  }
};

// 🔹 UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, rollNumber, division, year, branch } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const updateData = { name };
    if (rollNumber !== undefined && rollNumber !== '') updateData.rollNumber = rollNumber;
    if (division !== undefined && division !== '') updateData.division = division;
    if (year !== undefined && year !== '') updateData.year = year;
    if (branch !== undefined && branch !== '') updateData.branch = branch;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user._doc;

    res.json({
      message: "Profile updated successfully",
      user: userWithoutPassword
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

// 🔹 CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    const { password: _, ...userWithoutPassword } = user._doc;

    res.json({
      message: "Password changed successfully",
      user: userWithoutPassword
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error changing password" });
  }
};

// GET STUDENT COUNT
exports.getStudentCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "student" });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔥 SEED TEST DATA - Populate student details for testing
exports.seedStudentData = async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    
    const branches = ["CSE", "ECE", "Mechanical", "Civil"];
    const divisions = ["A", "B", "C"];
    
    let updated = 0;
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      
      // Only update if fields are empty
      if (!student.rollNumber || !student.branch || !student.division) {
        student.rollNumber = `${100 + i}`;
        student.branch = branches[i % branches.length];
        student.division = divisions[i % divisions.length];
        student.year = "2024";
        await student.save();
        updated++;
      }
    }
    
    res.json({
      message: `Seeded ${updated} student records with test data`,
      updated
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};