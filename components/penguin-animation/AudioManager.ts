export class AudioManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private muted: boolean;
  private ambientSource: AudioBufferSourceNode | null = null;
  private initialized: boolean = false;

  constructor(muted: boolean = true) {
    this.muted = muted;
    this.initialize();
  }

  private async initialize() {
    try {
      // Create audio context (lazy initialization for better browser support)
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        this.audioContext = new AudioContext();
        this.initialized = true;
        
        // Preload sounds
        await this.loadSounds();
        
        // Start ambient sound if not muted
        if (!this.muted) {
          this.playAmbient();
        }
      }
    } catch (error) {
      console.warn('Audio initialization failed:', error);
      this.initialized = false;
    }
  }

  private async loadSounds() {
    if (!this.audioContext) return;

    const soundFiles = [
      { name: 'slide1', url: '/sounds/slide1.mp3' },
      { name: 'slide2', url: '/sounds/slide2.mp3' },
      { name: 'ambient', url: '/sounds/ambient.mp3' },
    ];

    for (const sound of soundFiles) {
      try {
        const response = await fetch(sound.url);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
          this.sounds.set(sound.name, audioBuffer);
        }
      } catch (error) {
        // Silently fail if sound files don't exist yet
        console.debug(`Sound file ${sound.name} not found, continuing without audio`);
      }
    }
  }

  playSlideSound() {
    if (this.muted || !this.audioContext || !this.initialized) return;

    try {
      // Randomly choose between slide1 and slide2
      const soundName = Math.random() > 0.5 ? 'slide1' : 'slide2';
      const buffer = this.sounds.get(soundName);
      
      if (buffer) {
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        
        // Add gain node for volume control
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = 0.3; // 30% volume for subtle effect
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        source.start(0);
      }
    } catch (error) {
      console.warn('Failed to play slide sound:', error);
    }
  }

  private playAmbient() {
    if (this.muted || !this.audioContext || !this.initialized) return;

    try {
      const buffer = this.sounds.get('ambient');
      
      if (buffer && !this.ambientSource) {
        this.ambientSource = this.audioContext.createBufferSource();
        this.ambientSource.buffer = buffer;
        this.ambientSource.loop = true;
        
        // Add gain node for volume control
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = 0.2; // 20% volume for ambient
        
        this.ambientSource.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        this.ambientSource.start(0);
      }
    } catch (error) {
      console.warn('Failed to play ambient sound:', error);
    }
  }

  private stopAmbient() {
    if (this.ambientSource) {
      try {
        this.ambientSource.stop();
        this.ambientSource.disconnect();
      } catch (error) {
        // Ignore errors when stopping
      }
      this.ambientSource = null;
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    
    if (muted) {
      this.stopAmbient();
    } else {
      this.playAmbient();
    }
  }

  cleanup() {
    this.stopAmbient();
    
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (error) {
        // Ignore close errors
      }
      this.audioContext = null;
    }
    
    this.sounds.clear();
    this.initialized = false;
  }
}
