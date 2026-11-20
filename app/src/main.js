// Vice Sunset Cover Lab: wires the page. Upload 1 to 3 photos or use the
// built-in drawn sunset scene, pick a layout and grade, edit the words,
// then export the cover as a PNG. A ?shot= query sets up a fixed scene
// for a screenshot instead (see ./shots.js).
import { drawCover } from './cover.js';
import { runShot } from './shots.js';

const canvas = document.getElementById('cover');
const status = document.getElementById('status');
const thumbs = document.getElementById('thumbs');

const state = {
  photos: [],
  selected: 0,
  layout: 'grid',
  grade: 'sunset',
  gradeAmt: 70,
  vignette: 40,
  grain: 15,
  title: 'VICE CITY',
  subtitle: 'Welcome to Leonida',
  badge: 'VI',
};

function el(id) { return document.getElementById(id); }

function redraw() {
  state.title = el('title').value;
  state.subtitle = el('subtitle').value;
  state.badge = el('badge').value;
  state.layout = el('layout').value;
  state.grade = el('grade').value;
  state.gradeAmt = Number(el('gradeAmt').value);
  state.vignette = Number(el('vignette').value);
  state.grain = Number(el('grain').value);
  drawCover(canvas, state);
}

/** Loads an image from a URL, resolving to the image once it can be drawn. */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function refreshThumbs() {
  thumbs.innerHTML = '';
  state.photos.forEach((p, i) => {
    const im = document.createElement('img');
    im.src = p.src;
    im.alt = 'Photo ' + (i + 1);
    if (i === state.selected) im.className = 'sel';
    im.addEventListener('click', () => {
      state.selected = i;
      refreshThumbs();
      redraw();
    });
    thumbs.appendChild(im);
  });
  status.textContent = state.photos.length === 0
    ? 'No photo yet. The preview shows the built-in sample sunset scene. Upload a photo to replace it.'
    : state.photos.length + ' photo(s) loaded. Click a thumbnail to use it as the main photo.';
}

function loadFiles(files) {
  const list = Array.prototype.slice.call(files).slice(0, 3);
  list.forEach((f) => {
    const r = new FileReader();
    r.addEventListener('load', (e) => {
      const img = new Image();
      img.addEventListener('load', () => {
        state.photos.push(img);
        refreshThumbs();
        redraw();
      });
      img.src = e.target.result;
    });
    r.readAsDataURL(f);
  });
}

el('photo').addEventListener('change', (e) => {
  state.photos = [];
  state.selected = 0;
  loadFiles(e.target.files);
});
el('sampleBtn').addEventListener('click', () => {
  state.photos = [];
  state.selected = 0;
  refreshThumbs();
  redraw();
});
el('clearBtn').addEventListener('click', () => {
  state.photos = [];
  state.selected = 0;
  el('photo').value = '';
  refreshThumbs();
  redraw();
});
['title', 'subtitle', 'badge', 'layout', 'grade'].forEach((id) => {
  el(id).addEventListener('input', redraw);
  el(id).addEventListener('change', redraw);
});
[['gradeAmt', 'gradeAmtVal'], ['vignette', 'vignetteVal'], ['grain', 'grainVal']].forEach(([a, b]) => {
  el(a).addEventListener('input', () => {
    el(b).textContent = el(a).value;
    redraw();
  });
});
el('size').addEventListener('change', () => {
  const parts = el('size').value.split('x');
  canvas.width = parseInt(parts[0], 10);
  canvas.height = parseInt(parts[1], 10);
  redraw();
});
el('exportBtn').addEventListener('click', () => {
  redraw();
  const a = document.createElement('a');
  a.download = 'vice-sunset-cover-' + canvas.width + 'x' + canvas.height + '.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
  status.textContent = 'Saved ' + a.download;
});
el('samplePngBtn').addEventListener('click', () => {
  const keep = state.photos.slice();
  state.photos = [];
  state.selected = 0;
  redraw();
  const a = document.createElement('a');
  a.download = 'vice-sunset-cover-sample-' + canvas.width + 'x' + canvas.height + '.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
  state.photos = keep;
  redraw();
});

const shot = new URLSearchParams(location.search).get('shot');
if (shot) {
  runShot(shot, new URLSearchParams(location.search), async (sample, opts) => {
    const img = await loadImage(sample);
    state.photos = [img];
    state.selected = 0;
    el('title').value = opts.title;
    el('subtitle').value = opts.caption;
    el('layout').value = opts.layout;
    el('grade').value = opts.grade;
    refreshThumbs();
    redraw();
  });
} else {
  refreshThumbs();
  redraw();
}
