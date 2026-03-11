/**
 * MARKS header - Fixed square logo in top-left corner
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const logo = document.createElement('a');
  logo.href = '/';
  logo.className = 'marks-logo';
  logo.setAttribute('aria-label', 'MARKS home');
  logo.innerHTML = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="var(--color-graphite, #24272a)"/>
    <text x="50" y="68" text-anchor="middle" font-family="'Surt Normal', sans-serif"
      font-weight="900" font-size="32" fill="var(--color-beige, #eeebe6)"
      letter-spacing="-1">marks.</text>
  </svg>`;

  block.textContent = '';
  block.append(logo);

  // Shrink logo on scroll (mobile only)
  const observer = new IntersectionObserver(([entry]) => {
    logo.classList.toggle('off-top', !entry.isIntersecting);
  }, { threshold: 0 });

  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;';
  document.body.prepend(sentinel);
  observer.observe(sentinel);
}
