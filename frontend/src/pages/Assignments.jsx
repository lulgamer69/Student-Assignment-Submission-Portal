import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, CheckSquare, Bell, LogOut, Search, Settings, Sun, Moon, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
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
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    25% {
      transform: translate(20px, -50px) scale(1.1);
    }
    50% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    75% {
      transform: translate(50px, 50px) scale(1.05);
    }
  }

  @keyframes dotScroll {
    0% { background-position: 0 0; }
    100% { background-position: 32px 32px; }
  }

  .animate-blob {
    animation: blob 7s infinite;
  }

  .page-fade-in {
    animation: pageLoadFade 0.7s ease-out;
  }

  .card-slide-in {
    animation: cardSlideIn 0.6s ease-out;
  }

  .card-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .card-hover:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15) !important;
  }
`;

export default function Assignments() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [userData, setUserData] = useState(null);
  const [activeNav, setActiveNav] = useState('assignments');
  const [filterTab, setFilterTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ total: 0, submitted: 0, pending: 0 });
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    if (filter === 'pending') {
      setFilterTab('pending');
    }
  }, [location.search]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://student-assignment-submission-portal.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await res.json();
        if (data.user) {
          setUserRole(data.user.role);
          setUserData(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user data");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const endpoint = userRole === "student" 
      ? "https://student-assignment-submission-portal.onrender.com/api/assignments/student"
      : "https://student-assignment-submission-portal.onrender.com/api/assignments";

    if (!userRole) return;

    fetch(endpoint, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(r => {
      if (!r.ok) throw new Error("Failed to fetch assignments");
      return r.json();
    })
    .then(res => {
      const assignments = Array.isArray(res) ? res : res.assignments || res;
      setData(assignments);

      const total = assignments.length;
      const submitted = assignments.filter(a => a.status === 'submitted').length;
      const pending = assignments.filter(a => a.status === 'not_submitted').length;
      setStats({ total, submitted, pending });

      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const upcoming = assignments
        .filter(a => {
          const deadline = new Date(a.deadline);
          return deadline >= now && deadline <= nextWeek;
        })
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 3);
      setUpcomingDeadlines(upcoming);
    })
    .catch(err => {
      setError("Failed to load assignments");
      console.error(err);
    })
    .finally(() => setLoading(false));
  }, [userRole]);

  const handleSearchInput = (query) => {
    setSearchQuery(query);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: userRole === 'student' ? '/student/dashboard' : '/teacher/dashboard' },
    { id: 'assignments', label: 'Assignments', icon: FileText, path: userRole === 'student' ? '/student/assignments' : '/teacher/assignments' },
    { id: 'submissions', label: 'Submissions', icon: CheckSquare, path: userRole === 'student' ? '/student/submissions' : '/teacher/submissions' },
    { id: 'announcements', label: 'Announcements', icon: Bell, path: userRole === 'student' ? '/student/announcements' : '/teacher/announcements' },
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'not_submitted': return { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-600', icon: AlertCircle };
      case 'submitted': return { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-600', icon: Clock };
      case 'evaluated': return { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-600', icon: CheckCircle };
      default: return { bg: 'bg-gray-500/20', border: 'border-gray-500/30', text: 'text-gray-600', icon: AlertCircle };
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'not_submitted': return 'Pending';
      case 'submitted': return 'Submitted';
      case 'evaluated': return 'Graded';
      default: return 'Unknown';
    }
  };

  const filteredAssignments = data.filter(a => {
    let matchesTab = true;
    if (filterTab === 'pending') matchesTab = a.status === 'not_submitted';
    if (filterTab === 'submitted') matchesTab = a.status === 'submitted';
    if (filterTab === 'graded') matchesTab = a.status === 'evaluated';

    let matchesSearch = true;
    if (searchQuery.trim() !== "") {
      matchesSearch = 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description?.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return matchesTab && matchesSearch;
  });

  const submitAssignment = async (assignmentId) => {
    const fileInput = document.getElementById(`file-${assignmentId}`);
    if (!fileInput || !fileInput.files[0]) {
      alert("Please select a file to submit");
      return;
    }

    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("file", fileInput.files[0]);

    try {
      const res = await fetch("https://student-assignment-submission-portal.onrender.com/api/submissions", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData
      });

      const result = await res.json();
      if (res.ok) {
        alert("Assignment submitted successfully!");
        window.location.reload();
      } else {
        alert(result.message || "Failed to submit assignment");
      }
    } catch (err) {
      alert("Error submitting assignment");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`page-fade-in flex h-screen w-screen overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-[#e8eeff]'}`}>
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950' : 'bg-gradient-to-br from-[#e8eeff] via-[#f0f4ff] to-[#eef2ff]'}`}/>
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-blob"/>
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/25 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }}/>
          <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }}/>
          <div className="absolute bottom-0 -right-40 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-blob" style={{ animationDelay: "3s" }}/>
        </div>

        <div className={`w-64 h-screen flex-shrink-0 ${isDark ? 'bg-slate-900/80 backdrop-blur-sm border-r border-slate-700/30' : 'bg-white/80 backdrop-blur-sm border-r border-gray-200/30'} flex flex-col overflow-y-auto relative z-10`}>
          <div className={`p-6 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <img src={acadlyLogo} alt="Acadly" className="w-8 h-8 object-contain" />
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Acadly</span>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                    activeNav === item.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : isDark
                      ? 'text-gray-300 hover:text-white hover:bg-slate-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
                isDark
                  ? 'text-red-400 hover:bg-slate-700 hover:text-red-300'
                  : 'text-red-600 hover:bg-gray-100 hover:text-red-700'
              }`}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="flex-1 min-w-0 h-screen flex flex-col overflow-hidden relative z-5">
          <div className={`flex-shrink-0 ${isDark ? 'bg-slate-900/70 backdrop-blur-sm border-b border-slate-700/50' : 'bg-white/70 backdrop-blur-sm border-b border-gray-200/50'} px-8 py-5 flex items-center justify-between`}>
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex-1 max-w-md">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                  <Search size={18} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    className={`bg-transparent outline-none w-full text-base ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-600'}`}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${userRole === 'student' ? 'bg-blue-500/20 border border-blue-500/30 text-blue-600' : 'bg-purple-500/20 border border-purple-500/30 text-purple-600'}`}>
                {userRole === 'student' ? '👨‍🎓 Student' : '👨‍🏫 Teacher'}
              </div>
              <button className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
                <Bell size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
              </button>
              <button onClick={() => navigate(userRole === 'student' ? '/student/profile' : '/teacher/profile')} className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
                <Settings size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
              </button>
              <button onClick={toggleTheme} className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => navigate(userRole === 'student' ? '/student/profile' : '/teacher/profile')} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold hover:shadow-lg transition-all">
                {userData?.name?.charAt(0) || 'S'}
              </button>
            </div>
          </div>

          <div className="flex-1 min-w-0 overflow-y-auto relative z-5 px-8 py-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading assignments...</p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Assignments
                      </h1>
                      <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {userRole === 'student' ? 'Your assignments' : 'All assignments'}
                      </p>
                    </div>
                    {userRole === 'teacher' && (
                      <button
                        onClick={() => navigate('/teacher/create-assignment')}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all shadow-lg"
                      >
                        <Plus size={20} />
                        Create
                      </button>
                    )}
                  </div>

                  {userRole === 'student' && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className={`rounded-lg p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-gray-200'} shadow-sm border backdrop-blur-sm`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total</p>
                            <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{stats.total}</p>
                          </div>
                          <FileText size={32} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                        </div>
                      </div>
                      <div className={`rounded-lg p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-gray-200'} shadow-sm border backdrop-blur-sm`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Submitted</p>
                            <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>{stats.submitted}</p>
                          </div>
                          <CheckCircle size={32} className={isDark ? 'text-green-400' : 'text-green-600'} />
                        </div>
                      </div>
                      <div className={`rounded-lg p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-gray-200'} shadow-sm border backdrop-blur-sm`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Pending</p>
                            <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{stats.pending}</p>
                          </div>
                          <AlertCircle size={32} className={isDark ? 'text-orange-400' : 'text-orange-600'} />
                        </div>
                      </div>
                    </div>
                  )}

                  {userRole === 'student' && upcomingDeadlines.length > 0 && (
                    <div className={`rounded-lg p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-gray-200'} shadow-sm border backdrop-blur-sm`}>
                      <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Upcoming Deadlines</h3>
                      <div className="space-y-3">
                        {upcomingDeadlines.map((a, idx) => (
                          <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                            <div>
                              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{a.title}</p>
                              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Due: {new Date(a.deadline).toLocaleDateString()}</p>
                            </div>
                            <Clock size={20} className={isDark ? 'text-orange-400' : 'text-orange-600'} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {userRole === 'student' && (
                  <div className="flex gap-3 mb-6">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'pending', label: 'Pending' },
                      { id: 'submitted', label: 'Submitted' },
                      { id: 'graded', label: 'Graded' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setFilterTab(tab.id)}
                        className={`px-5 py-2 rounded-lg font-medium transition-all ${
                          filterTab === tab.id
                            ? 'bg-blue-600 text-white shadow-md'
                            : isDark
                            ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}

                {error ? (
                  <div className={`p-6 rounded-lg border ${isDark ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {error}
                  </div>
                ) : filteredAssignments.length === 0 ? (
                  <div className={`p-12 rounded-lg border-2 border-dashed text-center ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-300 bg-gray-50'}`}>
                    <FileText size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
                      {searchQuery ? 'No assignments found' : 'No assignments available'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredAssignments.map((a, idx) => {
                      const statusColor = getStatusColor(a.status);
                      const StatusIcon = statusColor.icon;
                      return (
                        <div
                          key={a.id || a._id}
                          className={`card-hover rounded-lg p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-gray-200'} shadow-sm border backdrop-blur-sm`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {a.title}
                              </h3>
                              {a.subject && (
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  <strong>Subject:</strong> {a.subject}
                                </p>
                              )}
                            </div>
                            <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${statusColor.bg} border ${statusColor.border}`}>
                              <StatusIcon size={16} className={statusColor.text} />
                              <span className={`text-sm font-semibold ${statusColor.text}`}>{getStatusLabel(a.status)}</span>
                            </div>
                          </div>

                          {a.description && (
                            <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {a.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between mb-4">
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              <strong>Deadline:</strong> {a.deadline ? new Date(a.deadline).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>

                          {userRole === 'student' && a.status === 'not_submitted' && (
                            <div className="flex gap-3 items-center">
                              <input
                                type="file"
                                id={`file-${a._id}`}
                                className={`flex-1 text-sm`}
                              />
                              <button
                                onClick={() => submitAssignment(a._id)}
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all"
                              >
                                Submit
                              </button>
                            </div>
                          )}

                          {userRole === 'student' && a.status === 'evaluated' && a.marks && (
                            <div className={`p-4 rounded-lg ${isDark ? 'bg-green-500/20 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
                              <p className={`text-sm font-semibold ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                                Marks: {a.marks.total}
                              </p>
                            </div>
                          )}

                          {userRole === 'teacher' && (
                            <button
                              onClick={() => navigate(`/teacher/assignments/${a._id}/submissions`)}
                              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all"
                            >
                              View Submissions
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
