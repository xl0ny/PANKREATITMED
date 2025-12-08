import { apiClient } from "./apiClient";
import type { Criterion } from "../types/criterion";
import { mockCriteria } from "../mocks/criteria";

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

// Получить один критерий по ID
export async function getCriterion(id: string): Promise<Criterion | null> {
  try {
    const response = await apiClient.id.criteriaDetail(
      { id: parseInt(id) },
      {
        secure: false, // Детали критерия доступны без авторизации
      }
    );

    const data = response.data;
    if (!data) {
      throw new Error("Критерий не найден");
    }

    return mapApiCriterionToCriterion(data);
  } catch (error) {
    console.warn("Ошибка загрузки критерия, используем mock данные:", error);
    // Если сервер не доступен — fallback на mock
    const mock = mockCriteria.find((c) => String(c.id) === id);
    return mock ?? null;
  }
}
