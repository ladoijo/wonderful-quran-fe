# Wonderful Quran (Frontend)

A Next.js application that brings the Quran to the web with fast navigation, verse exploration, and a clean study interface. It fetches content from the Wonderful Quran backend and delivers a modern, accessible reading experience.

## Features

- Browse Quran by chapter or juz with instant category switching
- Infinite scrolling for verses, complete with skeleton placeholders and spinners
- Bookmark controls ready for future enhancements
- Context-driven state so chapters/juz data hydrate once and stay in sync
- Radix UI themeing, Next.js fonts, and custom LPMQ typography for Arabic script
- Server-side caching via `unstable_cache` plus client fallbacks to keep pages resilient
- SEO-friendly metadata, structured data hooks, and semantic markup

## Tech Stack

- [Next.js 14 App Router](https://nextjs.org/docs) with TypeScript
- [Radix UI Themes](https://www.radix-ui.com/themes) and icons
- [Tailwind CSS](https://tailwindcss.com/) utilities via custom classes
- Axios-based API client with configured base URL/path/ports
- Biome for linting/formatting
- Local fonts (`next/font/local`) and Google fonts (`next/font/google`)

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm, pnpm, or bun (examples below use npm)
- Running instance of the Wonderful Quran backend API, or access to an environment URL

### Installation

```bash
git clone https://github.com/<your-org>/wonderful-quran-fe.git
cd wonderful-quran-fe
npm install
