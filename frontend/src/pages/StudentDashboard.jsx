import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, CheckSquare, Bell, LogOut, Search, Settings, Moon, Sun } from 'lucide-react';
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
    transform: translateY(-8px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3) !important;
  }
`;

export default function StudentDashboard() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState('student');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, submitted: 0, pending: 0 });
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const userRes = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUserData(userData.user);
          setUserRole(userData.user?.role || 'student');
        }

        const assignmentRes = await fetch('http://localhost:5000/api/assignments/student', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (assignmentRes.ok) {
          const assignments = await assignmentRes.json();
          const assignmentList = Array.isArray(assignments) ? assignments : assignments.assignments || [];
          
          const total = assignmentList.length;
          const submitted = assignmentList.filter(a => a.status === 'submitted').length;
          const pending = assignmentList.filter(a => a.status === 'not_submitted').length;
          setStats({ total, submitted, pending });

          const now = new Date();
          const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          const upcoming = assignmentList
            .filter(a => {
              const deadline = new Date(a.deadline);
              return deadline >= now && deadline <= nextWeek;
            })
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
            .slice(0, 3);
          setUpcomingDeadlines(upcoming);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    if (showNotifications) {
      fetchNotifications();
    }
    
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [showNotifications]);

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
            {navItems.map((item, idx) => {
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
          <div className={`flex-shrink-0 ${isDark ? 'bg-slate-900/70 backdrop-blur-sm border-b border-slate-700/50' : 'bg-white/70 backdrop-blur-sm border-b border-gray-200/50'} px-8 py-5 flex items-center justify-between relative z-20`}>
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex-1 max-w-md">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                  <Search size={18} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className={`bg-transparent outline-none w-full text-base ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-600'}`}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 relative">
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${userRole === 'student' ? 'bg-blue-500/20 border border-blue-500/30 text-blue-600' : 'bg-purple-500/20 border border-purple-500/30 text-purple-600'}`}>
                {userRole === 'student' ? '👨‍🎓 Student' : '👨‍🏫 Teacher'}
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2 rounded-lg transition-all relative ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
                >
                  <Bell size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length > 99 ? '99+' : notifications.length}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className={`absolute right-0 top-12 w-80 rounded-lg shadow-2xl border z-50 max-h-96 overflow-y-auto ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <div className={`p-4 border-b font-semibold ${isDark ? 'border-slate-700 text-white' : 'border-gray-200 text-gray-900'}`}>
                      Notifications
                    </div>
                    {notifications.length === 0 ? (
                      <div className={`p-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p>No notifications</p>
                      </div>
                    ) : (
                      <div>
                        {notifications.map(notif => (
                          <div 
                            key={notif._id}
                            className={`p-4 border-b cursor-pointer transition-all ${isDark ? 'border-slate-700 hover:bg-slate-700' : 'border-gray-100 hover:bg-gray-50'}`}
                          >
                            <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {notif.title}
                            </p>
                            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {notif.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <button
                onClick={() => navigate('/student/profile')}
                className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
              >
                <Settings size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
              </button>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => navigate('/student/profile')}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold hover:shadow-lg transition-all"
              >
                {userData?.name?.charAt(0) || 'S'}
              </button>
            </div>
          </div>

          <div className="flex-1 min-w-0 overflow-y-auto relative z-5 px-8 py-8">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading...</p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Welcome! <span className="text-blue-500">{userData?.name || 'Student'}</span>
                  </h1>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Here's your dashboard overview.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-8">
                  {[
                    { label: 'Assignments', value: stats.total.toString(), color: 'from-blue-400 to-blue-600', icon: '📝' },
                    { label: 'Submissions', value: stats.submitted.toString(), color: 'from-green-400 to-green-600', icon: '✅' },
                    { label: 'Pending', value: stats.pending.toString(), color: 'from-orange-400 to-orange-600', icon: '⏳' }
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className={`card-hover rounded-lg p-6 ${
                        isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-gray-200'
                      } shadow-sm border backdrop-blur-sm cursor-pointer`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {stat.label}
                        </p>
                        <span className="text-2xl">{stat.icon}</span>
                      </div>
                      <p className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div>
                  <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Upcoming Deadlines
                  </h2>

                  {upcomingDeadlines.length === 0 ? (
                    <div className={`card-hover rounded-lg p-8 text-center ${
                      isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-gray-200'
                    } shadow-sm border backdrop-blur-sm`}>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        No upcoming deadlines
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingDeadlines.map((deadline, idx) => (
                        <div
                          key={idx}
                          className={`card-hover rounded-lg p-4 ${
                            isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-gray-200'
                          } shadow-sm border backdrop-blur-sm cursor-pointer`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {deadline.title}
                              </p>
                              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Due: {new Date(deadline.deadline).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="text-2xl">📅</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
