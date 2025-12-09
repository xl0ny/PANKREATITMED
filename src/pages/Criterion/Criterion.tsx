import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Alert } from "react-bootstrap";
import type { Criterion } from "../../types/criterion";
import { getCriterion } from "../../api/criterion";
import { mockCriteria } from "../../mocks/criteria";
import noImage from "../../assets/no-image.svg";
import "./Criterion.css";

const defaultImage = noImage;

const CriterionPage: React.FC = () => {
  const { id } = useParams();
  const [criterion, setCriterion] = useState<Criterion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchCriterion = async () => {
      if (!id) return;
      try {
        const data = await getCriterion(id);
        if (data) {
          setCriterion(data);
          setImageError(false); // Сбрасываем ошибку изображения при загрузке нового критерия
        } else setError("Критерий не найден");
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
      {/* На десктопе блоки идут в 2 колонки, а @media ≤1024px в CSS стекает их в одну (описание для защиты ЛР6) */}
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
              {criterion.ref_high !== 0 && criterion.ref_high != null
              ? `> ${criterion.ref_high} ${criterion.unit}`
              : criterion.ref_low !== 0 && criterion.ref_low != null
              ? `< ${criterion.ref_low} ${criterion.unit}`
              : ""}
            </span>
          </div>
        </div>

        <div className="criterion-image-wrapper">
          <img
            src={
              imageError
                ? (mockCriteria.find((c) => c.id === criterion.id)?.image_url || defaultImage)
                : criterion.image_url || defaultImage
            }
            alt={criterion.name}
            className="criterion-image"
            onError={() => {
              setImageError(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CriterionPage;