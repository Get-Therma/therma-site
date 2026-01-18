'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const ThermaAssistant = dynamic(() => import('./ThermaAssistant'), {
  ssr: false,
  loading: () => null,
});

export default function ThermaAssistantLoader() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const enable = () => setEnabled(true);

    // Defer chat JS off the critical path (improves LTE/LCP).
    if (typeof (window as any).requestIdleCallback === 'function') {
      (window as any).requestIdleCallback(enable, { timeout: 2500 });
      return;
    }

    const t = window.setTimeout(enable, 1200);
    return () => window.clearTimeout(t);
  }, []);

  if (!enabled) return null;
  return <ThermaAssistant />;
}

