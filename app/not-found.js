import { notFoundPage } from '@/lib/content';
import { Headline, MoreLink } from '@/components/Text';

export const metadata = {
  title: notFoundPage.meta.title,
};

export default function NotFound() {
  return (
    <section className="hero hero--not-found" aria-labelledby="not-found-title">
      <div className="container fade-up">
        <Headline as="h1" id="not-found-title" title={notFoundPage.title} className="display" />
        <p className="hero__lead">
          <MoreLink href={notFoundPage.link.href}>{notFoundPage.link.label}</MoreLink>
        </p>
      </div>
    </section>
  );
}
