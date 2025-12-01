import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Form, Button, Alert, Card, Container } from "react-bootstrap";
import { loginAsync, fetchUserAsync, selectAuthLoading, selectAuthError, selectIsAuthenticated } from "../../store/slices/authSlice";
import "./Login.css";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  // Редирект, если уже авторизован
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!login.trim() || !password.trim()) {
      return;
    }

    const result = await dispatch(loginAsync({ login: login.trim(), password }) as any);
    
    if (loginAsync.fulfilled.match(result)) {
      // Загружаем информацию о пользователе после успешного входа
      await dispatch(fetchUserAsync() as any);
      // Успешный вход - редирект произойдет через useEffect
      const from = (location.state as any)?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  };

  return (
    <Container className="login-page">
      <div className="login-container">
        <Card className="login-card">
          <Card.Body>
            <Card.Title className="text-center mb-4">Вход в систему</Card.Title>

            {error && (
              <Alert variant="danger" dismissible onClose={() => {}}>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formLogin">
                <Form.Label>Логин</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Введите логин"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  disabled={loading}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Пароль</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 mb-3"
                disabled={loading || !login.trim() || !password.trim()}
              >
                {loading ? "Вход..." : "Войти"}
              </Button>
            </Form>

            <div className="text-center">
              <Link to="/register">Нет аккаунта? Зарегистрироваться</Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Login;
