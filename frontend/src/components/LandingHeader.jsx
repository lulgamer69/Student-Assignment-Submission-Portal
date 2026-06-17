import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

export default function LandingHeader({ loaded, onFeaturesClick, onContactClick }) {
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-700 ${
        loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
      } ${
        isDark ? 'bg-gray-900 border-gray-800' : 'bg-blue-50 border-blue-100'
      } border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 no-underline group transition-transform hover:scale-105 flex-shrink-0">
            <svg className="w-8 md:w-9 h-8 md:h-9" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2563eb" />
                  <stop offset="1" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
              <polygon points="40,8 10,68 22,68 40,28 58,68 70,68" fill="url(#grad1)" />
              <rect x="22" y="50" width="36" height="9" rx="3" fill="#60a5fa" />
              <rect x="32" y="16" width="18" height="22" rx="2.5" fill="white" fillOpacity="0.9" />
              <circle cx="58" cy="58" r="11" fill="#16a34a" />
              <polyline points="52,58 56.5,63 64,52" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={`hidden sm:inline text-lg font-bold transition-colors ${isDark ? 'text-white' : 'text-black'}`}>
              Acadly
            </span>
          </a>

          {/* Center Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a href="/" className={`text-sm font-medium border-b-2 pb-1 transition-colors ${
              isDark 
                ? 'text-blue-400 border-blue-400' 
                : 'text-blue-600 border-blue-600'
            }`}>
              Home
            </a>
            <button 
              onClick={onFeaturesClick}
              className={`text-sm font-medium transition-colors hover-lift cursor-pointer bg-transparent border-none p-0 ${
                isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Features
            </button>
            <button 
              onClick={onContactClick}
              className={`text-sm font-medium transition-colors hover-lift cursor-pointer bg-transparent border-none p-0 ${
                isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Contact
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-white text-gray-600 hover:bg-blue-100'
              }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <a href="/login" className={`hidden sm:inline-block px-3 md:px-5 py-2 rounded-lg border-2 font-medium text-xs md:text-sm no-underline transition-all duration-300 hover-lift ${
              isDark
                ? 'border-blue-500 text-blue-400 hover:bg-blue-500/10'
                : 'border-blue-600 text-blue-600 hover:bg-blue-50'
            }`}>
              Login
            </a>
            
            <a href="/register" className={`hidden sm:inline-block px-3 md:px-5 py-2 rounded-lg font-medium text-xs md:text-sm no-underline transition-all duration-300 hover-lift ${
              isDark
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}>
              Register
            </a>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-all ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-white hover:bg-blue-100'
              }`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden px-4 py-4 border-t ${isDark ? 'border-gray-700' : 'border-blue-200'}`}>
            <div className="flex flex-col gap-4">
              <a href="/" className={`text-sm font-medium pb-2 transition-colors ${
                isDark 
                  ? 'text-blue-400' 
                  : 'text-blue-600'
              }`}>
                Home
              </a>
              <button 
                onClick={() => {
                  onFeaturesClick();
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-sm font-medium transition-colors cursor-pointer bg-transparent border-none p-0 ${
                  isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Features
              </button>
              <button 
                onClick={() => {
                  onContactClick();
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-sm font-medium transition-colors cursor-pointer bg-transparent border-none p-0 ${
                  isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Contact
              </button>
              <div className="border-t pt-4 flex flex-col gap-2" style={{borderColor: isDark ? '#374151' : '#dbeafe'}}>
                <a href="/login" className={`block px-4 py-2 rounded-lg border-2 font-medium text-sm no-underline text-center transition-all ${
                  isDark
                    ? 'border-blue-500 text-blue-400 hover:bg-blue-500/10'
                    : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}>
                  Login
                </a>
                <a href="/register" className={`block px-4 py-2 rounded-lg font-medium text-sm no-underline text-center transition-all ${
                  isDark
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                  Register
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
