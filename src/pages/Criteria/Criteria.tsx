import { useEffect, useState } from "react";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import CriterionCard from "../../components/CriterionCard/CriterionCard";
import CriteriaFilters from "../../components/CriteriaFilters/CriteriaFilters";
import CartButton from "../../components/CartButton/CartButton";
import { getCriteria } from "../../api/criteria";
import type { Criterion } from "../../types/criterion";
import "./Criteria.css";

const CriteriaPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [allItems, setAllItems] = useState<Criterion[]>([]);
  const [filteredItems, setFilteredItems] = useState<Criterion[]>([]);
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
        setFilteredItems(data); // изначально показываем всё
      } catch (e: any) {
        setError(e?.message || "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // ← только при первом монтировании

  // 🟦 Локальная фильтрация по query (без fetch)
  useEffect(() => {
    if (!query.trim()) {
      setFilteredItems(allItems);
      return;
    }

    const q = query.toLowerCase();
    const filtered = allItems.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
    setFilteredItems(filtered);
  }, [query, allItems]);

  return (
    <div className="container">
      <h2 className="mb-3">Критерии</h2>
      <CriteriaFilters query={query} setQuery={setQuery} />

      {loading && (
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      )}

      {error && (
        <Alert className="mt-3" variant="danger">
          {error}
        </Alert>
      )}

      {!loading && !filteredItems.length && (
        <div className="text-center mt-4">Ничего не найдено</div>
      )}

      <Row className="g-4 mt-2">
        {filteredItems.map((criterion) => (
          <Col key={criterion.id} xs={12} sm={6} md={4} lg={3}>
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