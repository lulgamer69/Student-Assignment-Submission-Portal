import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, CheckSquare, Bell, LogOut, Sun, Moon, Edit2, Lock } from 'lucide-react';
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
`;

export default function TeacherProfile() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('profile');
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    department: '',
    phone: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://student-assignment-submission-portal.onrender.com/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUserData(data.user);
          setProfileForm({
            name: data.user.name,
            email: data.user.email,
            department: data.user.department || '',
            phone: data.user.phone || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://student-assignment-submission-portal.onrender.com/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });

      if (res.ok) {
        const data = await res.json();
        setUserData(data.user);
        setProfileSuccess('Profile updated successfully!');
        setEditingProfile(false);
        setTimeout(() => setProfileSuccess(''), 3000);
      } else {
        const error = await res.json();
        setProfileError(error.message || 'Failed to update profile');
      }
    } catch (err) {
      setProfileError('Network error. Please try again.');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://student-assignment-submission-portal.onrender.com/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        })
      });

      if (res.ok) {
        setPasswordSuccess('Password changed successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setEditingPassword(false);
        setTimeout(() => setPasswordSuccess(''), 3000);
      } else {
        const error = await res.json();
        setPasswordError(error.message || 'Failed to change password');
      }
    } catch (err) {
      setPasswordError('Network error. Please try again.');
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
                    activeNav === item.id ? 'bg-purple-600 text-white shadow-lg' : isDark ? 'text-gray-300 hover:text-white hover:bg-slate-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isDark ? 'text-red-400 hover:bg-slate-700 hover:text-red-300' : 'text-red-600 hover:bg-gray-100 hover:text-red-700'}`}
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
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Profile</h2>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-full text-sm font-semibold bg-purple-500/20 border border-purple-500/30 text-purple-600`}>
                👨‍🏫 Teacher
              </div>
              <button onClick={toggleTheme} className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0 overflow-y-auto relative z-5 p-8">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading profile...</p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className={`text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>My Profile</h1>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Avatar Card */}
                    <div className={`card-slide-in rounded-lg p-8 text-center ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-gray-200'} shadow-sm border backdrop-blur-sm`} style={{ animation: 'pageLoadFade 0.7s ease-out' }}>
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white text-5xl font-bold mx-auto mb-6">
                        {userData?.name?.charAt(0) || 'T'}
                      </div>
                      <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {userData?.name}
                      </h2>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        Teacher
                      </p>
                    </div>

                    {/* Profile Details Card */}
                    <div className={`lg:col-span-2 card-slide-in rounded-lg p-8 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-gray-200'} shadow-sm border backdrop-blur-sm`} style={{ animation: 'cardSlideIn 0.6s ease-out 0.1s backwards' }}>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Profile Information
                        </h3>
                        {!editingProfile && (
                          <button
                            onClick={() => setEditingProfile(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                          >
                            <Edit2 size={18} />
                            Edit
                          </button>
                        )}
                      </div>

                      {profileError && (
                        <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-700'}`}>
                          {profileError}
                        </div>
                      )}
                      {profileSuccess && (
                        <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700'}`}>
                          {profileSuccess}
                        </div>
                      )}

                      {editingProfile ? (
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                          <div>
                            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              Name
                            </label>
                            <input
                              type="text"
                              value={profileForm.name}
                              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                              className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:border-blue-500`}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              Email
                            </label>
                            <input
                              type="email"
                              value={profileForm.email}
                              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                              className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:border-blue-500`}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              Department
                            </label>
                            <input
                              type="text"
                              value={profileForm.department}
                              onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                              className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:border-blue-500`}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              Phone
                            </label>
                            <input
                              type="tel"
                              value={profileForm.phone}
                              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                              className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:border-blue-500`}
                            />
                          </div>
                          <div className="flex gap-4 justify-end pt-4">
                            <button
                              type="button"
                              onClick={() => setEditingProfile(false)}
                              className={`px-6 py-2 rounded-lg font-semibold transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                            >
                              Save Changes
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-4">
                          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Name</p>
                            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {userData?.name}
                            </p>
                          </div>
                          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
                            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {userData?.email}
                            </p>
                          </div>
                          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Department</p>
                            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {userData?.department || 'Not specified'}
                            </p>
                          </div>
                          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Phone</p>
                            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {userData?.phone || 'Not specified'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Password Change Card */}
                  <div className={`mt-8 card-slide-in rounded-lg p-8 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-gray-200'} shadow-sm border backdrop-blur-sm`} style={{ animation: 'cardSlideIn 0.6s ease-out 0.2s backwards' }}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Change Password
                      </h3>
                      {!editingPassword && (
                        <button
                          onClick={() => setEditingPassword(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                        >
                          <Lock size={18} />
                          Change
                        </button>
                      )}
                    </div>

                    {passwordError && (
                      <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-700'}`}>
                        {passwordError}
                      </div>
                    )}
                    {passwordSuccess && (
                      <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700'}`}>
                        {passwordSuccess}
                      </div>
                    )}

                    {editingPassword ? (
                      <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div>
                          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:border-blue-500`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            New Password
                          </label>
                          <input
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:border-blue-500`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:border-blue-500`}
                          />
                        </div>
                        <div className="flex gap-4 justify-end pt-4">
                          <button
                            type="button"
                            onClick={() => setEditingPassword(false)}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                          >
                            Update Password
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        Keep your account secure by changing your password regularly
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
