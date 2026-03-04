import type { Metadata } from 'next';
import { IBM_Plex_Sans, Barlow } from 'next/font/google';
import './globals.css';
import ErrorBoundary from '@/components/ErrorBoundary';

/* Reference (vertical.framer.media): editorial geometric sans — neutral body + strong display */
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const barlow = Barlow({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://avelonmotion.com'),
  title: { default: 'Avelon Motion – AI Video Production', template: '%s | Avelon Motion' },
  description: 'Cinematic AI-powered video production for modern brands.',
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#0a0a0a] text-[#f5f5f5]">
      <body
        className={`${ibmPlexSans.variable} ${barlow.variable} font-sans antialiased min-h-screen bg-[#0a0a0a] text-[#f5f5f5]`}
      >
        <ErrorBoundary>
          <div id="__next" className="min-h-screen">
            {children}
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
