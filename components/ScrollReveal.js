'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Scroll-triggered motion for the public pages.
 * - Content blocks (headings, cards, tiles, panels…) fade and slide in the first time they scroll into view.
 *   Items revealed together are staggered slightly.
 * - The spirit level only starts its animation once at least half of it is on screen.
 * - What is already visible when a page first loads is shown at once (no flash).
 * - Nothing moves for visitors who ask for reduced motion, and without JavaScript everything is simply visible.
 * Blocks are chosen here by selector, so pages need no extra markup.
 */

// Larger blocks that scale in slightly; checked first, so their contents don't animate separately.
const SCALE = ['.panel', '.booking'];
// Everything else that fades up.
const UP = [
  '.closing__inner',
  '.section .h2',
  '.band .h2',
  '.section-intro',
  '.section-link',
  '.service-tile',
  '.card--scroll',
  '.tile',
  '.client-card',
  '.help-card',
  '.side-card',
  '.step',
  '.contact-form',
  '.about-person',
  '.about-story',
];

const STAGGER_MS = 70;
const MAX_STAGGER = 6;

function tag() {
  const fresh = [];
  for (const [variant, selectors] of [
    ['scale', SCALE],
    ['up', UP],
  ]) {
    for (const el of document.querySelectorAll(selectors.join(','))) {
      if (el.hasAttribute('data-reveal') || el.closest('.hero, [data-reveal]')) continue;
      el.setAttribute('data-reveal', variant);
      fresh.push(el);
    }
  }
  return fresh;
}

const inView = (el, fraction = 0) => {
  const r = el.getBoundingClientRect();
  const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
  return visible > Math.min(r.height, window.innerHeight) * fraction && r.bottom > 0 && r.top < window.innerHeight;
};

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      root.classList.remove('js-reveal');
      return undefined;
    }

    const blocks = tag();
    const levels = [...document.querySelectorAll('.level:not([data-play])')];

    // Whatever is already on screen when a page appears stays as it is; only what you scroll to animates.
    for (const el of blocks) if (inView(el)) el.setAttribute('data-revealed', 'done');

    const reveal = new IntersectionObserver(
      (entries) => {
        const shown = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target)
          .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top || a.getBoundingClientRect().left - b.getBoundingClientRect().left);
        shown.forEach((el, i) => {
          el.style.setProperty('--reveal-delay', `${Math.min(i, MAX_STAGGER) * STAGGER_MS}ms`);
          el.setAttribute('data-revealed', 'in');
          reveal.unobserve(el);
          // Once settled, hand the element back to its own transitions (e.g. card hover).
          const settle = () => {
            el.setAttribute('data-revealed', 'done');
            el.style.removeProperty('--reveal-delay');
          };
          el.addEventListener('transitionend', settle, { once: true });
          setTimeout(settle, 1600);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    const play = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute('data-play', '');
          play.unobserve(e.target);
        }
      },
      { threshold: 0.5 },
    );

    for (const el of blocks) if (!el.hasAttribute('data-revealed')) reveal.observe(el);
    for (const el of levels) play.observe(el);
    root.classList.add('js-reveal');

    return () => {
      reveal.disconnect();
      play.disconnect();
    };
  }, [pathname]);

  return null;
}
