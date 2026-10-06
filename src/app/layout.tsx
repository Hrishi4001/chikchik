import type { Metadata } from 'next';
import { Instrument_Sans, Figtree, Cormorant, Poppins } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import ToastContainer from '@/components/ui/ToastContainer';
import SiteChrome from '@/components/layout/SiteChrome';

const instrument = Instrument_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic']
});

const figtree = Figtree({
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

const poppins = Poppins({
  variable: '--font-button-face',
  subsets: ['latin'],
  weight: ['400', '500']
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.hevaelegance.com'),
  title: 'Heva Elegance | Indian traditional wear brand',
  description: 'Heva Elegance is an Indian traditional wear brand offering festive saree collections, silk sarees for festivals, and cotton kurtas for everyday wear. Discover designer sarees online and authentic kurtas for women, combining cultural heritage with modern style',
  keywords: [
    'Heva Elegance',
    'Indian traditional wear',
    'festive saree collection',
    'silk sarees for festivals',
    'designer sarees online',
    'cotton kurtas for women',
    'kurta sets'
  ],
  openGraph: {
    title: 'Heva Elegance | Indian traditional wear brand',
    description: 'Heva Elegance is an Indian traditional wear brand offering festive saree collections, silk sarees for festivals, and cotton kurtas for everyday wear. Discover designer sarees online and authentic kurtas for women, combining cultural heritage with modern style',
    url: 'https://www.hevaelegance.com',
    siteName: 'Heva Elegance',
    images: [
      {
        url: '/images/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Heva Elegance'
      }
    ],
    locale: 'en_IN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Heva Elegance | Indian traditional wear brand',
    description: 'Heva Elegance is an Indian traditional wear brand offering festive saree collections, silk sarees for festivals, and cotton kurtas for everyday wear. Discover designer sarees online and authentic kurtas for women, combining cultural heritage with modern style',
    images: ['/images/hero.jpg']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'Heva Elegance',
    url: 'https://www.hevaelegance.com',
    logo: 'https://static.wixstatic.com/media/80e345_3336b58c16684240b719821a70eb70a3~mv2.png',
    description: 'Heva Elegance is an Indian traditional wear brand offering festive saree collections, silk sarees for festivals, and cotton kurtas for everyday wear. Discover designer sarees online and authentic kurtas for women, combining cultural heritage with modern style',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN'
    }
  };

  return (
    <html lang="en" className={`${instrument.variable} ${figtree.variable} ${cormorant.variable} ${poppins.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
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
