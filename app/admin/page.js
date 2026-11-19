import { cookies } from 'next/headers';
import AdminApp from '@/components/admin/AdminApp';
import AdminLogin from '@/components/admin/AdminLogin';
import { LogoMark } from '@/components/Logo';
import { COOKIE, MIN_PASSWORD, getTwoStep, isAdminSession, passwordConfigured } from '@/lib/admin/auth';
import { quebecHolidays } from '@/lib/booking/holidays';
import en from '@/lib/content/en';
import fr from '@/lib/content/fr';
import { isDbConfigured } from '@/lib/db';
import { getSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

function Shell({ children }) {
  return (
    <div className="admin">
      <header className="admin-top">
        <div className="admin-top__brand">
          <LogoMark width={34} height={17} />
          <span>Conseils Verax · Admin</span>
        </div>
      </header>
      {children}
    </div>
  );
}

export default async function AdminPage() {
  if (!passwordConfigured() || !isDbConfigured()) {
    return (
      <Shell>
        <main className="admin-main admin-narrow">
          <h1 className="admin-h1">Admin portal not set up yet</h1>
          <p>
            In hPanel, open <strong>Websites → conseilsverax.ca → Node.js → Environment variables</strong> and add{' '}
            <code>ADMIN_PASSWORD</code> with a password of at least {MIN_PASSWORD} characters. Then reload this page.
          </p>
          {!isDbConfigured() && <p>The database connection (DB_HOST, DB_NAME…) is also missing.</p>}
        </main>
      </Shell>
    );
  }

  const signedIn = await isAdminSession((await cookies()).get(COOKIE)?.value);
  if (!signedIn) {
    return (
      <Shell>
        <main className="admin-main admin-narrow">
          <AdminLogin />
        </main>
      </Shell>
    );
  }

  const [settings, twoStep] = await Promise.all([getSettings(), getTwoStep()]);
  const year = new Date().getFullYear();
  const today = new Date().toISOString().slice(0, 10);
  const holidays = [...quebecHolidays(year), ...quebecHolidays(year + 1)].filter((h) => h.date >= today).slice(0, 10);
  const services = en.services.map((s, i) => ({ id: s.id, en: s.title, fr: fr.services[i].title }));
  const wording = {
    heading: { en: en.home.servicesBand.title.rest, fr: fr.home.servicesBand.title.rest },
    numberWords: { en: en.ui.numberWords, fr: fr.ui.numberWords },
  };

  return (
    <Shell>
      <AdminApp
        initialSettings={settings}
        services={services}
        holidays={holidays}
        wording={wording}
        twoStepEnabled={twoStep.enabled}
      />
    </Shell>
  );
}
