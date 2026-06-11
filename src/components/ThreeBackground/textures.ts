import * as THREE from 'three';

/** Soft radial glow texture for sprites (generated, no asset files). */
export function makeGlowTexture(size = 128): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,238,214,0.55)');
  g.addColorStop(1, 'rgba(255,238,214,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

/**
 * Text label rendered to a canvas sprite — uses the already-loaded
 * JetBrains Mono webfont, so no extra network requests.
 */
export function makeLabelSprite(text: string, color = '#EAE6DC'): THREE.Sprite {
  const pad = 26;
  const fontSize = 46;
  const font = `500 ${fontSize}px "JetBrains Mono", monospace`;

  const canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Sprite();
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(text).width) + pad * 2;
  const h = fontSize + pad * 2;
  canvas.width = w;
  canvas.height = h; // resizing resets context state
  ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Sprite();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(212,169,106,0.9)';
  ctx.shadowBlur = 14;
  ctx.fillText(text, pad, h / 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  const scale = 0.012;
  sprite.scale.set(w * scale, h * scale, 1);
  return sprite;
}
