import { useState, useEffect, useRef } from 'react';
import LandingHeader from '../components/LandingHeader';
import Hero from '../components/Hero';
import Features from '../components/Features';
import LandingFooter from '../components/LandingFooter';
import FadeWrapper from '../components/FadeWrapper';

export default function Landing() {
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const featuresRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const scrollToSection = (ref, sectionName) => {
    setActiveSection(sectionName);
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Remove highlight after 3 seconds
    const timer = setTimeout(() => setActiveSection(null), 3000);
    return () => clearTimeout(timer);
  };

  return (
    <div className="w-full bg-white">
      <LandingHeader 
        loaded={loaded} 
        onFeaturesClick={() => scrollToSection(featuresRef, 'features')}
        onContactClick={() => scrollToSection(footerRef, 'contact')}
      />
      <Hero loaded={loaded} />
      <FadeWrapper>
        <div 
          ref={featuresRef}
          className={`transition-all duration-700 ${
            activeSection === 'features' 
              ? 'ring-4 ring-blue-400 ring-opacity-50 rounded-xl shadow-2xl' 
              : ''
          }`}
        >
          <Features />
        </div>
      </FadeWrapper>
      <FadeWrapper delay={200}>
        <div 
          ref={footerRef}
          className={`transition-all duration-700 ${
            activeSection === 'contact' 
              ? 'ring-4 ring-blue-400 ring-opacity-50 rounded-xl shadow-2xl' 
              : ''
          }`}
        >
          <LandingFooter />
        </div>
      </FadeWrapper>

      <style>{`
        @keyframes sectionHighlight {
          0% {
            box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(96, 165, 250, 0.1);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(96, 165, 250, 0);
          }
        }
      `}</style>
    </div>
  );
}
