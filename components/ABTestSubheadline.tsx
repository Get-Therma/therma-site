'use client';

interface ABTestSubheadlineProps {
  className?: string;
}

export default function ABTestSubheadline({ className }: ABTestSubheadlineProps) {
  return (
    <h2 className={className}>
      Therma finds the hidden patterns in your daily life<br />
      and turns them into clear, actionable insights.<br /><br />
      Fine-tune your habits for peak energy, clarity, and confidence—<br />
      making every week better than the last.
    </h2>
  );
}
