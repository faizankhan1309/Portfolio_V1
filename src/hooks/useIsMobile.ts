import { useState, useEffect } from 'react';

/**
 * Returns true if the viewport width is <= 1024px (tablet/phone).
 * Reactively updates on window resize.
 * Desktop (>1024px) always returns false so the full GSAP experience runs.
 */
export const useIsMobile = (breakpoint = 1024): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= breakpoint;
  });

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);

  return isMobile;
};
