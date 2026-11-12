import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const el = (tag, cls) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
};

// social network icon (in /icons) by link host
const SOCIAL = [
  [/youtube\.com$/, 'square-youtube'],
  [/facebook\.com$/, 'square-facebook'],
  [/(twitter|x)\.com$/, 'square-x-twitter'],
  [/instagram\.com$/, 'square-instagram'],
];

async function inlineIcon(name) {
  try {
    const resp = await fetch(`${window.hlx?.codeBasePath || ''}/icons/${name}.svg`);
    if (!resp.ok) return null;
    const doc = new DOMParser().parseFromString(await resp.text(), 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) return null;
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    return document.importNode(svg, true);
  } catch (e) {
    return null;
  }
}

// links of a list, unwrapping DA's <li><p><a> nesting
const linksOf = (list) => (list ? [...list.querySelectorAll(':scope > li')]
  .map((li) => li.querySelector('a')).filter(Boolean) : []);

function navList(links, cls, label) {
  const nav = el('nav', cls);
  nav.setAttribute('aria-label', label);
  const ul = el('ul');
  links.forEach((a) => {
    const li = el('li');
    li.append(a);
    ul.append(li);
  });
  nav.append(ul);
  return nav;
}

/**
 * Footer from the /footer fragment: [home link + social links] [copyright + legal links]
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  const [socialSec, legalSec] = fragment ? [...fragment.children] : [];
  block.textContent = '';

  if (socialSec) {
    const social = el('div', 'footer-social');
    const inner = el('div', 'footer-social-inner');
    const link = [...socialSec.querySelectorAll('a')].find((a) => !a.closest('ul'));
    const home = el('a', 'footer-brand');
    home.href = link ? link.href : '/';
    const sr = el('span', 'sr-only');
    sr.textContent = link ? link.textContent.trim() : 'Home';
    const logo = el('img');
    logo.src = '/icons/ownitvoiceit_logo.svg';
    logo.alt = '';
    logo.loading = 'lazy';
    home.append(sr, logo);
    inner.append(home);

    const links = await Promise.all(linksOf(socialSec.querySelector('ul')).map(async (a) => {
      const out = el('a');
      out.href = a.href;
      out.target = '_blank';
      out.rel = 'noopener';
      out.setAttribute('aria-label', a.textContent.trim());
      const { hostname } = new URL(a.href);
      const hit = SOCIAL.find(([re]) => re.test(hostname.replace(/^www\./, '')));
      const svg = hit ? await inlineIcon(hit[1]) : null;
      if (svg) out.append(svg);
      return out;
    }));
    const wrap = el('div');
    wrap.append(navList(links, 'footer-social-nav', 'footer navigation'));
    inner.append(wrap);
    social.append(inner);
    block.append(social);
  }

  if (legalSec) {
    const legal = el('div', 'footer-legal');
    const inner = el('div', 'footer-legal-inner');
    const copy = legalSec.querySelector('p');
    if (copy) {
      copy.className = 'footer-copy';
      inner.append(copy);
    }
    const links = linksOf(legalSec.querySelector('ul'));
    links.forEach((a) => { a.className = ''; });
    if (links.length) inner.append(navList(links, 'footer-legal-nav', 'Legal statements'));
    legal.append(inner);
    block.append(legal);
  }
}
