/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-about. Base: columns. Source: https://makemarks.com/
 * Generated: 2026-03-11
 *
 * Source DOM structure (.section-about):
 *   .content-container > .content > h2 + .text.type-body > p(strong) + p
 *   .media-container > video[poster] + svg.letter
 *
 * Target block structure (columns):
 *   2 columns per row
 *   Col 1: H2 heading + bold lead text + body paragraph
 *   Col 2: Image (video poster thumbnail)
 */
export default function parse(element, { document }) {
  // Col 1: Text content
  // Source: .content-container .content
  const contentDiv = element.querySelector('.content-container .content');
  const col1 = document.createElement('div');

  if (contentDiv) {
    const heading = contentDiv.querySelector('h2');
    if (heading) {
      col1.append(heading);
    }

    // Bold lead text and body paragraph from .text.type-body
    const textDiv = contentDiv.querySelector('.text.type-body, .type-body');
    if (textDiv) {
      const paragraphs = textDiv.querySelectorAll('p');
      paragraphs.forEach((p) => col1.append(p));
    }
  }

  // Col 2: Video poster image
  // Source: .media-container video[poster]
  const video = element.querySelector('.media-container video[poster]');
  const col2 = document.createElement('div');

  if (video) {
    const posterUrl = video.getAttribute('poster');
    const img = document.createElement('img');
    img.src = posterUrl;
    img.alt = 'About section media';
    col2.append(img);
  }

  const cells = [];
  cells.push([col1, col2]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-about', cells });
  element.replaceWith(block);
}
