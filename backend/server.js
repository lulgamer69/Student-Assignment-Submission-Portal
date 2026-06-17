const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const submissionRoutes = require("./routes/submissionRoutes");
const app = express();
const assignmentRoutes = require("./routes/assignmentRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
const { protect } = require("./middleware/authMiddleware");
const { authorizeRoles } = require("./middleware/roleMiddleware");

app.get("/api/teacher-only", protect, authorizeRoles("teacher"), (req, res) => {
  res.json({
    message: "Welcome teacher 👨‍🏫"
  });
});
console.log("Teacher route loaded ✅");
app.get("/api/test", protect, (req, res) => {
  res.json({
    message: "Protected route working 🔥",
    user: req.user
  });
});
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/notifications", notificationRoutes);
console.log("Notification route loaded ✅");

// test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// connect DB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed ✅");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed ✅");
      process.exit(0);
    });
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed ✅");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed ✅");
      process.exit(0);
    });
  });
});
