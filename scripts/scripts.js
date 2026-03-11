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

    // Force button styling on the CTA link (mailto or any link in contact)
    const ctaLink = ctaContainer.querySelector('a[href]');
    if (ctaLink) {
      const p = ctaLink.closest('p');
      if (p) p.className = 'button-wrapper';
      ctaLink.className = 'button primary';
    }

    wrapper.textContent = '';
    wrapper.append(ctaContainer);
    if (imagesContainer.children.length > 0) wrapper.append(imagesContainer);
    if (locationsContainer.children.length > 0) wrapper.append(locationsContainer);
  });
}

/**
 * Decorates the last section of main as the page footer (links + copyright).
 * @param {Element} main The main element
 */
function decoratePageFooter(main) {
  // Find the footer section by content (UL with links + P with MARKS copyright)
  const sections = [...main.querySelectorAll(':scope > .section')];
  const footerSection = sections.find((section) => {
    const ul = section.querySelector(':scope > .default-content-wrapper > ul');
    const p = section.querySelector(':scope > .default-content-wrapper > p');
    return ul && p && p.textContent.includes('MARKS');
  });
  if (!footerSection) return;

  footerSection.classList.add('section-page-footer');

  const ul = footerSection.querySelector('.default-content-wrapper > ul');
  if (ul) {
    ul.setAttribute('role', 'list');
    ul.querySelectorAll('a').forEach((a) => {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noreferrer noopener');
    });
  }

  // Remove trailing empty sections
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    if (sections[i] === footerSection) break;
    if (!sections[i].textContent.trim()) sections[i].remove();
  }
}

/**
 * Decorates the work section with a title and intro panel above the carousel.
 * @param {Element} main The main element
 */
function decorateWorkSection(main) {
  const sections = main.querySelectorAll('.section');
  sections.forEach((section) => {
    const carousel = section.querySelector('.carousel-casestudies');
    if (!carousel) return;

    section.classList.add('section-work');

    // Create work media video (left side on desktop)
    const WORK_MUX_ID = 'NkzVLB4dIcQliGucdvd00ZJLQw00xExfZ00';
    const mediaContainer = document.createElement('div');
    mediaContainer.classList.add('work-media');
    const workVideo = document.createElement('video');
    workVideo.autoplay = true;
    workVideo.muted = true;
    workVideo.loop = true;
    workVideo.playsInline = true;
    workVideo.setAttribute('preload', 'auto');
    workVideo.poster = `https://image.mux.com/${WORK_MUX_ID}/thumbnail.jpg`;
    workVideo.src = `https://stream.mux.com/${WORK_MUX_ID}/high.mp4`;
    mediaContainer.append(workVideo);

    const title = document.createElement('div');
    title.classList.add('work-title', 'animate-fade');
    title.innerHTML = '<h2>Work</h2>';

    // Inject intro as the first slide of the carousel
    const slidesWrapper = carousel.querySelector('.carousel-casestudies-slides');
    if (slidesWrapper) {
      const introSlide = document.createElement('li');
      introSlide.classList.add('carousel-casestudies-slide');
      introSlide.innerHTML = '<div class="carousel-casestudies-slide-content">'
        + '<p>Impact</p>'
        + '<h3>Experience the first platform in\u00a0action</h3>'
        + '<p>We don\u2019t just promise a bold new brand world. We prove it. From bold, '
        + 'disruptive rebranding to groundbreaking brand activations, the work we do for '
        + 'clients every day all around the globe doesn\u2019t just show up or stand out '
        + '\u2014 it makes a\u00a0mark.</p>'
        + '</div>';
      slidesWrapper.prepend(introSlide);

      // Re-index all slides and reset to show intro (slide 0)
      const allSlides = slidesWrapper.querySelectorAll('.carousel-casestudies-slide');
      allSlides.forEach((slide, idx) => {
        slide.dataset.slideIndex = idx;
        slide.setAttribute('aria-hidden', idx !== 0);
      });
      carousel.dataset.activeSlide = 0;
    }

    const wrapper = section.querySelector('.carousel-casestudies-wrapper');
    if (wrapper) {
      section.insertBefore(mediaContainer, wrapper);
      section.insertBefore(title, wrapper);
    }
  });
}

/**
 * Creates decorative color square dividers between major sections.
 * @param {Element} main The main element
 */
function buildSectionDividers(main) {
  const sections = [...main.querySelectorAll(':scope > .section')];

  function createDivider(type, count) {
    const div = document.createElement('div');
    div.classList.add('section-divider', `divider-${type}`);
    for (let i = 1; i <= count; i += 1) {
      const cell = document.createElement('div');
      cell.classList.add('divider-cell', `cell-${i}`);
      div.append(cell);
    }
    return div;
  }

  const aboutSection = sections.find((s) => s.querySelector('.columns-about'));
  const workSection = sections.find((s) => s.querySelector('.carousel-casestudies'));

  if (aboutSection) {
    aboutSection.after(createDivider('teal', 5));
  }

  if (workSection) {
    workSection.after(createDivider('yellow', 7));
  }
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

  // Add border-top animation to headings with top borders
  document.querySelectorAll('.columns-about h2, .section-contact .contact-cta h2').forEach((el) => {
    el.classList.add('animate-border-top');
  });

  document.querySelectorAll('.animate-fade, .animate-slide-from-left, .animate-slide-from-right, .animate-border-top').forEach((el) => {
    observer.observe(el);
  });

  // Auto-add fade animation to sections (skip hero and page footer)
  document.querySelectorAll('main > .section').forEach((section) => {
    const hasHero = section.querySelector('.hero-agency');
    const isFooter = section.classList.contains('section-page-footer');
    if (hasHero || isFooter || section.classList.contains('animate-fade')) return;
    section.classList.add('animate-fade');
    observer.observe(section);
  });

  // Immediately reveal elements already in the viewport
  requestAnimationFrame(() => {
    document.querySelectorAll('.animate-fade, .animate-slide-from-left, .animate-slide-from-right, .animate-border-top').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('inview');
      }
    });
  });
}

/**
 * Sets up scroll-driven parallax on the hero background.
 */
function setupParallax() {
  const heroBg = document.querySelector('.hero-agency .hero-agency-bg');
  if (!heroBg) return;

  let ticking = false;
  const speed = 0.35;

  function updateParallax() {
    const { scrollY } = window;
    heroBg.style.transform = `translateY(${scrollY * speed}px)`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
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
  decoratePageFooter(main);
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

  decorateWorkSection(main);
  buildSectionDividers(main);

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
  setupParallax();
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
