import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import type { Criterion } from "../../types/criterion";
import { getCriterion } from "../../api/criterion";
// import "./Criterion.css";

const defaultImage = "/no-image.png";

const CriterionPage: React.FC = () => {
  const { id } = useParams();
  const [criterion, setCriterion] = useState<Criterion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchCriterion = async () => {
      if (!id) return;
      try {
        const data = await getCriterion(id);
        if (data) setCriterion(data);
        else setError("Критерий не найден");
      } catch {
        setError("Ошибка при загрузке данных критерия");
      } finally {
        setLoading(false);
      }
    };
    fetchCriterion();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error || !criterion) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error || "Критерий не найден"}</Alert>
      </Container>
    );
  }

  return (
    <Container className="criterion-page mt-4">
      <Row className="align-items-start">
        <Col md={7}>
          <h2 className="criterion-title">{criterion.name}</h2>
          <p className="criterion-duration">{criterion.duration}</p>
          {criterion.home_visit && (
            <p className="criterion-home">Доступно с выездом на дом</p>
          )}
          <p className="criterion-description">{criterion.description}</p>

          <div className="criterion-ref">
            Критерий:{" "}
            <span className="criterion-ref-value text-danger">
              &gt; {criterion.ref_high} {criterion.unit}
            </span>
          </div>
        </Col>

        <Col md={5} className="text-center">
          <img
            src={criterion.image_url || defaultImage}
            alt={criterion.name}
            className="criterion-image img-fluid rounded shadow-sm"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CriterionPage;