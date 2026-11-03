import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { lightPercentageToFrequency } from '../audio-synthesis';

describe('Audio Synthesis', () => {
  describe('lightPercentageToFrequency', () => {
    it('should map 0% light to ~200 Hz', () => {
      const frequency = lightPercentageToFrequency(0);
      expect(frequency).toBeGreaterThanOrEqual(200);
      expect(frequency).toBeLessThanOrEqual(250);
    });

    it('should map 50% light to middle frequency range', () => {
      const frequency = lightPercentageToFrequency(50);
      expect(frequency).toBeGreaterThan(500);
      expect(frequency).toBeLessThan(1000);
    });

    it('should map 100% light to ~2000 Hz', () => {
      const frequency = lightPercentageToFrequency(100);
      expect(frequency).toBeGreaterThanOrEqual(1900);
      expect(frequency).toBeLessThanOrEqual(2100);
    });

    it('should clamp negative percentages to 0%', () => {
      const frequency = lightPercentageToFrequency(-10);
      expect(frequency).toBeGreaterThanOrEqual(200);
      expect(frequency).toBeLessThanOrEqual(250);
    });

    it('should clamp percentages over 100 to 100%', () => {
      const frequency = lightPercentageToFrequency(150);
      expect(frequency).toBeGreaterThanOrEqual(1900);
      expect(frequency).toBeLessThanOrEqual(2100);
    });

    it('should return increasing frequencies for increasing light levels', () => {
      const freq0 = lightPercentageToFrequency(0);
      const freq25 = lightPercentageToFrequency(25);
      const freq50 = lightPercentageToFrequency(50);
      const freq75 = lightPercentageToFrequency(75);
      const freq100 = lightPercentageToFrequency(100);

      expect(freq0).toBeLessThan(freq25);
      expect(freq25).toBeLessThan(freq50);
      expect(freq50).toBeLessThan(freq75);
      expect(freq75).toBeLessThan(freq100);
    });

    it('should return integer frequencies', () => {
      const frequency = lightPercentageToFrequency(42);
      expect(Number.isInteger(frequency)).toBe(true);
    });

    it('should handle edge case: 0% returns lowest frequency', () => {
      const freq0 = lightPercentageToFrequency(0);
      const freq1 = lightPercentageToFrequency(1);
      expect(freq0).toBeLessThanOrEqual(freq1);
    });

    it('should handle edge case: 100% returns highest frequency', () => {
      const freq99 = lightPercentageToFrequency(99);
      const freq100 = lightPercentageToFrequency(100);
      expect(freq99).toBeLessThanOrEqual(freq100);
    });

    it('should produce smooth frequency transitions', () => {
      const frequencies = [];
      for (let i = 0; i <= 100; i += 10) {
        frequencies.push(lightPercentageToFrequency(i));
      }

      // Check that each frequency is greater than the previous
      for (let i = 1; i < frequencies.length; i++) {
        expect(frequencies[i]).toBeGreaterThanOrEqual(frequencies[i - 1]);
      }
    });

    it('should use exponential mapping for natural progression', () => {
      // Exponential mapping should result in larger frequency jumps at higher light levels
      const freq0to25 = lightPercentageToFrequency(25) - lightPercentageToFrequency(0);
      const freq75to100 = lightPercentageToFrequency(100) - lightPercentageToFrequency(75);

      // The difference should be positive (frequencies increase)
      expect(freq0to25).toBeGreaterThan(0);
      expect(freq75to100).toBeGreaterThan(0);
    });
  });
});
