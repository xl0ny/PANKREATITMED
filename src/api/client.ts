export async function httpGet<T>(
  url: string,
  {
    timeoutMs = 4000,
    auth = false, // 🔸 новый флаг — нужно ли добавлять JWT
  }: { timeoutMs?: number; auth?: boolean } = {}
): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const headers: Record<string, string> = {};

    if (auth) {
      // const token = localStorage.getItem('token'); // можно заменить на sessionStorage
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIzLCJsb2dpbiI6InByb3N0b0V2Z2VuaXkiLCJpc21vZGVyYXRvciI6ZmFsc2UsImlzcyI6InBhbmtyZWF0aXRtZWQiLCJleHAiOjE3NjI3ODIxNzcsIm5iZiI6MTc2MjY5OTM3NywiaWF0IjoxNzYyNjk5Mzc3fQ.41RqDq5QYQXGbB5-KGyTMfu1D_sN54Z_6HdhSnAiUo4";
      if (token) {
        headers['Authorization'] = `bearer ${token}`;
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