import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import localFont from 'next/font/local';
import Header from '@/components/Header';
import { QuranProvider } from '@/contexts/QuranProvider';
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
  title: 'Wonderful Quran',
  description: 'Wonderful Quran by HDygiDev'
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lpmqFont.variable} antialiased`}
      >
        <Theme appearance="light" accentColor="indigo">
          <QuranProvider initialChapters={chapters} initialJuzs={juzs}>
            <Header />
            {children}
          </QuranProvider>
          {/* <ThemePanel /> */}
        </Theme>
      </body>
    </html>
  );
}
