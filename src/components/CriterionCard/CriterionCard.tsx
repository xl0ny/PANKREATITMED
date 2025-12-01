import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../store/slices/authSlice";
import { addToCartAsync } from "../../store/slices/cartSlice";
import type { Criterion } from "../../types/criterion";
import noImage from "../../assets/no-image.svg";
import "./CriterionCard.css";

const defaultImage = noImage;

const CriterionCard: React.FC<{ criterion: Criterion }> = ({ criterion }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [adding, setAdding] = useState(false);

  const handleClick = () => {
    navigate(`/criteria/${criterion.id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем клик по карточке

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setAdding(true);
    try {
      await dispatch(addToCartAsync(criterion.id) as any);
    } catch (error) {
      console.error("Ошибка добавления в заявку:", error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card
      className="criterion-card shadow-sm border-0"
      onClick={handleClick}
      role="button"
    >

      <Card.Body className="criterion-card__body">
        <div className="criterion-card__code">{criterion.code}</div>

        <Card.Title className="criterion-card__title">
          {criterion.name}
        </Card.Title>

        <div className="criterion-card__duration">
          {criterion.duration || "1 календарный день"}
        </div>

        {criterion.home_visit && (
          <div className="criterion-card__home">Доступно с выездом на дом</div>
        )}

        <div className="criterion-card__img-wrapper">
        <Card.Img
          variant="top"
          src={criterion.image_url || defaultImage}
          alt={criterion.name}
          className="criterion-card__img"
        />
      </div>

        <div className="criterion-card__ref text-danger mt-2">
        {criterion.ref_high !== 0 && criterion.ref_high != null
          ? `> ${criterion.ref_high} ${criterion.unit}`
          : criterion.ref_low !== 0 && criterion.ref_low != null
          ? `< ${criterion.ref_low} ${criterion.unit}`
          : ""}
        </div>

        {isAuthenticated && (
          <Button
            variant="primary"
            size="sm"
            className="mt-2 w-100"
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? "Добавление..." : "Добавить"}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default CriterionCard;