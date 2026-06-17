import { useTheme } from '../context/ThemeContext';

export default function StudentProfile() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-6xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Student Profile</h1>
        
        <div className={`rounded-lg p-8 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Profile page coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
