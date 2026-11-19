import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap', variable: '--font-inter' });

export const metadata = {
  title: 'Admin · Conseils Verax',
  robots: { index: false, follow: false },
};

/** The admin portal has its own layout (English only, no public header/footer). */
export default function AdminLayout({ children }) {
  return (
    <html lang="en-CA" className={inter.variable}>
      <body className="admin-body">{children}</body>
    </html>
  );
}
