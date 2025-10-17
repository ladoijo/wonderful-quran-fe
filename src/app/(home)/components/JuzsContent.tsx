'use client';

import { Badge, Box, Card, Flex, Text } from '@radix-ui/themes';
import Link from 'next/link';
import { useMemo } from 'react';
import { useQuranContext } from '@/contexts/QuranProvider';
import type { Juz } from '@/types/quran';
import JuzTooltip from './JuzTooltip';

export default function JuzsContent() {
  const { chapters, juzs } = useQuranContext();

  const uniqueJuzs = useMemo(() => {
    const seen = new Set<number>();
    return juzs.filter((juz) => {
      if (seen.has(juz.juz_number)) return false;
      seen.add(juz.juz_number);
      return true;
    });
  }, [juzs]);

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {uniqueJuzs?.map((juz: Juz) => {
        const chapterNames = Object.keys(juz.verse_mapping)
          .map((chapterId) => chapters[Number(chapterId)].name_simple)
          .join(', ')
          .toString();

        return (
          <Box key={juz.id} minWidth="350px" maxWidth="350px" height="70px">
            <Link href={`/juzs/${juz.juz_number}/verses`} className="block h-full">
              <Card className="h-full group hover:bg-emerald-200 transition-colors hover:cursor-pointer">
                <Flex gap="3" align="center" height="100%">
                  <Text
                    as="span"
                    size="3"
                    color="gray"
                    weight="bold"
                    className="group-hover:bg-emerald-200 transition-colors rounded-full bg-gray-200 p-2 w-12 aspect-square flex items-center justify-center"
                  >
                    {juz.juz_number}
                  </Text>
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
    </div>
  );
}
