'use client';

import { Box, Card, Flex, Text } from '@radix-ui/themes';
import Link from 'next/link';
import { useQuranContext } from '@/contexts/QuranProvider';
import { capitalizeWords } from '@/utils/formatter';

export default function ChaptersContent() {
  const { chapters } = useQuranContext();
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {Object.values(chapters).map((value) => (
        <Box key={value.id} minWidth="350px" maxWidth="350px" height="70px">
          <Link href={`/chapters/${value.id}/verses`} className="block h-full">
            <Card className="h-full group hover:bg-emerald-200 transition-colors hover:cursor-pointer">
              <Flex gap="3" align="center" height="100%">
                <Text
                  as="span"
                  size="3"
                  color="gray"
                  weight="bold"
                  className="group-hover:bg-emerald-200 transition-colors rounded-full bg-gray-200 p-2 w-10 aspect-square flex items-center justify-center"
                >
                  {value.id}
                </Text>
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
    </div>
  );
}
