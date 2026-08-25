// Procedural Web Audio API Sound Synthesizer for 1994 Laundromat & Arcade
// Zero external mp3 dependencies needed!

class AudioSynthEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;

  // Ambient Gain Nodes
  private masterGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private dryerGain: GainNode | null = null;
  private neonGain: GainNode | null = null;
  private arcadeGain: GainNode | null = null;

  // Active Generators / Loops
  private rainNode: AudioNode | null = null;
  private dryerNode: AudioNode | null = null;
  private neonNode: AudioNode | null = null;
  private arcadeInterval: number | null = null;

  public init() {
    if (this.isInitialized && this.ctx && this.ctx.state === 'running') return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Setup Channel Gains (Gentle background texture)
      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.rainGain.connect(this.masterGain);

      this.dryerGain = this.ctx.createGain();
      this.dryerGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      this.dryerGain.connect(this.masterGain);

      this.neonGain = this.ctx.createGain();
      this.neonGain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      this.neonGain.connect(this.masterGain);

      this.arcadeGain = this.ctx.createGain();
      this.arcadeGain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      this.arcadeGain.connect(this.masterGain);

      this.startRainSynth();
      this.startDryerSynth();
      this.startNeonSynth();
      this.startArcadeSynth();

      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported or blocked by browser policy:', e);
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- Rain Generator (Continuous Pink/Brown Noise with Low-Pass) ---
  private startRainSynth() {
    if (!this.ctx || !this.rainGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.rainGain);
    whiteNoise.start(0);
    this.rainNode = whiteNoise;
  }

  // --- Dryer Mechanical Rumble & Tumbling Clothes ---
  private startDryerSynth() {
    if (!this.ctx || !this.dryerGain) return;
    
    // Motor Hum (120Hz + 60Hz resonant rumble)
    const motorOsc = this.ctx.createOscillator();
    motorOsc.type = 'triangle';
    motorOsc.frequency.setValueAtTime(95, this.ctx.currentTime);

    const motorFilter = this.ctx.createBiquadFilter();
    motorFilter.type = 'bandpass';
    motorFilter.frequency.setValueAtTime(180, this.ctx.currentTime);
    motorFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    const motorGain = this.ctx.createGain();
    motorGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    motorOsc.connect(motorFilter);
    motorFilter.connect(motorGain);
    motorGain.connect(this.dryerGain);
    motorOsc.start(0);

    // Mechanical low rumble loop
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 1.5;
    }

    const rumble = this.ctx.createBufferSource();
    rumble.buffer = noiseBuffer;
    rumble.loop = true;

    const rumbleFilter = this.ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.setValueAtTime(140, this.ctx.currentTime);

    rumble.connect(rumbleFilter);
    rumbleFilter.connect(this.dryerGain);
    rumble.start(0);
    this.dryerNode = rumble;
  }

  // --- 60Hz Neon Electrical Transformer Hum & Buzz ---
  private startNeonSynth() {
    if (!this.ctx || !this.neonGain) return;

    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(60, this.ctx.currentTime);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(120, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(240, this.ctx.currentTime);
    filter.Q.setValueAtTime(5.0, this.ctx.currentTime);

    const neonSubGain = this.ctx.createGain();
    neonSubGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(neonSubGain);
    neonSubGain.connect(this.neonGain);

    osc1.start(0);
    osc2.start(0);
    this.neonNode = osc1;
  }

  // --- Arcade Attract Chiptune Blips (Periodic subtle 8-bit blips in the background) ---
  private startArcadeSynth() {
    if (!this.ctx || !this.arcadeGain) return;

    const playRandomChiptuneBlip = () => {
      if (!this.ctx || !this.arcadeGain || this.ctx.state !== 'running') return;
      if (Math.random() > 0.6) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';

        const freqs = [440, 523.25, 659.25, 783.99, 880, 1046.5];
        const f = freqs[Math.floor(Math.random() * freqs.length)];
        
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.exponentialRampToValueAtTime(f * 1.5, now + 0.12);

        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.arcadeGain);

        osc.start(now);
        osc.stop(now + 0.2);
      }
    };

    this.arcadeInterval = window.setInterval(playRandomChiptuneBlip, 4500);
  }

  // --- Dynamic Volume Controls ---
  public setRainVolume(val: number) {
    if (this.ctx && this.rainGain) {
      this.rainGain.gain.setTargetAtTime(Math.max(0, Math.min(1, val * 0.6)), this.ctx.currentTime, 0.05);
    }
  }

  public setDryerVolume(val: number) {
    if (this.ctx && this.dryerGain) {
      this.dryerGain.gain.setTargetAtTime(Math.max(0, Math.min(1, val * 0.5)), this.ctx.currentTime, 0.05);
    }
  }

  public setNeonVolume(val: number) {
    if (this.ctx && this.neonGain) {
      this.neonGain.gain.setTargetAtTime(Math.max(0, Math.min(1, val * 0.35)), this.ctx.currentTime, 0.05);
    }
  }

  public setArcadeVolume(val: number) {
    if (this.ctx && this.arcadeGain) {
      this.arcadeGain.gain.setTargetAtTime(Math.max(0, Math.min(1, val * 0.4)), this.ctx.currentTime, 0.05);
    }
  }

  public setMasterMute(muted: boolean) {
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 1, this.ctx.currentTime, 0.05);
    }
  }

  // --- One-Shot Sound Effects ---
  public playCoinSound() {
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Metal Clink
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(2400, now);
    osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.1);

    // 2. Rising Arcade 1-UP Chime (1994 style)
    const notes = [987.77, 1318.51]; // B5, E6
    notes.forEach((freq, idx) => {
      const o = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      o.type = 'square';
      const t = now + 0.06 + idx * 0.09;
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.15, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      o.connect(g);
      g.connect(this.ctx!.destination);
      o.start(t);
      o.stop(t + 0.28);
    });
  }

  public playButtonBeep() {
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  public playVendingDrinkDrop() {
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Heavy Metal Thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.25);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);

    // Carbonation Fizz
    const bufferSize = this.ctx.sampleRate * 0.4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3000, now + 0.15);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.1, now + 0.15);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(now + 0.15);
  }

  // --- Brass Shop Door Chime ("Ding-Dong" on Entering Laundromat) ---
  public playDoorChime() {
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [
      { freq: 880, time: 0, dur: 1.2 },    // High A5 (Ding)
      { freq: 659.25, time: 0.3, dur: 1.5 } // Lower E5 (Dong)
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0.25, now + time);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + time);
      osc.stop(now + time + dur);
    });
  }

  // --- Mechanical Cassette Tape Rewind / Fast-Forward Whir & Head Click ---
  public playTapeRewind() {
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Motor Spin Whir
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.4);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);

    // 2. Mechanical Head Click
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(800, now + 0.42);
    clickOsc.frequency.exponentialRampToValueAtTime(100, now + 0.48);

    clickGain.gain.setValueAtTime(0.2, now + 0.42);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    clickOsc.connect(clickGain);
    clickGain.connect(this.ctx.destination);
    clickOsc.start(now + 0.42);
    clickOsc.stop(now + 0.5);
  }

  // --- 1994 Industrial Washer Buzzer (Cycle Complete) ---
  public playWasherBuzzer() {
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.8);
  }

  // --- 🕹️ Easter Egg 1: Pac-Man 8-Bit Arcade Melody & Coin Chime ---
  public playPacManArcade() {
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Classic Namco arcade theme notes
    const pacNotes = [
      { f: 493.88, d: 0.1 },  // B4
      { f: 987.77, d: 0.1 },  // B5
      { f: 739.99, d: 0.1 },  // F#5
      { f: 622.25, d: 0.1 },  // D#5
      { f: 987.77, d: 0.1 },  // B5
      { f: 739.99, d: 0.1 },  // F#5
      { f: 622.25, d: 0.2 },  // D#5
    ];

    let t = now;
    pacNotes.forEach(({ f, d }) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + d * 0.95);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t);
      osc.stop(t + d);
      t += d;
    });
  }

  // --- 💡 Easter Egg 2: Neon Sign Transformer Ballast Zap & Flicker ---
  public playNeonBallastHum(isQuiet = false) {
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const count = isQuiet ? 2 : 4;
    const vol = isQuiet ? 0.08 : 0.2;

    for (let i = 0; i < count; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const zapTime = now + i * 0.07 + Math.random() * 0.02;
      osc.frequency.setValueAtTime(110 + Math.random() * 90, zapTime);

      gain.gain.setValueAtTime(vol, zapTime);
      gain.gain.exponentialRampToValueAtTime(0.001, zapTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(zapTime);
      osc.stop(zapTime + 0.06);
    }
  }

  // --- 🛋️ Vintage Desk Lamp Pull-Chain Click ---
  public playLampSwitch() {
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // --- 🧺 Easter Egg 3: Speed Queen Drum Water Slosh & Spin ---
  public playWasherDrumSpin() {
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(60, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.4);
    osc.frequency.exponentialRampToValueAtTime(80, now + 1.2);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.4);
  }

  // --- Procedural 90s City Pop / Cantopop Melodic Synthesizer ---
  private musicInterval: number | null = null;
  private musicGain: GainNode | null = null;
  private currentChordIndex = 0;

  public startCityPopMusic(volume = 0.7) {
    this.init();
    this.resume();
    if (!this.ctx) return;

    if (!this.musicGain) {
      this.musicGain = this.ctx.createGain();
      this.musicGain.connect(this.ctx.destination);
    }
    this.musicGain.gain.setValueAtTime(volume, this.ctx.currentTime);

    if (this.musicInterval) return;

    // Classic 90s City Pop Progression: Fmaj7 -> Em7 -> Dm7 -> Cmaj7
    const chords = [
      { bass: 174.61, notes: [349.23, 440.00, 523.25, 659.25] }, // Fmaj7 (F3, F4, A4, C5, E5)
      { bass: 164.81, notes: [329.63, 392.00, 493.88, 587.33] }, // Em7 (E3, E4, G4, B4, D5)
      { bass: 146.83, notes: [293.66, 349.23, 440.00, 523.25] }, // Dm7 (D3, D4, F4, A4, C5)
      { bass: 130.81, notes: [261.63, 329.63, 392.00, 493.88] }, // Cmaj7 (C3, C4, E4, G4, B4)
    ];

    const playChordStep = () => {
      if (!this.ctx || !this.musicGain) return;
      const now = this.ctx.currentTime;
      const chord = chords[this.currentChordIndex];
      this.currentChordIndex = (this.currentChordIndex + 1) % chords.length;

      // 1. Warm Electric Piano (Rhodes / DX7 chime)
      chord.notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);

        // Gentle FM modulation for glassy Rhodes shimmer
        const mod = this.ctx!.createOscillator();
        const modGain = this.ctx!.createGain();
        mod.frequency.setValueAtTime(freq * 2, now);
        modGain.gain.setValueAtTime(freq * 0.15, now);
        mod.connect(osc.frequency);
        mod.start(now);
        mod.stop(now + 2.2);

        noteGain.gain.setValueAtTime(0.08, now + i * 0.04);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

        osc.connect(noteGain);
        noteGain.connect(this.musicGain!);
        osc.start(now + i * 0.04);
        osc.stop(now + 2.4);
      });

      // 2. Warm Analog Sub Bass
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(chord.bass / 2, now);

      bassGain.gain.setValueAtTime(0.18, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      bassOsc.connect(bassGain);
      bassGain.connect(this.musicGain);
      bassOsc.start(now);
      bassOsc.stop(now + 2.2);

      // 3. Subtle Lo-Fi Snare Brush
      const bufferSize = this.ctx.sampleRate * 0.15;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const brush = this.ctx.createBufferSource();
      brush.buffer = noiseBuffer;
      const brushFilter = this.ctx.createBiquadFilter();
      brushFilter.type = 'bandpass';
      brushFilter.frequency.setValueAtTime(4500, now + 1.2);
      const brushGain = this.ctx.createGain();
      brushGain.gain.setValueAtTime(0.03, now + 1.2);
      brushGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.35);

      brush.connect(brushFilter);
      brushFilter.connect(brushGain);
      brushGain.connect(this.musicGain);
      brush.start(now + 1.2);
    };

    // Play first chord immediately
    playChordStep();
    this.musicInterval = window.setInterval(playChordStep, 2400);
  }

  public setCityPopMusicVolume(volume: number) {
    if (this.ctx && this.musicGain) {
      this.musicGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  public stopCityPopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }

  public dispose() {
    this.stopCityPopMusic();
    if (this.arcadeInterval) {
      clearInterval(this.arcadeInterval);
      this.arcadeInterval = null;
    }
    if (this.rainNode) {
      try { (this.rainNode as AudioScheduledSourceNode).stop(); } catch { /* ignore */ }
      this.rainNode = null;
    }
    if (this.dryerNode) {
      try { (this.dryerNode as AudioScheduledSourceNode).stop(); } catch { /* ignore */ }
      this.dryerNode = null;
    }
    if (this.neonNode) {
      try { (this.neonNode as AudioScheduledSourceNode).stop(); } catch { /* ignore */ }
      this.neonNode = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    this.isInitialized = false;
  }
}

export const audioSynth = new AudioSynthEngine();



