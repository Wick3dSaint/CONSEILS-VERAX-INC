import Link from 'next/link';
import { localePath } from '@/lib/i18n';
import { LogoMark } from './Logo';
import NavLinks from './NavLinks';
import LanguageSwitcher from './LanguageSwitcher';
import { PillLink } from './Text';

export default function Header({ dict, lang }) {
  const { site, ui, navigation } = dict;
  const links = navigation.links.map((l) => ({ ...l, href: localePath(lang, l.href) }));

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href={localePath(lang, '/')} className="brand" aria-label={ui.homeLabel}>
          <LogoMark width={34} height={17} />
          <span className="brand__name">{site.name}</span>
        </Link>
        <NavLinks links={links} label={ui.mainNavLabel} />
        <LanguageSwitcher current={lang} target={ui.otherLanguage} />
        <PillLink
          href={localePath(lang, navigation.cta.href)}
          variant="black"
          className="pill--small header-cta"
        >
          {navigation.cta.label}
        </PillLink>
      </div>
    </header>
  );
}
