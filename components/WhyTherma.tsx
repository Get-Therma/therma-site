'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { MouseEvent } from 'react';
import { useRef } from 'react';

type Item = { emoji: string; title: string; body: string; alt: string; microStory: string };

const ITEMS: Item[] = [
  {
    emoji: '🧘',
    title: 'Daily Reflections',
    body: 'Gentle prompts that help you process your day—without judgment.',
    alt: 'A person in a calm seated pose.',
    microStory: '→ Try a 2-minute check-in: inhale 4, hold 4, exhale 6.'
  },
  {
    emoji: '🤖',
    title: 'AI Companion',
    body: 'A kind companion that listens, asks thoughtful questions, and helps you notice patterns.',
    alt: 'A friendly robot face.',
    microStory: '→ Ask a question and receive a thoughtful, unbiased perspective.'
  },
  {
    emoji: '☁️',
    title: 'Mindful Space',
    body: 'A quiet place to slow down, breathe, and actually hear yourself.',
    alt: 'A small, soft cloud.',
    microStory: "→ Take a moment to pause and notice what you're feeling right now."
  }
];

export default function WhyTherma() {
  const prefersReducedMotion = useReducedMotion();
  const refs = useRef<Array<HTMLDivElement | null>>([]);

  const handleMove = (e: MouseEvent<HTMLDivElement>, i: number) => {
    const el = refs.current[i];
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y - r.height / 2) / r.height) * 6;   // tilt range
    const ry = ((x - r.width / 2) / r.width) * -6;
    el.style.setProperty('--rx', `${rx}deg`);
    el.style.setProperty('--ry', `${ry}deg`);
  };

  const handleLeave = (i: number) => {
    const el = refs.current[i];
    if (!el) return;
    el.style.setProperty('--rx', `0deg`);
    el.style.setProperty('--ry', `0deg`);
  };

  return (
    <section id="why" className="relative mt-16 md:mt-24 lg:mt-28 overflow-hidden py-20 md:py-28">
      {/* Ambient breathing auras (very subtle) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-0 h-64 w-64 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.08), transparent)' }}
        animate={prefersReducedMotion ? undefined : { scale: [1, 1.05, 1] , opacity:[.5,.7,.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-10 h-80 w-80 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.06), transparent)' }}
        animate={prefersReducedMotion ? undefined : { scale: [1, 1.04, 1], opacity:[.45,.65,.45] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative mx-auto max-w-5xl px-6">
        <header className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">Why Therma?</h2>
          <p className="mt-3 text-white/70">Your space to slow down, check in, and feel supported.</p>
        </header>

        <div className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((it, i) => (
            <motion.div
              key={it.title}
              ref={(el) => { refs.current[i] = el; }}
              onMouseMove={(e) => handleMove(e, i)}
              onMouseLeave={() => handleLeave(i)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              viewport={{ once: true, amount: 0.35 }}
              className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-5 md:p-6 text-white will-change-transform shadow-[0_8px_40px_-20px_rgba(0,0,0,0.6)]"
              style={{
                transform: 'perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* focus glow that appears on hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'radial-gradient(60% 80% at 50% 20%, rgba(255,255,255,0.10), transparent)' }}
              />
              {/* soft glow */}
              <motion.div
                aria-hidden
                className="absolute -inset-px rounded-3xl"
                style={{ background: 'radial-gradient(60% 60% at 50% 40%, rgba(255,255,255,0.12), transparent)', filter: 'blur(10px)', transform: 'translateZ(-1px)' }}
                animate={prefersReducedMotion ? { opacity: 0.5 } : { scale: [1, 1.04, 1], opacity: [0.45, 0.7, 0.45] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* content */}
              <div className="relative z-10 space-y-2">
                <div className="relative inline-flex">
                  <span className="text-3xl" role="img" aria-label={it.alt}>{it.emoji}</span>
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-full"
                    style={{ boxShadow: '0 0 0 0 rgba(255,255,255,0.15)' }}
                  />
                </div>
                <h3 className="text-lg md:text-xl font-semibold">{it.title}</h3>
                <p className="text-sm md:text-[15px] leading-relaxed text-white/80">{it.body}</p>
                {/* micro-story on hover */}
                <div className="pt-2">
                  <div className="text-xs text-white/65 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {it.microStory}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="sr-only">
          Motion is subtle. Enable "Reduce Motion" in system settings to minimize effects.
        </p>
      </div>
    </section>
  );
}
