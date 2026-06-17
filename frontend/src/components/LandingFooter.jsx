import { useTheme } from '../context/ThemeContext';

export default function LandingFooter() {
  const { isDark } = useTheme();

  const socialLinks = [
    { title: 'LinkedIn', label: 'in', href: 'https://linkedin.com' },
    { title: 'Email', label: '✉', href: 'mailto:contact@acadly.com' },
    { title: 'Website', label: '🌐', href: '#' }
  ];

  return (
    <footer className={`transition-colors duration-300 ${
      isDark
        ? 'bg-gray-900 border-gray-800'
        : 'bg-white border-gray-200'
    } border-t px-8 pt-14 pb-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-3 gap-20 mb-12">
          <div className="footer-col">
            <h5 className={`text-xs font-semibold mb-4 transition-colors ${
              isDark ? 'text-gray-300' : 'text-gray-900'
            }`}>
              Quick Links
            </h5>
            <a href="/" className={`block text-sm no-underline mb-3 transition-colors duration-300 hover:text-blue-600 ${
              isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600'
            }`}>
              Home
            </a>
            <a href="#features" className={`block text-sm no-underline mb-3 transition-colors duration-300 hover:text-blue-600 ${
              isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600'
            }`}>
              Features
            </a>
            <a href="#contact" className={`block text-sm no-underline mb-3 transition-colors duration-300 hover:text-blue-600 ${
              isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600'
            }`}>
              Contact
            </a>
          </div>

          <div className="footer-col">
            <h5 className={`text-xs font-semibold mb-4 transition-colors ${
              isDark ? 'text-gray-300' : 'text-gray-900'
            }`}>
              For Users
            </h5>
            <a href="/login" className={`block text-sm no-underline mb-3 transition-colors duration-300 hover:text-blue-600 ${
              isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600'
            }`}>
              Student Login
            </a>
            <a href="/login" className={`block text-sm no-underline mb-3 transition-colors duration-300 hover:text-blue-600 ${
              isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600'
            }`}>
              Teacher Login
            </a>
            <a href="/register" className={`block text-sm no-underline mb-3 transition-colors duration-300 hover:text-blue-600 ${
              isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600'
            }`}>
              Register
            </a>
          </div>

          <div className="footer-col">
            <h5 className={`text-xs font-semibold mb-4 transition-colors ${
              isDark ? 'text-gray-300' : 'text-gray-900'
            }`}>
              Connect
            </h5>
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className={`w-8 h-8 rounded border flex items-center justify-center text-sm font-semibold no-underline transition-all duration-300 relative group ${
                    isDark
                      ? 'border-gray-700 text-gray-500 hover:border-blue-500 hover:text-blue-400'
                      : 'border-gray-200 text-gray-400 hover:border-blue-600 hover:text-blue-600'
                  }`}
                  title={social.title}
                  style={{
                    animation: `popTransition 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
                    animationDelay: `${idx * 0.2}s`
                  }}
                >
                  {/* Shine effect overlay */}
                  <div className="absolute inset-0 rounded overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-pulse"></div>
                  </div>
                  <span className="relative z-10">{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={`border-t transition-colors ${isDark ? 'border-gray-800' : 'border-gray-200'} pt-6 flex justify-center`}>
          <p className={`text-xs transition-colors ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            © 2024 Acadly. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes popTransition {
          0% {
            opacity: 0;
            transform: scale(0) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </footer>
  );
}
