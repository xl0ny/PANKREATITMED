import { useEffect, useState } from "react";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import CriterionCard from "../../components/CriterionCard/CriterionCard";
import CriteriaFilters from "../../components/CriteriaFilters/CriteriaFilters";
import { getCriteria } from "../../api/criteria";
import type { Criterion } from "../../types/criterion";

const CriteriaPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Criterion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getCriteria({ query });
        console.log("✅ [CriteriaPage] Data received in component:", data);
        setItems(data);
      } catch (e: any) {
        setError(e?.message || "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <div className="container">
      <h2 className="mb-3">Критерии</h2>
      <CriteriaFilters query={query} setQuery={setQuery} />
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !items.length && <div>Ничего не найдено</div>}

      <Row className="g-4">
        {items.map((criterion) => (
          <Col key={criterion.id} xs={12} sm={6} md={4} lg={3}>
            <CriterionCard criterion={criterion} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CriteriaPage;