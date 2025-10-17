'use client';
import { useEffect, useRef } from 'react';

type Opts = {
  enabled?: boolean; // turn off when no more data
  rootMargin?: string; // prefetch earlier, e.g. "400px"
  onLoadMore: () => void; // call your fetcher
};

export function useInfiniteScroll({ enabled = true, rootMargin = '300px', onLoadMore }: Opts) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false); // guard against double fires

  useEffect(() => {
    if (!enabled) return;
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      async (entries) => {
        const first = entries[0];
        if (!first.isIntersecting || loadingRef.current) return;
        loadingRef.current = true;
        try {
          onLoadMore();
        } finally {
          // tiny delay avoids rapid re-triggering on long lists
          setTimeout(() => {
            loadingRef.current = false;
          }, 50);
        }
      },
      { root: null, rootMargin, threshold: 0 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [enabled, rootMargin, onLoadMore]);

  return { sentinelRef };
}
