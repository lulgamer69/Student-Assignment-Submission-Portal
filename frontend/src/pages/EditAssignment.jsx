import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTheme } from '../context/ThemeContext';

export default function EditAssignment() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(!!id);

  // If ID provided, fetch assignment data
  useEffect(() => {
    if (!id) {
      setPageLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAssignment = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/assignments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (res.ok) {
          const data = await res.json();
          const assignment = data.assignment || data;
          setForm({
            title: assignment.title || "",
            description: assignment.description || "",
            deadline: assignment.deadline ? new Date(assignment.deadline).toISOString().slice(0, 16) : "",
            totalMarks: assignment.totalMarks || "",
            message: assignment.message || ""
          });
        }
      } catch (err) {
        console.error("Failed to fetch assignment:", err);
        setError("Failed to load assignment");
      } finally {
        setPageLoading(false);
      }
    };

    fetchAssignment();
  }, [id, navigate]);

  const validate = () => {
    // For edit mode, allow partial updates - only validate fields that are provided
    if (form.totalMarks && isNaN(form.totalMarks)) {
      setError("Total marks must be a valid number");
      return false;
    }
    
    // Check at least one field is being updated
    if (id && !form.title && !form.description && !form.deadline && !form.totalMarks && !form.message) {
      setError("Please update at least one field");
      return false;
    }
    
    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      // For edit mode, only include fields that have values
      const payload = {};
      if (form.title && form.title.trim()) payload.title = form.title;
      if (form.description && form.description.trim()) payload.description = form.description;
      if (form.deadline) payload.deadline = form.deadline;
      if (form.totalMarks) payload.totalMarks = form.totalMarks;
      if (form.message && form.message.trim()) payload.message = form.message;

      if (id) {
        // Edit existing assignment
        const res = await fetch(`http://localhost:5000/api/assignments/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const contentType = res.headers.get('content-type');
          let data = {};
          if (contentType && contentType.includes('application/json')) {
            data = await res.json();
          }
          setError(data.message || `Server error: ${res.status}`);
          return;
        }

        const data = await res.json();
        alert("Assignment updated successfully!");
        navigate("/teacher/assignments");
      } else {
        // Create new assignment (without file in this simplified version)
        // Original create requires file, so this just edits
        setError("File upload required when creating new assignments. Use the Create page instead.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-medium">Loading assignment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-3xl mx-auto px-8 py-12">
        <button 
          onClick={() => navigate('/teacher/assignments')} 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8"
        >
          <ArrowLeft size={20} />
          Back to Assignments
        </button>
        
        <div className={`rounded-lg p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h1 className="text-4xl font-bold mb-8">{id ? 'Edit Assignment' : 'Create Assignment'}</h1>
          
          {error && (
            <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'}`}>
              <p className={isDark ? 'text-red-400' : 'text-red-600'}>{error}</p>
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Title</label>
              <input 
                type="text"
                placeholder="Assignment title" 
                value={form.title || ''}
                onChange={e => setForm({...form, title: e.target.value})} 
                className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea 
                placeholder="Assignment description" 
                value={form.description || ''}
                onChange={e => setForm({...form, description: e.target.value})} 
                className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                rows="4"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Deadline</label>
              <input 
                type="datetime-local"
                value={form.deadline || ''}
                onChange={e => setForm({...form, deadline: e.target.value})} 
                className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Total Marks</label>
              <input 
                type="number"
                placeholder="100" 
                value={form.totalMarks || ''}
                onChange={e => setForm({...form, totalMarks: e.target.value})} 
                className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Instructions/Message</label>
              <textarea 
                placeholder="Instructions for students" 
                value={form.message || ''}
                onChange={e => setForm({...form, message: e.target.value})} 
                className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                rows="3"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-1 py-2 rounded-lg font-semibold text-white transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
              }`}
            >
              {loading ? 'Saving...' : (id ? 'Update Assignment' : 'Create Assignment')}
            </button>
            <button
              onClick={() => navigate('/teacher/assignments')}
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
