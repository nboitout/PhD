import type { Metadata, Viewport } from 'next';
import VisitTracker from '@/components/VisitTracker';
import './globals.css';

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
  themeColor: '#1d4e6b',
};

/**
 * The stored theme has to land on <html> before the first paint, or a reader
 * who chose dark gets a white flash while React hydrates. The static page got
 * this for free from a deferred script; here it takes four lines in <head>.
 */
const THEME_BOOTSTRAP = `try{var t=localStorage.getItem('phd-theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body>
        {children}
        <VisitTracker />
      </body>
    </html>
  );
}
