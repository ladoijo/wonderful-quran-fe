import ViewVerses from '@/components/ViewVerses';
import { getVersesByChapterIdCached } from '@/utils/apiClient';

interface PageProps {
  params: { chapterId: string };
}

export default async function ChapterVersesPage({ params }: PageProps) {
  const { chapterId } = await params;
  if (Number.isNaN(chapterId)) throw new TypeError('Invalid chapter id');

  const chapterIdNum = Number(chapterId);
  const res = await getVersesByChapterIdCached({ chapterId: chapterIdNum, page: 1 });
  const firstVersePage = res.verses;

  const loadMoreVerses = async (page: number) => {
    'use server';
    return getVersesByChapterIdCached({ chapterId: chapterIdNum, page });
  };

  return <ViewVerses firstVersePage={firstVersePage} onLoadMore={loadMoreVerses} />;
}
