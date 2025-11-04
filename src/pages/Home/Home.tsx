import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Container className="text-center mt-5 pt-5">
        <h1 className="home-title">Добро пожаловать в PankreatitMed</h1>
        <p className="home-description mt-3">
          Это система оценки риска панкреатита по критериям Ranson. 
          Здесь вы можете просматривать медицинские критерии, формировать заявки и анализировать результаты.
        </p>
        <Button
          variant="primary"
          size="lg"
          className="mt-4"
          onClick={() => navigate("/criteria")}
        >
          Перейти к критериям
        </Button>
      </Container>
    </div>
  );
};

export default Home;