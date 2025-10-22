'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { Button, Select, Skeleton, Spinner } from '@radix-ui/themes';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useQuranContext } from '@/contexts/QuranProvider';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { Chapter, Juz, Verse } from '@/types/quran';
import { type GetVerses, getVersesByChapterId, getVersesByJuzNumber } from '@/utils/apiClient';
import { capitalizeFirst, capitalizeWords, fmtArabic } from '@/utils/formatter';
import bismillahImage from '~/assets/images/bismillah.svg';

interface PageProps {
  versesBy: 'chapter' | 'juz';
  firstVersePage: Record<number, Verse>;
  initialCategoryId: number;
  initialPagination: GetVerses['pagination'];
}

export default function ViewVerses({
  versesBy,
  firstVersePage,
  initialCategoryId,
  initialPagination
}: Readonly<PageProps>) {
  const router = useRouter();
  const [verses, setVerses] = useState<Record<number, Verse>>(firstVersePage);
  const [currentCategoryId, setCurrentCategoryId] = useState(initialCategoryId);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialPagination?.total_pages ? 1 < initialPagination.total_pages : false
  );
  const { chapters, juzs } = useQuranContext();
  const firstVerse = Object.values(firstVersePage)[0];
  const chapterId = firstVerse?.chapter_id ?? initialCategoryId;
  const chapter = chapters[chapterId];
  let categories: Record<number, Chapter> | Record<number, Juz>;
  let btnPrevText: string;
  let btnNextText: string;
  const baseRoute = versesBy === 'juz' ? '/juzs' : '/chapters';
  if (versesBy === 'juz') {
    categories = juzs;
    btnPrevText = currentCategoryId > 1 ? `Juz ${currentCategoryId - 1}` : '';
    btnNextText = currentCategoryId < 30 ? `Juz ${currentCategoryId + 1}` : '';
  } else {
    categories = chapters;
    const prevChapter = chapters[currentCategoryId - 1];
    const nextChapter = chapters[currentCategoryId + 1];
    btnPrevText = prevChapter ? prevChapter.name_simple : '';
    btnNextText = nextChapter ? nextChapter.name_simple : '';
  }

  useEffect(() => {
    setVerses(firstVersePage);
    setCurrentCategoryId(initialCategoryId);
    setCurrentPage(1);
    setHasMore(initialPagination?.total_pages ? 1 < initialPagination.total_pages : false);
    setCategoryLoading(false);
  }, [firstVersePage, initialCategoryId, initialPagination]);

  const navigateToCategory = useCallback(
    (targetId: number) => {
      if (Number.isNaN(targetId) || targetId === currentCategoryId) return;
      setCategoryLoading(true);
      setCurrentCategoryId(targetId);
      setVerses({});
      router.push(`${baseRoute}/${targetId}/verses`);
    },
    [baseRoute, currentCategoryId, router]
  );

  const handlePrevCategory = useCallback(() => {
    if (!btnPrevText) return;
    const targetId = currentCategoryId - 1;
    if (targetId < 1) return;
    navigateToCategory(targetId);
  }, [btnPrevText, currentCategoryId, navigateToCategory]);

  const handleNextCategory = useCallback(() => {
    if (!btnNextText) return;
    const targetId = currentCategoryId + 1;
    navigateToCategory(targetId);
  }, [btnNextText, currentCategoryId, navigateToCategory]);

  const handleCategoryChange = useCallback(
    (value: string) => {
      const targetId = Number(value);
      if (Number.isNaN(targetId)) return;
      navigateToCategory(targetId);
    },
    [navigateToCategory]
  );

  const loadMoreVerses = useCallback(async () => {
    if (loadMoreLoading || !hasMore) return;
    try {
      setLoadMoreLoading(true);
      const nextPage = currentPage + 1;
      const respVerses =
        versesBy === 'juz'
          ? await getVersesByJuzNumber({ juzNumber: currentCategoryId, page: nextPage })
          : await getVersesByChapterId({ chapterId: currentCategoryId, page: nextPage });
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
      setLoadMoreLoading(false);
    }
  }, [currentPage, currentCategoryId, hasMore, loadMoreLoading, versesBy]);

  const { sentinelRef } = useInfiniteScroll({
    enabled: hasMore && !loadMoreLoading,
    rootMargin: '400px',
    onLoadMore: () => {
      void loadMoreVerses();
    }
  });

  const showChapterSkeleton = categoryLoading || (!verses && loadMoreLoading);

  return (
    <main className="flex flex-col w-[1000px] gap-4 mx-auto">
      <div className="flex items-center gap-3 sticky top-0 z-1 p-4 bg-white shadow rounded-b">
        <Button
          variant="classic"
          color="gold"
          onClick={handlePrevCategory}
          hidden={!btnPrevText}
          className="flex-shrink-0"
        >
          <ChevronLeftIcon /> {btnPrevText}
        </Button>
        <div className="flex-1 min-w-0">
          <Select.Root value={currentCategoryId.toString()} onValueChange={handleCategoryChange}>
            <Select.Trigger className="!w-full" />
            <Select.Content color="gold">
              <Select.Group>
                <Select.Label>{versesBy === 'juz' ? 'Juz' : 'Chapter'}</Select.Label>
                {Object.entries(categories).map(([key, value]) => {
                  return (
                    <Select.Item key={key} value={key}>
                      {versesBy === 'juz'
                        ? `Juz ${value.juz_number ?? key}`
                        : (value as Chapter).name_simple}
                    </Select.Item>
                  );
                })}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        <Button
          variant="classic"
          color="gold"
          onClick={handleNextCategory}
          hidden={!btnNextText}
          className="flex-shrink-0"
        >
          {btnNextText} <ChevronRightIcon />
        </Button>
      </div>
      <section
        aria-labelledby="chapter-heading"
        className="flex flex-col gap-1 items-center text-center w-full"
      >
        {showChapterSkeleton ? (
          <>
            <Skeleton height="40px" width="75px" />
            <Skeleton height="28px" width="100px" />
            <Skeleton height="20px" width="120px" />
          </>
        ) : (
          <>
            <h1 id="chapter-heading" className="text-4xl font-bold font-lpmqFont">
              {chapter?.name_arabic}
            </h1>
            <h2 className="text-xl font-bold">{chapter?.name_simple}</h2>
            <p className="text-sm text-gray-500">
              {chapter?.revelation_place && capitalizeWords(chapter.revelation_place)}
            </p>
            <Image
              src={bismillahImage}
              alt="Arabic calligraphy of Bismillah ar-Rahman ar-Raheem"
              width={500}
              height={120}
              className="flex pt-10 h-20 w-80 flex-1 items-center justify-center text-black"
            />
          </>
        )}
      </section>
      <section aria-label="verses-content" className="flex-col gap-1 items-center w-full">
        <div className="flex flex-col h-fit divide-y divide-gray-400 w-full">
          {showChapterSkeleton && (
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
                    <section
                      aria-labelledby="chapter-heading"
                      className="flex flex-col gap-1 items-center text-center"
                    >
                      <h1 id="chapter-heading" className="text-4xl font-bold font-lpmqFont">
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
                        alt="Arabic calligraphy of Bismillah ar-Rahman ar-Raheem"
                        width={500}
                        height={120}
                        className="flex pt-10 h-20 w-80 flex-1 items-center justify-center text-black"
                      />
                    </section>
                  )}
                  <p className="font-bold text-4xl text-end font-lpmqFont leading-24">
                    {value.text_uthmani}{' '}
                    <span className="text-yellow-700">{fmtArabic.format(value.verse_number)}</span>
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
        {Object.keys(verses).length > 0 && loadMoreLoading && (
          <div className="flex justify-center py-4">
            <Spinner size="3" />
          </div>
        )}

        <div ref={sentinelRef} style={{ height: 1 }} />
      </section>
    </main>
  );
}
