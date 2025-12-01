import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../store/slices/authSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Компонент для защиты маршрутов
 * Редиректит на страницу входа, если пользователь не авторизован
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Сохраняем путь, куда пользователь хотел попасть, для редиректа после входа
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
