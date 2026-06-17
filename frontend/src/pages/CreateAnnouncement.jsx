import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateAnnouncement(){
  const [title,setTitle]=useState("");
  const [message,setMessage]=useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const validate = () => {
    if (!title || title.trim() === "") {
      setError("Title is required");
      return false;
    }
    if (!message || message.trim() === "") {
      setError("Message is required");
      return false;
    }
    setError("");
    return true;
  };

  const create=async()=>{
    if (!validate()) return;
    
    setLoading(true);
    try {
      const res=await fetch("https://student-assignment-submission-portal.onrender.com/api/announcements",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${localStorage.getItem("token")}`
        },
        body:JSON.stringify({title,message})
      });

      const data = await res.json();
      if (res.ok) {
        alert("Announcement created successfully!");
        nav("/announcements");
      } else {
        setError(data.message || "Failed to create announcement");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth: "600px", margin: "20px auto", padding: "20px"}}>
      <h1>Create Announcement</h1>
      {error && <div style={{color: "red", marginBottom: "10px"}}>{error}</div>}
      <input placeholder="Title" onChange={e=>setTitle(e.target.value)} style={{width: "100%", padding: "8px", marginBottom: "10px"}} />
      <textarea placeholder="Message" onChange={e=>setMessage(e.target.value)} style={{width: "100%", padding: "8px", marginBottom: "10px", minHeight: "100px"}} />
      <button onClick={create} disabled={loading} style={{padding: "10px 20px", cursor: loading ? "not-allowed" : "pointer"}}>{loading ? "Creating..." : "Create"}</button>
    </div>
  );
}