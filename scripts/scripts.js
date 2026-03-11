import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    if (h1.closest('.hero') || h1.closest('.hero-agency') || picture.closest('.hero') || picture.closest('.hero-agency')) {
      return;
    }
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * Decorates the contact section with scrolling locations and people grid.
 * @param {Element} main The main element
 */
function decorateContactSection(main) {
  const sections = main.querySelectorAll('.section');
  sections.forEach((section) => {
    const h2 = section.querySelector(':scope > .default-content-wrapper > h2');
    const ul = section.querySelector(':scope > .default-content-wrapper > ul');
    if (!h2 || !ul) return;
    if (!h2.textContent.includes('Plug in')) return;

    section.classList.add('section-contact');

    // Find the default-content-wrapper and restructure
    const wrapper = section.querySelector('.default-content-wrapper');
    if (!wrapper) return;

    // Collect CTA elements (h2, p, link) and images and locations
    const ctaContainer = document.createElement('div');
    ctaContainer.classList.add('contact-cta');

    const imagesContainer = document.createElement('div');
    imagesContainer.classList.add('contact-people');

    const locationsContainer = document.createElement('div');
    locationsContainer.classList.add('contact-locations');

    // Move elements to appropriate containers
    const children = [...wrapper.children];
    let pastLink = false;

    children.forEach((child) => {
      if (child.tagName === 'UL') {
        locationsContainer.append(child);
        return;
      }
      if (child.tagName === 'P' && child.querySelector('img') && !child.querySelector('a')) {
        imagesContainer.append(child);
        pastLink = true;
        return;
      }
      if (!pastLink) {
        ctaContainer.append(child);
      }
    });

    wrapper.textContent = '';
    wrapper.append(ctaContainer);
    if (imagesContainer.children.length > 0) wrapper.append(imagesContainer);
    if (locationsContainer.children.length > 0) wrapper.append(locationsContainer);
  });
}

/**
 * Sets up IntersectionObserver for scroll-triggered animations.
 */
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('inview');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-fade, .animate-slide-from-left, .animate-slide-from-right, .animate-border-top').forEach((el) => {
    observer.observe(el);
  });

  // Auto-add fade animation to sections
  document.querySelectorAll('main > .section').forEach((section) => {
    if (!section.classList.contains('animate-fade')) {
      section.classList.add('animate-fade');
      observer.observe(section);
    }
  });
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // auto load `*/fragments/*` references
    const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')].filter((f) => !f.closest('.fragment'));
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(...frag.children);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }

    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates formatted links to style them as buttons.
 * @param {HTMLElement} main The main container element
 */
function decorateButtons(main) {
  main.querySelectorAll('p a[href]').forEach((a) => {
    a.title = a.title || a.textContent;
    const p = a.closest('p');
    const text = a.textContent.trim();

    // quick structural checks
    if (a.querySelector('img') || p.textContent.trim() !== text) return;

    // skip URL display links
    try {
      if (new URL(a.href).href === new URL(text, window.location).href) return;
    } catch { /* continue */ }

    // require authored formatting for buttonization
    const strong = a.closest('strong');
    const em = a.closest('em');
    if (!strong && !em) return;

    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong && em) { // high-impact call-to-action
      a.classList.add('accent');
      const outer = strong.contains(em) ? strong : em;
      outer.replaceWith(a);
    } else if (strong) {
      a.classList.add('primary');
      strong.replaceWith(a);
    } else {
      a.classList.add('secondary');
      em.replaceWith(a);
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateButtons(main);
  decorateContactSection(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    // Boost LCP image for faster discovery
    const lcpImg = main.querySelector('img');
    if (lcpImg) {
      lcpImg.fetchPriority = 'high';
    }
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  // Optimize image delivery for below-fold images
  main.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.decoding = 'async';
  });

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
  setupScrollAnimations();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
