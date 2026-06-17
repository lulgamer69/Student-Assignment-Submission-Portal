import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { formatDate } from '../utils/dateFormatter';
import { useEffect, useState } from 'react';

export default function StudentAnnouncements() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/announcements", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setAnnouncements(data.announcements || data || []);
        } else {
          setError("Failed to load announcements");
        }
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError("Error loading announcements");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto px-8 py-12">
        <button onClick={() => navigate('/student/dashboard')} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8">
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        
        <h1 className="text-4xl font-bold mb-8">Announcements</h1>
        
        {loading && (
          <div className={`rounded-lg p-8 text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading announcements...</p>
          </div>
        )}

        {error && (
          <div className={`rounded-lg p-8 text-center ${isDark ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'}`}>
            <p className={isDark ? 'text-red-400' : 'text-red-600'}>{error}</p>
          </div>
        )}

        {!loading && announcements.length === 0 && !error && (
          <div className={`rounded-lg p-8 text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No announcements yet</p>
          </div>
        )}

        {announcements.length > 0 && (
          <div className="space-y-4">
            {announcements.map((announcement, idx) => {
              const postedDate = formatDate(announcement.createdAt);
              return (
                <div
                  key={announcement._id}
                  className={`rounded-lg p-6 border transition-all ${isDark ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-500'}`}
                  style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.05}s backwards` }}
                >
                  <h3 className="text-xl font-bold mb-2">{announcement.title}</h3>
                  <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {announcement.message || announcement.content}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    Posted: {postedDate}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
