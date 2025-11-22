'use client';

import Image from 'next/image';
import React from 'react';

import styles from './ThermaWeeklyHero.module.css';

type Volume = {
  id: number;
  label: string;
  title: string;
  color: 'red' | 'blue' | 'yellow';
};

const VOLUMES: Volume[] = [
  { id: 1, label: 'VOL. 01', title: 'Night Rituals', color: 'red' },
  { id: 2, label: 'VOL. 02', title: 'Signals & Symptoms', color: 'blue' },
  { id: 3, label: 'VOL. 03', title: 'Creative Weather', color: 'yellow' },
  { id: 4, label: 'VOL. 04', title: 'Restless Nights', color: 'red' },
  { id: 5, label: 'VOL. 05', title: 'Deep Sleep Drift', color: 'blue' },
  { id: 6, label: 'VOL. 06', title: 'Micro Climates', color: 'yellow' }
];

const colorClassMap: Record<Volume['color'], string> = {
  red: styles.volumeRed,
  blue: styles.volumeBlue,
  yellow: styles.volumeYellow
};

interface VolumeButtonProps {
  volume: Volume;
  align?: 'left' | 'right';
  onClick?: () => void;
}

const VolumeButton: React.FC<VolumeButtonProps> = ({ volume, align = 'left', onClick }) => {
  const alignClass = align === 'left' ? styles.volumeButtonLeft : styles.volumeButtonRight;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[styles.volumeButton, colorClassMap[volume.color], alignClass].join(' ')}
    >
      <span className={styles.volumeLabel}>{volume.label}</span>
      {volume.title && <span className={styles.volumeTitle}>{volume.title}</span>}
    </button>
  );
};

const ThermaWeeklyHero: React.FC = () => {
  const leftVolumes = VOLUMES.slice(0, 3);
  const rightVolumes = VOLUMES.slice(3, 6);

  return (
    <section className={styles.hero}>
      <div className={styles.background} aria-hidden="true" />

      <div className={styles.layout}>
        <div className={styles.volumeColumn}>
          {leftVolumes.map((volume) => (
            <VolumeButton
              key={volume.id}
              volume={volume}
              align="left"
              onClick={() => {
                /* hook up routing later, e.g. router.push(`/therma-weekly/vol-${String(volume.id).padStart(2, '0')}`) */
              }}
            />
          ))}
        </div>

        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <div className={styles.masthead}>
              <div className={styles.mastheadTitle}>
                <span className={styles.mastheadTherma}>Therma</span>
                <span className={styles.mastheadWeekly}>Weekly</span>
              </div>
              <div className={styles.mastheadSubhead}>
                therma weekly • emotional weather & night rituals
              </div>
            </div>

            <div className={styles.imageWrapper}>
              <Image
                src="/images/therma-weekly-cover.jpg"
                alt="Therma Weekly hero"
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                priority
                style={{ objectFit: 'cover' }}
              />
            </div>

            <div className={styles.copy}>
              <p>
                Therma Weekly is a rotating series of digital issues exploring the small, repeatable
                rituals that shape our inner weather: late-night reading, anxious loops, calm
                pockets, and the subtle shifts that happen when we finally pay attention.
              </p>
              <p>
                Built on top of the Therma app, each volume zooms in on a different pattern – not to
                fix you, but to help you see yourself more clearly. Think of it as a slow magazine
                for your emotional climate.
              </p>
            </div>
          </div>

          <div className={styles.mobileGrid}>
            {VOLUMES.map((volume) => (
              <VolumeButton
                key={`mobile-${volume.id}`}
                volume={volume}
                onClick={() => {
                  /* hook mobile routing here */
                }}
              />
            ))}
          </div>
        </div>

        <div className={styles.volumeColumn}>
          {rightVolumes.map((volume) => (
            <VolumeButton
              key={volume.id}
              volume={volume}
              align="right"
              onClick={() => {
                /* hook routing here */
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThermaWeeklyHero;

