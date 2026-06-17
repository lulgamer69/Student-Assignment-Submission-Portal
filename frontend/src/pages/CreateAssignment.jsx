import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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

  @keyframes blob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(20px, -50px) scale(1.1); }
    50% { transform: translate(-20px, 20px) scale(0.9); }
    75% { transform: translate(50px, 50px) scale(1.05); }
  }

  .animate-blob { animation: blob 7s infinite; }
  .page-fade-in { animation: pageLoadFade 0.7s ease-out; }
`;

export default function CreateAssignment() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    deadline: '',
    maxMarks: '100'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('https://student-assignment-submission-portal.onrender.com/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert('Assignment created successfully!');
        navigate('/teacher/assignments');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to create assignment');
      }
    } catch (err) {
      alert('Error creating assignment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`page-fade-in min-h-screen w-screen ${isDark ? 'bg-slate-950' : 'bg-[#e8eeff]'}`}>
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950' : 'bg-gradient-to-br from-[#e8eeff] via-[#f0f4ff] to-[#eef2ff]'}`}/>
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-blob"/>
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/25 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }}/>
          <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }}/>
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          <div className={`flex-shrink-0 ${isDark ? 'bg-slate-900/70 backdrop-blur-sm border-b border-slate-700/50' : 'bg-white/70 backdrop-blur-sm border-b border-gray-200/50'} px-8 py-5 flex items-center justify-between`}>
            <button
              onClick={() => navigate('/teacher/assignments')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <ArrowLeft size={20} />
              Back
            </button>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center px-8 py-12">
            <div className={`w-full max-w-2xl rounded-lg p-8 shadow-2xl backdrop-blur-sm ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white/50 border border-gray-200'}`}>
              <h1 className={`text-4xl font-bold mb-8 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Create Assignment
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border outline-none focus:border-blue-500 transition-all ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white placeholder-gray-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-600'
                    }`}
                    placeholder="Assignment title"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="5"
                    className={`w-full px-4 py-3 rounded-lg border outline-none focus:border-blue-500 transition-all resize-none ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white placeholder-gray-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-600'
                    }`}
                    placeholder="Assignment description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border outline-none focus:border-blue-500 transition-all ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-white placeholder-gray-500'
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-600'
                      }`}
                      placeholder="Subject"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Deadline *
                    </label>
                    <input
                      type="datetime-local"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border outline-none focus:border-blue-500 transition-all ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Max Marks
                  </label>
                  <input
                    type="number"
                    name="maxMarks"
                    value={formData.maxMarks}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border outline-none focus:border-blue-500 transition-all ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => navigate('/teacher/assignments')}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                      isDark
                        ? 'bg-slate-700 hover:bg-slate-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating...' : 'Create Assignment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
