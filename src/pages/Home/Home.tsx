import { Carousel, Container } from "react-bootstrap";
import diagnostiqueImg from "../../assets/carousel/Diagnostique.webp";
import criteriaImg from "../../assets/carousel/Criteria.jpg";
import analysisImg from "../../assets/carousel/Analysis.jpg";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <Container className="home-page text-center mt-4">
      <h1 className="home-title">Добро пожаловать в PankreatitMed</h1>
      <p className="home-subtitle">
        Система оценки риска панкреатита по критериям Ranson
      </p>

      <Carousel className="home-carousel mt-4">
        <Carousel.Item>
          <img
            className="d-block w-100 rounded"
            src={diagnostiqueImg}
            alt="Диагностика"
          />
          <Carousel.Caption>
            <h5>Точная диагностика</h5>
            <p>Система оценки тяжести панкреатита по 11 критериям</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100 rounded"
            src={criteriaImg}
            alt="Критерии"
          />
          <Carousel.Caption>
            <h5>Простая визуализация</h5>
            <p>Просматривайте и анализируйте критерии в удобной форме</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100 rounded"
            src={analysisImg}
            alt="Анализ"
          />
          <Carousel.Caption>
            <h5>Мгновенные результаты</h5>
            <p>Получайте оценку состояния пациента в пару кликов</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </Container>
  );
};

export default Home;