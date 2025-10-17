'use client';

import { Box, Flex, Skeleton, Spinner } from '@radix-ui/themes';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useQuranContext } from '@/contexts/QuranProvider';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { Verse } from '@/types/quran';
import type { GetVerses } from '@/utils/apiClient';
import { capitalizeFirst, capitalizeWords, fmtArabic } from '@/utils/formatter';
import bismillahImage from '~/assets/images/bismillah.svg';

interface PageProps {
  firstVersePage: Record<number, Verse>;
  onLoadMore: (page: number) => Promise<GetVerses>;
}

export default function ViewVerses({ firstVersePage, onLoadMore }: Readonly<PageProps>) {
  const [verses, setVerses] = useState<Record<number, Verse>>(firstVersePage);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { chapters } = useQuranContext();
  const chapterId = Object.values(firstVersePage)[0].chapter_id;
  const chapter = chapters[chapterId];

  // biome-ignore lint/correctness/useExhaustiveDependencies: dependencies intentionally limited to avoid duplicate fetches
  const loadMoreVerses = useCallback(async () => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      const respVerses = await onLoadMore(nextPage);
      const verses = respVerses.verses;
      setVerses((prev) => ({ ...prev, ...verses }));
      setCurrentPage(nextPage);
      setHasMore(
        respVerses.pagination.total_pages ? nextPage < respVerses.pagination.total_pages : false
      );
    } catch (error) {
      // TODO: Show this error on snackbar or alert
      console.error('Error loading more verses:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, loading, hasMore]);

  const { sentinelRef } = useInfiniteScroll({
    enabled: hasMore && !loading,
    rootMargin: '400px',
    onLoadMore: () => {
      void loadMoreVerses();
    }
  });

  return (
    <>
      <Box></Box>
      <Flex className="p-7" direction="column" gap="4">
        <Flex className="flex-col gap-1 items-center text-center">
          {!verses && loading ? (
            <>
              <Skeleton height="40px" width="75px" />
              <Skeleton height="28px" width="100px" />
              <Skeleton height="20px" width="120px" />
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold font-lpmqFont">{chapter?.name_arabic}</h1>
              <h2 className="text-xl font-bold">{chapter?.name_simple}</h2>
              <p className="text-sm text-gray-500">
                {chapter?.revelation_place && capitalizeWords(chapter.revelation_place)}
              </p>
            </>
          )}

          <Image
            src={bismillahImage}
            alt="Bismillah calligraphy"
            width={500}
            height={120}
            className="flex pt-10 h-20 w-80 flex-1 items-center justify-center text-black"
          />
        </Flex>
        <Flex className="flex-col gap-1 items-center">
          <div className="flex flex-col w-[1000px] h-fit divide-y divide-gray-400">
            {!verses && loading && (
              <div className="flex-col w-full h-fit py-8">
                <Skeleton height="96px" width="100%" />
                <Skeleton height="28px" width="100%" className="mt-8" />
                <Skeleton height="28px" width="100%" className="mt-2" />
              </div>
            )}
            {verses &&
              Object.entries(verses).map(([key, value], index) => {
                const latin = value.words.map((w) => w.transliteration.text).join(' ');
                return (
                  <div key={key} className="flex-col w-full h-fit py-8">
                    {index !== 0 && value.verse_number === 1 && (
                      <Flex className="flex-col gap-1 items-center text-center">
                        <h1 className="text-4xl font-bold font-lpmqFont">
                          {chapters[value.chapter_id].name_arabic}
                        </h1>
                        <h2 className="text-xl font-bold">
                          {chapters[value.chapter_id].name_simple}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {chapters[value.chapter_id].revelation_place &&
                            capitalizeWords(chapters[value.chapter_id].revelation_place)}
                        </p>
                        <Image
                          src={bismillahImage}
                          alt="Bismillah calligraphy"
                          width={500}
                          height={120}
                          className="flex pt-10 h-20 w-80 flex-1 items-center justify-center text-black"
                        />
                      </Flex>
                    )}
                    <p className="font-bold text-4xl text-end font-lpmqFont leading-24">
                      {value.text_uthmani}{' '}
                      <span className="text-yellow-700">
                        {fmtArabic.format(value.verse_number)}
                      </span>
                    </p>
                    <p className="font-light text-lg mt-8 text-yellow-800">
                      {capitalizeFirst(latin)}
                    </p>
                    <p className="font-light text-lg mt-2">
                      {capitalizeFirst(value.translations[0].text)}
                    </p>
                  </div>
                );
              })}
          </div>

          {/* Loading indicator */}
          {verses && loading && (
            <div className="flex justify-center py-4">
              <Spinner size="3" />
            </div>
          )}

          <div ref={sentinelRef} style={{ height: 1 }} />
        </Flex>
      </Flex>
    </>
  );
}
