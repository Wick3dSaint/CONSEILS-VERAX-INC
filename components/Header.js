import Link from 'next/link';
import { navigation, site, ui } from '@/lib/content';
import { LogoMark } from './Logo';
import NavLinks from './NavLinks';
import { PillLink } from './Text';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label={ui.homeLabel}>
          <LogoMark width={34} height={17} />
          <span className="brand__name">{site.name}</span>
        </Link>
        <NavLinks links={navigation.links} label={ui.mainNavLabel} />
        <PillLink href={navigation.cta.href} variant="black" className="pill--small header-cta">
          {navigation.cta.label}
        </PillLink>
      </div>
    </header>
  );
}
