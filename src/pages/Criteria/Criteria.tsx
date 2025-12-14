import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import CriterionCard from "../../components/CriterionCard/CriterionCard";
import CriteriaFilters from "../../components/CriteriaFilters/CriteriaFilters";
import CartButton from "../../components/CartButton/CartButton";
import { apiClient } from "../../api/apiClient";
import type { Criterion } from "../../types/criterion";
import type { PankreatitmedInternalAppDtoResponseSendCriterion } from "../../api/Api";
import { selectQuery } from "../../store/slices/filterSlice";
import { mockCriteria } from "../../mocks/criteria";
import "./Criteria.css";

/**
 * Преобразует ответ API в формат Criterion
 */
function mapApiCriterionToCriterion(apiCriterion: PankreatitmedInternalAppDtoResponseSendCriterion): Criterion {
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

/**
 * Страница со списком критериев
 * 
 * Использует Redux для хранения состояния фильтра (query), что позволяет
 * сохранять значение поискового запроса при переключении страниц и при
 * входе в PWA. Фильтрация выполняется локально через useMemo для оптимизации.
 */
const CriteriaPage: React.FC = () => {
  // Получаем поисковый запрос из Redux store
  // Состояние сохраняется при переключении страниц благодаря глобальному store
  const query = useSelector(selectQuery);

  // Локальное состояние для данных, загруженных с API
  const [allItems, setAllItems] = useState<Criterion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  // 🟩 Загружаем критерии только один раз при монтировании
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Запрос к реальному API через сгенерированный клиент
        const response = await apiClient.criteriaList(
          {},
          {
            secure: false, // Список критериев доступен без авторизации
          }
        );

        const data = response.data;
        console.log("✅ [CriteriaPage] Raw backend response:", data);

        // API возвращает объект с полем items или массив
        let items: PankreatitmedInternalAppDtoResponseSendCriterion[] = [];
        if (Array.isArray(data)) {
          items = data;
        } else if (data && typeof data === "object" && (data as any).items) {
          items = (data as any).items;
        } else if (data && typeof data === "object" && (data as any).criteria) {
          // Если структура ответа содержит criteria
          items = (data as any).criteria;
        }

        if (Array.isArray(items) && items.length > 0) {
          const normalized = items.map(mapApiCriterionToCriterion);
          console.log("✅ [CriteriaPage] Data received on mount:", normalized);
          setAllItems(normalized);
        } else {
          throw new Error("Некорректный формат ответа от API /api/criteria");
        }
      } catch (e: any) {
        console.warn("Ошибка загрузки критериев, используем mock данные:", e);
        // Если бэк не доступен — fallback на mock
        setAllItems(mockCriteria);
        setError(undefined);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // ← только при первом монтировании

  // 🟦 Фильтрация через useMemo для оптимизации производительности
  // Вычисляется только при изменении query или allItems
  // Использует query из Redux store, поэтому состояние сохраняется при навигации
  const filteredItems = useMemo(() => {
    // Если запрос пустой, возвращаем все элементы
    if (!query.trim()) {
      return allItems;
    }

    // Фильтруем по названию и описанию (регистронезависимый поиск)
    const q = query.toLowerCase();
    return allItems.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }, [query, allItems]);

  return (
    <div className="criteria-page container">
      <h2 className="criteria-page__title mb-3">Критерии</h2>
      {/* CriteriaFilters теперь использует Redux напрямую, props не нужны */}
      <CriteriaFilters />

      {loading && (
        <div className="criteria-status text-center mt-4">
          <Spinner animation="border" />
        </div>
      )}

      {error && (
        <Alert className="mt-3" variant="danger">
          {error}
        </Alert>
      )}

      {!loading && !filteredItems.length && (
        <div className="criteria-status text-center mt-4">
          Ничего не найдено
        </div>
      )}

      {/* Количество карточек для демонстрации на ЛР6: 1 (xs) → 2 (md ≥768px) → 3 (lg ≥992px) → 4 (xl ≥1200px) */}
      <Row className="criteria-grid g-4 mt-2">
        {filteredItems.map((criterion) => (
          <Col key={criterion.id} xs={12} sm={12} md={6} lg={4} xl={3}>
            <CriterionCard criterion={criterion} />
          </Col>
        ))}
      </Row>

      {/* Кнопка корзины — фиксирована снизу слева */}
      <CartButton />
    </div>
  );
};

export default CriteriaPage;