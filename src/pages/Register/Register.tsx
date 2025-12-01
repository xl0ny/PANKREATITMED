import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Alert, Card, Container } from "react-bootstrap";
import { registerAsync, fetchUserAsync, selectAuthLoading, selectAuthError, selectIsAuthenticated } from "../../store/slices/authSlice";
import "./Register.css";

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  // Редирект, если уже авторизован
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!login.trim() || !password.trim() || !confirmPassword.trim()) {
      setValidationError("Все поля обязательны для заполнения");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setValidationError("Пароль должен быть не менее 6 символов");
      return;
    }

    const result = await dispatch(registerAsync({ login: login.trim(), password }) as any);
    
    if (registerAsync.fulfilled.match(result)) {
      // Загружаем информацию о пользователе после успешной регистрации
      await dispatch(fetchUserAsync() as any);
      // Успешная регистрация - редирект произойдет через useEffect
      navigate("/", { replace: true });
    }
  };

  return (
    <Container className="register-page">
      <div className="register-container">
        <Card className="register-card">
          <Card.Body>
            <Card.Title className="text-center mb-4">Регистрация</Card.Title>

            {(error || validationError) && (
              <Alert variant="danger" dismissible onClose={() => {}}>
                {error || validationError}
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
                  minLength={6}
                />
                <Form.Text className="text-muted">
                  Минимум 6 символов
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label>Подтвердите пароль</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Повторите пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                  minLength={6}
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 mb-3"
                disabled={loading || !login.trim() || !password.trim() || !confirmPassword.trim()}
              >
                {loading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </Form>

            <div className="text-center">
              <Link to="/login">Уже есть аккаунт? Войти</Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Register;
