/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-pillars. Base: cards. Source: https://makemarks.com/
 * Generated: 2026-03-11
 *
 * Source DOM structure (.cover-pillars):
 *   .pillar (×5), each with:
 *     .hotspot > span.index ("01") + span.label ("Creation")
 *     .overlay .content > span (name) + h3 (heading) + p (description)
 *
 * Target block structure (cards, no images variant):
 *   1 column, each row = one card with heading + description
 *   Row per pillar: Number + Name label, H3 heading, description paragraph
 */
export default function parse(element, { document }) {
  const pillars = element.querySelectorAll('.pillar');
  const cells = [];

  pillars.forEach((pillar) => {
    // Extract number and name from hotspot
    const index = pillar.querySelector('.hotspot .index');
    const label = pillar.querySelector('.hotspot .label');

    // Extract heading and description from overlay content
    const overlayContent = pillar.querySelector('.overlay .content');
    const heading = overlayContent ? overlayContent.querySelector('h3') : null;
    const description = overlayContent ? overlayContent.querySelector('p') : null;

    // Build single cell with all content
    const cellWrapper = document.createElement('div');

    // Label: "01 Creation"
    if (index || label) {
      const labelEl = document.createElement('p');
      const strong = document.createElement('strong');
      const parts = [];
      if (index) parts.push(index.textContent.trim());
      if (label) parts.push(label.textContent.trim());
      strong.textContent = parts.join(' ');
      labelEl.append(strong);
      cellWrapper.append(labelEl);
    }

    // H3 heading
    if (heading) {
      cellWrapper.append(heading);
    }

    // Description paragraph
    if (description) {
      cellWrapper.append(description);
    }

    cells.push([cellWrapper]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-pillars', cells });
  element.replaceWith(block);
}
