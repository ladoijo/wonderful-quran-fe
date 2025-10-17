import ViewVerses from '@/components/ViewVerses';
import { getVersesByJuzNumberCached } from '@/utils/apiClient';

interface PageProps {
  params: { juzNumber: string };
}

export default async function JuzVersesPage({ params }: PageProps) {
  const { juzNumber } = await params;
  if (Number.isNaN(juzNumber)) throw new TypeError('Invalid juz number');

  const juzNumberNum = Number(juzNumber);
  const res = await getVersesByJuzNumberCached({ juzNumber: juzNumberNum, page: 1 });
  const firstVersePage = res.verses;

  const loadMoreVerses = async (page: number) => {
    'use server';
    return await getVersesByJuzNumberCached({ juzNumber: juzNumberNum, page });
  };

  return <ViewVerses firstVersePage={firstVersePage} onLoadMore={loadMoreVerses} />;
}
