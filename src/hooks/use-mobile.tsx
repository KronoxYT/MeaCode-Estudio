import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook to determine if the current viewport is a mobile device.
 *
 * It returns `undefined` on the server and on the initial client render,
 * to prevent hydration mismatches. After hydration, it returns `true` or `false`.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Initial check after component mounts
    checkDevice();

    // Listen for window resize events
    window.addEventListener('resize', checkDevice);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile;
}
