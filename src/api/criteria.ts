import { httpGet } from "./client";
import { getApiUrl } from "./config";
import type { Criterion } from "../types/criterion";
import { mockCriteria } from "../mocks/criteria";

export type CriteriaQuery = {
  query?: string;
};

export async function getCriteria(q: CriteriaQuery): Promise<Criterion[]> {
  const params = new URLSearchParams();
  if (q.query) params.set("query", q.query);

  const url = getApiUrl(`/api/criteria${params.toString() ? "?" + params.toString() : ""}`);

  try {
    // Запрос к реальному API
    const data = await httpGet<{ items: Criterion[] }>(url);
    console.log("✅ [getCriteria] Raw backend response:", data);

    // Если сервер возвращает объект с полем items — берем его
    if (Array.isArray((data as any).items)) {
      return (data as any).items;
    }

    // Если сервер возвращает сразу массив — просто вернем его
    if (Array.isArray(data)) {
      return data;
    }

    throw new Error("Некорректный формат ответа от API /api/criteria");
  } catch {
    // Если бэк не доступен — fallback на mock
    return mockCriteria.filter((c) =>
      !q.query
        ? true
        : c.name.toLowerCase().includes(q.query.toLowerCase()) ||
          c.description?.toLowerCase().includes(q.query.toLowerCase())
    );
  }
}
