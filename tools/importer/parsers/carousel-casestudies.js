/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-casestudies. Base: carousel. Source: https://makemarks.com/
 * Generated: 2026-03-11
 *
 * Source DOM structure (.section-work .items):
 *   .item (×13), each with:
 *     .headings > span.type-caption (brand name) + h3.project-heading (title)
 *     .type-body.text > p (description)
 *   First .item.showreel is the intro slide (has h2 instead of h3)
 *
 * Target block structure (carousel):
 *   2 columns per row (image | text content)
 *   Each row = one slide
 *   Col 1: Image (placeholder since videos are Mux streams)
 *   Col 2: Brand label + H3 title + description
 *
 * Note: Skips first .item.showreel since it's default content (section intro)
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.item');
  const cells = [];

  items.forEach((item) => {
    // Skip the showreel intro slide - it's handled as default content
    if (item.classList.contains('showreel')) return;

    // Col 1: Placeholder image (source uses Mux video backgrounds per slide)
    const col1 = document.createElement('div');
    const img = document.createElement('img');
    img.src = 'https://image.mux.com/P6UGAw00NPyaFLcUJYCn02jQF5A00Gn6z8a/thumbnail.jpg';
    img.alt = 'Case study slide';
    col1.append(img);

    // Col 2: Brand label + heading + description
    const col2 = document.createElement('div');

    // Brand name label
    const brandLabel = item.querySelector('.headings .type-caption, .headings span:first-child');
    if (brandLabel) {
      const p = document.createElement('p');
      p.textContent = brandLabel.textContent.trim();
      col2.append(p);
    }

    // H3 title
    const heading = item.querySelector('.headings h3, .headings .project-heading');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      col2.append(h3);
    }

    // Description
    const textDiv = item.querySelector('.type-body.text, .text');
    if (textDiv) {
      const desc = textDiv.querySelector('p');
      if (desc) {
        col2.append(desc);
      }
    }

    cells.push([col1, col2]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-casestudies', cells });
  element.replaceWith(block);
}
