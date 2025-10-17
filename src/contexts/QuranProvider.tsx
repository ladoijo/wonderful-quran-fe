'use client';

import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import type { Chapter, Juz } from '@/types/quran';
import { getChaptersCached, getJuzsCached } from '@/utils/apiClient';

type QuranContextValue = {
  chapters: Record<number, Chapter>;
  juzs: Juz[];
};

const QuranContext = createContext<QuranContextValue | null>(null);

export function QuranProvider({
  children,
  initialChapters,
  initialJuzs
}: Readonly<{
  children: ReactNode;
  initialChapters?: QuranContextValue['chapters'];
  initialJuzs?: Juz[];
}>) {
  const [chapters, setChapters] = useState<QuranContextValue['chapters']>(initialChapters ?? []);
  const [juzs, setJuzs] = useState<Juz[]>(initialJuzs ?? []);

  useEffect(() => {
    if (chapters && Object.keys(chapters).length && juzs.length) return; // already hydrated from server
    // fetch as a fallback when SSR data wasn’t provided (e.g., client-only route)
    (async () => {
      const [resChapters, resJuzs] = await Promise.all([getChaptersCached(), getJuzsCached()]);
      setChapters(resChapters);
      setJuzs(resJuzs.juzs);
    })();
  }, [chapters, juzs.length]);

  const contextValue = useMemo(() => ({ chapters, juzs }), [chapters, juzs]);

  return <QuranContext.Provider value={contextValue}>{children}</QuranContext.Provider>;
}

export function useQuranContext() {
  const context = useContext(QuranContext);

  if (!context) {
    throw new Error('useQuranContext must be used within a QuranProvider');
  }

  return context;
}
