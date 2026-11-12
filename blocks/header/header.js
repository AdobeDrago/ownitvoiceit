import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const el = (tag, cls) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
};

const img = (src, alt, cls) => {
  const i = el('img', cls);
  i.src = src;
  i.alt = alt;
  return i;
};

/**
 * Header from the /nav fragment: [home link text] [flag picture] [tagline heading].
 * The gradient and the logo are brand assets served from /icons.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  block.textContent = '';
  if (!fragment) return;

  block.append(img('/icons/header_gradient.svg', 'Header Gradient', 'header-gradient'));

  const link = fragment.querySelector('a');
  const home = el('a', 'header-brand');
  home.href = link ? link.href : '/';
  const sr = el('span', 'sr-only');
  sr.textContent = link ? link.textContent.trim() : 'Home';
  home.append(sr, img('/icons/ownitvoiceit_logo.svg', ''));
  block.append(home);

  const flag = fragment.querySelector('picture img, img');
  if (flag) {
    flag.classList.add('header-flag');
    flag.alt = '';
    flag.loading = 'eager';
    block.append(flag.closest('picture') || flag);
  }

  const heading = fragment.querySelector('h1, h2');
  if (heading) {
    const h1 = el('h1');
    h1.id = heading.id;
    // the emphasised line of the tagline is the accent-coloured span
    [...heading.childNodes].forEach((n) => {
      if (n.nodeType === Node.ELEMENT_NODE && /^(STRONG|EM|B|I)$/.test(n.tagName)) {
        const span = el('span', 'header-accent');
        span.textContent = n.textContent;
        h1.append(span);
      } else h1.append(n.cloneNode(true));
    });
    const wrap = el('div', 'header-title');
    wrap.append(h1);
    block.append(wrap);
  }
}
