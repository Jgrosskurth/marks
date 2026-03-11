/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-agency. Base: hero. Source: https://makemarks.com/
 * Generated: 2026-03-11
 *
 * Source DOM structure (.cover):
 *   .inner > .cover-intros > .intro (×3) with h2, span.type-body, button
 *   .cover-pillars > .pillar (×5) with .hotspot (span.index + span.label) and .overlay .content (h3, p)
 *
 * Target block structure (hero):
 *   Row 1: Background image (video poster)
 *   Row 2: H1 heading + subheading + body text
 */
export default function parse(element, { document }) {
  // Extract heading from intro panels
  // Source: .cover-intros .intro h2 (first intro has the main heading)
  const intros = element.querySelectorAll('.cover-intros .intro');
  let heading = null;
  let subheading = null;
  let bodyText = null;

  if (intros.length > 0) {
    // First intro: "Welcome to the post-agency era" with body text
    heading = intros[0].querySelector('h2');
    bodyText = intros[0].querySelector('.type-body, p');
  }

  if (intros.length > 1) {
    // Second intro provides additional context
    subheading = intros[1].querySelector('h2');
  }

  // Build background image row from video poster
  // Source: .inner link[rel="preload"][as="image"]
  const preloadLink = element.querySelector('link[rel="preload"][as="image"]');
  const posterUrl = preloadLink ? preloadLink.getAttribute('href') : 'https://image.mux.com/P6UGAw00NPyaFLcUJYCn02jQF5A00Gn6z8a/thumbnail.jpg';

  const img = document.createElement('img');
  img.src = posterUrl;
  img.alt = 'Hero background';

  const cells = [];

  // Row 1: Background image
  cells.push([img]);

  // Row 2: Content in a single cell (heading + subheading + body text)
  const contentWrapper = document.createElement('div');

  // Create H1 from the page title since source uses SVG paths for headline
  const h1 = document.createElement('h1');
  h1.textContent = 'The Brand Creation Platform';
  contentWrapper.append(h1);

  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    contentWrapper.append(h2);
  }

  if (bodyText) {
    contentWrapper.append(bodyText);
  }

  cells.push([contentWrapper]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-agency', cells });
  element.replaceWith(block);
}
