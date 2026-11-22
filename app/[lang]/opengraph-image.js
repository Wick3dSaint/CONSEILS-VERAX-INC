import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { getDictionary, hasLocale } from '@/lib/i18n';

// The picture shown when a link to the site is shared (messages, LinkedIn, Facebook…).
export const alt = 'Conseils Verax';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const { lang } = await params;
  const dict = getDictionary(hasLocale(lang) ? lang : 'en');
  const { lead, rest } = dict.home.hero.title;
  const groups = dict.serviceGroups.map((g) => g.title).join('  ·  ');
  // Inter, the site's typeface (SIL Open Font License, see assets/fonts/OFL-LICENSE.txt).
  const font = (weight) => readFile(join(process.cwd(), 'assets/fonts', `Inter-${weight}.woff`));
  // If the font files are ever missing, fall back to the default font rather than failing.
  const fonts = await Promise.all([font(400), font(600)])
    .then(([regular, semibold]) => [
      { name: 'Inter', data: regular, weight: 400, style: 'normal' },
      { name: 'Inter', data: semibold, weight: 600, style: 'normal' },
    ])
    .catch(() => undefined);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#ffffff',
          color: '#1d1d1f',
          fontFamily: 'Inter',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <svg width="120" height="60" viewBox="0 0 40 20">
            <rect x="1.25" y="1.25" width="37.5" height="17.5" rx="8.75" fill="none" stroke="#1d1d1f" strokeWidth="2.5" />
            <path d="M15 5.5v9M25 5.5v9" stroke="#1d1d1f" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="20" cy="10" r="3.3" fill="#0a6e5c" />
          </svg>
          <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-0.02em' }}>{dict.site.name}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 76, fontWeight: 600, lineHeight: 1.05, letterSpacing: '-0.035em' }}>
          <span>{lead}</span>
          <span style={{ color: '#6e6e73' }}>{rest}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, color: '#424245' }}>
          <span>{groups}</span>
          <span style={{ color: '#0a6e5c' }}>conseilsverax.ca</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    },
  );
}
