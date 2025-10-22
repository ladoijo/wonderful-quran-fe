import type { Metadata } from 'next';
import ViewVerses from '@/components/ViewVerses';
import { getChaptersCached, getVersesByChapterIdCached } from '@/utils/apiClient';

interface PageProps {
  params: { chapterId: string };
}

export async function generateMetadata({
  params
}: {
  params: { chapterId: string };
}): Promise<Metadata> {
  const { chapterId } = await params;
  const chapterIdNum: number = Number(chapterId);
  const chapters = await getChaptersCached();
  const chapter = chapters[chapterIdNum];

  return {
    title: `Chapter ${chapterId}: ${chapter.name_simple}`,
    description: `Explore verses of Chapter ${chapter.name_simple}`,
    alternates: {
      canonical: `/chapters/${chapterId}/verses`
    },
    openGraph: {
      title: `Chapter ${chapterId}: ${chapter.name_simple}`,
      description: `Explore verses of Chapter ${chapter.name_simple}`,
      url: `/chapters/${chapterId}/verses`
    }
  };
}

export default async function ChapterVersesPage({ params }: PageProps) {
  const { chapterId } = await params;
  if (Number.isNaN(chapterId)) throw new TypeError('Invalid chapter id');

  const chapterIdNum = Number(chapterId);
  const res = await getVersesByChapterIdCached({ chapterId: chapterIdNum, page: 1 });
  const firstVersePage = res.verses;

  return (
    <ViewVerses
      versesBy="chapter"
      firstVersePage={firstVersePage}
      initialCategoryId={chapterIdNum}
      initialPagination={res.pagination}
    />
  );
}
