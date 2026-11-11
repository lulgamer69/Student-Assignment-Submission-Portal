import { useState, useEffect } from 'react';
import { ArrowRight, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useCounter } from '../hooks/useCounter';

export default function Hero({ loaded }) {
  const { isDark } = useTheme();
  const [dashRef, isDashVisible] = useScrollAnimation(0.2);
  const [isLoaded, setIsLoaded] = useState(false);
  const [typedText, setTypedText] = useState("");

  const activeUsers = useCounter(1000, 2000, isLoaded);
  const coursesManaged = useCounter(50, 2000, isLoaded);
  const submissionSuccess = useCounter(99, 2000, isLoaded);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Real typing animation for "Simplify Submissions."
  useEffect(() => {
    if (!loaded) return;
    
    const text = "Simplify Submissions.";
    let i = 0;

    const interval = setInterval(() => {
      setTypedText(text.substring(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, [loaded]);

  return (
    <section className={`relative responsive-hero px-8 py-24 transition-all duration-1000 ${
      loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    } ${
      isDark ? 'bg-gray-950' : 'bg-gradient-to-br from-white via-blue-50 to-blue-100'
    } overflow-hidden`}>
      {/* Polka Dots Background */}
      <div className="polka-dots"></div>

      {/* Primary Blue Blob - Top Right */}
      <div className={`absolute -top-40 -right-20 w-96 h-96 rounded-full blur-3xl transition-colors duration-300 ${
        isDark ? 'bg-blue-900/30' : 'bg-blue-400/40'
      }`} style={{
        animation: 'float 8s ease-in-out infinite'
      }}></div>

      {/* Secondary Blue Blob - Bottom Left */}
      <div className={`absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl transition-colors duration-300 ${
        isDark ? 'bg-blue-800/20' : 'bg-blue-300/30'
      }`} style={{
        animation: 'floatSecond 10s ease-in-out infinite'
      }}></div>

      <div className="max-w-7xl mx-auto grid grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Side */}
        <div>
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 text-sm font-medium transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-5'
          } ${
            isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'
          }`}>
            <span>🏠</span>
            <span>Smart Assignment Portal</span>
          </div>

          <h1 className={`responsive-hero-title text-5xl font-bold leading-tight mb-6 transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-5'
          } ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Manage Assignments.
            <br />
            <span className="text-blue-600">{typedText}</span>
          </h1>

          <p className={`text-lg leading-relaxed mb-8 max-w-md transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0 delay-400' : 'opacity-0 translate-y-5'
          } ${
            isDark ? 'text-gray-400' : 'text-gray-700'
          }`}>
            Acadly helps students submit assignments and teachers manage, review, and grade — all in one place.
          </p>

          <div className={`responsive-hero-actions flex items-center gap-4 mb-12 transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-5'
          }`}>
            <Link to="/register" className="px-7 py-3 bg-blue-600 text-white font-semibold rounded-lg no-underline transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 flex items-center gap-2 group">
              Get Started
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/login" className={`px-7 py-3 border-2 font-semibold rounded-lg no-underline transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
              isDark ? 'border-blue-500 text-blue-400 hover:bg-blue-900/20' : 'border-blue-600 text-blue-600 hover:bg-blue-50'
            }`}>
              Login to Account
            </Link>
          </div>

          <div className={`responsive-hero-stats flex gap-12 transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0 delay-600' : 'opacity-0 translate-y-5'
          }`}>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">{activeUsers.toLocaleString()}+</div>
              <div className={`text-sm transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">{coursesManaged}+</div>
              <div className={`text-sm transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Courses Managed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">{submissionSuccess}%</div>
              <div className={`text-sm transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Submission Success</div>
            </div>
          </div>
        </div>

        {/* Right Side - Dashboard Preview */}
        <div ref={dashRef} className={`fade-up delay-3 relative transition-all duration-700 ${
          loaded ? 'opacity-100 translate-y-0 delay-700' : 'opacity-0 translate-y-10'
        } ${isDashVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Background Effects */}
          <div className="absolute inset-0 -z-10">
            {/* Glow Effect */}
            <div className="absolute left-[-120px] top-[80px] w-[350px] h-[350px] bg-blue-400 opacity-30 blur-3xl rounded-full"></div>

            {/* Main Blob - Left */}
            <svg
              className="absolute left-[-100px] top-[50px] w-[400px] opacity-80"
              viewBox="0 0 600 600"
            >
              <path
                fill="#3b82f6"
                d="M421,320Q380,390,310,430Q240,470,170,430Q100,390,80,320Q60,250,100,190Q140,130,210,100Q280,70,350,110Q420,150,440,220Q460,290,421,320Z"
              />
            </svg>

            {/* Subtle Blob - Right */}
            <svg
              className="absolute right-[-100px] top-[0px] w-[300px] opacity-30"
              viewBox="0 0 600 600"
            >
              <path
                fill="#60a5fa"
                d="M400,300Q360,360,300,400Q240,440,180,400Q120,360,100,300Q80,240,120,180Q160,120,220,100Q280,80,340,120Q400,160,420,220Q440,280,400,300Z"
              />
            </svg>
          </div>

          {/* Dashboard Card with Glow */}
          <div className="relative">
            {/* Blue Glow Layer */}
            <div className="absolute -inset-2 bg-blue-400 opacity-20 blur-2xl rounded-2xl -z-10"></div>

            {/* Main Card */}
            <div className={`relative z-10 rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            }`} style={{
              boxShadow: isDark 
                ? '0 20px 50px rgba(59, 130, 246, 0.15)'
                : '0 20px 60px rgba(59, 130, 246, 0.25)'
            }}>
            {/* Header */}
            <div className={`flex items-center justify-between mb-6 pb-4 border-b transition-colors ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="gradDash" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#2563eb" />
                      <stop offset="1" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                  <polygon points="40,8 10,68 22,68 40,28 58,68 70,68" fill="url(#gradDash)" />
                </svg>
                <div>
                  <div className={`text-sm font-semibold transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>Acadly</div>
                  <div className={`text-xs transition-colors ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Welcome back, Priya! 👋</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className={`p-2 transition-colors ${isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}`}>
                  <Bell size={20} />
                </button>
                <div className="w-8 h-8 bg-blue-600 rounded-full text-white text-xs font-bold flex items-center justify-center">P</div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className={`rounded-lg p-3 transition-colors ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                <div className={`text-xs mb-1 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Pending Submissions</div>
                <div className="text-2xl font-bold text-blue-600">3</div>
              </div>
              <div className={`rounded-lg p-3 transition-colors ${isDark ? 'bg-green-900/20' : 'bg-green-50'}`}>
                <div className={`text-xs mb-1 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Graded & Returned</div>
                <div className="text-2xl font-bold text-green-600">5</div>
              </div>
              <div className={`rounded-lg p-3 transition-colors ${isDark ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
                <div className={`text-xs mb-1 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Average Score</div>
                <div className="text-2xl font-bold text-purple-600">92%</div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-semibold transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>Upcoming Deadlines</h3>
                <a href="#" className="text-xs text-blue-600 font-medium hover:underline">View All</a>
              </div>
              <div className="space-y-2">
                <div className={`flex items-center justify-between p-3 rounded-lg transition-colors ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div>
                    <div className={`text-xs font-semibold transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>Data Structures Assignment</div>
                    <div className={`text-xs mt-0.5 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Due: Tomorrow, 11:59 PM</div>
                  </div>
                  <button className={`px-3 py-1 text-xs font-semibold rounded transition-all hover:shadow-md ${isDark ? 'bg-gray-700 text-blue-400 border border-blue-500/30' : 'bg-white text-blue-600 border border-blue-200'}`}>
                    Submit
                  </button>
                </div>
                <div className={`flex items-center justify-between p-3 rounded-lg transition-colors ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div>
                    <div className={`text-xs font-semibold transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>Web Development Project</div>
                    <div className={`text-xs mt-0.5 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Due: Mar 15, 2024</div>
                  </div>
                  <button className={`px-3 py-1 text-xs font-semibold rounded transition-all hover:shadow-md ${isDark ? 'bg-gray-700 text-blue-400 border border-blue-500/30' : 'bg-white text-blue-600 border border-blue-200'}`}>
                    Submit
                  </button>
                </div>
              </div>
            </div>

            {/* Quiz Section */}
            <div className={`flex items-center p-3 rounded-lg transition-colors ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">⚡</div>
              <div className="text-xs">
                <div className={`font-semibold transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>Database Management System Quiz</div>
                <div className={`transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Due: Mar 16, 2024 • <button className="text-blue-600 font-semibold hover:underline">Start Quiz</button></div>
              </div>
            </div>
            </div>
            {/* Close Main Card */}
          </div>
          {/* Close Glow Wrapper */}
        </div>
      </div>
    </section>
  );
}

