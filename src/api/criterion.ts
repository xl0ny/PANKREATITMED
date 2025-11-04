import { httpGet } from "./client";
import type { Criterion } from "../types/criterion";
import { mockCriteria } from "../mocks/criteria";

// Получить один критерий по ID
export async function getCriterion(id: string): Promise<Criterion | null> {
  try {
    const data = await httpGet<Criterion>(`/api/criteria/${id}`);
    return data;
  } catch {
    // Если сервер не доступен — fallback на mock
    const mock = mockCriteria.find((c) => String(c.id) === id);
    return mock ?? null;
  }
}