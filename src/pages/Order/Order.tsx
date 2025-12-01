import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner, Alert, Button, Form, Card } from "react-bootstrap";
import {
  fetchOrderByIdAsync,
  selectCurrentOrder,
  selectOrdersLoading,
  selectOrdersError,
  formOrderAsync,
  deleteOrderAsync,
  updateOrderItemAsync,
  removeOrderItemAsync,
} from "../../store/slices/ordersSlice";
import noImage from "../../assets/no-image.svg";
import "./Order.css";

const Order: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const order = useSelector(selectCurrentOrder);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  const [editingValues, setEditingValues] = useState<Record<number, number | null>>({});
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [savingItemId, setSavingItemId] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderByIdAsync(parseInt(id)) as any);
    }
  }, [dispatch, id]);

  const isDraft = order?.status === "draft";
  const canEdit = isDraft;

  // Инициализируем значения для редактирования
  useEffect(() => {
    if (order?.criteria) {
      const initialValues: Record<number, number | null> = {};
      order.criteria.forEach((item) => {
        initialValues[item.id] = item.value_num;
      });
      setEditingValues(initialValues);
    }
  }, [order]);

  const handleValueChange = (itemId: number, value: string) => {
    setEditingValues((prev) => ({
      ...prev,
      [itemId]: value === "" ? null : parseFloat(value),
    }));
  };

  const handleSaveItem = async (itemId: number, criterionId: number) => {
    if (!id) return;

    const value = editingValues[itemId];
    setSavingItemId(itemId);

    try {
      await dispatch(
        updateOrderItemAsync({
          orderId: parseInt(id),
          criterionId,
          data: {
            value_num: value ?? undefined,
          },
        }) as any
      );
      
      // Обновляем заявку после изменения
      await dispatch(fetchOrderByIdAsync(parseInt(id)) as any);
    } catch (error) {
      console.error("Ошибка сохранения:", error);
    } finally {
      setSavingItemId(null);
    }
  };

  const handleRemoveItem = async (criterionId: number) => {
    if (!id || !window.confirm("Удалить услугу из заявки?")) return;

    await dispatch(
      removeOrderItemAsync({
        orderId: parseInt(id),
        criterionId,
      }) as any
    );
    
    // Обновляем заявку после удаления
    await dispatch(fetchOrderByIdAsync(parseInt(id)) as any);
  };

  const handleFormOrder = async () => {
    if (!id || !window.confirm("Подтвердить заявку? После подтверждения редактирование будет недоступно.")) return;

    setFormLoading(true);
    try {
      await dispatch(formOrderAsync(parseInt(id)) as any);
      // После формирования заявка автоматически обновится через fetchOrderByIdAsync в formOrderAsync
      // Обновляем вручную для надежности
      await dispatch(fetchOrderByIdAsync(parseInt(id)) as any);
    } catch (error) {
      console.error("Ошибка формирования заявки:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!id || !window.confirm("Удалить черновик заявки?")) return;

    setDeleteLoading(true);
    try {
      await dispatch(deleteOrderAsync(parseInt(id)) as any);
      navigate("/orders");
    } catch (error) {
      console.error("Ошибка удаления заявки:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Определяет статус критерия: красный = превышен порог (1), зеленый = норма (0)
  const getItemStatus = (item: any) => {
    if (item.value_num === null || item.value_num === undefined) {
      return null; // Нет значения
    }
    
    const criterion = item.criterion;
    if (!criterion) return null;

    // Поддерживаем оба формата: camelCase и snake_case
    const refHigh = criterion.refHigh ?? (criterion as any).ref_high;
    const refLow = criterion.refLow ?? (criterion as any).ref_low;

    // Проверяем пороговые значения
    if (refHigh !== null && refHigh !== undefined && refHigh > 0) {
      // Порог "больше чем"
      return item.value_num > refHigh ? 1 : 0;
    }
    
    if (refLow !== null && refLow !== undefined && refLow > 0) {
      // Порог "меньше чем"
      return item.value_num < refLow ? 1 : 0;
    }

    return null;
  };

  const formatThreshold = (item: any) => {
    const criterion = item.criterion;
    if (!criterion) return "";
    
    // Поддерживаем оба формата: camelCase и snake_case
    const refHigh = criterion.refHigh ?? (criterion as any).ref_high;
    const refLow = criterion.refLow ?? (criterion as any).ref_low;
    const unit = criterion.unit || "";
    
    if (refHigh !== null && refHigh !== undefined && refHigh > 0) {
      return `> ${refHigh} ${unit}`;
    }
    
    if (refLow !== null && refLow !== undefined && refLow > 0) {
      return `< ${refLow} ${unit}`;
    }
    
    return "";
  };

  if (loading) {
    return (
      <Container className="order-page">
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container className="order-page">
        <Alert variant="danger">{error || "Заявка не найдена"}</Alert>
        <Button onClick={() => navigate("/orders")} className="mt-3">
          Вернуться к списку заявок
        </Button>
      </Container>
    );
  }

  const sortedCriteria = [...(order.criteria || [])].sort((a, b) => (a.position || 0) - (b.position || 0));

  return (
    <Container className="order-page">
      <div className="order-header mb-4">
        <h2 className="order-title">PANKREATITMED</h2>
        
        {/* Ranson Score и Risk */}
        <div className="score-section text-center mb-3">
          {order.ranson_score !== null && (
            <>
              <p className="score-text">
                Ваш бал по шкале Рэнсона - <strong>{order.ranson_score}</strong>
              </p>
              {order.mortality_risk && (
                <p className="risk-text">
                  Летальный исход - <strong>{order.mortality_risk}</strong>
                </p>
              )}
            </>
          )}
        </div>

        {/* Выбор пациента (для будущей реализации) */}
        <div className="patient-selector mb-4">
          <Form.Select disabled>
            <option>Выберете пациента</option>
          </Form.Select>
        </div>

        {/* Действия для черновика */}
        {isDraft && (
          <div className="order-actions mb-4">
            <Button
              variant="success"
              onClick={handleFormOrder}
              disabled={formLoading || sortedCriteria.length === 0}
              className="me-2"
            >
              {formLoading ? "Формирование..." : "Подтвердить заявку"}
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteOrder}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Удаление..." : "Удалить черновик"}
            </Button>
          </div>
        )}
      </div>

      {/* Список критериев */}
      <div className="criteria-list">
        {sortedCriteria.length === 0 ? (
          <Alert variant="info">Заявка пуста</Alert>
        ) : (
          sortedCriteria.map((item, index) => {
            const criterion = item.criterion;
            const status = getItemStatus(item);
            const currentValue = editingValues[item.id] ?? item.value_num;
            const isSaving = savingItemId === item.id;

            return (
              <Card key={item.id} className="criterion-card mb-3">
                <Card.Body>
                  <div className="criterion-content">
                    {/* Номер позиции */}
                    <div className="criterion-number">{index + 1}</div>

                    {/* Основной контент */}
                    <div className="criterion-main">
                      {/* Код и название */}
                      <div className="criterion-header">
                        <span className="criterion-code">{criterion?.code || `№${item.criterion_id}`}</span>
                        <h5 className="criterion-name">{criterion?.name || "Критерий"}</h5>
                      </div>

                      {/* Длительность и доступность */}
                      <div className="criterion-meta">
                        <span>{criterion?.duration || "1 календарный день"}</span>
                        {(criterion?.homeVisit ?? (criterion as any)?.home_visit) && <span> Доступно с выездом на дом</span>}
                      </div>

                      {/* Порог */}
                      <div className="criterion-threshold">
                        {formatThreshold(item)}
                      </div>

                      {/* Иконка и значение */}
                      <div className="criterion-input-section">
                        <div className="criterion-icon">
                          <img
                            src={criterion?.imageURL ?? (criterion as any)?.image_url ?? noImage}
                            alt={criterion?.name || "Критерий"}
                            className="criterion-image"
                          />
                        </div>

                        <div className="criterion-value-group">
                          <Form.Control
                            type="number"
                            step="any"
                            value={currentValue !== null && currentValue !== undefined ? currentValue : ""}
                            onChange={(e) => handleValueChange(item.id, e.target.value)}
                            disabled={!canEdit || isSaving}
                            placeholder="..."
                            className="criterion-input"
                          />

                          {/* Индикатор статуса */}
                          {status !== null && (
                            <div className={`status-indicator status-${status === 1 ? "critical" : "normal"}`}>
                              {status}
                            </div>
                          )}

                          {/* Кнопка сохранения (только для редактируемых) */}
                          {canEdit && currentValue !== item.value_num && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleSaveItem(item.id, item.criterion_id)}
                              disabled={isSaving}
                              className="ms-2"
                            >
                              {isSaving ? "..." : "Сохранить"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Кнопка удаления */}
                    {canEdit && (
                      <Button
                        variant="link"
                        onClick={() => handleRemoveItem(item.criterion_id)}
                        className="criterion-delete"
                        disabled={isSaving}
                      >
                        🗑️
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            );
          })
        )}
      </div>

      <div className="mt-4">
        <Button variant="secondary" onClick={() => navigate("/orders")}>
          Вернуться к списку заявок
        </Button>
      </div>
    </Container>
  );
};

export default Order;