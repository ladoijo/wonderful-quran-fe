import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import localFont from 'next/font/local';
import Header from '@/components/Header';
import { QuranProvider } from '@/contexts/QuranProvider';
import { ToastProvider } from '@/contexts/ToastProvider';
import type { Chapter, Juz } from '@/types/quran';
import { getChaptersCached, getJuzsCached } from '@/utils/apiClient';

const lpmqFont = localFont({
  src: [
    {
      path: '../../public/fonts/LPMQ IsepMisbah.ttf',
      weight: '400',
      style: 'normal'
    }
  ],
  variable: '--font-lpmqFont' // optional for Tailwind usage
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wonderful-quran.netlify.app'),
  title: {
    template: '%s · Wonderful Quran',
    default: 'Wonderful Quran – Explore the Revelation'
  },
  description:
    'Study Quran chapters, verses, and translations with a modern interface. Created by HDygiDev',
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en'
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' }
  },
  openGraph: {
    type: 'website',
    title: 'Wonderful Quran',
    description:
      'Discover Quranic chapters, and translations in a beautifully designed experience.',
    url: '/',
    siteName: 'Wonderful Quran',
    images: [{ url: '/og/home.jpg', width: 1200, height: 630, alt: 'Wonderful Quran interface' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wonderful Quran',
    description:
      'Explore Quran chapters, translations, tajweed, and tafsir with a thoughtful interface.',
    images: ['/og/home.jpg']
  },
  other: {
    'google-site-verification': 'a6iJGnvsQYP9yKQxvWj0l-qfcXYoRJYR3tkV3dinsa0'
  }
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  let chapters: Record<number, Chapter> | undefined;
  let juzs: Record<number, Juz> | undefined;

  try {
    const res = await Promise.all([getChaptersCached(), getJuzsCached()]);
    chapters = res[0];
    juzs = res[1];
  } catch (error) {
    console.log(error);
  }

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta
          name="google-site-verification"
          content="a6iJGnvsQYP9yKQxvWj0l-qfcXYoRJYR3tkV3dinsa0"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lpmqFont.variable} antialiased`}
      >
        <Theme appearance="light" accentColor="indigo">
          <ToastProvider>
            <QuranProvider initialChapters={chapters} initialJuzs={juzs}>
              <Header />
              {children}
            </QuranProvider>
          </ToastProvider>
          {/* <ThemePanel /> */}
        </Theme>
      </body>
    </html>
  );
}
