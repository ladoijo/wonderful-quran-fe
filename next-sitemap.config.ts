// @ts-check
import type { Chapter, Juz } from '@/types/quran';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_PORT = process.env.NEXT_PUBLIC_API_PORT;
const API_BASE_PATH = process.env.NEXT_PUBLIC_API_BASE_PATH;

let baseUrl = API_URL;
if (API_PORT) {
  baseUrl += `:${API_PORT}`;
}
if (API_BASE_PATH) {
  baseUrl += `${API_BASE_PATH}`;
}

// Helper function to safely fetch and parse JSON
async function fetchJson(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error);
    return { chapters: [], juzs: [] }; // Return empty arrays to prevent build failures
  }
}

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://wonderful-quran.netlify.app',
  generateRobotsTxt: true,
  priority: null,
  exclude: ['/api/*'],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }]
  },
  async additionalPaths() {
    try {
      const [chaptersRes, juzsRes] = await Promise.all([
        fetchJson(`${baseUrl}/chapters?language=en`),
        fetchJson(`${baseUrl}/juzs`)
      ]);

      const chapterUrls = (chaptersRes.chapters || []).map((chapter: Chapter) => ({
        loc: `/chapters/${chapter.id}/verses`,
        changefreq: 'daily',
        priority: 0.7,
        lastmod: new Date().toISOString()
      }));

      const juzUrls = (juzsRes.juzs || []).map((juz: Juz) => ({
        loc: `/juzs/${juz.juz_number}/verses`,
        changefreq: 'daily',
        priority: 0.6,
        lastmod: new Date().toISOString()
      }));

      return [...chapterUrls, ...juzUrls];
    } catch (error) {
      console.error('Error generating sitemap paths:', error);
      return []; // Return empty array to prevent build failure
    }
  }
};
