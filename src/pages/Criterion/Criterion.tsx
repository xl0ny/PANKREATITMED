import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner, Alert, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../store/slices/authSlice";
import { addToCartAsync } from "../../store/slices/cartSlice";
import { apiClient } from "../../api/apiClient";
import type { Criterion } from "../../types/criterion";
import type { PankreatitmedInternalAppDtoResponseSendCriterion } from "../../api/Api";
import { mockCriteria } from "../../mocks/criteria";
import noImage from "../../assets/no-image.svg";
import "./Criterion.css";

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

const defaultImage = noImage;

const CriterionPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [criterion, setCriterion] = useState<Criterion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchCriterion = async () => {
      if (!id) return;
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

        const normalized = mapApiCriterionToCriterion(data);
        setCriterion(normalized);
      } catch (error) {
        console.warn("Ошибка загрузки критерия, используем mock данные:", error);
        // Если сервер не доступен — fallback на mock
        const mock = mockCriteria.find((c) => String(c.id) === id);
        if (mock) {
          setCriterion(mock);
        } else {
          setError("Критерий не найден");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCriterion();
  }, [id]);

  const handleAddToCart = async () => {
    if (!criterion) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setAdding(true);
    try {
      await dispatch(addToCartAsync(criterion.id) as any);
    } catch (error) {
      console.error("Ошибка добавления в заключение:", error);
    } finally {
      setAdding(false);
    }
  };

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

          {isAuthenticated && (
            <Button
              variant="primary"
              className="mt-3"
              onClick={handleAddToCart}
              disabled={adding}
            >
              {adding ? "Добавление..." : "Добавить в заключение"}
            </Button>
          )}
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