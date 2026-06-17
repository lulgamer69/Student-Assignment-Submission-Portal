import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const nav = useNavigate();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const getMe = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await res.json();
        if (data.user) {
          setUserRole(data.user.role);
        }
      } catch (err) {
        console.error("Failed to fetch user data");
      }
    };
    getMe();
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Dashboard</h1>
        <button onClick={() => { localStorage.clear(); nav("/"); }} style={{ padding: "8px 16px", cursor: "pointer" }}>
          Logout
        </button>
      </div>

      {userRole === "student" && (
        <div>
          <h2>Student Menu</h2>
          <button 
            onClick={() => nav("/assignments")} 
            style={{ width: "100%", padding: "12px", marginBottom: "10px", cursor: "pointer", fontSize: "16px" }}
          >
            View Assignments
          </button>
          <button 
            onClick={() => nav("/my-submissions")} 
            style={{ width: "100%", padding: "12px", marginBottom: "10px", cursor: "pointer", fontSize: "16px" }}
          >
            My Submissions
          </button>
          <button 
            onClick={() => nav("/announcements")} 
            style={{ width: "100%", padding: "12px", marginBottom: "10px", cursor: "pointer", fontSize: "16px" }}
          >
            View Announcements
          </button>
        </div>
      )}

      {userRole === "teacher" && (
        <div>
          <h2>Teacher Menu</h2>
          <button 
            onClick={() => nav("/assignments")} 
            style={{ width: "100%", padding: "12px", marginBottom: "10px", cursor: "pointer", fontSize: "16px" }}
          >
            Manage Assignments
          </button>
          <button 
            onClick={() => nav("/create-assignment")} 
            style={{ width: "100%", padding: "12px", marginBottom: "10px", cursor: "pointer", fontSize: "16px" }}
          >
            Create Assignment
          </button>
          <button 
            onClick={() => nav("/announcements")} 
            style={{ width: "100%", padding: "12px", marginBottom: "10px", cursor: "pointer", fontSize: "16px" }}
          >
            View Announcements
          </button>
          <button 
            onClick={() => nav("/create-announcement")} 
            style={{ width: "100%", padding: "12px", marginBottom: "10px", cursor: "pointer", fontSize: "16px" }}
          >
            Create Announcement
          </button>
        </div>
      )}
    </div>
  );
}