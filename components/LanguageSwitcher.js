'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { internalPath, localePath } from '@/lib/routes';

/** Links to the same page in the other language and remembers the choice for future visits. */
export default function LanguageSwitcher({ current, target }) {
  const pathname = usePathname() || `/${current}`;
  // Same page in the other language, at that language's own address (/fr/a-propos ↔ /en/about).
  const rest = pathname.replace(/^\/(fr|en)(?=\/|$)/, '') || '/';
  const href = localePath(target.code, internalPath(current, rest));

  function remember() {
    const secure = window.location.protocol === 'https:' ? '; secure' : '';
    document.cookie = `lang=${target.code}; path=/; max-age=31536000; samesite=lax${secure}`;
  }

  return (
    <Link
      href={href}
      hrefLang={target.code}
      lang={target.code}
      aria-label={target.ariaLabel}
      className="lang-switch"
      onClick={remember}
    >
      {target.label}
    </Link>
  );
}
