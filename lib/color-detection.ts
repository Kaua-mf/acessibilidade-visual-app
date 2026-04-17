/**
 * Color Detection Utility
 * Analyzes image data to detect and identify colors
 */

interface ColorData {
  name: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  confidence: number;
}

interface PixelData {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Comprehensive color database with common colors
 */
const COLOR_DATABASE: Array<{
  name: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
}> = [
  // Reds
  { name: 'Vermelho', hex: '#FF0000', rgb: { r: 255, g: 0, b: 0 } },
  { name: 'Vermelho Escuro', hex: '#8B0000', rgb: { r: 139, g: 0, b: 0 } },
  { name: 'Vermelho Claro', hex: '#FF6B6B', rgb: { r: 255, g: 107, b: 107 } },
  { name: 'Crimson', hex: '#DC143C', rgb: { r: 220, g: 20, b: 60 } },
  { name: 'Rosa', hex: '#FFC0CB', rgb: { r: 255, g: 192, b: 203 } },
  { name: 'Rosa Quente', hex: '#FF69B4', rgb: { r: 255, g: 105, b: 180 } },

  // Oranges
  { name: 'Laranja', hex: '#FFA500', rgb: { r: 255, g: 165, b: 0 } },
  { name: 'Laranja Escuro', hex: '#FF8C00', rgb: { r: 255, g: 140, b: 0 } },
  { name: 'Laranja Claro', hex: '#FFB347', rgb: { r: 255, g: 179, b: 71 } },
  { name: 'Pêssego', hex: '#FFDAB9', rgb: { r: 255, g: 218, b: 185 } },

  // Yellows
  { name: 'Amarelo', hex: '#FFFF00', rgb: { r: 255, g: 255, b: 0 } },
  { name: 'Amarelo Escuro', hex: '#DAA520', rgb: { r: 218, g: 165, b: 20 } },
  { name: 'Amarelo Claro', hex: '#FFFFE0', rgb: { r: 255, g: 255, b: 224 } },
  { name: 'Ouro', hex: '#FFD700', rgb: { r: 255, g: 215, b: 0 } },

  // Greens
  { name: 'Verde', hex: '#008000', rgb: { r: 0, g: 128, b: 0 } },
  { name: 'Verde Claro', hex: '#90EE90', rgb: { r: 144, g: 238, b: 144 } },
  { name: 'Verde Escuro', hex: '#006400', rgb: { r: 0, g: 100, b: 0 } },
  { name: 'Verde Limão', hex: '#32CD32', rgb: { r: 50, g: 205, b: 50 } },
  { name: 'Menta', hex: '#98FF98', rgb: { r: 152, g: 255, b: 152 } },
  { name: 'Turquesa', hex: '#40E0D0', rgb: { r: 64, g: 224, b: 208 } },

  // Cyans
  { name: 'Ciano', hex: '#00FFFF', rgb: { r: 0, g: 255, b: 255 } },
  { name: 'Ciano Escuro', hex: '#008B8B', rgb: { r: 0, g: 139, b: 139 } },
  { name: 'Azul Claro', hex: '#ADD8E6', rgb: { r: 173, g: 216, b: 230 } },

  // Blues
  { name: 'Azul', hex: '#0000FF', rgb: { r: 0, g: 0, b: 255 } },
  { name: 'Azul Escuro', hex: '#00008B', rgb: { r: 0, g: 0, b: 139 } },
  { name: 'Azul Marinho', hex: '#000080', rgb: { r: 0, g: 0, b: 128 } },
  { name: 'Azul Real', hex: '#4169E1', rgb: { r: 65, g: 105, b: 225 } },
  { name: 'Azul Céu', hex: '#87CEEB', rgb: { r: 135, g: 206, b: 235 } },

  // Purples
  { name: 'Roxo', hex: '#800080', rgb: { r: 128, g: 0, b: 128 } },
  { name: 'Roxo Claro', hex: '#DDA0DD', rgb: { r: 221, g: 160, b: 221 } },
  { name: 'Violeta', hex: '#EE82EE', rgb: { r: 238, g: 130, b: 238 } },
  { name: 'Magenta', hex: '#FF00FF', rgb: { r: 255, g: 0, b: 255 } },
  { name: 'Índigo', hex: '#4B0082', rgb: { r: 75, g: 0, b: 130 } },

  // Browns
  { name: 'Marrom', hex: '#A52A2A', rgb: { r: 165, g: 42, b: 42 } },
  { name: 'Marrom Claro', hex: '#D2B48C', rgb: { r: 210, g: 180, b: 140 } },
  { name: 'Marrom Escuro', hex: '#654321', rgb: { r: 101, g: 67, b: 33 } },
  { name: 'Chocolate', hex: '#D2691E', rgb: { r: 210, g: 105, b: 30 } },

  // Grays
  { name: 'Cinza', hex: '#808080', rgb: { r: 128, g: 128, b: 128 } },
  { name: 'Cinza Claro', hex: '#D3D3D3', rgb: { r: 211, g: 211, b: 211 } },
  { name: 'Cinza Escuro', hex: '#A9A9A9', rgb: { r: 169, g: 169, b: 169 } },
  { name: 'Preto', hex: '#000000', rgb: { r: 0, g: 0, b: 0 } },
  { name: 'Branco', hex: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 } },
];

