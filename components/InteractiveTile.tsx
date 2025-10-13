// components/InteractiveTile.tsx
'use client';

import { useState } from 'react';

interface InteractiveTileProps {
  children: React.ReactNode;
  className?: string;
}

export default function InteractiveTile({ children, className = '' }: InteractiveTileProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => {
    setIsPressed(true);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  return (
    <div
      className={`why-tile ${className} ${isPressed ? 'pressed' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {children}
    </div>
  );
}
