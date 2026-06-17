import { useEffect, useRef, useState } from 'react';

export const useCounter = (target, duration = 2000, isVisible = true) => {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!isVisible || hasRunRef.current) return;

    hasRunRef.current = true;
    const increment = target / (duration / 16);
    let current = 0;

    intervalRef.current = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(intervalRef.current);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [target, duration, isVisible]);

  return count;
};
