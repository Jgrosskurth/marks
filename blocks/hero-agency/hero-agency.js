const INTRO_CARDS = [
  {
    id: 'welcome',
    gridCol: '5 / span 2',
    gridRow: '3 / span 2',
  },
  {
    id: 'hacking',
    gridCol: '7 / span 2',
    gridRow: '3 / span 2',
    heading: 'Hacking brand relevance',
    text: 'As the world\u2019s first Brand Creation Platform, we operate at the intersection of all things brand impact\u2014from culture to commerce, ideation to activation, URL to IRL.',
  },
  {
    id: 'built',
    gridCol: '3 / span 2',
    gridRow: '3 / span 2',
    heading: 'Built for culture\u2019s velocity',
    text: 'We spot opportunities before they become noise. We leverage the right talent at the right time. Shortening the runway from idea to impact.',
  },
];

function createScrollIndicator() {
  const btn = document.createElement('button');
  btn.classList.add('hero-scroll-btn');
  btn.setAttribute('aria-label', 'Scroll to next section');
  btn.innerHTML = '<span class="hero-scroll-label">Scroll</span>'
    + '<span class="hero-scroll-icon">'
    + '<svg viewBox="0 0 48 48" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M24 10.2 24 37.8"/>'
    + '<path d="M37.8 24 24 37.8 10.2 24"/>'
    + '</svg>'
    + '<span class="hero-scroll-progress">'
    + '<svg viewBox="0 0 48 48" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M24 10.2 24 37.8"/>'
    + '<path d="M37.8 24 24 37.8 10.2 24"/>'
    + '</svg>'
    + '</span>'
    + '</span>';
  return btn;
}

function setupScrollSystem(block, cards) {
  // Create invisible scroll triggers
  const triggers = document.createElement('div');
  triggers.classList.add('hero-scroll-triggers');
  INTRO_CARDS.forEach((cfg) => {
    const trigger = document.createElement('div');
    trigger.classList.add('hero-trigger');
    trigger.dataset.id = cfg.id;
    triggers.append(trigger);
  });
  block.append(triggers);

  let activeId = INTRO_CARDS[0].id;

  // IntersectionObserver watches triggers to switch cards
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const { id } = entry.target.dataset;
      if (id === activeId) return;

      const scrollingDown = entry.boundingClientRect.top < 0
        || entry.intersectionRect.top <= entry.rootBounds.top + 50;

      const container = block.querySelector('.hero-intros');
      container.classList.remove('dir-up', 'dir-down');
      container.classList.add(scrollingDown ? 'dir-down' : 'dir-up');

      cards.forEach((card) => {
        if (card.dataset.id === id) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
      activeId = id;
    });
  }, { threshold: 0, rootMargin: '0px 0px -90% 0px' });

  triggers.querySelectorAll('.hero-trigger').forEach((t) => observer.observe(t));

  // Scroll progress tracking
  const triggerEls = [...triggers.querySelectorAll('.hero-trigger')];
  function updateProgress() {
    triggerEls.forEach((t, i) => {
      const rect = t.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      if (cards[i]) cards[i].style.setProperty('--progress', progress);
    });
    requestAnimationFrame(updateProgress);
  }
  requestAnimationFrame(updateProgress);

  // Scroll button click → scroll to next trigger
  block.querySelectorAll('.hero-scroll-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = INTRO_CARDS.findIndex((c) => c.id === activeId);
      const nextIdx = idx + 1;
      if (nextIdx < triggerEls.length) {
        triggerEls[nextIdx].scrollIntoView({ behavior: 'smooth' });
      } else {
        // Scroll past hero
        const heroBottom = block.getBoundingClientRect().bottom + window.scrollY;
        window.scrollTo({ top: heroBottom, behavior: 'smooth' });
      }
    });
  });
}

