// Fixed scenes for screenshots: ?shot=editor shows the page with a sample
// photo loaded; ?shot=cover shows the cover alone. Query keys: photo picks
// samples/<photo>.jpg, caption sets the subtitle, title sets the title,
// layout and grade pick those settings. window.__shotReady is set once painted.
export async function runShot(shot, query, apply) {
  if (shot === 'cover') document.body.classList.add('shot-cover');
  const photo = query.get('photo') || 'pier';
  const title = query.get('title') || 'VICE CITY';
  const caption = query.get('caption') || 'Welcome to Leonida';
  const layout = query.get('layout') || 'grid';
  const grade = query.get('grade') || 'sunset';
  await apply('samples/' + photo + '.jpg', { title, caption, layout, grade });
  requestAnimationFrame(() => requestAnimationFrame(() => { window.__shotReady = true; }));
}
