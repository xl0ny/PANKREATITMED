import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Table, Spinner, Alert, Form, Button, Row, Col, Card } from "react-bootstrap";
import {
  fetchOrdersAsync,
  selectOrders,
  selectOrdersLoading,
  selectOrdersError,
  selectOrderFilters,
  setFilters,
} from "../../store/slices/ordersSlice";
import "./Orders.css";

const Orders: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const filters = useSelector(selectOrderFilters);

  const [statusFilter, setStatusFilter] = useState<string>(filters.status || "");
  const [fromDate, setFromDate] = useState<string>(filters.from_date || "");
  const [toDate, setToDate] = useState<string>(filters.to_date || "");

  useEffect(() => {
    dispatch(fetchOrdersAsync(filters) as any);
  }, [dispatch]);

  const handleFilter = () => {
    const newFilters: any = {};
    if (statusFilter) newFilters.status = statusFilter;
    // Форматируем даты в ISO формат: YYYY-MM-DDTHH:mm:ss
    if (fromDate) {
      newFilters.from_date = `${fromDate}T00:00:00`;
    }
    if (toDate) {
      newFilters.to_date = `${toDate}T00:00:00`;
    }
    
    dispatch(setFilters(newFilters));
    dispatch(fetchOrdersAsync(newFilters) as any);
  };

  const handleReset = () => {
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    dispatch(setFilters({}));
    dispatch(fetchOrdersAsync() as any);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: "Черновик",
      formed: "Сформирована",
      completed: "Завершена",
      rejected: "Отклонена",
      deleted: "Удалена",
    };
    return labels[status] || status;
  };

  const getStatusVariant = (status: string) => {
    const variants: Record<string, string> = {
      draft: "secondary",
      formed: "info",
      completed: "success",
      rejected: "danger",
      deleted: "dark",
    };
    return variants[status] || "secondary";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ru-RU");
  };

  return (
    <Container className="orders-page">
      <h2 className="mb-4">Мои заключения</h2>

      {/* Фильтры */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Статус</Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Все статусы</option>
                  <option value="draft">Черновик</option>
                  <option value="formed">Сформирована</option>
                  <option value="completed">Завершена</option>
                  <option value="rejected">Отклонена</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Дата с</Form.Label>
                <Form.Control
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Дата по</Form.Label>
                <Form.Control
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <div>
                <Button variant="primary" onClick={handleFilter} className="me-2">
                  Применить
                </Button>
                <Button variant="secondary" onClick={handleReset}>
                  Сбросить
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}

      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      {!loading && !error && orders.length === 0 && (
        <Alert variant="info">Заключения не найдены</Alert>
      )}

      {!loading && !error && orders.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Статус</th>
              <th>Дата формирования</th>
              <th>Дата завершения</th>
              <th>Ranson Score</th>
              <th>Риск летальности</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  <span className={`badge bg-${getStatusVariant(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td>{formatDate(order.formed_at)}</td>
                <td>{formatDate(order.finished_at)}</td>
                <td>{order.ranson_score !== null ? order.ranson_score : "-"}</td>
                <td>{order.mortality_risk || "-"}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    Просмотр
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Orders;
