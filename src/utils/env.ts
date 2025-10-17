const ENV = process.env.ENV ?? 'prelive';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost';
const API_BASE_PATH = process.env.NEXT_PUBLIC_API_BASE_PATH ?? '/api';
const API_PORT = Number(process.env.NEXT_PUBLIC_API_PORT ?? 3001);
const MADE_BY_URL = process.env.NEXT_PUBLIC_MADE_BY_URL ?? '';

if (!API_BASE_URL) {
  throw new Error('Missing required environment variables: API_BASE_URL in .env');
}

const isProd = ENV === 'production';
const LOG_LEVEL = process.env.LOG_LEVEL ?? 'info';

export { ENV, API_BASE_URL, API_BASE_PATH, API_PORT, isProd, LOG_LEVEL, MADE_BY_URL };
