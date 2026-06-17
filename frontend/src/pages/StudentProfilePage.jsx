import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function StudentProfilePage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    rollNumber: '',
    division: '',
    year: '',
    branch: '',
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
            rollNumber: data.user.rollNumber || '',
            division: data.user.division || '',
            year: data.user.year || '',
            branch: data.user.branch || '',
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
        const data = await res.json();
        setProfileError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setProfileError('Error updating profile');
      console.error(err);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://student-assignment-submission-portal.onrender.com/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (res.ok) {
        setPasswordSuccess('Password changed successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setEditingPassword(false);
        setTimeout(() => setPasswordSuccess(''), 3000);
      } else {
        const data = await res.json();
        setPasswordError(data.message || 'Failed to change password');
      }
    } catch (err) {
      setPasswordError('Error changing password');
      console.error(err);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950' : 'bg-gradient-to-br from-[#e8eeff] via-[#f0f4ff] to-[#eef2ff]'}`} style={{ animation: 'fadeIn 600ms ease-out forwards' }}>
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/25 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/student/dashboard')}
          className={`flex items-center gap-2 mb-8 px-4 py-2 rounded-lg transition-all ${
            isDark
              ? 'text-gray-400 hover:text-white hover:bg-slate-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          style={{ animation: 'fadeInDown 600ms ease-out 100ms forwards' }}
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {loading ? (
          <div className={`rounded-xl ${isDark ? 'bg-slate-900/80 border border-slate-700' : 'bg-white/80 border border-gray-200'} backdrop-blur-sm p-8 text-center`}>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading profile...</p>
          </div>
        ) : (
          <>
            {/* Profile Card */}
            <div 
              className={`rounded-xl ${isDark ? 'bg-slate-900/80 border border-slate-700' : 'bg-white/80 border border-gray-200'} backdrop-blur-sm p-8 mb-6`}
              style={{ animation: 'fadeInUp 600ms ease-out 200ms forwards', opacity: 0 }}
            >
              {/* Header Section */}
              <div className="flex items-start gap-8 mb-8 pb-8 border-b" style={{ borderColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(209, 213, 219, 0.5)' }}>
                {/* Avatar */}
                <div 
                  className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center flex-shrink-0"
                  style={{ animation: 'fadeInDown 600ms ease-out 300ms forwards', opacity: 0 }}
                >
                  <span className="text-6xl font-bold text-white">
                    {userData?.name?.charAt(0) || 'S'}
                  </span>
                </div>

                {/* Profile Info */}
                <div style={{ animation: 'fadeInRight 600ms ease-out 400ms forwards', opacity: 0 }}>
                  <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {userData?.name || 'Student'}
                  </h1>
                  <p className={`text-lg font-medium mb-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    Student
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {userData?.email || 'No email'}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Roll Number */}
                <div 
                  className={`p-6 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}
                  style={{ animation: 'fadeInUp 600ms ease-out 300ms forwards', opacity: 0 }}
                >
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Roll Number
                  </p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                    {userData?.rollNumber || 'N/A'}
                  </p>
                </div>

                {/* Student ID */}
                <div 
                  className={`p-6 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}
                  style={{ animation: 'fadeInUp 600ms ease-out 350ms forwards', opacity: 0 }}
                >
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Student ID
                  </p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                    {userData?._id?.substring(0, 8).toUpperCase() || 'N/A'}
                  </p>
                </div>

                {/* Branch/Course */}
                <div 
                  className={`p-6 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}
                  style={{ animation: 'fadeInUp 600ms ease-out 400ms forwards', opacity: 0 }}
                >
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Branch / Course
                  </p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                    {userData?.branch || 'N/A'}
                  </p>
                </div>

                {/* Year & Division */}
                <div 
                  className={`p-6 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}
                  style={{ animation: 'fadeInUp 600ms ease-out 450ms forwards', opacity: 0 }}
                >
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Year / Division
                  </p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                    {userData?.year && userData?.division
                      ? `${userData.year} - ${userData.division}`
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </button>
                <button
                  onClick={() => setEditingPassword(!editingPassword)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
                >
                  <Lock size={18} />
                  Change Password
                </button>
              </div>
            </div>

            {/* Edit Profile Form */}
            {editingProfile && (
              <div 
                className={`rounded-xl ${isDark ? 'bg-slate-900/80 border border-slate-700' : 'bg-white/80 border border-gray-200'} backdrop-blur-sm p-8 mb-6`}
                style={{ animation: 'slideInUp 400ms ease-out forwards' }}
              >
                <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Edit Profile
                </h2>

                {profileError && (
                  <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-400">{profileError}</p>
                  </div>
                )}

                {profileSuccess && (
                  <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                    <p className="text-green-400">{profileSuccess}</p>
                  </div>
                )}

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>

                  {/* Roll Number */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Roll Number
                    </label>
                    <input
                      type="text"
                      value={profileForm.rollNumber}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, rollNumber: e.target.value })
                      }
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  {/* Division */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Division
                    </label>
                    <input
                      type="text"
                      value={profileForm.division}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, division: e.target.value })
                      }
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  {/* Year */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Year
                    </label>
                    <input
                      type="text"
                      value={profileForm.year}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, year: e.target.value })
                      }
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  {/* Branch */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Branch
                    </label>
                    <input
                      type="text"
                      value={profileForm.branch}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, branch: e.target.value })
                      }
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProfile(false)}
                      className={`flex-1 px-6 py-2 rounded-lg font-medium transition-all ${
                        isDark
                          ? 'bg-slate-700 hover:bg-slate-600 text-gray-200'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Change Password Form */}
            {editingPassword && (
              <div 
                className={`rounded-xl ${isDark ? 'bg-slate-900/80 border border-slate-700' : 'bg-white/80 border border-gray-200'} backdrop-blur-sm p-8`}
                style={{ animation: 'slideInUp 400ms ease-out forwards' }}
              >
                <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Change Password
                </h2>

                {passwordError && (
                  <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-400">{passwordError}</p>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                    <p className="text-green-400">{passwordSuccess}</p>
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                      }
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                      }
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all"
                    >
                      Update Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingPassword(false)}
                      className={`flex-1 px-6 py-2 rounded-lg font-medium transition-all ${
                        isDark
                          ? 'bg-slate-700 hover:bg-slate-600 text-gray-200'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </div>
  );
}
