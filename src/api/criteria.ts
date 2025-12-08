import { apiClient } from "./apiClient";
import type { Criterion } from "../types/criterion";
import { mockCriteria } from "../mocks/criteria";

export type CriteriaQuery = {
  query?: string;
};

/**
 * Преобразует ответ API в формат Criterion
 */
function mapApiCriterionToCriterion(apiCriterion: any): Criterion {
  return {
    id: apiCriterion.id || 0,
    code: apiCriterion.code || "",
    name: apiCriterion.name || "",
    description: apiCriterion.description || "",
    duration: apiCriterion.duration || "",
    home_visit: apiCriterion.home_visit ?? false,
    image_url: apiCriterion.image_url || null,
    status: apiCriterion.status || "",
    unit: apiCriterion.unit || "",
    ref_low: apiCriterion.ref_low ?? null,
    ref_high: apiCriterion.ref_high ?? null,
  };
}

export async function getCriteria(q: CriteriaQuery): Promise<Criterion[]> {
  try {
    // Запрос к реальному API через сгенерированный клиент
    const response = await apiClient.criteriaList(
      {
        query: q.query,
      },
      {
        secure: false, // Список критериев доступен без авторизации
      }
    );

    const data = response.data;
    console.log("✅ [getCriteria] Raw backend response:", data);

    // API возвращает объект с полем items или массив
    let items: any[] = [];
    if (Array.isArray(data)) {
      items = data;
    } else if (data && typeof data === "object" && (data as any).items) {
      items = (data as any).items;
    } else if (data && typeof data === "object" && (data as any).criteria) {
      // Если структура ответа содержит criteria
      items = (data as any).criteria;
    }

    if (Array.isArray(items) && items.length > 0) {
      return items.map(mapApiCriterionToCriterion);
    }

    throw new Error("Некорректный формат ответа от API /api/criteria");
  } catch (error) {
    console.warn("Ошибка загрузки критериев, используем mock данные:", error);
    // Если бэк не доступен — fallback на mock
    return mockCriteria.filter((c) =>
      !q.query
        ? true
        : c.name.toLowerCase().includes(q.query.toLowerCase()) ||
          c.description?.toLowerCase().includes(q.query.toLowerCase())
    );
  }
}
