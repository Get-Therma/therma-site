'use client';

import { useEffect, useRef, useState } from 'react';
import { Penguin } from './penguin-animation/Penguin';
import { Scene } from './penguin-animation/Scene';
import { AudioManager } from './penguin-animation/AudioManager';
import { Trump } from './penguin-animation/Trump';
import { Presidents } from './penguin-animation/Presidents';

interface PenguinIntroProps {
  onComplete: () => void;
}

export default function PenguinIntro({ onComplete }: PenguinIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const penguinsRef = useRef<Penguin[]>([]);
  const trumpRef = useRef<Trump>();
  const presidentsRef = useRef<Presidents>();
  const sceneRef = useRef<Scene>();
  const audioManagerRef = useRef<AudioManager>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize scene
    sceneRef.current = new Scene(canvas.width, canvas.height);

    // Initialize presidents holding "Get Therma" signs!
    presidentsRef.current = new Presidents(canvas.width, canvas.height);

    // Initialize Trump (dancing in the middle!)
    trumpRef.current = new Trump(canvas.width, canvas.height);

    // Initialize audio manager
    audioManagerRef.current = new AudioManager(isMuted);

    // Create 10 penguins with varied properties
    penguinsRef.current = Array.from({ length: 10 }, (_, i) => {
      const fromLeft = i % 2 === 0;
      const startX = fromLeft ? -100 : canvas.width + 100;
      const y = canvas.height * 0.6 + (Math.random() - 0.5) * 100;
      const speed = 3 + Math.random() * 4;
      const delay = i * 0.8; // Stagger entrance
      
      return new Penguin(startX, y, speed, fromLeft, delay);
    });

    // Animation loop
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = (timestamp - startTimeRef.current) / 1000; // seconds
      const duration = 10; // 10 seconds total
      const progressPercent = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(progressPercent);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw scene (background, snow, etc)
      sceneRef.current?.draw(ctx, elapsed);

      // Update and draw presidents holding "Get Therma" signs (in background)
      presidentsRef.current?.update(elapsed);
      presidentsRef.current?.draw(ctx);

      // Update and draw penguins
      penguinsRef.current.forEach(penguin => {
        penguin.update(elapsed, canvas.width);
        penguin.draw(ctx);
      });

      // Update and draw Trump dancing in the middle (foreground)!
      trumpRef.current?.update(elapsed);
      trumpRef.current?.draw(ctx);

      // Check if animation is complete
      if (elapsed >= duration) {
        // Fade out and complete
        const fadeProgress = Math.min((elapsed - duration) / 0.5, 1);
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeProgress})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (fadeProgress >= 1) {
          cancelAnimationFrame(animationRef.current!);
          onComplete();
          return;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      audioManagerRef.current?.cleanup();
    };
  }, [onComplete, isMuted]);

  const handleSkip = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    onComplete();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audioManagerRef.current?.setMuted(!isMuted);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault();
      handleSkip();
    }
  };

  return (
    <div 
      className="penguin-intro"
      onKeyDown={handleKeyPress}
      tabIndex={0}
      role="dialog"
      aria-label="Loading animation with penguins"
    >
      <canvas ref={canvasRef} className="penguin-canvas" />
      
      {/* Progress bar */}
      <div className="penguin-intro__progress-container">
        <div 
          className="penguin-intro__progress-bar" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="penguin-intro__controls">
        <button
          onClick={toggleMute}
          className="penguin-intro__mute-btn"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
        <button
          onClick={handleSkip}
          className="penguin-intro__skip-btn"
          aria-label="Skip intro animation"
        >
          Skip →
        </button>
      </div>
    </div>
  );
}
