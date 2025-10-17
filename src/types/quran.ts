export type Chapter = {
  id: number;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
  revelation_place: string;
  translated_name: {
    language_name: string;
    name: string;
  };
};

export type Juz = {
  id: number;
  juz_number: number;
  verse_mapping: Record<string, string>;
  first_verse_id: number;
  last_verse_id: number;
  verses_count: number;
};

export type ChaptersResp = { chapters: Chapter[] };
export type ChapterResp = { chapter: Chapter };
export type JuzsResp = { juzs: Juz[] };

export type Translation = { resource_id?: number; text?: string };

export type Verse = {
  id: number;
  verse_number: number;
  verse_key: string;
  hizb_number: number;
  rub_el_hizb_number: number;
  ruku_number: number;
  manzil_number: number;
  sajdah_number?: number;
  chapter_id: number;
  text_indopak: string;
  text_indopak_nastaleeq: string;
  text_uthmani: string;
  text_uthmani_tajweed: string;
  image_url: string;
  image_width: number;
  code_v2: string;
  page_number: number;
  v2_page: number;
  juz_number: number;
  words: {
    id: number;
    position: number;
    audio_url: string;
    char_type_name: string;
    verse_id: number;
    chapter_id: number;
    text_indopak: string;
    text_imlaei: string;
    verse_key: string;
    location: string;
    code_v2: string;
    v2_page: number;
    line_number: number;
    line_v2: number;
    page_number: number;
    text: string;
    translation: {
      text: string;
      language_name: string;
    };
    transliteration: {
      text: string;
      language_name: string;
    };
  }[];
  translations: {
    id: number;
    resource_id: number;
    text: string;
    chapter_id: number;
    verse_number: number;
    verse_key: string;
    juz_number: number;
    hizb_number: number;
    rub_el_hizb_number: number;
    page_number: number;
    resource_name: string;
    language_name: string;
    language_id: number;
  }[];
};

export type VersesResp = {
  verses: Verse[];
  pagination: { per_page?: number; current_page?: number; total_pages?: number };
};
