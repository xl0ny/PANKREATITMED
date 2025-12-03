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

  // Логируем заявку для отладки
  useEffect(() => {
    if (order) {
      console.log("[Order] order object:", order);
    }
  }, [order]);

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

  // Определяет статус критерия: 1 = входит в референс (красный), 0 = не входит (зеленый)
  const getItemStatus = (item: any) => {
    if (item.value_num === null || item.value_num === undefined) {
      return null; // Нет значения
    }
    
    const criterion = item.criterion;
    if (!criterion) return null;

    const refHigh = criterion.refHigh;
    const refLow = criterion.refLow;

    // Проверяем пороговые значения
    if (refHigh !== null && refHigh !== undefined && refHigh > 0) {
      // Порог "больше чем" - если значение превышает порог, значит входит (1 красный)
      return item.value_num > refHigh ? 1 : 0;
    }
    
    if (refLow !== null && refLow !== undefined && refLow > 0) {
      // Порог "меньше чем" - если значение меньше порога, значит входит (1 красный)
      return item.value_num < refLow ? 1 : 0;
    }

    return null;
  };

  const formatThreshold = (item: any) => {
    const criterion = item.criterion;
    if (!criterion) return "";
    
    const refHigh = criterion.refHigh;
    const refLow = criterion.refLow;
    const unit = criterion.unit || "";
    
    if (refHigh !== null && refHigh !== undefined && refHigh > 0) {
      return `> ${refHigh} ${unit}`;
    }
    
    if (refLow !== null && refLow !== undefined && refLow > 0) {
      return `< ${refLow} ${unit}`;
    }
    
    return "";
  };

  // Получает URL изображения критерия
  const getImageUrl = (criterion: any) => {
    if (!criterion) return noImage;
    
    const imageUrl = criterion.imageURL;
    if (!imageUrl) return noImage;
    
    return imageUrl;
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
        {/* <h2 className="order-title">PANKREATITMED</h2> */}
        
        {/* Ranson Score и Risk */}
        <div className="score-section text-center mb-4">
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
            const imageUrl = getImageUrl(criterion);

            return (
              <Card key={item.id} className="order-item-card mb-3">
                <Card.Body className="order-item-body">
                  {/* Номер позиции */}
                  <div className="item-position">{index + 1}</div>

                  {/* Код критерия */}
                  <div className="item-code">{criterion?.code || `№${item.criterion_id}`}</div>

                  {/* Название критерия */}
                  <div className="item-name">{criterion?.name || "Критерий"}</div>

                  {/* Комментарии (длительность и доступность) */}
                  <div className="item-comments">
                    <span>{criterion?.duration || "1 календарный день"}</span>
                    {(criterion?.homeVisit ?? (criterion as any)?.home_visit) && (
                      <span> Доступно с выездом на дом</span>
                    )}
                  </div>

                  {/* Референсное значение */}
                  <div className="item-threshold">
                    {formatThreshold(item)}
                  </div>

                  {/* Изображение */}
                  <div className="item-image">
                    <img
                      src={imageUrl}
                      alt={criterion?.name || "Критерий"}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = noImage;
                      }}
                    />
                  </div>

                  {/* Поле ввода значения */}
                  <div className="item-input">
                    <Form.Control
                      type="number"
                      step="any"
                      value={currentValue !== null && currentValue !== undefined ? currentValue : ""}
                      onChange={(e) => handleValueChange(item.id, e.target.value)}
                      disabled={!canEdit || isSaving}
                      placeholder="..."
                    />
                    {/* Кнопка сохранения появляется при изменении */}
                    {canEdit && currentValue !== item.value_num && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSaveItem(item.id, item.criterion_id)}
                        disabled={isSaving}
                        className="ms-1"
                      >
                        {isSaving ? "..." : "✓"}
                      </Button>
                    )}
                  </div>

                  {/* Индикатор статуса */}
                  {status !== null && (
                    <div className={`item-status status-${status === 1 ? "critical" : "normal"}`}>
                      {status}
                    </div>
                  )}

                  {/* Кнопка удаления */}
                  {canEdit && (
                    <Button
                      variant="link"
                      onClick={() => handleRemoveItem(item.criterion_id)}
                      className="item-delete"
                      disabled={isSaving}
                      title="Удалить"
                    >
                      🗑️
                    </Button>
                  )}
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