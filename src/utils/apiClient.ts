import { unstable_cache } from 'next/cache';
import {
  API_CHAPTER,
  API_CHAPTERS,
  API_JUZS,
  API_VERSES_BY_CHAPTER_ID,
  API_VERSES_BY_JUZ_NUMBER
} from '@/constants/endpoint';
import type {
  Chapter,
  ChapterResp,
  ChaptersResp,
  Juz,
  JuzsResp,
  Verse,
  VersesResp
} from '@/types/quran';
import { api } from './api';

export async function getChapters() {
  const res = await api<ChaptersResp>(API_CHAPTERS, { queryParams: { language: 'en' } });

  return res.chapters.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<number, Chapter>
  );
}

export const getChaptersCached = unstable_cache(async () => getChapters(), ['chapters:en'], {
  revalidate: 3600
});

export const getChapter = async (chapterId: number) => {
  const { chapter } = await api<ChapterResp>(API_CHAPTER, {
    urlParams: { chapterId },
    queryParams: { language: 'en' }
  });
  return chapter;
};

export const getChapterCached = unstable_cache(
  async (chapterId: number) => getChapter(chapterId),
  ['chapters:en'],
  {
    revalidate: 3600
  }
);

export async function getJuzs() {
  const res = await api<JuzsResp>(API_JUZS, { queryParams: { language: 'en' } });
  const seen = new Set<number>();
  return res.juzs
    .filter((juz) => {
      if (seen.has(juz.juz_number)) return false;
      seen.add(juz.juz_number);
      return true;
    })
    .reduce(
      (acc, item) => {
        acc[item.juz_number] = item;
        return acc;
      },
      {} as Record<number, Juz>
    );
}

export const getJuzsCached = unstable_cache(async () => getJuzs(), ['juzs:en'], {
  revalidate: 3600
});

export async function getVersesByChapterId({
  chapterId,
  page
}: {
  chapterId: number;
  page: number;
}): Promise<GetVerses> {
  const arrVerses = await api<VersesResp>(API_VERSES_BY_CHAPTER_ID, {
    urlParams: { chapterId },
    queryParams: {
      language: 'en',
      words: true,
      translations: 85,
      audio: 1,
      word_fields:
        'verse_id,chapter_id,text_uthmani,text_indopak,text_imlaei_simple,text_imlaei,text_uthmani_simple,text_uthmani_tajweed,text_qpc_hafs,verse_key,location,code_v1,code_v2,v1_page,v2_page,line_number,line_v2,line_v1',
      translation_fields:
        'chapter_id,verse_number,verse_key,juz_number,hizb_number,rub_el_hizb_number,page_number,ruku_number,manzil_number,resource_name,language_name,language_id,id',
      fields:
        'chapter_id,text_indopak,text_imlaei_simple,text_imlaei,text_uthmani,text_uthmani_simple,text_uthmani_tajweed,text_qpc_hafs,qpc_uthmani_hafs,text_qpc_nastaleeq_hafs,text_qpc_nastaleeq,text_indopak_nastaleeq,image_url,image_width,code_v1,code_v2,page_number,v1_page,v2_page',
      page,
      per_page: 10
    }
  });

  const objVerses = arrVerses.verses.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<number, Verse>
  );

  return { verses: objVerses, pagination: arrVerses.pagination };
}

export const getVersesByChapterIdCached = unstable_cache(
  async ({ chapterId, page }: { chapterId: number; page: number }) =>
    getVersesByChapterId({ chapterId, page }),
  ['chapters:verses:en'],
  {
    revalidate: 3600
  }
);

export type GetVerses = {
  verses: Record<number, Verse>;
  pagination: VersesResp['pagination'];
};

export async function getVersesByJuzNumber({
  juzNumber,
  page
}: {
  juzNumber: number;
  page: number;
}): Promise<GetVerses> {
  const arrVerses = await api<VersesResp>(API_VERSES_BY_JUZ_NUMBER, {
    urlParams: { juzNumber },
    queryParams: {
      language: 'en',
      words: true,
      translations: 85,
      audio: 1,
      word_fields:
        'verse_id,chapter_id,text_uthmani,text_indopak,text_imlaei_simple,text_imlaei,text_uthmani_simple,text_uthmani_tajweed,text_qpc_hafs,verse_key,location,code_v1,code_v2,v1_page,v2_page,line_number,line_v2,line_v1',
      translation_fields:
        'chapter_id,verse_number,verse_key,juz_number,hizb_number,rub_el_hizb_number,page_number,ruku_number,manzil_number,resource_name,language_name,language_id,id',
      fields:
        'chapter_id,text_indopak,text_imlaei_simple,text_imlaei,text_uthmani,text_uthmani_simple,text_uthmani_tajweed,text_qpc_hafs,qpc_uthmani_hafs,text_qpc_nastaleeq_hafs,text_qpc_nastaleeq,text_indopak_nastaleeq,image_url,image_width,code_v1,code_v2,page_number,v1_page,v2_page',
      page,
      per_page: 10
    }
  });

  const objVerses = arrVerses.verses.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<number, Verse>
  );

  return { verses: objVerses, pagination: arrVerses.pagination };
}

export const getVersesByJuzNumberCached = unstable_cache(
  async ({ juzNumber, page }: { juzNumber: number; page: number }) =>
    getVersesByJuzNumber({ juzNumber, page }),
  ['juzs:verses:en'],
  {
    revalidate: 3600
  }
);
