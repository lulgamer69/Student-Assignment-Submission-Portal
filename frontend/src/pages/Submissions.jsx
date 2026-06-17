import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, CheckSquare, Bell, LogOut, Settings, Sun, Moon, Search, Download, X, Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { formatDate } from '../utils/dateFormatter';
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

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
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

  .modal-overlay {
    animation: slideIn 0.3s ease-out;
  }
`;

export default function Submissions() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [activeNav, setActiveNav] = useState('submissions');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
          return;
        }
        const data = await res.json();
        if (data.user) {
          setUserData(data.user);
          setUserRole(data.user.role || 'student');
        }
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

    fetch("http://localhost:5000/api/submissions/my", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(r => {
      if (r.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
        return;
      }
      if (!r.ok) throw new Error("Failed to fetch submissions");
      return r.json();
    })
    .then(res => {
      if (res) {
        const submissions = Array.isArray(res) ? res : res.submissions || res;
        setData(submissions);
      }
    })
    .catch(err => {
      setError("Failed to load submissions");
      console.error(err);
    })
    .finally(() => setLoading(false));
  }, [navigate]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
    { id: 'assignments', label: 'Assignments', icon: FileText, path: '/student/assignments' },
    { id: 'submissions', label: 'Submissions', icon: CheckSquare, path: '/student/submissions' },
    { id: 'announcements', label: 'Announcements', icon: Bell, path: '/student/announcements' },
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
      case 'pending': return { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-600', label: 'Evaluation Pending' };
      case 'submitted': return { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-600', label: 'Submitted' };
      case 'graded': return { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-600', label: 'Evaluation Done' };
      default: return { bg: 'bg-gray-500/20', border: 'border-gray-500/30', text: 'text-gray-600', label: 'Unknown' };
    }
  };

  const handleViewMarks = (submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  const handleDownloadRubrics = (submission) => {
    const token = localStorage.getItem("token");
    const link = document.createElement('a');
    link.href = `http://localhost:5000/api/submissions/${submission._id}/download`;
    link.setAttribute('Authorization', `Bearer ${token}`);
    link.download = `marked-rubrics-${submission._id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubmissions = data.filter(s =>
    s.assignmentTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.assignmentDescription?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style>{styles}</style>
      <div className={`page-fade-in flex flex-row h-screen w-screen overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-[#e8eeff]'}`}>
        {/* BACKGROUND BLOBS */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950' : 'bg-gradient-to-br from-[#e8eeff] via-[#f0f4ff] to-[#eef2ff]'}`}/>
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-blob"/>
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/25 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }}/>
          <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }}/>
          <div className="absolute bottom-0 -right-40 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-blob" style={{ animationDelay: "3s" }}/>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, ${isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.06)"} 1.5px, transparent 1.5px)`,
              backgroundSize: "32px 32px",
              animation: "dotScroll 25s linear infinite",
            }}
          />
        </div>

        {/* Sidebar */}
        <div className={`w-64 h-screen flex-shrink-0 top-0 left-0 ${isDark ? 'bg-slate-900/80 backdrop-blur-sm border-r border-slate-700/30' : 'bg-white/80 backdrop-blur-sm border-r border-gray-200/30'} flex flex-col overflow-y-auto relative z-10`}>
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

        {/* Main Content */}
        <div className="flex-1 min-w-0 h-screen flex flex-col overflow-hidden relative z-5">
          {/* Top Bar */}
          <div className={`flex-shrink-0 ${isDark ? 'bg-slate-900/70 backdrop-blur-sm border-b border-slate-700/50' : 'bg-white/70 backdrop-blur-sm border-b border-gray-200/50'} px-8 py-5 flex items-center justify-between`}>
            <div className="flex-1 max-w-md relative">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                <Search size={18} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                <input
                  type="text"
                  placeholder="Search submissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`bg-transparent outline-none w-full ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-600'}`}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600">
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${userRole === 'student' ? 'bg-blue-500/20 border border-blue-500/30 text-blue-600' : 'bg-purple-500/20 border border-purple-500/30 text-purple-600'}`}>
                {userRole === 'student' ? '👨‍🎓 Student' : '👨‍🏫 Teacher'}
              </div>
              <button onClick={toggleTheme} className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => navigate('/student/profile')} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold hover:shadow-lg transition-all">
                {userData?.name?.charAt(0) || 'S'}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0 overflow-y-auto relative z-5 p-8">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading submissions...</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-8 card-slide-in" style={{ animation: 'pageLoadFade 0.7s ease-out' }}>
                  <div>
                    <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Submissions
                    </h1>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      View all your assignment submissions and grades
                    </p>
                  </div>
                </div>

                {/* Submissions Grid */}
                {error ? (
                  <div className={`p-6 rounded-lg border ${isDark ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {error}
                  </div>
                ) : filteredSubmissions.length === 0 ? (
                  <div className={`p-12 rounded-lg border-2 border-dashed text-center ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-300 bg-gray-50'}`}>
                    <FileText size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
                      {searchQuery ? 'No submissions found with that search' : 'No submissions yet'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredSubmissions.map((submission, idx) => {
                      const statusColor = getStatusColor(submission.status);
                      return (
                        <div
                          key={submission._id}
                          className={`card-hover card-slide-in rounded-lg p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-gray-200'} shadow-sm border backdrop-blur-sm`}
                          style={{ animation: `cardSlideIn 0.6s ease-out ${idx * 0.05}s backwards` }}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {submission.assignmentTitle}
                              </h3>
                              {submission.assignmentDescription && (
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {submission.assignmentDescription}
                                </p>
                              )}
                            </div>
                            <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${statusColor.bg} border ${statusColor.border}`}>
                              <span className={`text-sm font-semibold ${statusColor.text}`}>{statusColor.label}</span>
                            </div>
                          </div>

                          {/* Submission Details */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>SUBMITTED ON</p>
                              <p className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {formatDate(submission.createdAt || submission.submittedAt)}
                              </p>
                            </div>
                            {submission.status === 'graded' && submission.marks && (
                              <div>
                                <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>MARKS OBTAINED</p>
                                <p className={`text-sm font-semibold text-green-500`}>
                                  {((submission.marks.TS || 0) + (submission.marks.OM || 0) + (submission.marks.PR || 0) + (submission.marks.IA || 0)).toFixed(0)} / {submission.assignment?.totalMarks || 100}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 items-center flex-wrap">
                            {submission.status === 'graded' && submission.marks && (
                              <button
                                onClick={() => handleViewMarks(submission)}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all"
                              >
                                ✓ Graded
                              </button>
                            )}
                            {submission.status === 'graded' && (
                              <button
                                onClick={() => handleDownloadRubrics(submission)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all"
                              >
                                <Download size={18} />
                                Marked PDF
                              </button>
                            )}
                            {submission.file && (
                              <a
                                href={`http://localhost:5000/${submission.file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all"
                              >
                                <Download size={18} />
                                Download
                              </a>
                            )}
                          </div>
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

      {/* Marks Modal */}
      {showModal && selectedSubmission && (
        <div className={`fixed inset-0 ${isDark ? 'bg-black/50' : 'bg-black/30'} z-50 flex items-center justify-center p-4`}>
          <div 
            className={`modal-overlay rounded-lg ${isDark ? 'bg-slate-800' : 'bg-white'} p-6 max-w-2xl w-full max-h-96 overflow-y-auto`}
            style={{ animation: 'slideIn 0.3s ease-out' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Evaluation Report
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <X size={24} />
              </button>
            </div>

            {/* Marks Details */}
            <div className="space-y-4">
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>ASSIGNMENT</p>
                <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {selectedSubmission.assignmentTitle}
                </p>
              </div>

              <div className={`rounded-lg p-4 ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3`}>MARKS BREAKDOWN</p>
                <div className="space-y-2">
                  {selectedSubmission.marks.TS && (
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Theory/Subject (TS)</span>
                      <span className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{selectedSubmission.marks.TS}</span>
                    </div>
                  )}
                  {selectedSubmission.marks.OM && (
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Original/Methodology (OM)</span>
                      <span className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{selectedSubmission.marks.OM}</span>
                    </div>
                  )}
                  {selectedSubmission.marks.PR && (
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Presentation (PR)</span>
                      <span className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{selectedSubmission.marks.PR}</span>
                    </div>
                  )}
                  {selectedSubmission.marks.IA && (
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Internal Assessment (IA)</span>
                      <span className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{selectedSubmission.marks.IA}</span>
                    </div>
                  )}
                  <div className={`border-t ${isDark ? 'border-slate-600' : 'border-gray-200'} pt-2 mt-2 flex justify-between`}>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Total Marks</span>
                    <span className={`font-bold text-green-500`}>{selectedSubmission.marks.total} / {selectedSubmission.marks.totalMarks || 100}</span>
                  </div>
                </div>
              </div>

              {selectedSubmission.marks.feedback && (
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>FEEDBACK</p>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    {selectedSubmission.marks.feedback}
                  </p>
                </div>
              )}
            </div>

            {/* PDF Viewer (if rubrics available) */}
            {selectedSubmission.rubrics && (
              <div className="mt-6">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3`}>RUBRICS PDF</p>
                <iframe
                  src={`http://localhost:5000/${selectedSubmission.rubrics}`}
                  title="Rubrics"
                  className={`w-full h-64 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}
                />
                <button
                  onClick={() => handleDownloadRubrics(selectedSubmission)}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all"
                >
                  <Download size={18} />
                  Download Rubrics PDF
                </button>
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className={`w-full mt-6 px-4 py-2 rounded-lg font-semibold transition-all ${
                isDark
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}