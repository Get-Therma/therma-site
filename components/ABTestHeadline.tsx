'use client';

interface ABTestHeadlineProps {
  className?: string;
}

export default function ABTestHeadline({ className }: ABTestHeadlineProps) {
  return (
    <h1 className={className}>
      Discover Your Patterns. Optimize Your Routine.
    </h1>
  );
}