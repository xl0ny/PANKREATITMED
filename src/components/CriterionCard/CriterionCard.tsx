import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import type { Criterion } from "../../types/criterion";
import { mockCriteria } from "../../mocks/criteria";
import noImage from "../../assets/no-image.svg";
import "./CriterionCard.css";

const defaultImage = noImage;

const CriterionCard: React.FC<{ criterion: Criterion }> = ({ criterion }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    navigate(`/criteria/${criterion.id}`);
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
          src={
            imageError
              ? (mockCriteria.find((c) => c.id === criterion.id)?.image_url || defaultImage)
              : criterion.image_url || defaultImage
          }
          alt={criterion.name}
          className="criterion-card__img"
          onError={() => {
            setImageError(true);
          }}
        />
      </div>

        <div className="criterion-card__ref text-danger mt-2">
        {criterion.ref_high !== 0 && criterion.ref_high != null
          ? `> ${criterion.ref_high} ${criterion.unit}`
          : criterion.ref_low !== 0 && criterion.ref_low != null
          ? `< ${criterion.ref_low} ${criterion.unit}`
          : ""}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CriterionCard;