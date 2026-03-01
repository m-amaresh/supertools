export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface ColorResult {
  hex: string;
  rgb: RGB;
  hsl: HSL;
  error: string | null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToRgb(hex: string): RGB | null {
  const cleaned = hex.replace(/^#/, "");
  let r: number;
  let g: number;
  let b: number;

  if (cleaned.length === 3) {
    r = Number.parseInt(cleaned[0] + cleaned[0], 16);
    g = Number.parseInt(cleaned[1] + cleaned[1], 16);
    b = Number.parseInt(cleaned[2] + cleaned[2], 16);
  } else if (cleaned.length === 6) {
    r = Number.parseInt(cleaned.slice(0, 2), 16);
    g = Number.parseInt(cleaned.slice(2, 4), 16);
    b = Number.parseInt(cleaned.slice(4, 6), 16);
  } else {
    return null;
  }

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return { r, g, b };
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) {
      h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    } else if (max === gn) {
      h = ((bn - rn) / d + 2) / 6;
    } else {
      h = ((rn - gn) / d + 4) / 6;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  const sn = s / 100;
  const ln = l / 100;
  const hn = h / 360;

  if (sn === 0) {
    const v = Math.round(ln * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tn = t;
    if (tn < 0) tn += 1;
    if (tn > 1) tn -= 1;
    if (tn < 1 / 6) return p + (q - p) * 6 * tn;
    if (tn < 1 / 2) return q;
    if (tn < 2 / 3) return p + (q - p) * (2 / 3 - tn) * 6;
    return p;
  };

  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;

  return {
    r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  };
}

export function parseColor(input: string): ColorResult {
  const trimmed = input.trim();
  const errorResult: ColorResult = {
    hex: "",
    rgb: { r: 0, g: 0, b: 0 },
    hsl: { h: 0, s: 0, l: 0 },
    error: "Unrecognized color format",
  };

  if (!trimmed) {
    return { ...errorResult, error: null };
  }

  // Try HEX
  const hexMatch = trimmed.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (hexMatch) {
    const rgb = hexToRgb(hexMatch[1]);
    if (rgb) {
      return {
        hex: rgbToHex(rgb.r, rgb.g, rgb.b),
        rgb,
        hsl: rgbToHsl(rgb.r, rgb.g, rgb.b),
        error: null,
      };
    }
  }

  // Try rgb(r, g, b) or rgb(r g b)
  const rgbMatch = trimmed.match(
    /^rgba?\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*(?:[,/]\s*[\d.]+%?\s*)?\)$/,
  );
  if (rgbMatch) {
    const r = Number.parseInt(rgbMatch[1], 10);
    const g = Number.parseInt(rgbMatch[2], 10);
    const b = Number.parseInt(rgbMatch[3], 10);
    if (r <= 255 && g <= 255 && b <= 255) {
      return {
        hex: rgbToHex(r, g, b),
        rgb: { r, g, b },
        hsl: rgbToHsl(r, g, b),
        error: null,
      };
    }
  }

  // Try hsl(h, s%, l%)
  const hslMatch = trimmed.match(
    /^hsla?\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})%?\s*[,\s]\s*(\d{1,3})%?\s*(?:[,/]\s*[\d.]+%?\s*)?\)$/,
  );
  if (hslMatch) {
    const h = Number.parseInt(hslMatch[1], 10);
    const s = Number.parseInt(hslMatch[2], 10);
    const l = Number.parseInt(hslMatch[3], 10);
    if (h <= 360 && s <= 100 && l <= 100) {
      const rgb = hslToRgb(h, s, l);
      return {
        hex: rgbToHex(rgb.r, rgb.g, rgb.b),
        rgb,
        hsl: { h, s, l },
        error: null,
      };
    }
  }

  // Try bare r,g,b
  const bareRgb = trimmed.match(/^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/);
  if (bareRgb) {
    const r = Number.parseInt(bareRgb[1], 10);
    const g = Number.parseInt(bareRgb[2], 10);
    const b = Number.parseInt(bareRgb[3], 10);
    if (r <= 255 && g <= 255 && b <= 255) {
      return {
        hex: rgbToHex(r, g, b),
        rgb: { r, g, b },
        hsl: rgbToHsl(r, g, b),
        error: null,
      };
    }
  }

  return errorResult;
}

export function generatePalette(hex: string, count: number): string[] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors: string[] = [];
  const step = 360 / count;

  for (let i = 0; i < count; i++) {
    const h = (hsl.h + Math.round(step * i)) % 360;
    const newRgb = hslToRgb(h, hsl.s, hsl.l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return colors;
}