export default function decorate(block) {
  const rows = [...block.children];
  const bgRow = rows[0];
  const headlineRow = rows[1];
  let introRow = rows[2];

  // Create sticky inner container
  const inner = document.createElement('div');
  inner.classList.add('hero-agency-inner');

  // Set up background video — hardcoded Mux source
  const HERO_MUX_ID = 'P6UGAw00NPyaFLcUJYCn02jQF5A00Gn6z8a';
  if (bgRow) {
    bgRow.classList.add('hero-agency-bg');
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('preload', 'auto');
    video.poster = `https://image.mux.com/${HERO_MUX_ID}/thumbnail.jpg`;
    video.src = `https://stream.mux.com/${HERO_MUX_ID}/high.mp4`;
    bgRow.textContent = '';
    bgRow.append(video);
  }

  // Split headline + intro if in one row
  if (headlineRow && !introRow) {
    const h1 = headlineRow.querySelector('h1');
    const h2 = headlineRow.querySelector('h2');
    if (h1 && h2) {
      introRow = document.createElement('div');
      const innerDiv = headlineRow.querySelector(':scope > div') || headlineRow;
      const children = [...innerDiv.children];
      let foundH2 = false;
      children.forEach((child) => {
        if (child === h2) foundH2 = true;
        if (foundH2) introRow.append(child);
      });
    }
  }

  // Build split headline: each line independently positioned
  let headlineEl = null;
  if (headlineRow) {
    headlineEl = document.createElement('div');
    headlineEl.classList.add('hero-agency-headline');
    ['The Brand', 'Creation', 'Platform'].forEach((text, i) => {
      const span = document.createElement('span');
      span.classList.add(['hero-headline-top', 'hero-headline-mid', 'hero-headline-bot'][i]);
      span.textContent = text;
      headlineEl.append(span);
    });
  }

  // Create intro cards container
  const introsContainer = document.createElement('div');
  introsContainer.classList.add('hero-intros');

  const cardEls = INTRO_CARDS.map((cfg, i) => {
    const card = document.createElement('div');
    card.classList.add('hero-intro-card');
    card.dataset.id = cfg.id;
    card.style.gridColumn = cfg.gridCol;
    card.style.gridRow = cfg.gridRow;

    const panel = document.createElement('div');
    panel.classList.add('hero-intro-panel');
    card.append(panel);

    const content = document.createElement('div');
    content.classList.add('hero-intro-content');

    if (i === 0 && introRow) {
      // First card uses authored CMS content
      [...introRow.children].forEach((el) => content.append(el));
    } else if (cfg.heading) {
      content.innerHTML = `<h2>${cfg.heading}</h2><p>${cfg.text}</p>`;
    }

    card.append(content);
    card.append(createScrollIndicator());

    if (i === 0) card.classList.add('active');
    return card;
  });

  cardEls.forEach((card) => introsContainer.append(card));

  // Create grid overlay
  const gridOverlay = document.createElement('div');
  gridOverlay.classList.add('hero-grid-overlay');
  for (let i = 0; i < 9 * 6; i += 1) {
    const cell = document.createElement('div');
    cell.classList.add('hero-grid-cell');
    gridOverlay.append(cell);
  }

  // Create color squares
  const squares = document.createElement('div');
  squares.classList.add('hero-color-squares');
  ['sq-pink', 'sq-empty', 'sq-pink', 'sq-empty', 'sq-beige', 'sq-pink',
    'sq-empty', 'sq-empty', 'sq-pink'].forEach((cls) => {
    const span = document.createElement('span');
    span.classList.add(cls);
    squares.append(span);
  });

  // Assemble inner
  if (bgRow) inner.append(bgRow);
  if (headlineEl) inner.append(headlineEl);
  inner.append(introsContainer);
  inner.append(gridOverlay);
  inner.append(squares);

  // Clear block and add inner
  block.textContent = '';
  block.append(inner);

  // Entry animations
  if (bgRow) bgRow.classList.add('hero-anim-bg');
  if (headlineEl) headlineEl.classList.add('hero-anim-headline');
  introsContainer.classList.add('hero-anim-intro');
  squares.classList.add('hero-anim-squares');

  // Setup scroll system after paint
  requestAnimationFrame(() => setupScrollSystem(block, cardEls));
}
