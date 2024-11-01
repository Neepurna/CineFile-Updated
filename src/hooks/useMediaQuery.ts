import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // Perform the initial match check
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return; // Ensure this only runs in the browser

    const mediaQuery = window.matchMedia(query);

    // Event listener to update the state when the media query match status changes
    const handleChange = () => setMatches(mediaQuery.matches);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    // Perform the initial match check
    setMatches(mediaQuery.matches);

    // Cleanup listener on component unmount
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}
