import { useEffect,useState } from "react";
import { formatDate } from '../utils/dateFormatter';
import { useNavigate } from "react-router-dom";

export default function Announcements(){
  const [data,setData]=useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(()=>{
    fetch("https://student-assignment-submission-portal.onrender.com/api/announcements",{
      headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}
    })
    .then(r=>{
      if (!r.ok) throw new Error("Failed to fetch announcements");
      return r.json();
    })
    .then(res=>setData(res.announcements || res))
    .catch(err=>{
      setError("Failed to load announcements");
      console.error(err);
    })
    .finally(()=>setLoading(false));
  },[]);

  const deleteAnnouncement = async (id) => {
    try {
      const res = await fetch(`https://student-assignment-submission-portal.onrender.com/api/announcements/${id}`,{
        method:"DELETE",
        headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}
      });
      
      if (res.ok) {
        alert("Announcement deleted!");
        setData(data.filter(a => a._id !== id));
      } else {
        alert("Failed to delete announcement");
      }
    } catch (err) {
      alert("Error deleting announcement");
    }
  };

  if (loading) return <div style={{textAlign: "center", marginTop: "20px"}}>Loading...</div>;

  return (
    <div style={{maxWidth: "800px", margin: "20px auto", padding: "20px"}}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px"}}>
        <h1>Announcements</h1>
        <button onClick={()=>nav("/dashboard")} style={{padding: "8px 16px"}}>Back to Dashboard</button>
      </div>
      
      {error && <div style={{color: "red", marginBottom: "10px"}}>{error}</div>}
      
      {data.length === 0 ? (
        <p>No announcements yet.</p>
      ) : (
        data.map(a=>(
          <div key={a._id} style={{border: "1px solid #ddd", padding: "15px", marginBottom: "10px", borderRadius: "5px"}}>
            <h3>{a.title}</h3>
            <p>{a.message}</p>
            <small>By: {a.createdBy?.name || "Unknown"}</small>
            <br/>
            <small>{formatDate(a.createdAt)}</small>
            <br/>
            <button onClick={() => deleteAnnouncement(a._id)} style={{marginTop: "10px", padding: "5px 10px", cursor: "pointer", color: "red"}}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}