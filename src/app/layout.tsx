import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';
import { AuthProvider } from '@/store/authContext';
import NavigationProgress from '@/components/layout/NavigationProgress';
import { FEATURES } from '@/config/features';
import '@/styles/globals.css';
import '@/styles/legacy-sprites.css';

const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(`${siteOrigin}/`),
  title: 'Satbet | Throw the Dice THRICE & Claim INR 3500 Welcome Bonus',
  description:
    "Satbet offers a powerful betting experience with cricket, casino, and live sports in one place. Join one of India's trusted betting platforms and unlock an exclusive bonus.",
  keywords: 'Satbet, betting, cricket, casino, live casino, sports',
  openGraph: {
    title: 'Satbet | Throw the Dice THRICE & Claim INR 3500 Welcome Bonus',
    description:
      'Satbet offers a powerful betting experience with cricket, casino, and live sports in one place. Join one of India trusted betting platforms and unlock an exclusive bonus.',
    siteName: 'Satbet',
    type: 'website',
    images: [{ url: '/assets/SB_Cric_CSK_vs_RCB_Web.webp' }],
  },
  ...(FEATURES.googleSiteVerification
    ? {
        other: {
          'google-site-verification': FEATURES.googleSiteVerificationToken,
        },
      }
    : {}),
  robots: FEATURES.robotsIndex ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, userScalable: false };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta httpEquiv="Access-Control-Allow-Origin" content="*" />
        {FEATURES.cspUpgradeInsecure ? (
          <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        ) : null}
        <link rel="canonical" href={`${siteOrigin}/`} />
        <link rel="icon" type="image" href="/assets/C541106C-favicon.png" />

        <link rel="stylesheet" href="/assets/vendor.app.min.css" />

        {FEATURES.gtm ? (
          <Script
            src={`https://www.googletagmanager.com/gtm.js?id=${FEATURES.gtmId}`}
            strategy="afterInteractive"
          />
        ) : null}
      </head>
      <body>
        {FEATURES.gtm ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${FEATURES.gtmId}`}
              height="0"
              width="0"
              className="gtm-noscript-iframe"
              title="Google Tag Manager"
            />
          </noscript>
        ) : null}

        <AuthProvider>
          <Suspense fallback={null}>
            <NavigationProgress />
          </Suspense>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
