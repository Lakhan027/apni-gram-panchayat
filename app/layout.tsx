import type { Metadata, Viewport } from 'next';
import { Mukta } from 'next/font/google';
import './globals.css';
import TopStrip from '@/components/layout/TopStrip';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CampaignBar, CampaignFab } from '@/components/campaign/Campaign';
import { getCampaign, getSearchIndex } from '@/lib/data';
import { LanguageProvider } from '@/lib/i18n/LanguageProvider';
import { T } from '@/lib/i18n/T';

const mukta = Mukta({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-mukta',
});

export const metadata: Metadata = {
  title: {
    default: 'अपनी ग्राम पंचायत — आपलियास',
    template: '%s | अपनी ग्राम पंचायत आपलियास',
  },
  description:
    'ग्राम पंचायत आपलियास, तहसील Hurda, जिला Bhilwara (राजस्थान) का पारदर्शी पंचायत पोर्टल।',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B3D27',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [searchIndex, campaign] = await Promise.all([getSearchIndex(), getCampaign()]);
  return (
    <html lang="hi" className={mukta.variable}>
      <body className="font-sans">
        <LanguageProvider>
          <a
            href="#main"
            className="sr-only z-[60] rounded-[10px] bg-green-700 px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            <T k="site.skip" />
          </a>
          <TopStrip />
          <Header searchIndex={searchIndex} />
          <CampaignBar campaign={campaign} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer campaign={campaign} />
          <CampaignFab campaign={campaign} />
        </LanguageProvider>
      </body>
    </html>
  );
}
