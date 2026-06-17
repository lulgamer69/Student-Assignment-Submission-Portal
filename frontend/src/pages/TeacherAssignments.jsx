import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, CheckSquare, Bell, LogOut, Search, Settings, Sun, Moon, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import acadlyLogo from '../assets/icons/Acadly logo.png';

const styles = `
  @keyframes pageLoadFade {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes cardSlideIn {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes blob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(20px, -50px) scale(1.1); }
    50% { transform: translate(-20px, 20px) scale(0.9); }
    75% { transform: translate(50px, 50px) scale(1.05); }
  }

  .animate-blob { animation: blob 7s infinite; }
  .page-fade-in { animation: pageLoadFade 0.7s ease-out; }
  .card-slide-in { animation: cardSlideIn 0.6s ease-out; }
  .card-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
  .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15) !important; }
`;

export default function TeacherAssignments() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('assignments');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://student-assignment-submission-portal.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await res.json();
        setUserData(data.user);
      } catch (err) {
        console.error("Failed to fetch user");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("https://student-assignment-submission-portal.onrender.com/api/assignments", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
          const result = await res.json();
          setData(Array.isArray(result) ? result : result.assignments || []);
        }
      } catch (err) {
        console.error("Failed to fetch assignments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

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

  const filteredAssignments = data.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1 max-w-md">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                  <Search size={18} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`bg-transparent outline-none w-full text-base ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-600'}`}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-500/20 border border-purple-500/30 text-purple-600">
                👨‍🏫 Teacher
              </div>
              <button className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
                <Bell size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
              </button>
              <button onClick={() => navigate('/teacher/profile')} className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
                <Settings size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
              </button>
              <button onClick={toggleTheme} className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => navigate('/teacher/profile')} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center text-white font-bold">
                {userData?.name?.charAt(0) || 'T'}
              </button>
            </div>
          </div>

          <div className="flex-1 min-w-0 overflow-y-auto relative z-5 px-8 py-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading...</p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        My Assignments
                      </h1>
                      <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        All assignments
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/teacher/create-assignment')}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all shadow-lg"
                    >
                      <Plus size={20} />
                      Create
                    </button>
                  </div>
                </div>

                {filteredAssignments.length === 0 ? (
                  <div className={`p-12 rounded-lg border-2 border-dashed text-center ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-300 bg-gray-50'}`}>
                    <FileText size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      No assignments
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredAssignments.map((a) => (
                      <div
                        key={a._id}
                        className={`card-hover rounded-lg p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-gray-200'} shadow-sm border backdrop-blur-sm cursor-pointer`}
                        onClick={() => navigate(`/teacher/assignments/${a._id}/submissions`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {a.title}
                            </h3>
                            {a.subject && (
                              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Subject: {a.subject}
                              </p>
                            )}
                            {a.description && (
                              <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {a.description}
                              </p>
                            )}
                            <p className={`text-sm mt-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Deadline: {new Date(a.deadline).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                              {a.submissions?.length || 0}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Submissions
                            </p>
                          </div>
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
    </>
  );
}
