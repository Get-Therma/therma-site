'use client';

import { useEffect } from 'react';
import { captureAttributionFromLocation } from '../lib/attribution';

/**
 * Captures UTM params from inbound traffic (e.g. Beacons links) and persists them
 * so downstream conversions (waitlist/contact) can attribute cleanly even after navigation.
 *
 * Renders nothing.
 */
export default function AttributionTracker() {
  useEffect(() => {
    captureAttributionFromLocation();
  }, []);

  return null;
}

