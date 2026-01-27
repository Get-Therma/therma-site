'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import PenguinIntro to avoid SSR issues with canvas
const PenguinIntro = dynamic(() => import('./PenguinIntro'), {
  ssr: false,
});

interface IntroWrapperProps {
  children: React.ReactNode;
}

export default function IntroWrapper({ children }: IntroWrapperProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Skip intro for users who prefer reduced motion
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = () => {
    setFadeOut(true);
    
    // Wait for fade animation before hiding
    setTimeout(() => {
      setShowIntro(false);
    }, 500);
  };

  if (!showIntro) {
    return <>{children}</>;
  }

  return (
    <>
      <div className={`intro-overlay ${fadeOut ? 'intro-overlay--fade-out' : ''}`}>
        <PenguinIntro onComplete={handleIntroComplete} />
      </div>
      <div className="main-content" style={{ opacity: 0 }}>
        {children}
      </div>
    </>
  );
}
