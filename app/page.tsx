'use client';

import SubscribeForm from '../components/SubscribeForm';

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1.1 }}>
          <strong>See your patterns. Keep what works. Steady your days.</strong>
        </h1>
        <p style={{ margin: '1rem auto', maxWidth: 760, fontSize: '1.125rem' }}>
          Therma turns your journaling, habits, and daily check‑ins into <b>pattern maps</b>—spotting
          <b> bright spots</b> to keep and <b>frictions</b> to tweak—so small changes add up to steadier weeks.
        </p>

        <div style={{ marginTop: '1.5rem', maxWidth: 560, marginInline: 'auto' }}>
          <SubscribeForm />
          <p style={{ fontSize: '.9rem', opacity: .8, marginTop: '0.5rem' }}>
            Early access — first 1,000 spots. No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* VALUE / HOW IT WORKS */}
      <section style={{ padding: '2rem 1.25rem', maxWidth: 1000, margin: '0 auto' }}>
        <h2>Why Therma</h2>
        <ul style={{ display: 'grid', gap: '1rem', listStyle: 'none', padding: 0 }}>
          <li>
            <b>Pattern Maps</b> — Your entries, habits, sleep, and mood are organized into weekly
            views that surface recurring contexts—days, times, people, or routines—linked with steadier
            or shakier moods.
          </li>
          <li>
            <b>Bright Spots (what's already working)</b> — See the routines that stabilize you
            (e.g., walk + 6‑bpm breathing before meetings). Save them as "Keep" habits to reinforce wins.
          </li>
          <li>
            <b>Friction Finder (what to adjust)</b> — Therma flags conditions that nudge you off course
            (e.g., late caffeine + short sleep). Turn them into <i>if‑then</i> plans to make change stick.
          </li>
          <li>
            <b>Gentle, research‑informed prompts</b> — Low‑effort daily prompts reduce cognitive load
            and help you reflect consistently.
          </li>
          <li>
            <b>Breath tools for regulation</b> — Quick, paced‑breathing guides to downshift stress and
            improve HRV over time.
          </li>
          <li>
            <b>Private by design</b> — Your entries stay yours. We use strong safeguards and
            HIPAA‑eligible services; details in our Privacy Policy.
          </li>
        </ul>

        <h2 style={{ marginTop: '2rem' }}>How it works</h2>
        <ol style={{ display: 'grid', gap: '.75rem', paddingLeft: '1.25rem' }}>
          <li><b>Check in</b> — 60–120s of guided breathing + a simple mood prompt.</li>
          <li><b>Journal</b> — Answer one or two gentle questions; add any habit tags.</li>
          <li><b>See patterns</b> — Weekly Pattern Map highlights <b>bright spots</b> and <b>frictions</b> with easy next steps.</li>
        </ol>
      </section>
    </main>
  );
}