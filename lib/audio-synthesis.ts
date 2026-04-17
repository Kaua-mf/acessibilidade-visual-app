/**
 * Audio Synthesis Utility
 * Generates variable-frequency whistle sounds for light detection feedback
 */

let audioContext: AudioContext | null = null;
let oscillator: OscillatorNode | null = null;
let gainNode: GainNode | null = null;
let isPlaying = false;

/**
 * Initialize the Web Audio API context
 */
function initializeAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Start playing a variable-frequency whistle
 * @param frequency - Frequency in Hz (200-2000 Hz recommended)
 * @param volume - Volume level (0-1)
 */
export function startWhistle(frequency: number = 1000, volume: number = 0.3): void {
  try {
    if (isPlaying) {
      stopWhistle();
    }

    const context = initializeAudioContext();

    // Resume audio context if suspended (required for iOS)
    if (context.state === 'suspended') {
      context.resume();
    }

    // Create oscillator (generates the tone)
    oscillator = context.createOscillator();
    oscillator.type = 'sine'; // Smooth sine wave for whistle-like sound
    oscillator.frequency.value = frequency;

    // Create gain node (controls volume)
    gainNode = context.createGain();
    gainNode.gain.value = volume;

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Start oscillator
    oscillator.start();
    isPlaying = true;
  } catch (error) {
    console.error('Error starting whistle:', error);
  }
}

/**
 * Stop playing the whistle
 */
export function stopWhistle(): void {
  try {
    if (oscillator && isPlaying) {
      oscillator.stop();
      oscillator.disconnect();
      oscillator = null;
      isPlaying = false;
    }
  } catch (error) {
    console.error('Error stopping whistle:', error);
  }
}

/**
 * Change the frequency of the current whistle
 * @param frequency - New frequency in Hz
 */
export function setWhistleFrequency(frequency: number): void {
  try {
    if (oscillator && isPlaying) {
      // Use exponential ramp for smooth frequency transitions
      const context = initializeAudioContext();
      const currentTime = context.currentTime;
      
      // Smooth transition over 50ms
      oscillator.frequency.exponentialRampToValueAtTime(
        frequency,
        currentTime + 0.05
      );
    }
  } catch (error) {
    console.error('Error setting whistle frequency:', error);
  }
}

/**
 * Set the volume of the current whistle
 * @param volume - Volume level (0-1)
 */
export function setWhistleVolume(volume: number): void {
  try {
    if (gainNode) {
      gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  } catch (error) {
    console.error('Error setting whistle volume:', error);
  }
}

/**
 * Convert light percentage (0-100) to frequency (200-2000 Hz)
 * Low light = low frequency, high light = high frequency
 * @param lightPercentage - Light level as percentage (0-100)
 * @returns Frequency in Hz
 */
export function lightPercentageToFrequency(lightPercentage: number): number {
  // Clamp percentage to 0-100
  const clamped = Math.max(0, Math.min(100, lightPercentage));
  
  // Map 0-100 to 200-2000 Hz
  // Using exponential mapping for more natural-sounding progression
  const minFreq = 200;
  const maxFreq = 2000;
  
  // Exponential mapping: more noticeable changes at lower light levels
  const normalized = clamped / 100;
  const frequency = minFreq * Math.pow(maxFreq / minFreq, normalized);
  
  return Math.round(frequency);
}

/**
 * Play a continuous whistle that updates with light changes
 * @param lightPercentage - Light level as percentage (0-100)
 * @param volume - Volume level (0-1)
 */
export function playLightDetectionWhistle(
  lightPercentage: number,
  volume: number = 0.3
): void {
  const frequency = lightPercentageToFrequency(lightPercentage);
  
  if (!isPlaying) {
    startWhistle(frequency, volume);
  } else {
    setWhistleFrequency(frequency);
    setWhistleVolume(volume);
  }
}

/**
 * Play a short beep sound (for button feedback)
 * @param frequency - Frequency in Hz
 * @param duration - Duration in milliseconds
 * @param volume - Volume level (0-1)
 */
export function playBeep(
  frequency: number = 800,
  duration: number = 100,
  volume: number = 0.3
): void {
  try {
    const context = initializeAudioContext();

    // Resume audio context if suspended
    if (context.state === 'suspended') {
      context.resume();
    }

    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.frequency.value = frequency;
    osc.type = 'sine';

    gain.gain.setValueAtTime(volume, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration / 1000);

    osc.connect(gain);
    gain.connect(context.destination);

    osc.start(context.currentTime);
    osc.stop(context.currentTime + duration / 1000);
  } catch (error) {
    console.error('Error playing beep:', error);
  }
}

/**
 * Clean up audio resources
 */
export function cleanup(): void {
  stopWhistle();
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
}

/**
 * Check if audio is currently playing
 */
export function isAudioPlaying(): boolean {
  return isPlaying;
}
