import { Spinner } from "react-bootstrap";
import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

/**
 * Компонент индикатора загрузки
 * Может отображаться как полноэкранный или как inline элемент
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = false, message }) => {
  if (fullScreen) {
    return (
      <div className="loading-spinner-fullscreen">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </Spinner>
        {message && <p className="mt-3">{message}</p>}
      </div>
    );
  }

  return (
    <div className="loading-spinner-inline text-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Загрузка...</span>
      </Spinner>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
