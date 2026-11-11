import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LayoutDashboard, FileText, CheckSquare, Bell, LogOut, Sun, Moon, Download, Mail } from 'lucide-react';
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

export default function TeacherSubmissions() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { id: assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [nonSubmissions, setNonSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [activeNav, setActiveNav] = useState('submissions');
  const [activeTab, setActiveTab] = useState('submitted');
  const [sendingReminder, setSendingReminder] = useState({});
  const [viewMode, setViewMode] = useState(assignmentId ? 'details' : 'list'); // 'list' or 'details'

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
        if (data.user) {
          setUserData(data.user);
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

    const fetchData = async () => {
      try {
        console.log("Fetching data. Mode:", assignmentId ? 'details' : 'list');
        
        // Fetch total student count
        let totalStudents = 50; // fallback
        try {
          const countRes = await fetch("https://student-assignment-submission-portal.onrender.com/api/auth/students/count", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (countRes.ok) {
            const countData = await countRes.json();
            totalStudents = countData.count || 50;
          }
        } catch (err) {
          console.error("Failed to fetch student count, using fallback");
        }
        
        if (assignmentId) {
          // Fetch submissions for specific assignment
          console.log("Fetching submissions for assignment:", assignmentId);
          
          const submissionsRes = await fetch(
            `https://student-assignment-submission-portal.onrender.com/api/submissions/assignment/${assignmentId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          if (submissionsRes.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/login");
            return;
          }
          
          console.log("Submissions response:", submissionsRes.status);
          
          if (submissionsRes.ok) {
            const submissionsData = await submissionsRes.json();
            console.log("Submissions data:", submissionsData);
            
            const submittedList = submissionsData.submissions || [];
            
            const enrichedSubmissions = submittedList.map(sub => ({
              ...sub,
              studentName: sub.student?.name || 'Unknown',
              studentEmail: sub.student?.email || '',
              rollNumber: sub.student?.rollNumber || 'N/A',
              branch: sub.student?.branch || 'N/A',
              division: sub.student?.division || 'N/A'
            }));
            
            setSubmissions(enrichedSubmissions);
            
            // Fetch real non-submitted students
            try {
              const nonSubmittedRes = await fetch(
                `https://student-assignment-submission-portal.onrender.com/api/submissions/pending/${assignmentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              
              if (nonSubmittedRes.ok) {
                const nonSubmittedData = await nonSubmittedRes.json();
                const nonSubmittedList = nonSubmittedData.students || [];
                
                const enrichedNonSubmitted = nonSubmittedList.map(student => ({
                  _id: student._id,
                  studentName: student.name || 'Unknown',
                  studentEmail: student.email || '',
                  rollNumber: student.rollNumber || 'N/A',
                  branch: student.branch || 'N/A',
                  division: student.division || 'N/A'
                }));
                
                setNonSubmissions(enrichedNonSubmitted);
              } else {
                setNonSubmissions([]);
              }
            } catch (err) {
              console.error("Error fetching non-submitted students:", err);
              setNonSubmissions([]);
            }
          } else {
            setError("Failed to load submissions");
          }
        } else {
          // Fetch all assignments to show in list mode
          console.log("Fetching all assignments for list view");
          
          const assignmentsRes = await fetch(
            `https://student-assignment-submission-portal.onrender.com/api/assignments`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          if (assignmentsRes.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/login");
            return;
          }
          
          if (assignmentsRes.ok) {
            const assignmentData = await assignmentsRes.json();
            const assignmentList = Array.isArray(assignmentData) ? assignmentData : assignmentData.assignments || [];
            
            // For each assignment, get submission count
            const enrichedAssignments = await Promise.all(
              assignmentList.map(async (assignment) => {
                try {
                  const submissionsRes = await fetch(
                    `https://student-assignment-submission-portal.onrender.com/api/submissions/assignment/${assignment._id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  if (submissionsRes.ok) {
                    const submissionsData = await submissionsRes.json();
                    const submissions = submissionsData.submissions || [];
                    return {
                      ...assignment,
                      submittedCount: submissions.length,
                      pendingCount: Math.max(0, totalStudents - submissions.length)
                    };
                  }
                } catch (err) {
                  console.error("Error fetching submissions for assignment", assignment._id);
                }
                return { ...assignment, submittedCount: 0, pendingCount: totalStudents };
              })
            );
            
            setAssignments(enrichedAssignments);
          } else {
            setError("Failed to load assignments");
          }
        }
      } catch (err) {
        setError("Failed to load data: " + err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assignmentId, navigate]);

  const handleSendReminder = async (student) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setSendingReminder(prev => ({ ...prev, [student._id]: true }));
    try {
      const assignmentTitle = submissions[0]?.assignment?.title || "Assignment";
      const response = await fetch("https://student-assignment-submission-portal.onrender.com/api/notifications/send", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          studentId: student._id,
          type: "reminder",
          title: "Assignment Submission Reminder",
          message: `Please submit your assignment. Deadline is approaching!`,
          email: student.studentEmail,
          assignmentId: assignmentId
        })
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
        return;
      }

      if (response.ok) {
        alert(`Reminder sent to ${student.studentName}!`);
      } else {
        alert("Failed to send reminder");
      }
    } catch (err) {
      console.error("Error sending reminder:", err);
      alert("Error sending reminder");
    } finally {
      setSendingReminder(prev => ({ ...prev, [student._id]: false }));
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
      <div className={`page-fade-in responsive-app-shell flex flex-row h-screen w-screen overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-[#e8eeff]'}`}>
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
        <div className={`w-64 h-screen flex-shrink-0 responsive-app-sidebar ${isDark ? 'bg-slate-900/80 backdrop-blur-sm border-r border-slate-700/30' : 'bg-white/80 backdrop-blur-sm border-r border-gray-200/30'} flex flex-col overflow-y-auto relative z-10`}>
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
        <div className="flex-1 min-w-0 h-screen flex flex-col overflow-hidden relative z-5 responsive-app-main">
          {/* Top Bar */}
          <div className={`flex-shrink-0 responsive-app-topbar ${isDark ? 'bg-slate-900/70 backdrop-blur-sm border-b border-slate-700/50' : 'bg-white/70 backdrop-blur-sm border-b border-gray-200/50'} px-8 py-5 flex items-center justify-between`}>
            <div className="flex-1">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Assignment Submissions
              </h2>
            </div>

            <div className="flex items-center gap-4">
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
          <div className="flex-1 min-w-0 overflow-y-auto relative z-5 responsive-app-content p-8">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading...</p>
              </div>
            ) : error ? (
              <div className={`p-8 rounded-lg text-center ${isDark ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'}`}>
                <p className={isDark ? 'text-red-400' : 'text-red-600'}>{error}</p>
              </div>
            ) : viewMode === 'list' ? (
              // LIST VIEW - All Assignments
              <>
                <div className="mb-8 card-slide-in" style={{ animation: 'pageLoadFade 0.7s ease-out' }}>
                  <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    All Submissions
                  </h1>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Click on an assignment to view submissions
                  </p>
                </div>

                {assignments.length === 0 ? (
                  <div className={`p-8 rounded-lg text-center ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'} border`}>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No assignments yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {assignments.map((assignment, idx) => (
                      <div
                        key={assignment._id}
                        onClick={() => navigate(`/teacher/assignments/${assignment._id}/submissions`)}
                        className={`card-hover rounded-lg p-6 cursor-pointer ${isDark ? 'bg-slate-800/50 border-slate-700 hover:border-purple-500' : 'bg-white/50 border-gray-200 hover:border-purple-500'} shadow-sm border backdrop-blur-sm transition-all`}
                        style={{ animation: `cardSlideIn 0.6s ease-out ${idx * 0.05}s backwards` }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {assignment.title}
                            </h3>
                            {assignment.description && (
                              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {assignment.description.substring(0, 100)}...
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                            <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>SUBMITTED</p>
                            <p className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                              {assignment.submittedCount}
                            </p>
                          </div>
                          <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                            <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>PENDING</p>
                            <p className={`text-lg font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                              {assignment.pendingCount}
                            </p>
                          </div>
                          <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                            <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>DUE</p>
                            <p className={`text-lg font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                              {formatDate(assignment.deadline)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              // DETAIL VIEW - Specific Assignment Submissions
              <>
                <div className="mb-8 card-slide-in" style={{ animation: 'pageLoadFade 0.7s ease-out' }}>
                  <button
                    onClick={() => navigate('/teacher/submissions')}
                    className={`flex items-center gap-2 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-medium mb-4`}
                  >
                    ← Back to Assignments
                  </button>
                  <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Student Submissions
                  </h1>
                </div>

                <div className="flex gap-4 mb-8">
                  <button
                    onClick={() => setActiveTab('submitted')}
                    className={`px-6 py-2 font-semibold rounded-lg transition-all ${
                      activeTab === 'submitted'
                        ? 'bg-green-600 text-white'
                        : isDark ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    ✅ Submitted ({submissions.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-6 py-2 font-semibold rounded-lg transition-all ${
                      activeTab === 'pending'
                        ? 'bg-orange-600 text-white'
                        : isDark ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    ⏳ Pending ({nonSubmissions.length})
                  </button>
                </div>

                {activeTab === 'submitted' && (
                  <div className="space-y-4">
                    {submissions.length === 0 ? (
                      <div className={`p-8 rounded-lg text-center ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'} border`}>
                        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No submissions yet</p>
                      </div>
                    ) : (
                      submissions.map((sub, idx) => (
                        <div
                          key={sub._id}
                          className={`card-hover rounded-lg p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-gray-200'} shadow-sm border backdrop-blur-sm`}
                          style={{ animation: `cardSlideIn 0.6s ease-out ${idx * 0.05}s backwards` }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                                  {sub.studentName?.charAt(0)}
                                </div>
                                <div>
                                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {sub.studentName}
                                  </h3>
                                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {sub.rollNumber} | {sub.branch} {sub.division}
                                  </p>
                                </div>
                              </div>
                              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                Submitted: {formatDate(sub.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {sub.file && (
                                <a
                                  href={`https://student-assignment-submission-portal.onrender.com/${sub.file}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                                  title="Download submission"
                                >
                                  <Download size={18} />
                                </a>
                              )}
                              <button
                                onClick={() => navigate(`/grade/${sub._id}`)}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all"
                                title="Grade this submission"
                              >
                                Grade
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'pending' && (
                  <div className="space-y-4">
                    {nonSubmissions.length === 0 ? (
                      <div className={`p-8 rounded-lg text-center ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'} border`}>
                        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>All students have submitted!</p>
                      </div>
                    ) : (
                      nonSubmissions.map((student, idx) => (
                        <div
                          key={student._id}
                          className={`card-hover rounded-lg p-6 ${isDark ? 'bg-slate-800/50 border-orange-700/30' : 'bg-orange-50/50 border-orange-200'} shadow-sm border backdrop-blur-sm`}
                          style={{ animation: `cardSlideIn 0.6s ease-out ${idx * 0.05}s backwards` }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                                  {student.studentName?.charAt(0)}
                                </div>
                                <div>
                                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {student.studentName}
                                  </h3>
                                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {student.rollNumber} | {student.branch} {student.division}
                                  </p>
                                </div>
                              </div>
                              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                {student.studentEmail}
                              </p>
                            </div>
                            <button
                              onClick={() => handleSendReminder(student)}
                              disabled={sendingReminder[student._id]}
                              className="p-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg transition-all flex items-center gap-2"
                            >
                              <Mail size={18} />
                              {sendingReminder[student._id] ? "Sending..." : "Remind"}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
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
