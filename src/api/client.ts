export async function httpGet<T>(url: string, { timeoutMs = 4000 } = {}): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json() as T;
  } finally {
    clearTimeout(t);
  }
}