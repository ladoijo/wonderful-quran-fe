'use client';

import { Box, Card, Flex, Text } from '@radix-ui/themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuranContext } from '@/contexts/QuranProvider';
import { capitalizeWords } from '@/utils/formatter';

export default function ChaptersContent() {
  const { chapters } = useQuranContext();
  const router = useRouter();

  function prefetchChapter(chapterId: number) {
    router.prefetch(`/chapters/${chapterId}/verses`);
  }

  // useEffect(() => {
  //   if (!chapters || Object.keys(chapters).length === 0) return;
  //   const chapterEntries = Object.values(chapters)
  //     .sort((a, b) => a.id - b.id)
  //     .slice(0, 6);

  //   for (const chapter of chapterEntries) {
  //     prefetchChapter(chapter.id);
  //   }
  // }, [chapters, router]);

  return (
    <main>
      <section aria-label="chapters-content" className="flex flex-wrap gap-4 justify-center">
        {Object.values(chapters).map((value) => (
          <Box key={value.id} className="w-80 sm:w-96 h-[70px]">
            <Link
              href={`/chapters/${value.id}/verses`}
              className="block h-full"
              prefetch
              onMouseEnter={() => prefetchChapter(value.id)}
            >
              <Card className="h-full group hover:bg-emerald-200 transition-colors hover:cursor-pointer">
                <Flex gap="3" align="center" height="100%">
                  <Box className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-200 transition-colors group-hover:bg-emerald-200">
                    <Text
                      as="span"
                      size="3"
                      color="gray"
                      weight="bold"
                      className="group-hover:bg-emerald-200 transition-colors rounded-full bg-gray-200 p-2 flex items-center justify-center"
                    >
                      {value.id}
                    </Text>
                  </Box>
                  <Box>
                    <Text as="div" size="2" weight="bold">
                      {value.name_simple}
                    </Text>
                    <Text as="div" size="1" color="gray">
                      {value.translated_name.name}
                    </Text>
                  </Box>
                  <Box className="ml-auto text-right">
                    <Text as="div" size="2" weight="bold">
                      {value.name_arabic}
                    </Text>
                    <Text as="div" size="1" color="gray">
                      {value.verses_count} Ayat -{' '}
                      {` ${value.revelation_place && capitalizeWords(value.revelation_place)}`}
                    </Text>
                  </Box>
                </Flex>
              </Card>
            </Link>
          </Box>
        ))}
      </section>
    </main>
  );
}
