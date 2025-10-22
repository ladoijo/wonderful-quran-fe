import type { Metadata } from 'next';
import ViewVerses from '@/components/ViewVerses';
import { getChaptersCached, getJuzsCached, getVersesByJuzNumberCached } from '@/utils/apiClient';

interface PageProps {
  params: { juzNumber: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { juzNumber } = await params;
  const juzNumberNum = Number(juzNumber);
  const juzs = await getJuzsCached();
  const chapters = await getChaptersCached();
  const juz = juzs[juzNumberNum];
  const firstChapter = Object.keys(juz.verse_mapping)[0];
  const firstChapterName = chapters[Number(firstChapter)];
  let juzChapterName = firstChapterName.name_simple;
  let lastChapterName: string;
  if (Object.keys(juz.verse_mapping).length > 1) {
    const lastChapter = Object.keys(juz.verse_mapping)[Object.keys(juz.verse_mapping).length - 1];
    lastChapterName = chapters[Number(lastChapter)].name_simple;
    juzChapterName += ` - ${lastChapterName}`;
  }

  return {
    title: `Juz ${juzNumberNum}: ${juzChapterName}`,
    description: 'Verses by Juz',
    alternates: {
      canonical: `/juzs/${juzNumberNum}/verses`
    },
    openGraph: {
      title: `Juz ${juzNumberNum}: ${juzChapterName}`,
      description: `Explore verses of Juz ${juzNumberNum}`,
      url: `/juzs/${juzNumberNum}/verses`
    }
  };
}

export default async function JuzVersesPage({ params }: PageProps) {
  const { juzNumber } = await params;
  if (Number.isNaN(juzNumber)) throw new TypeError('Invalid juz number');

  const juzNumberNum = Number(juzNumber);
  const res = await getVersesByJuzNumberCached({ juzNumber: juzNumberNum, page: 1 });
  const firstVersePage = res.verses;

  return (
    <ViewVerses
      versesBy="juz"
      firstVersePage={firstVersePage}
      initialCategoryId={juzNumberNum}
      initialPagination={res.pagination}
    />
  );
}
