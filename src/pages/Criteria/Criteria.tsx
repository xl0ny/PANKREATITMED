import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import CriterionCard from "../../components/CriterionCard/CriterionCard";
import CriteriaFilters from "../../components/CriteriaFilters/CriteriaFilters";
import CartButton from "../../components/CartButton/CartButton";
import { getCriteria } from "../../api/criteria";
import type { Criterion } from "../../types/criterion";
import { selectQuery } from "../../store/slices/filterSlice";
import "./Criteria.css";

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
        const data = await getCriteria({}); // без query — грузим всё
        console.log("✅ [CriteriaPage] Data received on mount:", data);
        setAllItems(data);
      } catch (e: any) {
        setError(e?.message || "Ошибка загрузки");
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