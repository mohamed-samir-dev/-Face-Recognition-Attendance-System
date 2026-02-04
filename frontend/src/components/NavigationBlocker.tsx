'use client';

import { useEffect } from 'react';

export default function NavigationBlocker() {

  useEffect(() => {
    // Push a dummy state to prevent back navigation
    window.history.pushState(null, '', window.location.href);
    
    const handlePopState = () => {
      // Prevent back navigation by pushing forward again
      window.history.pushState(null, '', window.location.href);
    };

    // Block browser back/forward buttons
    window.addEventListener('popstate', handlePopState);

    // Block keyboard shortcuts (Alt+Left, Alt+Right, Backspace)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.altKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) ||
        (event.key === 'Backspace' && 
         (event.target as HTMLElement)?.tagName !== 'INPUT' && 
         (event.target as HTMLElement)?.tagName !== 'TEXTAREA')
      ) {
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
}