/**
 * Convert RGB to HSL (Hue, Saturation, Lightness)
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Calculate Euclidean distance between two RGB colors
 */
function colorDistance(
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number }
): number {
  const dr = color1.r - color2.r;
  const dg = color1.g - color2.g;
  const db = color1.b - color2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Find the closest color name from the database
 */
function findClosestColor(
  rgb: { r: number; g: number; b: number }
): { name: string; hex: string; distance: number } {
  let closest = COLOR_DATABASE[0];
  let minDistance = colorDistance(rgb, closest.rgb);

  for (let i = 1; i < COLOR_DATABASE.length; i++) {
    const distance = colorDistance(rgb, COLOR_DATABASE[i].rgb);
    if (distance < minDistance) {
      minDistance = distance;
      closest = COLOR_DATABASE[i];
    }
  }

  // Maximum distance is sqrt(3 * 255^2) ≈ 441
  // Convert to confidence (0-100)
  const confidence = Math.max(0, 100 - (minDistance / 441) * 100);

  return {
    name: closest.name,
    hex: closest.hex,
    distance: minDistance,
  };
}

/**
 * Extract pixel data from image data array
 * Assumes RGBA format
 */
function getPixelAt(
  imageData: Uint8ClampedArray,
  x: number,
  y: number,
  width: number
): PixelData {
  const index = (y * width + x) * 4;
  return {
    r: imageData[index],
    g: imageData[index + 1],
    b: imageData[index + 2],
    a: imageData[index + 3],
  };
}

/**
 * Average pixels in a region (for more stable color detection)
 */
function averagePixelsInRegion(
  imageData: Uint8ClampedArray,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  regionSize: number = 20
): PixelData {
  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let count = 0;

  const startX = Math.max(0, centerX - regionSize);
  const endX = Math.min(width, centerX + regionSize);
  const startY = Math.max(0, centerY - regionSize);
  const endY = Math.min(height, centerY + regionSize);

  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const pixel = getPixelAt(imageData, x, y, width);
      // Only include pixels with reasonable alpha
      if (pixel.a > 128) {
        totalR += pixel.r;
        totalG += pixel.g;
        totalB += pixel.b;
        count++;
      }
    }
  }

  if (count === 0) {
    return { r: 128, g: 128, b: 128, a: 255 };
  }

  return {
    r: Math.round(totalR / count),
    g: Math.round(totalG / count),
    b: Math.round(totalB / count),
    a: 255,
  };
}

/**
 * Detect color from image data
 * @param imageData - Raw image data (RGBA format)
 * @param width - Image width
 * @param height - Image height
 * @param centerX - X coordinate of center point (default: center of image)
 * @param centerY - Y coordinate of center point (default: center of image)
 * @returns Color data with name, hex, RGB, HSL, and confidence
 */
export function detectColorFromImageData(
  imageData: Uint8ClampedArray,
  width: number,
  height: number,
  centerX?: number,
  centerY?: number
): ColorData {
  // Use image center if coordinates not provided
  const x = centerX ?? Math.floor(width / 2);
  const y = centerY ?? Math.floor(height / 2);

  // Average pixels in a region for more stable detection
  const avgPixel = averagePixelsInRegion(imageData, x, y, width, height, 15);

  // Find closest color name
  const closest = findClosestColor(avgPixel);

  // Convert to HSL
  const hsl = rgbToHsl(avgPixel.r, avgPixel.g, avgPixel.b);

  // Calculate confidence (0-100)
  const confidence = Math.max(0, 100 - (closest.distance / 441) * 100);

  return {
    name: closest.name,
    hex: closest.hex,
    rgb: {
      r: avgPixel.r,
      g: avgPixel.g,
      b: avgPixel.b,
    },
    hsl,
    confidence: Math.round(confidence),
  };
}

/**
 * Get all available color names
 */
export function getAvailableColors(): string[] {
  return COLOR_DATABASE.map((color) => color.name);
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
      .toUpperCase()
  );
}
