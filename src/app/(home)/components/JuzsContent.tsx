'use client';

import { Badge, Box, Card, Flex, Text } from '@radix-ui/themes';
import Link from 'next/link';
import { useQuranContext } from '@/contexts/QuranProvider';
import type { Juz } from '@/types/quran';
import JuzTooltip from './JuzTooltip';

export default function JuzsContent() {
  const { chapters, juzs } = useQuranContext();

  return (
    <main>
      <section aria-label="juzs-content" className="flex flex-wrap gap-4 justify-center">
        {Object.values(juzs).map((juz: Juz) => {
          const chapterNames = Object.keys(juz.verse_mapping)
            .map((chapterId) => chapters[Number(chapterId)].name_simple)
            .join(', ')
            .toString();

          return (
            <Box key={juz.id} minWidth="350px" maxWidth="350px" height="70px">
              <Link href={`/juzs/${juz.juz_number}/verses`} className="block h-full">
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
                        {juz.juz_number}
                      </Text>
                    </Box>
                    <Flex direction="column" width="100%" gap="2">
                      <Flex direction="row" align="center" justify="between">
                        <Text as="div" size="2" weight="bold">
                          Juz {juz.juz_number}
                        </Text>
                        <JuzTooltip verseMapping={juz.verse_mapping} chapters={chapters} />
                      </Flex>
                      <Flex direction="row" align="center" justify="between">
                        <Badge color="green">
                          <Text as="div" size="1" truncate className="max-w-[200px]">
                            {chapterNames}
                          </Text>
                        </Badge>
                        <Text as="div" size="1" color="gray">
                          {juz?.verses_count}
                          {juz?.verses_count ? ' Ayat' : ''}
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Box>
          );
        })}
      </section>
    </main>
  );
}
