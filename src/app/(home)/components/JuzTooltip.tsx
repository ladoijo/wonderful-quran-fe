import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Flex, HoverCard, Text } from '@radix-ui/themes';
import type { Chapter } from '@/types/quran';

type JuzTooltipProps = {
  verseMapping: Record<string, string>;
  chapters: {
    [key: number]: Chapter;
  };
};

export default function JuzTooltip({ verseMapping, chapters }: JuzTooltipProps) {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <InfoCircledIcon width="20px" height="20px" color="gray" />
      </HoverCard.Trigger>
      <HoverCard.Content maxWidth="300px">
        <Flex direction="column">
          {verseMapping &&
            Object.entries(verseMapping).map(([chapterId, verse]) => (
              <Flex direction="row" align="center" justify="between" key={chapterId} gap="4">
                <Text as="span" size="2" weight="bold">
                  {chapters[Number(chapterId)].name_simple}
                </Text>
                <Text as="span" size="2" weight="bold">
                  {verse}
                </Text>
              </Flex>
            ))}
        </Flex>
      </HoverCard.Content>
    </HoverCard.Root>
  );
}
