'use client';

interface ABTestHeadlineProps {
  className?: string;
}

export default function ABTestHeadline({ className }: ABTestHeadlineProps) {
  return (
    <h1 className={className}>
      Spot the bright spots, fix the frictions, and feel steadier week by week.
    </h1>
  );
}