import { Flex, Skeleton, Tabs } from '@radix-ui/themes';
import { Suspense } from 'react';
import ChaptersContent from './components/ChaptersContent';
import JuzsContent from './components/JuzsContent';

export const runtime = 'nodejs'; // important for axios (Node APIs)
export const revalidate = 3600; // optional; main caching is in unstable_cache

export default function HomePage() {
  return (
    <Tabs.Root defaultValue="chapters">
      <Tabs.List>
        <Tabs.Trigger value="chapters">Surah</Tabs.Trigger>
        <Tabs.Trigger value="juz">Juz</Tabs.Trigger>
      </Tabs.List>

      <Flex className="p-7">
        <Tabs.Content value="chapters">
          <Suspense
            fallback={
              <div className="flex flex-wrap gap-4 justify-center">
                {Array.from({ length: 10 }).map((_, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <>
                  <Skeleton key={index} width="350px" height="70px" />
                ))}
              </div>
            }
          >
            <ChaptersContent />
          </Suspense>
        </Tabs.Content>

        <Tabs.Content value="juz">
          <Suspense
            fallback={
              <div className="flex flex-wrap gap-4 justify-center">
                {Array.from({ length: 10 }).map((_, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <>
                  <Skeleton key={index} width="350px" height="70px" />
                ))}
              </div>
            }
          >
            <JuzsContent />
          </Suspense>
        </Tabs.Content>
      </Flex>
    </Tabs.Root>
  );
}
