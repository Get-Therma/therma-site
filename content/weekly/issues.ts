export type ThermaWeeklyIssue = {
  slug: string;
  issueNumber: number;
  title: string;
  subtitle: string;
  publishedAt: string;
  readTimeMinutes: number;
  tags: string[];
  coverImageUrl?: string;
  heroKicker?: string;
  scientificSection: {
    heading: string;
    body: string;
  };
  personalSection: {
    heading: string;
    body: string;
  };
  cta?: {
    label: string;
    href: string;
  };
};

/**
 * To add a new Therma Weekly issue:
 * 1. Drop the cover image into /public/images/weekly/ (optional)
 * 2. Add a new object below with an incremented issueNumber and unique slug
 * 3. Keep tags/publishedAt consistent so the archive stays sorted chronologically
 */
export const weeklyIssues: ThermaWeeklyIssue[] = [
  {
    slug: 'sleep-debt-reset',
    issueNumber: 6,
    title: 'Sleep Debt Reset',
    subtitle: 'A seven-night protocol for untangling lingering fatigue.',
    publishedAt: '2025-02-09T08:00:00.000Z',
    readTimeMinutes: 8,
    tags: ['sleep', 'routines', 'research'],
    coverImageUrl: '/images/weekly/issue-default.svg',
    heroKicker: 'Issue 06',
    scientificSection: {
      heading: 'Why “sleep debt” is physiological, not moral weakness',
      body:
        "Researchers estimate that every hour of missed sleep stacks cortisol, elevates ghrelin, and tanks reaction time for three days. We break down the landmark Stanford Sleep Lab protocol, including slow-wave rebounds and how to modulate light exposure so REM rebounds don't spike anxiety.",
    },
    personalSection: {
      heading: 'Personal log: Relearning how to be tired',
      body:
        "By night three I realized my ‘productive insomnia’ was vanity. I tracked body temperature inside Therma and finally saw the 3 a.m. spike that kept me scrolling. Letting myself nap felt rebellious. The next Sunday, the fog lifted—quietly, without fireworks.",
    },
    cta: {
      label: 'Track your sleep experiments in Therma',
      href: '/contact',
    },
  },
  {
    slug: 'circadian-contrast-showers',
    issueNumber: 5,
    title: 'Circadian Contrast Showers',
    subtitle: 'Alternating heat & cold to anchor your morning chronotype.',
    publishedAt: '2025-01-26T08:00:00.000Z',
    readTimeMinutes: 6,
    tags: ['energy', 'rituals'],
    coverImageUrl: '/images/weekly/issue-default.svg',
    heroKicker: 'Issue 05',
    scientificSection: {
      heading: 'Thermal stress & norepinephrine timing',
      body:
        'We dissect Scandinavian hydrotherapy research that shows a 530% uptick in norepinephrine after 30 seconds of cold exposure, plus how heat priming keeps vessels elastic enough to avoid the “shiver crash.” Includes practical timing windows for dawn vs. dusk chronotypes.',
    },
    personalSection: {
      heading: 'Personal log: Trading doom scrolls for steam',
      body:
        "I used Therma’s check-ins to score my mood before and after each shower circuit. The data nudged me: on cold-heavy days I was jittery, but adding a 90-second warm rinse before bed helped me fall asleep 14 minutes faster.",
    },
    cta: {
      label: 'Save this protocol in Therma',
      href: '/contact',
    },
  },
  {
    slug: 'micro-climate-reading-nook',
    issueNumber: 4,
    title: 'Micro-Climate Reading Nook',
    subtitle: 'Building a sensory buffer so your brain knows it’s story time.',
    publishedAt: '2025-01-12T08:00:00.000Z',
    readTimeMinutes: 7,
    tags: ['mindfulness', 'environment'],
    coverImageUrl: '/images/weekly/issue-default.svg',
    heroKicker: 'Issue 04',
    scientificSection: {
      heading: 'Ambient warmth & parasympathetic drift',
      body:
        'Soft luminance paired with warm beverages can activate vagal tone within 6 minutes. We cite Dr. Huberman’s thermal layering experiments and explain how mild heat nudges the parasympathetic system for deeper reading focus.',
    },
    personalSection: {
      heading: 'Personal log: Turning off the overhead light',
      body:
        'Therma’s journal had me log scent, sound, and light. I noticed lavender made me nostalgic, so I swapped to cedar. The first night the nook felt contrived, but by day five the ritual cued my body to slow down before I even opened the book.',
    },
    cta: {
      label: 'Download the Therma ritual template',
      href: '/contact',
    },
  },
];

export const getSortedIssues = (): ThermaWeeklyIssue[] =>
  [...weeklyIssues].sort((a, b) => b.issueNumber - a.issueNumber);

export const getIssueBySlug = (slug: string): ThermaWeeklyIssue | undefined =>
  weeklyIssues.find((issue) => issue.slug === slug);

export const getIssueSiblings = (slug: string) => {
  const sorted = getSortedIssues();
  const index = sorted.findIndex((issue) => issue.slug === slug);
  return {
    previous: index < sorted.length - 1 ? sorted[index + 1] : undefined,
    next: index > 0 ? sorted[index - 1] : undefined,
  };
};

export const getAllTags = () => {
  const set = new Set<string>();
  weeklyIssues.forEach((issue) => issue.tags.forEach((tag) => set.add(tag)));
  return Array.from(set).sort();
};

