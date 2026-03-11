function updateActiveSlide(block, slideIndex) {
  const slides = block.querySelectorAll('.carousel-casestudies-slide');
  const total = slides.length;
  let idx = slideIndex;
  if (idx < 0) idx = total - 1;
  if (idx >= total) idx = 0;

  block.dataset.activeSlide = idx;

  slides.forEach((slide, i) => {
    slide.setAttribute('aria-hidden', i !== idx);
  });

  const indicators = block.querySelectorAll('.carousel-casestudies-slide-indicator');
  indicators.forEach((indicator, i) => {
    const btn = indicator.querySelector('button');
    if (i !== idx) {
      btn.removeAttribute('disabled');
    } else {
      btn.setAttribute('disabled', 'true');
    }
  });
}

function bindEvents(block) {
  const prev = block.querySelector('.slide-prev');
  const next = block.querySelector('.slide-next');

  if (prev) {
    prev.addEventListener('click', () => {
      updateActiveSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
    });
  }
  if (next) {
    next.addEventListener('click', () => {
      updateActiveSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
    });
  }

  const slideIndicators = block.querySelector('.carousel-casestudies-slide-indicators');
  if (slideIndicators) {
    slideIndicators.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', (e) => {
        const indicator = e.currentTarget.parentElement;
        updateActiveSlide(block, parseInt(indicator.dataset.targetSlide, 10));
      });
    });
  }
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-casestudies-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-casestudies-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-casestudies-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-casestudies-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-casestudies-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-casestudies-slides');

  let slideIndicators;
  if (!isSingleSlide) {
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute('aria-label', 'Carousel Slide Controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-casestudies-slide-indicators');
    slideIndicatorsNav.append(slideIndicators);
    block.append(slideIndicatorsNav);

    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-casestudies-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="Previous Slide"></button>
      <button type="button" class="slide-next" aria-label="Next Slide"></button>
    `;
    container.append(slideNavButtons);
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-casestudies-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button" aria-label="Show Slide ${idx + 1} of ${rows.length}"></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });

  container.append(slidesWrapper);
  block.prepend(container);

  // Initialize first slide as active
  updateActiveSlide(block, 0);

  if (!isSingleSlide) {
    bindEvents(block);
  }
}
