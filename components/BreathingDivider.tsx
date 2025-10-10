'use client';
import { motion, useReducedMotion } from 'framer-motion';

export default function BreathingDivider() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="relative isolate -mt-6 h-16 md:h-24 lg:h-28">
      <motion.div
        className="absolute inset-x-0 -top-10 mx-auto h-40 w-[90%] blur-2xl"
        style={{
          background:
            'radial-gradient(50% 120% at 50% 0%, rgba(255,255,255,0.10), transparent)'
        }}
        animate={reduce ? undefined : { opacity: [0.45, 0.75, 0.45], scale: [1, 1.03, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
