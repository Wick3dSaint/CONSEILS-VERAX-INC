import Link from 'next/link';
import { footer, services, site } from '@/lib/content';
import { EmailLink, PhoneLink } from './ContactDetails';

export default function Footer() {
  // Rendered at build time for static pages; a rebuild updates the year.
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <section aria-labelledby="footer-services">
            <h2 id="footer-services" className="footer-heading">
              {footer.servicesHeading}
            </h2>
            <ul className="footer-list">
              {services.map((s) => (
                <li key={s.id}>
                  <Link href={`/services#${s.id}`}>{s.shortLabel}</Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="footer-firm">
            <h2 id="footer-firm" className="footer-heading">
              {footer.firmHeading}
            </h2>
            <ul className="footer-list">
              {footer.firmLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="footer-contact">
            <h2 id="footer-contact" className="footer-heading">
              {footer.contactHeading}
            </h2>
            <ul className="footer-list">
              <li>
                <EmailLink email={site.email} />
              </li>
              <li>
                <PhoneLink phone={site.phone} />
              </li>
              <li>{site.area}</li>
            </ul>
          </section>
        </div>

        <div className="footer-bottom">
          <p>
            © {year} {site.legalName} {footer.rights}
          </p>
          <p>{site.signoff}</p>
        </div>
      </div>
    </footer>
  );
}
