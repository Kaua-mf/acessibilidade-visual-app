import { describe, it, expect } from 'vitest';
import {
  detectColorFromImageData,
  getAvailableColors,
  hexToRgb,
  rgbToHex,
} from '../color-detection';

describe('Color Detection', () => {
  describe('hexToRgb', () => {
    it('should convert hex #FF0000 to RGB(255, 0, 0)', () => {
      const result = hexToRgb('#FF0000');
      expect(result).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should convert hex #00FF00 to RGB(0, 255, 0)', () => {
      const result = hexToRgb('#00FF00');
      expect(result).toEqual({ r: 0, g: 255, b: 0 });
    });

    it('should convert hex #0000FF to RGB(0, 0, 255)', () => {
      const result = hexToRgb('#0000FF');
      expect(result).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('should convert hex #FFFFFF to RGB(255, 255, 255)', () => {
      const result = hexToRgb('#FFFFFF');
      expect(result).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('should convert hex #000000 to RGB(0, 0, 0)', () => {
      const result = hexToRgb('#000000');
      expect(result).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('should handle hex without # prefix', () => {
      const result = hexToRgb('FF0000');
      expect(result).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should return null for invalid hex', () => {
      const result = hexToRgb('INVALID');
      expect(result).toBeNull();
    });
  });

  describe('rgbToHex', () => {
    it('should convert RGB(255, 0, 0) to #FF0000', () => {
      const result = rgbToHex(255, 0, 0);
      expect(result).toBe('#FF0000');
    });

    it('should convert RGB(0, 255, 0) to #00FF00', () => {
      const result = rgbToHex(0, 255, 0);
      expect(result).toBe('#00FF00');
    });

    it('should convert RGB(0, 0, 255) to #0000FF', () => {
      const result = rgbToHex(0, 0, 255);
      expect(result).toBe('#0000FF');
    });

    it('should convert RGB(255, 255, 255) to #FFFFFF', () => {
      const result = rgbToHex(255, 255, 255);
      expect(result).toBe('#FFFFFF');
    });

    it('should convert RGB(0, 0, 0) to #000000', () => {
      const result = rgbToHex(0, 0, 0);
      expect(result).toBe('#000000');
    });

    it('should handle values with leading zeros', () => {
      const result = rgbToHex(15, 15, 15);
      expect(result).toBe('#0F0F0F');
    });
  });

  describe('getAvailableColors', () => {
    it('should return an array of color names', () => {
      const colors = getAvailableColors();
      expect(Array.isArray(colors)).toBe(true);
      expect(colors.length).toBeGreaterThan(0);
    });

    it('should include common colors', () => {
      const colors = getAvailableColors();
      expect(colors).toContain('Vermelho');
      expect(colors).toContain('Verde');
      expect(colors).toContain('Azul');
      expect(colors).toContain('Amarelo');
      expect(colors).toContain('Branco');
      expect(colors).toContain('Preto');
    });

    it('should not have duplicate color names', () => {
      const colors = getAvailableColors();
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(colors.length);
    });
  });

  describe('detectColorFromImageData', () => {
    it('should detect red color', () => {
      // Create a simple red image (100x100 pixels)
      const imageData = new Uint8ClampedArray(100 * 100 * 4);
      for (let i = 0; i < imageData.length; i += 4) {
        imageData[i] = 255; // R
        imageData[i + 1] = 0; // G
        imageData[i + 2] = 0; // B
        imageData[i + 3] = 255; // A
      }

      const result = detectColorFromImageData(imageData, 100, 100);
      expect(result.name).toBe('Vermelho');
      expect(result.confidence).toBeGreaterThan(80);
    });

    it('should detect green color', () => {
      // Create a simple green image
      const imageData = new Uint8ClampedArray(100 * 100 * 4);
      for (let i = 0; i < imageData.length; i += 4) {
        imageData[i] = 0; // R
        imageData[i + 1] = 255; // G
        imageData[i + 2] = 0; // B
        imageData[i + 3] = 255; // A
      }

      const result = detectColorFromImageData(imageData, 100, 100);
      expect(result.name).toContain('Verde');
      expect(result.confidence).toBeGreaterThan(70);
    });

    it('should detect blue color', () => {
      // Create a simple blue image
      const imageData = new Uint8ClampedArray(100 * 100 * 4);
      for (let i = 0; i < imageData.length; i += 4) {
        imageData[i] = 0; // R
        imageData[i + 1] = 0; // G
        imageData[i + 2] = 255; // B
        imageData[i + 3] = 255; // A
      }

      const result = detectColorFromImageData(imageData, 100, 100);
      expect(result.name).toContain('Azul');
      expect(result.confidence).toBeGreaterThan(70);
    });

    it('should return color data with all required fields', () => {
      const imageData = new Uint8ClampedArray(100 * 100 * 4);
      for (let i = 0; i < imageData.length; i += 4) {
        imageData[i] = 255;
        imageData[i + 1] = 255;
        imageData[i + 2] = 0;
        imageData[i + 3] = 255;
      }

      const result = detectColorFromImageData(imageData, 100, 100);
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('hex');
      expect(result).toHaveProperty('rgb');
      expect(result).toHaveProperty('hsl');
      expect(result).toHaveProperty('confidence');
    });

    it('should have confidence between 0 and 100', () => {
      const imageData = new Uint8ClampedArray(100 * 100 * 4);
      for (let i = 0; i < imageData.length; i += 4) {
        imageData[i] = 128;
        imageData[i + 1] = 128;
        imageData[i + 2] = 128;
        imageData[i + 3] = 255;
      }

      const result = detectColorFromImageData(imageData, 100, 100);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });

    it('should accept custom center coordinates', () => {
      // Create a 100x100 red image
      const imageData = new Uint8ClampedArray(100 * 100 * 4);
      for (let i = 0; i < imageData.length; i += 4) {
        imageData[i] = 255; // R
        imageData[i + 1] = 0; // G
        imageData[i + 2] = 0; // B
        imageData[i + 3] = 255; // A
      }

      // Test with custom center coordinates
      const result = detectColorFromImageData(imageData, 100, 100, 50, 50);
      expect(result.name).toBe('Vermelho');
      expect(result.confidence).toBeGreaterThan(80);
    });

    it('should return hex color in correct format', () => {
      const imageData = new Uint8ClampedArray(100 * 100 * 4);
      for (let i = 0; i < imageData.length; i += 4) {
        imageData[i] = 255;
        imageData[i + 1] = 0;
        imageData[i + 2] = 0;
        imageData[i + 3] = 255;
      }

      const result = detectColorFromImageData(imageData, 100, 100);
      expect(result.hex).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('should return RGB values in valid range', () => {
      const imageData = new Uint8ClampedArray(100 * 100 * 4);
      for (let i = 0; i < imageData.length; i += 4) {
        imageData[i] = 200;
        imageData[i + 1] = 100;
        imageData[i + 2] = 50;
        imageData[i + 3] = 255;
      }

      const result = detectColorFromImageData(imageData, 100, 100);
      expect(result.rgb.r).toBeGreaterThanOrEqual(0);
      expect(result.rgb.r).toBeLessThanOrEqual(255);
      expect(result.rgb.g).toBeGreaterThanOrEqual(0);
      expect(result.rgb.g).toBeLessThanOrEqual(255);
      expect(result.rgb.b).toBeGreaterThanOrEqual(0);
      expect(result.rgb.b).toBeLessThanOrEqual(255);
    });

    it('should detect yellow color', () => {
      const imageData = new Uint8ClampedArray(100 * 100 * 4);
      for (let i = 0; i < imageData.length; i += 4) {
        imageData[i] = 255;
        imageData[i + 1] = 255;
        imageData[i + 2] = 0;
        imageData[i + 3] = 255;
      }

      const result = detectColorFromImageData(imageData, 100, 100);
      expect(result.name).toContain('Amarelo');
      expect(result.confidence).toBeGreaterThan(70);
    });

    it('should detect white color', () => {
      const imageData = new Uint8ClampedArray(100 * 100 * 4);
      for (let i = 0; i < imageData.length; i += 4) {
        imageData[i] = 255;
        imageData[i + 1] = 255;
        imageData[i + 2] = 255;
        imageData[i + 3] = 255;
      }

      const result = detectColorFromImageData(imageData, 100, 100);
      expect(result.name).toBe('Branco');
      expect(result.confidence).toBeGreaterThan(80);
    });

    it('should detect black color', () => {
      const imageData = new Uint8ClampedArray(100 * 100 * 4);
      for (let i = 0; i < imageData.length; i += 4) {
        imageData[i] = 0;
        imageData[i + 1] = 0;
        imageData[i + 2] = 0;
        imageData[i + 3] = 255;
      }

      const result = detectColorFromImageData(imageData, 100, 100);
      expect(result.name).toBe('Preto');
      expect(result.confidence).toBeGreaterThan(80);
    });
  });
});
