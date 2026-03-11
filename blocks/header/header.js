import { getMetadata } from '../../scripts/aem.js';

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';

  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    const nav = document.createElement('nav');
    nav.id = 'nav';
    nav.innerHTML = html;

    const navSections = nav.querySelector('.nav-sections');
    if (navSections) {
      navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
        if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
        navSection.addEventListener('click', () => {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        });
      });
    }

    const hamburger = document.createElement('button');
    hamburger.type = 'button';
    hamburger.classList.add('nav-hamburger');
    hamburger.setAttribute('aria-controls', 'nav');
    hamburger.setAttribute('aria-label', 'Open navigation');
    hamburger.innerHTML = '<span class="nav-hamburger-icon"></span>';
    hamburger.addEventListener('click', () => {
      const expanded = nav.getAttribute('aria-expanded') === 'true';
      nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      hamburger.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    });
    nav.prepend(hamburger);
    nav.setAttribute('aria-expanded', 'false');

    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    navWrapper.append(nav);
    block.append(navWrapper);
  }
}
