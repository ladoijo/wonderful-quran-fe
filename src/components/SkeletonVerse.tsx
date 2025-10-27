import { Skeleton } from '@radix-ui/themes';

export default function SkeletonVerse() {
  return (
    <main className="flex flex-col gap-4 mx-auto py-10 px-7">
      <section
        aria-labelledby="chapter-heading"
        className="flex flex-col gap-1 items-center text-center w-full"
      >
        <Skeleton height="40px" width="75px" />
        <Skeleton height="28px" width="100px" />
        <Skeleton height="20px" width="120px" />
        <Skeleton width="500px" height="120px" className="mt-10" />
      </section>
      <section aria-label="verses-content" className="flex-col gap-1 items-center w-full">
        <div className="flex flex-col h-fit divide-y divide-gray-400 w-full">
          <div className="flex-col w-full h-fit py-8">
            <Skeleton height="96px" width="100%" />
            <Skeleton height="28px" width="100%" className="mt-8" />
            <Skeleton height="28px" width="100%" className="mt-2" />
          </div>
          <div className="flex-col w-full h-fit py-8">
            <Skeleton height="96px" width="100%" />
            <Skeleton height="28px" width="100%" className="mt-8" />
            <Skeleton height="28px" width="100%" className="mt-2" />
          </div>
          <div className="flex-col w-full h-fit py-8">
            <Skeleton height="96px" width="100%" />
            <Skeleton height="28px" width="100%" className="mt-8" />
            <Skeleton height="28px" width="100%" className="mt-2" />
          </div>
        </div>
      </section>
    </main>
  );
}
