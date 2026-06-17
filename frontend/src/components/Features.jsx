import { Cloud, Calendar, Star, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Features() {
  const { isDark } = useTheme();

  const features = [
    {
      icon: Cloud,
      title: 'Upload Assignments',
      description: 'Students can easily upload and submit assignments securely.'
    },
    {
      icon: Calendar,
      title: 'Track Deadlines',
      description: 'Never miss a due date with smart deadline tracking.'
    },
    {
      icon: Star,
      title: 'Grade & Feedback',
      description: 'Teachers can grade submissions and provide detailed feedback.'
    },
    {
      icon: Bell,
      title: 'Announcements',
      description: 'Stay updated with important announcements and news.'
    }
  ];

  return (
    <section className={`px-8 py-20 transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-white'
    } relative overflow-hidden`}>
      {/* Optional: Decorative elements */}
      <div className={`absolute top-20 right-10 w-40 h-40 rounded-full blur-2xl ${
        isDark ? 'bg-blue-900/10' : 'bg-blue-200/20'
      }`}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16" style={{ animation: 'fadeUp 0.6s ease forwards' }}>
          <h2 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Everything You Need in <span className="text-blue-600">One Platform</span>
          </h2>
          <p className={`text-lg transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Acadly makes assignment management simple, efficient and hassle-free.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`rounded-xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-2 relative group ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 hover:border-blue-500/50'
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
                style={{
                  animation: `popUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
                  animationDelay: `${idx * 0.15}s`
                }}
              >
                {/* Shine animation overlay */}
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                  <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-white via-transparent to-transparent opacity-0 group-hover:opacity-30 group-hover:animate-pulse rounded-xl"></div>
                </div>

                <div className={`inline-flex p-3 rounded-lg mb-4 transition-all duration-300 ${
                  isDark
                    ? 'bg-blue-900/20 text-blue-400'
                    : 'bg-blue-50 text-blue-600'
                }`}>
                  <Icon size={24} />
                </div>
                <h3 className={`font-bold text-base mb-3 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes popUp {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </section>
  );
}
