import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Forbidden() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-red-50 to-orange-100'
    }`}>
      <div className="text-center px-8">
        <h1 className={`text-8xl font-bold mb-4 ${
          isDark ? 'text-red-400' : 'text-red-600'
        }`}>
          403
        </h1>
        <h2 className={`text-3xl font-bold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Access Forbidden
        </h2>
        <p className={`text-lg mb-8 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          You don't have permission to access this resource. Make sure you're logged in as the right user.
        </p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
          >
            Go to Login
          </button>
          <button
            onClick={() => navigate('/')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isDark
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
