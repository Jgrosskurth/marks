/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - Import all parsers needed for the agency-homepage template
import heroAgencyParser from './parsers/hero-agency.js';
import cardsPillarsParser from './parsers/cards-pillars.js';
import columnsAboutParser from './parsers/columns-about.js';
import carouselCasestudiesParser from './parsers/carousel-casestudies.js';

// TRANSFORMER IMPORTS - Import makemarks-specific transformers
import makemarksCleanupTransformer from './transformers/makemarks-cleanup.js';
import makemarksSectionsTransformer from './transformers/makemarks-sections.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero-agency': heroAgencyParser,
  'cards-pillars': cardsPillarsParser,
  'columns-about': columnsAboutParser,
  'carousel-casestudies': carouselCasestudiesParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'agency-homepage',
  description: 'Single-page agency website with animated scrolling sections, portfolio showcase, and contact information',
  urls: [
    'https://makemarks.com/',
  ],
  blocks: [
    {
      name: 'hero-agency',
      instances: ['.cover'],
    },
    {
      name: 'cards-pillars',
      instances: ['.cover-pillars'],
    },
    {
      name: 'columns-about',
      instances: ['.section-about'],
    },
    {
      name: 'carousel-casestudies',
      instances: ['.section-work .items'],
    },
  ],
  sections: [
    {
      id: 'hero-cover',
      name: 'Hero / Cover Section',
      selector: '.cover',
      style: 'dark',
      blocks: ['hero-agency', 'cards-pillars'],
      defaultContent: [],
    },
    {
      id: 'about',
      name: 'About / Platform Description',
      selector: '.section-about',
      style: null,
      blocks: ['columns-about'],
      defaultContent: [],
    },
    {
      id: 'work',
      name: 'Work / Case Studies',
      selector: '.section-work',
      style: null,
      blocks: ['carousel-casestudies'],
      defaultContent: ['.section-work .item.showreel'],
    },
    {
      id: 'contact',
      name: 'Contact / CTA Section',
      selector: '.section-contact',
      style: null,
      blocks: [],
      defaultContent: ['.section-contact .content-container', '.section-contact ul'],
    },
    {
      id: 'footer',
      name: 'Footer',
      selector: 'footer',
      style: null,
      blocks: [],
      defaultContent: ['footer'],
    },
  ],
};

// TRANSFORMER REGISTRY - Array of transformer functions
// Cleanup runs first, then sections (which needs afterTransform to add <hr> and section-metadata)
const transformers = [
  makemarksCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [makemarksSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn(hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
