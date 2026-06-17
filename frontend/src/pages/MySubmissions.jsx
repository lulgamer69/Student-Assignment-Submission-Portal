import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MySubmissions() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    fetch("https://student-assignment-submission-portal.onrender.com/api/submissions/my", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(r => {
      if (!r.ok) throw new Error("Failed to fetch submissions");
      return r.json();
    })
    .then(res => setData(res.submissions || res))
    .catch(err => {
      setError("Failed to load submissions");
      console.error(err);
    })
    .finally(() => setLoading(false));
  }, []);

  const downloadReport = async (submissionId) => {
    try {
      const res = await fetch(`https://student-assignment-submission-portal.onrender.com/api/submissions/${submissionId}/download`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${submissionId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to download report");
      }
    } catch (err) {
      alert("Error downloading report");
    }
  };

  if (loading) return <div style={{textAlign: "center", marginTop: "20px"}}>Loading...</div>;

  return (
    <div style={{maxWidth: "900px", margin: "20px auto", padding: "20px"}}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px"}}>
        <h1>My Submissions</h1>
        <button onClick={() => nav("/dashboard")} style={{padding: "8px 16px"}}>Back to Dashboard</button>
      </div>
      
      {error && <div style={{color: "red", marginBottom: "10px"}}>{error}</div>}
      
      {data.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <div style={{overflowX: "auto"}}>
          <table style={{width: "100%", borderCollapse: "collapse", border: "1px solid #ddd"}}>
            <thead>
              <tr style={{backgroundColor: "#f5f5f5"}}>
                <th style={{border: "1px solid #ddd", padding: "10px", textAlign: "left"}}>Assignment</th>
                <th style={{border: "1px solid #ddd", padding: "10px", textAlign: "left"}}>Created By</th>
                <th style={{border: "1px solid #ddd", padding: "10px", textAlign: "left"}}>Deadline</th>
                <th style={{border: "1px solid #ddd", padding: "10px", textAlign: "left"}}>Submitted On</th>
                <th style={{border: "1px solid #ddd", padding: "10px", textAlign: "left"}}>Marks</th>
                <th style={{border: "1px solid #ddd", padding: "10px", textAlign: "left"}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map(s => (
                <tr key={s._id}>
                  <td style={{border: "1px solid #ddd", padding: "10px"}}>{s.assignment?.title || "N/A"}</td>
                  <td style={{border: "1px solid #ddd", padding: "10px"}}>{s.assignment?.createdBy?.name || "N/A"}</td>
                  <td style={{border: "1px solid #ddd", padding: "10px"}}>
                    {s.assignment?.deadline && !isNaN(new Date(s.assignment.deadline).getTime()) ? new Date(s.assignment.deadline).toLocaleString() : "N/A"}
                  </td>
                  <td style={{border: "1px solid #ddd", padding: "10px"}}>
                    {s.submittedAt && !isNaN(new Date(s.submittedAt).getTime()) ? new Date(s.submittedAt).toLocaleString() : "N/A"}
                  </td>
                  <td style={{border: "1px solid #ddd", padding: "10px"}}>
                    {s.marks ? (
                      <div>
                        <small>TS: {s.marks.TS}, OM: {s.marks.OM}, PR: {s.marks.PR}, IA: {s.marks.IA}</small>
                        <br/>
                        <strong>Total: {s.marks.total}</strong>
                      </div>
                    ) : (
                      "Not graded yet"
                    )}
                  </td>
                  <td style={{border: "1px solid #ddd", padding: "10px"}}>
                    {s.marks && (
                      <button 
                        onClick={() => downloadReport(s._id)}
                        style={{padding: "5px 10px", cursor: "pointer"}}
                      >
                        Download Report
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
