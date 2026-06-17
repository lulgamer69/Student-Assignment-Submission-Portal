import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-blue-100'
    }`}>
      <div className="text-center px-8">
        <h1 className={`text-8xl font-bold mb-4 ${
          isDark ? 'text-blue-400' : 'text-blue-600'
        }`}>
          404
        </h1>
        <h2 className={`text-3xl font-bold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Page Not Found
        </h2>
        <p className={`text-lg mb-8 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Sorry, the page you're looking for doesn't exist.
        </p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
          >
            Go to Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isDark
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
