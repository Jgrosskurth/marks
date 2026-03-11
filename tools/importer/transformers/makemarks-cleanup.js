/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: makemarks cleanup.
 * Selectors from captured DOM of https://makemarks.com/
 * Removes non-authorable content: logo SVG, decorative dividers, animated grid,
 * video backgrounds, cover placeholders, navigation SVGs, and data attributes.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove decorative/animated elements that block parsing
    // .cover-placeholders: empty placeholder divs for scroll animation
    // .cover-grid: 72-cell animated color grid overlay
    // .cover-background: video backgrounds with base64 posters
    // .divider-1 through .divider-4: decorative geometric dividers
    // svg.logo: fixed position SVG logo wordmark
    // .media-container within .section-work: video backgrounds per slide
    WebImporter.DOMUtils.remove(element, [
      'svg.logo',
      '.cover-placeholders',
      '.cover-grid',
      '.cover-background',
      '.divider-1',
      '.divider-2',
      '.divider-3',
      '.divider-4',
      '.section-work > .title',
      '.section-work > .media-container',
    ]);

    // Remove navigation buttons from carousel
    const navButtons = element.querySelectorAll('.section-work button');
    navButtons.forEach((btn) => btn.remove());
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable global elements
    // footer is handled as default content, not removed
    WebImporter.DOMUtils.remove(element, [
      'link',
      'noscript',
      'source',
    ]);

    // Clean data attributes from all elements
    element.querySelectorAll('*').forEach((el) => {
      const attrs = Array.from(el.attributes);
      attrs.forEach((attr) => {
        if (attr.name.startsWith('data-') || attr.name === 'style') {
          el.removeAttribute(attr.name);
        }
      });
    });
  }
}
