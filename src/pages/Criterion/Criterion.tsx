import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import type { Criterion } from "../../types/criterion";
import { getCriterion } from "../../api/criterion";
import "./Criterion.css";

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
      <div className="criterion-loading">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error || !criterion) {
    return (
      <div className="criterion-error">
        <Alert variant="danger">{error || "Критерий не найден"}</Alert>
      </div>
    );
  }

  return (
    <div className="criterion-page">
      <div className="criterion-container">
        <div className="criterion-text">
          <h2 className="criterion-title">{criterion.name}</h2>
          <p className="criterion-duration">{criterion.duration}</p>
          {criterion.home_visit && (
            <p className="criterion-home">Доступно с выездом на дом</p>
          )}
          <p className="criterion-description">{criterion.description}</p>

          <div className="criterion-ref">
            Критерий:{" "}
            <span className="criterion-ref-value">
              &gt; {criterion.ref_high} {criterion.unit}
            </span>
          </div>
        </div>

        <div className="criterion-image-wrapper">
          <img
            src={criterion.image_url || defaultImage}
            alt={criterion.name}
            className="criterion-image"
          />
        </div>
      </div>
    </div>
  );
};

export default CriterionPage;