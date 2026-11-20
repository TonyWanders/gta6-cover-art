// Vice Sunset Cover Lab drawing code.
// Draws one cover on a canvas from a state object. All art is original:
// gradient skies, a drawn sun, palm silhouettes and lettering in code.
// No Rockstar logo, official artwork or official font is used here.

export const GRADES = {
  sunset: { sky: ['#2b0a4a', '#ff2e88', '#ff7a3d', '#ffd23d'], tint: '255,94,122', panel: '#1a0b2e' },
  neon: { sky: ['#05051f', '#3b0a6e', '#00e5c7', '#ff2e88'], tint: '123,47,247', panel: '#0a0a2e' },
  gold: { sky: ['#2e1500', '#b3541e', '#ff9a3d', '#ffe08a'], tint: '255,154,61', panel: '#241204' },
  noir: { sky: ['#000000', '#3a3a3a', '#8a8a8a', '#ffffff'], tint: '120,120,120', panel: '#111111' },
};

function seeded(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function drawSunsetScene(ctx, x, y, w, h, grade) {
  const sky = GRADES[grade].sky;
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, sky[0]);
  g.addColorStop(0.45, sky[1]);
  g.addColorStop(0.75, sky[2]);
  g.addColorStop(1, sky[3]);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  const cx = x + w * 0.5;
  const cy = y + h * 0.62;
  const r = Math.min(w, h) * 0.22;
  ctx.fillStyle = 'rgba(255,240,200,0.95)';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(20,5,35,0.85)';
  ctx.fillRect(x, cy + r * 0.55, w, h - (cy + r * 0.55) + 2);
  ctx.strokeStyle = 'rgba(20,5,35,0.9)';
  ctx.lineWidth = Math.max(3, w * 0.008);
  for (let i = 0; i < 5; i++) {
    const px = x + w * (0.08 + i * 0.2);
    const py = y + h * 0.72;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px, py - h * 0.22);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px, py - h * 0.22);
    ctx.quadraticCurveTo(px - w * 0.06, py - h * 0.26, px - w * 0.09, py - h * 0.18);
    ctx.moveTo(px, py - h * 0.22);
    ctx.quadraticCurveTo(px + w * 0.06, py - h * 0.26, px + w * 0.09, py - h * 0.18);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  for (let i = 0; i < 24; i++) {
    ctx.fillRect(x + seeded(i) * w, y + seeded(i + 50) * h * 0.4, 2, 2);
  }
}

function coverDraw(ctx, img, x, y, w, h) {
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * s;
  const dh = img.naturalHeight * s;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function gradeOverlay(ctx, x, y, w, h, grade, amt) {
  if (amt <= 0) return;
  const a = (amt / 100) * 0.45;
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, 'rgba(' + GRADES[grade].tint + ',' + (a * 0.4) + ')');
  g.addColorStop(1, 'rgba(' + GRADES[grade].tint + ',' + a + ')');
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

function vignette(ctx, x, y, w, h, amt) {
  if (amt <= 0) return;
  const r = Math.max(w, h) * 0.75;
  const g = ctx.createRadialGradient(x + w / 2, y + h / 2, r * 0.35, x + w / 2, y + h / 2, r);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,' + (amt / 100) * 0.7 + ')');
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

function grain(ctx, x, y, w, h, amt, seedBase) {
  if (amt <= 0) return;
  const n = Math.floor(((w * h) / 9000) * (amt / 20));
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  for (let i = 0; i < n; i++) {
    ctx.fillRect(x + seeded(seedBase + i) * w, y + seeded(seedBase + i + 500) * h, 2, 2);
  }
}

function panel(ctx, canvas, x, y, w, h, img, state) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  if (img) coverDraw(ctx, img, x, y, w, h);
  else drawSunsetScene(ctx, x, y, w, h, state.grade);
  gradeOverlay(ctx, x, y, w, h, state.grade, state.gradeAmt);
  vignette(ctx, x, y, w, h, state.vignette);
  grain(ctx, x, y, w, h, state.grain, x + y);
  ctx.restore();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = Math.max(4, canvas.width * 0.006);
  ctx.strokeRect(x, y, w, h);
}

function outlineText(ctx, text, x, y, size, align) {
  ctx.font = '900 ' + size + 'px Arial, Helvetica, sans-serif';
  ctx.textAlign = align || 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = Math.max(4, size * 0.14);
  ctx.strokeStyle = '#000';
  ctx.strokeText(text, x, y);
  ctx.fillStyle = '#fff';
  ctx.fillText(text, x, y);
}

// state: { photos, selected, layout, grade, gradeAmt, vignette, grain,
//   title, subtitle, badge }
export function drawCover(canvas, state) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const photos = state.photos || [];
  const grade = GRADES[state.grade] ? state.grade : 'sunset';
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  const gap = Math.round(W * 0.012);
  if (state.layout === 'hero') {
    panel(ctx, canvas, 0, 0, W, H, photos[state.selected] || null, { ...state, grade });
  } else if (state.layout === 'duo') {
    const hw = (W - gap) / 2;
    panel(ctx, canvas, 0, 0, hw, H, photos[0] || null, { ...state, grade });
    panel(ctx, canvas, hw + gap, 0, hw, H, photos[1] || photos[0] || null, { ...state, grade });
  } else {
    const topH = H * 0.58;
    const botH = H - topH - gap;
    const bw = (W - gap) / 2;
    panel(ctx, canvas, 0, 0, W, topH, photos[0] || null, { ...state, grade });
    panel(ctx, canvas, 0, topH + gap, bw, botH, photos[1] || photos[0] || null, { ...state, grade });
    panel(ctx, canvas, bw + gap, topH + gap, bw, botH, photos[2] || photos[0] || null, { ...state, grade });
  }
  const title = (state.title || 'VICE CITY').toUpperCase();
  const titleSize = Math.round(W * (title.length > 12 ? 0.075 : 0.105));
  const ty = H - Math.round(H * 0.14);
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, ty - titleSize, W, titleSize * 2);
  outlineText(ctx, title, W / 2, ty, titleSize);
  if (state.subtitle) {
    outlineText(ctx, state.subtitle, W / 2, ty + titleSize * 0.85, Math.round(titleSize * 0.32));
  }
  if (state.badge) {
    const bs = Math.round(W * 0.055);
    ctx.fillStyle = '#ff2e88';
    ctx.beginPath();
    ctx.arc(W - bs, bs, bs * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.stroke();
    outlineText(ctx, state.badge, W - bs, bs, Math.round(bs * 0.8));
  }
}
