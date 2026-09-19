import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans, Instrument_Serif } from 'next/font/google';
import VisitTracker from '@/components/VisitTracker';
import './globals.css';

/* Self-hosted by next/font, which matters: vercel.json's CSP allows
   font-src 'self' only, so a Google Fonts <link> would be blocked. */
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-plex-sans',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex-mono',
  weight: ['400', '500'],
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nicolas Boitout — FX Markets Dynamics, a Doctoral Dissertation',
  description:
    'Four chapters on exchange rate dynamics and currency crises, from a 2004 doctoral dissertation — three of them rebuilt as interactive laboratories you can run in your browser: a multifractal cascade simulator, an agent-based FX market, and long-memory estimators on ten years of modern series.',
  openGraph: {
    type: 'website',
    title: 'Exchange Rate Dynamics — Nicolas Boitout',
    description:
      "Four chapters on how a currency price is made. Three of them run in your browser: a cascade simulator, an agent-based market, and long-memory estimators on today's markets.",
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b0d10',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable} ${instrumentSerif.variable}`}>
      <body>
        {children}
        <VisitTracker />
      </body>
    </html>
  );
}
