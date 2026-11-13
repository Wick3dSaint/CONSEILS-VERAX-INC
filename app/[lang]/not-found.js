import { lang } from 'next/root-params';
import { getDictionary, localePath } from '@/lib/i18n';
import { Headline, MoreLink } from '@/components/Text';

export async function generateMetadata() {
  const { notFoundPage } = getDictionary(await lang());
  return { title: notFoundPage.meta.title };
}

export default async function NotFound() {
  const current = await lang();
  const { notFoundPage } = getDictionary(current);
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
