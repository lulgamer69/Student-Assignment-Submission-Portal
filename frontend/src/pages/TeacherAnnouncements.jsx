import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, CheckSquare, Bell, LogOut, Sun, Moon, Plus, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import acadlyLogo from '../assets/icons/Acadly logo.png';

const styles = `
  @keyframes pageLoadFade {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes cardSlideIn {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes blob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(20px, -50px) scale(1.1); }
    50% { transform: translate(-20px, 20px) scale(0.9); }
    75% { transform: translate(50px, 50px) scale(1.05); }
  }

  @keyframes dotScroll {
    0% { background-position: 0 0; }
    100% { background-position: 32px 32px; }
  }

  .animate-blob { animation: blob 7s infinite; }
  .page-fade-in { animation: pageLoadFade 0.7s ease-out; }
  .card-slide-in { animation: cardSlideIn 0.6s ease-out; }
  .card-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
  .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15) !important; }
`;

export default function TeacherAnnouncements() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const [activeNav, setActiveNav] = useState('announcements');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", message: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("https://student-assignment-submission-portal.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
          return;
        }
        const data = await res.json();
        if (data.user) setUserData(data.user);
      } catch (err) {
        console.error("Failed to fetch user data");
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("https://student-assignment-submission-portal.onrender.com/api/announcements", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch announcements");
        const data = await res.json();
        setAnnouncements(Array.isArray(data) ? data : data.announcements || []);
      } catch (err) {
        setError("Failed to load announcements");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [navigate]);

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.message.trim()) {
      alert("Please fill in all fields");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("https://student-assignment-submission-portal.onrender.com/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newAnnouncement)
      });
      
      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
        return;
      }

      if (res.ok) {
        const created = await res.json();
        setAnnouncements([created, ...announcements]);
        setNewAnnouncement({ title: "", message: "" });
        setShowCreateModal(false);
        alert("Announcement created successfully!");
      } else {
        alert("Failed to create announcement");
      }
    } catch (err) {
      console.error("Error creating announcement:", err);
      alert("Error creating announcement");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`https://student-assignment-submission-portal.onrender.com/api/announcements/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
        return;
      }

      if (res.ok) {
        setAnnouncements(announcements.filter(a => a._id !== id));
        alert("Announcement deleted successfully!");
      } else {
        alert("Failed to delete announcement");
      }
    } catch (err) {
      console.error("Error deleting announcement:", err);
      alert("Error deleting announcement");
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/teacher/dashboard' },
    { id: 'assignments', label: 'Assignments', icon: FileText, path: '/teacher/assignments' },
    { id: 'submissions', label: 'Submissions', icon: CheckSquare, path: '/teacher/submissions' },
    { id: 'announcements', label: 'Announcements', icon: Bell, path: '/teacher/announcements' },
  ];

  const handleNavClick = (item) => {
    setActiveNav(item.id);
    navigate(item.path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`page-fade-in flex flex-row h-screen w-screen overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-[#e8eeff]'}`}>
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950' : 'bg-gradient-to-br from-[#e8eeff] via-[#f0f4ff] to-[#eef2ff]'}`}/>
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-blob"/>
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/25 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }}/>
          <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }}/>
          <div className="absolute bottom-0 -right-40 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-blob" style={{ animationDelay: "3s" }}/>
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle, ${isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.06)"} 1.5px, transparent 1.5px)`, backgroundSize: "32px 32px", animation: "dotScroll 25s linear infinite" }} />
        </div>

        {/* Sidebar */}
        <div className={`w-64 h-screen flex-shrink-0 ${isDark ? 'bg-slate-900/80 backdrop-blur-sm border-r border-slate-700/30' : 'bg-white/80 backdrop-blur-sm border-r border-gray-200/30'} flex flex-col overflow-y-auto relative z-10`}>
          <div className={`p-6 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <img src={acadlyLogo} alt="Acadly" className="w-8 h-8 object-contain" />
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Acadly</span>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-2 flex-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  style={{ animation: `pageLoadFade 0.7s ease-out ${idx * 0.1}s backwards` }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                    activeNav === item.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : isDark ? 'text-gray-300 hover:text-white hover:bg-slate-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                isDark ? 'text-red-400 hover:bg-slate-700 hover:text-red-300' : 'text-red-600 hover:bg-gray-100 hover:text-red-700'
              }`}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 h-screen flex flex-col overflow-hidden relative z-5">
          {/* Top Bar */}
          <div className={`flex-shrink-0 ${isDark ? 'bg-slate-900/70 backdrop-blur-sm border-b border-slate-700/50' : 'bg-white/70 backdrop-blur-sm border-b border-gray-200/50'} px-8 py-5 flex items-center justify-between`}>
            <div className="flex-1">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Announcements</h2>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all"
              >
                <Plus size={18} />
                Create
              </button>
              <div className={`px-4 py-2 rounded-full text-sm font-semibold bg-purple-500/20 border border-purple-500/30 text-purple-600`}>
                👨‍🏫 Teacher
              </div>
              <button onClick={toggleTheme} className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => navigate('/teacher/profile')} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white font-bold hover:shadow-lg transition-all">
                {userData?.name?.charAt(0) || 'T'}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0 overflow-y-auto relative z-5 p-8">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading announcements...</p>
              </div>
            ) : (
              <>
                <div className="mb-8 card-slide-in" style={{ animation: 'pageLoadFade 0.7s ease-out' }}>
                  <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Announcements
                  </h1>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Manage and share announcements with your students
                  </p>
                </div>

                {error ? (
                  <div className={`p-6 rounded-lg border ${isDark ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {error}
                  </div>
                ) : announcements.length === 0 ? (
                  <div className={`p-12 rounded-lg border-2 border-dashed text-center ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-300 bg-gray-50'}`}>
                    <Bell size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
                      No announcements yet. Create one to get started!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {announcements.map((ann, idx) => (
                      <div
                        key={ann._id}
                        className={`card-hover rounded-lg p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-gray-200'} shadow-sm border backdrop-blur-sm`}
                        style={{ animation: `cardSlideIn 0.6s ease-out ${idx * 0.05}s backwards` }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {ann.title}
                            </h3>
                            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>
                              {ann.message}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            Posted: {new Date(ann.createdAt).toLocaleString()}
                          </p>
                          <button
                            onClick={() => handleDeleteAnnouncement(ann._id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-lg p-8 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Create Announcement
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Title
                </label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="Enter announcement title"
                  className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:border-purple-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Message
                </label>
                <textarea
                  value={newAnnouncement.message}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                  placeholder="Enter announcement message"
                  rows="6"
                  className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:border-purple-500`}
                />
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAnnouncement}
                  disabled={creating}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
