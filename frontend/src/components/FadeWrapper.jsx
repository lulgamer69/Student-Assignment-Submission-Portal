import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function FadeWrapper({ children, delay = 0 }) {
  const [ref, visible] = useScrollAnimation(0.2);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{
        transitionDelay: visible ? `${delay}ms` : '0ms',
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  );
}
