import { lang } from 'next/root-params';
import { getContent, localePath } from '@/lib/i18n';
import { Headline, MoreLink } from '@/components/Text';

// Reads the admin portal's settings (services on/off, contact details) on every request.
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const { notFoundPage } = await getContent(await lang());
  return { title: notFoundPage.meta.title };
}

export default async function NotFound() {
  const current = await lang();
  const { notFoundPage } = await getContent(current);
  return (
    <section className="hero hero--not-found" aria-labelledby="not-found-title">
      <div className="container fade-up">
        <Headline as="h1" id="not-found-title" title={notFoundPage.title} className="display" />
        <p className="hero__lead">
          <MoreLink href={localePath(current, notFoundPage.link.href)}>{notFoundPage.link.label}</MoreLink>
        </p>
      </div>
    </section>
  );
}
