import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Assignments from "./pages/Assignments";
import CreateAssignment from "./pages/CreateAssignment";
import EditAssignment from "./pages/EditAssignment";
import Submissions from "./pages/Submissions";
import TeacherSubmissions from "./pages/TeacherSubmissions";
import MySubmissions from "./pages/MySubmissions";
import Grade from "./pages/Grade";
import Announcements from "./pages/Announcements";
import StudentAnnouncements from "./pages/StudentAnnouncements";
import CreateAnnouncement from "./pages/CreateAnnouncement";
import StudentProfilePage from "./pages/StudentProfilePage";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherProfile from "./pages/TeacherProfile";
import TeacherAssignments from "./pages/TeacherAssignments";
import TeacherAnnouncements from "./pages/TeacherAnnouncements";
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // "student" or "teacher"

  // Check authentication status from localStorage
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (token && role) {
        setIsAuthenticated(true);
        setUserRole(role);
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    };

    checkAuth();

    // Listen for storage changes (when login happens in another tab)
    window.addEventListener("storage", checkAuth);
    
    // Listen for custom auth change event (same-tab login)
    window.addEventListener("authChange", checkAuth);
    
    // Also check periodically (every 300ms) to catch same-tab changes
    const interval = setInterval(checkAuth, 300);
    
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
      clearInterval(interval);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              requiredRole="student"
              userRole={userRole}
            >
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/assignments"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              requiredRole="student"
              userRole={userRole}
            >
              <Assignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/submissions"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              requiredRole="student"
              userRole={userRole}
            >
              <Submissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/announcements"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              requiredRole="student"
              userRole={userRole}
            >
              <StudentAnnouncements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              requiredRole="student"
              userRole={userRole}
            >
              <StudentProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              requiredRole="teacher"
              userRole={userRole}
            >
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/assignments"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              requiredRole="teacher"
              userRole={userRole}
            >
              <TeacherAssignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/assignments/create"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              requiredRole="teacher"
              userRole={userRole}
            >
              <CreateAssignment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/assignments/edit/:id"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              requiredRole="teacher"
              userRole={userRole}
            >
              <EditAssignment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/assignments/:id/submissions"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              requiredRole="teacher"
              userRole={userRole}
            >
              <TeacherSubmissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/submissions"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              requiredRole="teacher"
              userRole={userRole}
            >
              <TeacherSubmissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/announcements"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              requiredRole="teacher"
              userRole={userRole}
            >
              <TeacherAnnouncements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/announcements/create"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              requiredRole="teacher"
              userRole={userRole}
            >
              <CreateAnnouncement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/profile"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              requiredRole="teacher"
              userRole={userRole}
            >
              <TeacherProfile />
            </ProtectedRoute>
          }
        />

        {/* Legacy Routes (kept for backward compatibility) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignments"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <Assignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-assignment"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <CreateAssignment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-submissions"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <MySubmissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submissions/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <Submissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grade/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <Grade />
            </ProtectedRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <Announcements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-announcement"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              <CreateAnnouncement />
            </ProtectedRoute>
          }
        />

        {/* Error Routes */}
        <Route path="/errors/404" element={<NotFound />} />
        <Route path="/errors/403" element={<Forbidden />} />

        {/* Catch all - 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;