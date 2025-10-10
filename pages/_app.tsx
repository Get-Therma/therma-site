
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect } from 'react'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', function() {
        // For now, just show an alert - you can expand this later
        alert('Mobile menu clicked! This can be expanded to show navigation options.');
      });
    }

    // Add interactive feedback for input
    const emailInput = document.querySelector('.pillInput input') as HTMLInputElement;
    
    if (emailInput) {
      emailInput.addEventListener('focus', function() {
        const parent = this.parentElement as HTMLElement;
        if (parent) {
          parent.style.borderColor = 'rgba(255,255,255,.4)';
          parent.style.boxShadow = '0 12px 40px rgba(0,0,0,.4)';
          parent.style.background = 'rgba(255,255,255,.15)';
        }
      });

      emailInput.addEventListener('blur', function() {
        const parent = this.parentElement as HTMLElement;
        if (parent) {
          parent.style.borderColor = 'rgba(255,255,255,.2)';
          parent.style.boxShadow = '0 8px 32px rgba(0,0,0,.3)';
          parent.style.background = 'rgba(255,255,255,.1)';
        }
      });
    }

    // Mouse movement interactive background
    const heroBg = document.querySelector('.heroBg') as HTMLElement;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let animationId: number;

    function updateBackground() {
      // Smooth interpolation for mouse movement
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      if (heroBg) {
        // Convert mouse position to percentage (0-100)
        const xPercent = (mouseX / window.innerWidth) * 100;
        const yPercent = (mouseY / window.innerHeight) * 100;

        // Update background gradients based on mouse position
        heroBg.style.background = `
          radial-gradient(60% 80% at ${20 + xPercent * 0.3}% ${20 + yPercent * 0.2}%, rgba(255,89,48,.2), transparent 50%),
          radial-gradient(50% 70% at ${80 - xPercent * 0.2}% ${30 + yPercent * 0.3}%, rgba(252,178,0,.15), transparent 50%),
          radial-gradient(60% 90% at ${30 + xPercent * 0.4}% ${70 - yPercent * 0.2}%, rgba(131,6,152,.1), transparent 60%),
          radial-gradient(50% 80% at ${70 - xPercent * 0.3}% ${80 - yPercent * 0.3}%, rgba(124,162,253,.15), transparent 60%),
          radial-gradient(40% 60% at ${50 + xPercent * 0.2}% ${50 + yPercent * 0.2}%, rgba(172,223,127,.08), transparent 70%),
          linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)
        `;
      }

      animationId = requestAnimationFrame(updateBackground);
    }

    function handleMouseMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
    }

    // Start the animation loop
    updateBackground();

    // Add mouse move listener
    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
