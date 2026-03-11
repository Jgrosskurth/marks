export default function decorate(block) {
  const rows = [...block.children];

  // Content may arrive as 2 rows (image + all text) or 3 rows (image + h1 + h2/p)
  const bgRow = rows[0];
  const headlineRow = rows[1];
  let introRow = rows[2];

  // Set up background image
  if (bgRow) {
    const pic = bgRow.querySelector('picture') || bgRow.querySelector('img');
    if (pic) {
      bgRow.classList.add('hero-agency-bg');
      bgRow.textContent = '';
      const p = document.createElement('p');
      p.append(pic);
      bgRow.append(p);
    }
  }

  // If all content is in one row (h1 + h2 + p), split into headline + intro
  if (headlineRow && !introRow) {
    const h1 = headlineRow.querySelector('h1');
    const h2 = headlineRow.querySelector('h2');
    if (h1 && h2) {
      // Create intro panel from h2 and everything after it
      introRow = document.createElement('div');
      const innerDiv = headlineRow.querySelector(':scope > div') || headlineRow;
      const children = [...innerDiv.children];
      let foundH2 = false;
      children.forEach((child) => {
        if (child === h2) foundH2 = true;
        if (foundH2) introRow.append(child);
      });
      block.insertBefore(introRow, headlineRow.nextSibling);
    }
  }

  // Set up headline overlay
  if (headlineRow) {
    headlineRow.classList.add('hero-agency-headline');
  }

  // Set up intro panel
  if (introRow) {
    introRow.classList.add('hero-agency-intro');
  }

  // Add decorative color squares at bottom
  const squares = document.createElement('div');
  squares.classList.add('hero-color-squares');
  const colors = ['sq-pink', 'sq-empty', 'sq-pink', 'sq-empty', 'sq-beige', 'sq-pink',
    'sq-empty', 'sq-empty', 'sq-pink'];
  colors.forEach((cls) => {
    const span = document.createElement('span');
    span.classList.add(cls);
    squares.append(span);
  });
  block.append(squares);

  // If no image found, mark as no-image
  if (!block.querySelector('picture') && !block.querySelector('img')) {
    block.classList.add('no-image');
  }
}
