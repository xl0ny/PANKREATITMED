import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { fetchUserAsync, selectUser, selectAuthLoading, selectAuthError } from "../../store/slices/authSlice";
import "./Profile.css";

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  useEffect(() => {
    dispatch(fetchUserAsync() as any);
  }, [dispatch]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError("");
    setUpdateSuccess("");

    if (!password.trim() || !confirmPassword.trim()) {
      setUpdateError("Поля пароля обязательны");
      return;
    }

    if (password !== confirmPassword) {
      setUpdateError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setUpdateError("Пароль должен быть не менее 6 символов");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setUpdateError("Требуется авторизация");
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          Authorization: `bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Ошибка обновления пароля" }));
        setUpdateError(errorData.message || "Ошибка обновления пароля");
      } else {
        setUpdateSuccess("Пароль успешно изменен");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      setUpdateError(error.message || "Ошибка подключения к серверу");
    } finally {
      setUpdating(false);
    }
  };

  if (loading && !user) {
    return (
      <Container className="profile-page">
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="profile-page">
      <Card className="profile-card">
        <Card.Header>
          <Card.Title className="mb-0">Личный кабинет</Card.Title>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => {}}>
              {error}
            </Alert>
          )}

          {user && (
            <div className="mb-4">
              <h5>Информация о пользователе</h5>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Логин:</strong> {user.login}</p>
              <p><strong>Роль:</strong> {user.isModerator ? "Модератор" : "Пользователь"}</p>
            </div>
          )}

          <hr />

          <h5 className="mb-3">Смена пароля</h5>

          {updateError && (
            <Alert variant="danger" dismissible onClose={() => setUpdateError("")}>
              {updateError}
            </Alert>
          )}

          {updateSuccess && (
            <Alert variant="success" dismissible onClose={() => setUpdateSuccess("")}>
              {updateSuccess}
            </Alert>
          )}

          <Form onSubmit={handlePasswordUpdate}>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Новый пароль</Form.Label>
              <Form.Control
                type="password"
                placeholder="Введите новый пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={updating}
                required
                minLength={6}
              />
              <Form.Text className="text-muted">
                Минимум 6 символов
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Подтвердите новый пароль</Form.Label>
              <Form.Control
                type="password"
                placeholder="Повторите новый пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={updating}
                required
                minLength={6}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={updating || !password.trim() || !confirmPassword.trim()}
            >
              {updating ? "Сохранение..." : "Изменить пароль"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
