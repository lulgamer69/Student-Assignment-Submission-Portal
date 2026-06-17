import { X } from 'lucide-react';

export default function StudentProfile({ isOpen, onClose, userData, isDark }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4">
        <div
          className={`rounded-xl ${
            isDark
              ? 'bg-slate-900/95 border border-slate-700'
              : 'bg-white/95 border border-gray-200'
          } backdrop-blur-sm p-8 shadow-2xl`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
              isDark
                ? 'hover:bg-slate-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X size={20} />
          </button>

          {/* Profile Header */}
          <div className="flex items-start gap-6 mb-8">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-4xl font-bold text-white">
                {userData?.name?.charAt(0) || 'S'}
              </span>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {userData?.name || 'Student'}
              </h2>
              <p className={`text-sm font-medium mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                Student
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-4">
            {/* Email */}
            <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
              <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                EMAIL
              </p>
              <p className={`${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                {userData?.email || 'No email'}
              </p>
            </div>

            {/* Roll Number */}
            {userData?.rollNumber && (
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  ROLL NUMBER
                </p>
                <p className={`${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  {userData.rollNumber}
                </p>
              </div>
            )}

            {/* Division */}
            {userData?.division && (
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  DIVISION
                </p>
                <p className={`${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  {userData.division}
                </p>
              </div>
            )}

            {/* Year */}
            {userData?.year && (
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  YEAR
                </p>
                <p className={`${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  {userData.year}
                </p>
              </div>
            )}

            {/* Branch */}
            {userData?.branch && (
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  BRANCH
                </p>
                <p className={`${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  {userData.branch}
                </p>
              </div>
            )}
          </div>

          {/* Edit Button */}
          <button
            className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </>
  );
}
