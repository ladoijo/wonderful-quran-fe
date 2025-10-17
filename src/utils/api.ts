import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { API_BASE_PATH, API_BASE_URL, API_PORT } from './env';

function buildBaseURL(): string {
  const url = new URL(API_BASE_URL);

  if (API_PORT) {
    url.port = String(API_PORT);
  }

  return url.toString().replace(/\/$/, '');
}

function normalizeBasePath(path: string): string {
  if (!path) return '';
  const trimmed = path.trim();
  if (!trimmed || trimmed === '/') return '';
  const leading = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return leading.replace(/\/$/, '');
}

const baseURL = buildBaseURL();
const basePath = normalizeBasePath(API_BASE_PATH);

export const apiClient = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
});

type APIErrorPayload = {
  message?: string;
  [key: string]: unknown;
};

type EnrichedAPIError = Error & {
  status?: number;
  data?: APIErrorPayload;
};

apiClient.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    const status = err.response?.status;
    const statusText = err.response?.statusText;
    const rawData = err.response?.data;
    const data: APIErrorPayload =
      typeof rawData === 'object' && rawData !== null
        ? (rawData as APIErrorPayload)
        : { message: rawData ? String(rawData) : undefined };
    const msg = data.message ?? err.message ?? 'Request failed';
    const enrichedError: EnrichedAPIError = new Error(
      `API ${status ?? ''} ${statusText ?? ''} ${msg}`.trim()
    );
    enrichedError.status = status;
    enrichedError.data = data;
    return Promise.reject(enrichedError);
  }
);

export type JSONLike = Record<string, unknown> | Array<unknown>;
export type APIInit = Omit<AxiosRequestConfig, 'url' | 'baseURL' | 'method' | 'data' | 'params'> & {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  urlParams?: Record<string, unknown>;
  queryParams?: Record<string, unknown>;
  body?: unknown;
};

function withBasePath(path: string): string {
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${suffix}` || suffix;
}

function injectUrlParams(path: string, params?: Record<string, unknown>): string {
  if (!params) return path;

  return path.replaceAll(/:(\w+)/g, (_, key) => {
    if (params[key] === undefined || params[key] === null) {
      throw new Error(`Missing url param "${key}" for path "${path}"`);
    }
    return encodeURIComponent(String(params[key]));
  });
}

export async function api<T = JSONLike>(path: string, init?: APIInit): Promise<T> {
  const { method = 'GET', urlParams, queryParams, body, ...rest } = init ?? {};
  const resolvedPath = injectUrlParams(path, urlParams);
  const res = await apiClient.request<T>({
    url: withBasePath(resolvedPath),
    method,
    params: queryParams,
    data: body,
    ...rest
  });
  return res.data;
}
