/**
 * Базовый HTTP клиент для запросов к API
 */
export async function httpGet<T>(
  url: string,
  {
    timeoutMs = 4000,
    auth = false,
  }: { timeoutMs?: number; auth?: boolean } = {}
): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const headers: Record<string, string> = {};

    if (auth) {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `bearer ${token}`;
      }
    }

    const res = await fetch(url, {
      signal: ctrl.signal,
      headers,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}
