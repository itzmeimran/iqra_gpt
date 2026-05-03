/**
 * apiClient.ts
 *
 * Central Axios instance.
 * - Injects the Bearer token on every request.
 * - On 401, silently refreshes the token once and retries.
 * - If refresh fails, fires a global "auth:logout" event so authStore can
 *   react without creating a circular dependency.
 */

import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios';

// ─── Token helpers (keeps apiClient decoupled from Zustand) ──────────────────

const TOKEN_KEY   = 'genai:accessToken';
const REFRESH_KEY = 'genai:refreshToken';

export const tokenStorage = {
  getAccess  : ()            => localStorage.getItem(TOKEN_KEY),
  getRefresh : ()            => localStorage.getItem(REFRESH_KEY),
  set        : (a: string, r: string) => {
    localStorage.setItem(TOKEN_KEY,   a);
    localStorage.setItem(REFRESH_KEY, r);
  },
  clear      : () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// ─── Axios instance ───────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL : import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
  timeout : 30_000,
  headers : { 'Content-Type': 'application/json' },
});

// ─── Request interceptor — attach access token ────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccess();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err),
);

// ─── Response interceptor — silent token refresh on 401 ──────────────────────

type FailedRequest = {
  resolve: (token: string) => void;
  reject : (err: unknown)  => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

function processQueue(error: unknown, token: string | null): void {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (res: AxiosResponse) => res,

  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const refreshToken = tokenStorage.getRefresh();

    if (!refreshToken) {
      tokenStorage.clear();
      window.dispatchEvent(new Event('auth:logout'));
      return Promise.reject(error);
    }

    // Queue subsequent 401 requests while a refresh is in-flight
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      });
    }

    original._retry = true;
    isRefreshing     = true;

    try {
      const { data } = await apiClient.post<{ accessToken: string; refreshToken: string }>(
        '/api/auth/refresh-token',
        { refreshToken },
      );

      tokenStorage.set(data.accessToken, data.refreshToken);
      processQueue(null, data.accessToken);

      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return apiClient(original);

    } catch (refreshError) {
      processQueue(refreshError, null);
      tokenStorage.clear();
      window.dispatchEvent(new Event('auth:logout'));
      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
