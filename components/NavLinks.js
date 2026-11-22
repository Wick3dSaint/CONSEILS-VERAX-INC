'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

/**
 * The Services dropdown: a disclosure button and a panel of grouped links.
 * Opens on hover with a mouse, on click or tap everywhere, and from the keyboard (Enter/Space).
 * Escape, a click outside, moving focus away or following a link closes it.
 */
function ServicesMenu({ label, menu, current }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const button = useRef(null);
  const hoverCapable = useRef(false);
  const openedByHover = useRef(false);
  const closeTimer = useRef(null);
  const panelId = useId();
  const pathname = usePathname();

  useEffect(() => {
    hoverCapable.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (!wrap.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const onMouseEnter = () => {
    if (!hoverCapable.current) return;
    clearTimeout(closeTimer.current);
    if (!open) openedByHover.current = true;
    setOpen(true);
  };
  const onMouseLeave = () => {
    if (!hoverCapable.current) return;
    closeTimer.current = setTimeout(() => setOpen(false), 180);
  };
  const onClick = () => {
    // A click on a menu that hover has just opened keeps it open instead of closing it.
    if (open && openedByHover.current) {
      openedByHover.current = false;
      return;
    }
    openedByHover.current = false;
    setOpen((o) => !o);
  };
  const onBlur = (e) => {
    if (!wrap.current?.contains(e.relatedTarget)) setOpen(false);
  };
  const close = () => setOpen(false);

  return (
    <li ref={wrap} className="nav-menu" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onBlur={onBlur}>
      <button
        ref={button}
        type="button"
        className="nav-link nav-menu__button"
        aria-expanded={open}
        aria-controls={panelId}
        data-current={current ? '' : undefined}
        onClick={onClick}
      >
        {label}
        <svg className="nav-menu__chevron" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M2 3.75 5 6.75l3-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div id={panelId} className="nav-menu__panel" hidden={!open}>
        <div className="nav-menu__groups">
          {menu.groups.map((g) => (
            <div key={g.id} className="nav-menu__group">
              <p id={`${panelId}-${g.id}`} className="nav-menu__title">
                {g.title}
              </p>
              <ul aria-labelledby={`${panelId}-${g.id}`}>
                {g.items.map((item) => (
                  <li key={item.id}>
                    <Link href={item.href} className="nav-menu__link" onClick={close}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link
          href={menu.all.href}
          className="nav-menu__all"
          aria-current={current ? 'page' : undefined}
          onClick={close}
        >
          {menu.all.label}
          <span aria-hidden="true">{' ›'}</span>
        </Link>
      </div>
    </li>
  );
}

export default function NavLinks({ links, label, servicesMenu }) {
  const pathname = usePathname() ?? '';
  const isCurrent = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav aria-label={label} className="site-nav">
      <ul>
        {links.map((link) => {
          if (servicesMenu && link.href === servicesMenu.match) {
            return <ServicesMenu key={link.href} label={link.label} menu={servicesMenu} current={isCurrent(link.href)} />;
          }
          const current = isCurrent(link.href);
          return (
            <li key={link.href}>
              <Link href={link.href} className="nav-link" aria-current={current ? 'page' : undefined}>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
