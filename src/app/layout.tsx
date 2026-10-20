import type { Metadata } from 'next';
import { Oswald, Cormorant, Poppins } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import ToastContainer from '@/components/ui/ToastContainer';
import SiteChrome from '@/components/layout/SiteChrome';
import { LEGAL } from '@/lib/legal';

const poppins = Poppins({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic']
});

const oswald = Oswald({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

const cormorant = Cormorant({
  variable: '--font-italic',
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['italic']
});

const SITE_URL = 'https://www.chikchik.in';
const SITE_TITLE = 'Chikchik | Designer Lighters India – Retro Matchbox Art Jet Lighters';
const SITE_DESCRIPTION = 'Shop designer lighters with a 90s soul. Vintage Indian matchbox art on refillable jet-flame and flip-top lighters, gift-boxed and shipped across India.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: 'Chikchik',
  category: 'shopping',
  keywords: [
    'Chikchik',
    'designer lighters',
    'designer lighters India',
    'buy lighter online India',
    'jet lighter',
    'torch lighter',
    'windproof lighter',
    'refillable lighter',
    'flip top lighter',
    'metal lighter',
    'retro lighter',
    'vintage matchbox art',
    'Indian matchbox label',
    'collectible lighters',
    'lighter gift for men',
    'gift lighter India'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 }
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: 'Chikchik',
    images: [
      {
        url: '/images/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Chikchik designer lighters with vintage matchbox art'
      }
    ],
    locale: 'en_IN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/images/og.jpg']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Store + website structured data, shared by every page
  const siteSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'OnlineStore',
        '@id': `${SITE_URL}/#store`,
        name: 'Chikchik',
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo.png`,
        image: `${SITE_URL}/images/og.jpg`,
        description: SITE_DESCRIPTION,
        slogan: 'Designer lighters with a 90s soul',
        telephone: LEGAL.whatsapp,
        email: LEGAL.email,
        priceRange: '₹₹',
        currenciesAccepted: 'INR',
        areaServed: { '@type': 'Country', name: 'India' },
        address: { '@type': 'PostalAddress', addressCountry: 'IN' },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          telephone: LEGAL.whatsapp,
          email: LEGAL.email,
          areaServed: 'IN',
          availableLanguage: ['English', 'Hindi']
        }
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Chikchik',
        inLanguage: 'en-IN',
        publisher: { '@id': `${SITE_URL}/#store` }
      }
    ]
  };

  return (
    <html lang="en-IN" className={`${poppins.variable} ${oswald.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body>
        <StoreProvider>
          <SiteChrome>{children}</SiteChrome>
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}
