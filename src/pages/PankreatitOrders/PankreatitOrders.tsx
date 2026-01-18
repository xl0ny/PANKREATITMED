import { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Table, Spinner, Alert, Form, Button, Row, Col, Card } from "react-bootstrap";
import {
  fetchPankreatitOrdersAsync,
  selectPankreatitOrders,
  selectPankreatitOrdersLoading,
  selectPankreatitOrdersError,
  selectPankreatitOrderFilters,
  setFilters,
  updatePankreatitOrderStatusAsync,
} from "../../store/slices/pankreatitordersSlice";
import { selectUser } from "../../store/slices/authSlice";
import { apiClient, updateApiToken } from "../../api/apiClient";
import "./PankreatitOrders.css";

// Функция для форматирования даты в российский формат DD.MM.YYYY
const formatDateToRU = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// Функция для преобразования даты из формата DD.MM.YYYY в YYYY-MM-DD
const parseDateFromRU = (dateString: string): string => {
  const parts = dateString.split(".");
  if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
    const [day, month, year] = parts;
    // Проверяем валидность даты
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (date.getFullYear() === parseInt(year) && 
        date.getMonth() === parseInt(month) - 1 && 
        date.getDate() === parseInt(day)) {
      return `${year}-${month}-${day}`;
    }
  }
  // Если дата неполная или невалидная, возвращаем пустую строку
  return "";
};

// Функция для получения сегодняшней даты в формате DD.MM.YYYY
const getTodayRU = (): string => {
  return formatDateToRU(new Date());
};

// Функция для получения сегодняшней даты в формате YYYY-MM-DD (для API)
const getTodayISO = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Функция для форматирования ввода даты с автоматической вставкой точек
const formatDateInput = (value: string): string => {
  // Удаляем все нецифровые символы
  const digits = value.replace(/\D/g, "");
  
  // Ограничиваем длину до 8 цифр (ДДММГГГГ)
  const limitedDigits = digits.slice(0, 8);
  
  // Форматируем с точками
  if (limitedDigits.length <= 2) {
    return limitedDigits;
  } else if (limitedDigits.length <= 4) {
    return `${limitedDigits.slice(0, 2)}.${limitedDigits.slice(2)}`;
  } else {
    return `${limitedDigits.slice(0, 2)}.${limitedDigits.slice(2, 4)}.${limitedDigits.slice(4)}`;
  }
};

const PankreatitOrders: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pankreatitorders = useSelector(selectPankreatitOrders);
  const loading = useSelector(selectPankreatitOrdersLoading);
  const error = useSelector(selectPankreatitOrdersError);
  const filters = useSelector(selectPankreatitOrderFilters);
  const user = useSelector(selectUser);
  const isModerator = user?.isModerator || false;

  // Инициализируем: "Дата с" и "Дата по" - сегодняшняя дата
  const getInitialFromDate = (): string => {
    if (filters.from_date) {
      // Если есть фильтр, преобразуем из ISO в RU формат
      const date = new Date(filters.from_date);
      return formatDateToRU(date);
    }
    return getTodayRU(); // Сегодняшняя дата по умолчанию
  };

  const getInitialToDate = (): string => {
    if (filters.to_date) {
      // Если есть фильтр, преобразуем из ISO в RU формат
      const date = new Date(filters.to_date);
      return formatDateToRU(date);
    }
    return getTodayRU(); // Сегодняшняя дата по умолчанию
  };

  const [statusFilter, setStatusFilter] = useState<string>(filters.status || "");
  const [fromDate, setFromDate] = useState<string>(getInitialFromDate());
  const [toDate, setToDate] = useState<string>(getInitialToDate());
  const [creatorFilter, setCreatorFilter] = useState<string>("");
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);
  const pollingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoadRef = useRef(true);
  // Локальная копия данных для плавного обновления без скачков
  const [localPankreatitOrders, setLocalPankreatitOrders] = useState<any[]>([]);
  const pankreatitordersRef = useRef<any[]>([]);

  const prevLoadingRef = useRef(loading);
  
  // Синхронизируем локальное состояние с Redux состоянием (только после завершения загрузки через Redux)
  useEffect(() => {
    // Обновляем локальное состояние из Redux только когда:
    // 1. Первая загрузка (localOrders пустое)
    // 2. Загрузка завершилась (loading изменился с true на false) - это означает ручное обновление/применение фильтров
    const loadingFinished = prevLoadingRef.current && !loading;
    
    if (localPankreatitOrders.length === 0 || loadingFinished) {
      setLocalPankreatitOrders(pankreatitorders);
      pankreatitordersRef.current = pankreatitorders;
    }
    
    prevLoadingRef.current = loading;
  }, [pankreatitorders, loading, localPankreatitOrders.length]);

  // Первоначальная загрузка данных
  useEffect(() => {
    // При первой загрузке, если нет фильтров, применяем фильтр с сегодняшней датой в "Дата с" и "Дата по"
    if (!filters.from_date && !filters.to_date && !filters.status) {
      const todayISO = getTodayISO();
      const initialFilters = {
        from_date: `${todayISO}T00:00:00`,
        to_date: `${todayISO}T00:00:00`,
      };
      dispatch(setFilters(initialFilters));
      dispatch(fetchPankreatitOrdersAsync(initialFilters) as any);
    } else {
      dispatch(fetchPankreatitOrdersAsync(filters) as any);
    }
    isInitialLoadRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Short polling для обновления статусов (работает всегда)
  // Используем ref для хранения актуальных фильтров и флага активности
  const filtersRef = useRef(filters);
  const isPollingActiveRef = useRef(true);
  
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Short polling для обновления данных (обновляет только локальное состояние, минуя Redux)
  useEffect(() => {
    isPollingActiveRef.current = true;
    
    const fetchData = async () => {
      if (!isPollingActiveRef.current) return;
      
      try {
        // Получаем токен и обновляем его в API клиенте
        const token = localStorage.getItem("token");
        if (!token) return;
        
        updateApiToken(token);
        
        // Делаем запрос напрямую к API, минуя Redux
        const response = await apiClient.pankreatitordersList({
          status: filtersRef.current.status,
          from_date: filtersRef.current.from_date,
          to_date: filtersRef.current.to_date,
        });

        const data = response.data;
        const newPankreatitOrders = Array.isArray(data) ? data : (data as any)?.items || [];
        
        // Нормализуем данные так же, как в Redux slice
        const normalizedPankreatitOrders = newPankreatitOrders.map((order: any) => {
          const normalizedCriteria = Array.isArray(order.criteria) 
            ? order.criteria.map((item: any) => ({
                ...item,
                criterion: item.criterion ? {
                  id: item.criterion.ID ?? item.criterion.id,
                  code: item.criterion.Code ?? item.criterion.code,
                  name: item.criterion.Name ?? item.criterion.name,
                  description: item.criterion.Description ?? item.criterion.description,
                  duration: item.criterion.Duration ?? item.criterion.duration,
                  homeVisit: item.criterion.HomeVisit ?? item.criterion.homeVisit ?? item.criterion.home_visit ?? false,
                  imageURL: item.criterion.ImageURL ?? item.criterion.imageURL ?? item.criterion.image_url ?? null,
                  status: item.criterion.Status ?? item.criterion.status,
                  unit: item.criterion.Unit ?? item.criterion.unit,
                  refLow: item.criterion.RefLow ?? item.criterion.refLow ?? item.criterion.ref_low ?? null,
                  refHigh: item.criterion.RefHigh ?? item.criterion.refHigh ?? item.criterion.ref_high ?? null,
                } : null,
              }))
            : [];
          
          return {
            ...order,
            criteria: normalizedCriteria,
          };
        });
        
        // Обновляем локальное состояние напрямую, без Redux
        // Это не вызовет полную перерисовку компонента
        requestAnimationFrame(() => {
          setLocalPankreatitOrders(normalizedPankreatitOrders);
          pankreatitordersRef.current = normalizedPankreatitOrders;
        });
      } catch (error) {
        // Игнорируем ошибки при polling, чтобы не мешать пользователю
        console.warn("Ошибка при обновлении данных через polling:", error);
      }
      
      // Перезапускаем таймер после выполнения запроса, если polling еще активен
      if (isPollingActiveRef.current) {
        pollingTimeoutRef.current = setTimeout(fetchData, 2000);
      }
    };

    // Запускаем первый запрос через 2 секунды (только если не первая загрузка)
    if (!isInitialLoadRef.current) {
      pollingTimeoutRef.current = setTimeout(fetchData, 2000);
    } else {
      // Для первой загрузки запускаем polling после небольшой задержки
      pollingTimeoutRef.current = setTimeout(() => {
        isInitialLoadRef.current = false;
        pollingTimeoutRef.current = setTimeout(fetchData, 2000);
      }, 1000);
    }
    
    return () => {
      isPollingActiveRef.current = false;
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
        pollingTimeoutRef.current = null;
      }
    };
  }, []);

  const handleFilter = () => {
    const newFilters: any = {};
    if (statusFilter) newFilters.status = statusFilter;
    // Форматируем даты из российского формата в ISO формат: YYYY-MM-DDTHH:mm:ss
    if (fromDate && fromDate.length === 10) {
      const isoDate = parseDateFromRU(fromDate);
      if (isoDate) {
        newFilters.from_date = `${isoDate}T00:00:00`;
      }
    }
    if (toDate && toDate.length === 10) {
      const isoDate = parseDateFromRU(toDate);
      if (isoDate) {
        newFilters.to_date = `${isoDate}T00:00:00`;
      }
    }
    
    dispatch(setFilters(newFilters));
    dispatch(fetchPankreatitOrdersAsync(newFilters) as any);
  };

  const handleReset = () => {
    setStatusFilter("");
    setCreatorFilter(""); // Сброс фильтра по создателю
    const todayRU = getTodayRU();
    setFromDate(todayRU); // Сегодняшняя дата
    setToDate(todayRU); // Сегодняшняя дата
    const todayISO = getTodayISO();
    const resetFilters = {
      from_date: `${todayISO}T00:00:00`,
      to_date: `${todayISO}T00:00:00`,
    };
    dispatch(setFilters(resetFilters));
    dispatch(fetchPankreatitOrdersAsync(resetFilters) as any);
  };

  const handleStatusChange = async (orderId: number, status: "complete" | "reject") => {
    setUpdatingStatusId(orderId);
    try {
      console.log(`[handleStatusChange] Изменение статуса заявки ${orderId} на ${status}`);
      const result = await dispatch(updatePankreatitOrderStatusAsync({ id: orderId, status }) as any);
      
      // Проверяем, была ли ошибка
      if (updatePankreatitOrderStatusAsync.rejected.match(result)) {
        const errorMessage = result.payload || "Ошибка изменения статуса";
        alert(`Ошибка: ${errorMessage}`);
      } else {
        console.log(`[handleStatusChange] Статус успешно изменен`);
      }
    } catch (error: any) {
      console.error("Ошибка изменения статуса:", error);
      alert(`Ошибка: ${error.message || "Неизвестная ошибка"}`);
    } finally {
      setUpdatingStatusId(null);
    }
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

  // Находим последнюю завершенную заявку
  const lastCompletedPankreatitOrder = useMemo(() => {
    const completedPankreatitOrders = localPankreatitOrders.filter(order => order.status === "completed");
    if (completedPankreatitOrders.length === 0) return null;
    
    // Сортируем по дате завершения (finished_at) или дате формирования (formed_at), если finished_at нет
    const sorted = completedPankreatitOrders.sort((a, b) => {
      const dateA = a.finished_at || a.formed_at || "";
      const dateB = b.finished_at || b.formed_at || "";
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
    
    return sorted[0];
  }, [localPankreatitOrders]);

  // Получаем уникальные creator_id из загруженных заявок
  const uniqueCreators = useMemo(() => {
    const creatorIds = new Set<number>();
    localPankreatitOrders.forEach((order) => {
      if (order.creator_id) {
        creatorIds.add(order.creator_id);
      }
    });
    return Array.from(creatorIds).sort((a, b) => a - b);
  }, [localPankreatitOrders]);

  // Фильтрация заявок по создателю на фронтенде
  const filteredPankreatitOrders = useMemo(() => {
    if (!creatorFilter || creatorFilter === "") {
      return localPankreatitOrders;
    }
    const creatorId = parseInt(creatorFilter);
    return localPankreatitOrders.filter((order) => order.creator_id === creatorId);
  }, [localPankreatitOrders, creatorFilter]);

  return (
    <Container className="pankreatitorders-page">
      <h2 className="mb-4">{isModerator ? "Все заключения" : "Мои заключения"}</h2>

      {/* Балл по шкале Рэнсона из последней завершенной заявки (только для обычных пользователей) */}
      {!isModerator && lastCompletedPankreatitOrder && lastCompletedPankreatitOrder.ranson_score !== null && (
        <div className="text-center mb-2">
          <p className="score-text" style={{ fontSize: "1.1rem" }}>
            Ваш текущий балл по шкале Рэнсона - <strong>{lastCompletedPankreatitOrder.ranson_score}</strong>
          </p>
        </div>
      )}

      {/* Летальный исход из последней завершенной заявки (только для обычных пользователей) */}
      {!isModerator && lastCompletedPankreatitOrder && lastCompletedPankreatitOrder.mortality_risk && (
        <div className="text-center mb-4">
          <p className="risk-text" style={{ fontSize: "1.1rem" }}>
            Летальный исход - <strong>
              {lastCompletedPankreatitOrder.mortality_risk.endsWith("%") 
                ? lastCompletedPankreatitOrder.mortality_risk 
                : `${lastCompletedPankreatitOrder.mortality_risk}%`}
            </strong>
          </p>
        </div>
      )}

      {/* Фильтры */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={isModerator ? 2 : 3}>
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
            {isModerator && (
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Создатель</Form.Label>
                  <Form.Select
                    value={creatorFilter}
                    onChange={(e) => setCreatorFilter(e.target.value)}
                  >
                    <option value="">Все создатели</option>
                    {uniqueCreators.map((creatorId) => (
                      <option key={creatorId} value={creatorId.toString()}>
                        ID: {creatorId}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            )}
            <Col md={isModerator ? 2 : 3}>
              <Form.Group>
                <Form.Label>Дата с</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ДД.ММ.ГГГГ"
                  value={fromDate}
                  onChange={(e) => {
                    const formatted = formatDateInput(e.target.value);
                    setFromDate(formatted);
                  }}
                  pattern="\d{2}\.\d{2}\.\d{4}"
                  title="Формат: ДД.ММ.ГГГГ (например, 15.12.2025)"
                />
              </Form.Group>
            </Col>
            <Col md={isModerator ? 2 : 3}>
              <Form.Group>
                <Form.Label>Дата по</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ДД.ММ.ГГГГ"
                  value={toDate}
                  onChange={(e) => {
                    const formatted = formatDateInput(e.target.value);
                    setToDate(formatted);
                  }}
                  pattern="\d{2}\.\d{2}\.\d{4}"
                  title="Формат: ДД.ММ.ГГГГ (например, 15.12.2025)"
                />
              </Form.Group>
            </Col>
            <Col md={isModerator ? 2 : 3} className="d-flex align-items-end">
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

      {loading && isInitialLoadRef.current && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}

      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      {!loading && !error && filteredPankreatitOrders.length === 0 && (
        <Alert variant="info">Заключения не найдены</Alert>
      )}

      {!loading && !error && filteredPankreatitOrders.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              {isModerator && <th>Создатель</th>}
              <th>Статус</th>
              <th>Дата формирования</th>
              <th>Дата завершения</th>
              <th>Ranson Score</th>
              <th>Риск летальности</th>
              <th>Действия</th>
              {isModerator && <th>Действия модератора</th>}
            </tr>
          </thead>
          <tbody>
            {filteredPankreatitOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                {isModerator && <td>ID: {order.creator_id}</td>}
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
                    onClick={() => navigate(`/pankreatitorders/${order.id}`)}
                  >
                    Просмотр
                  </Button>
                </td>
                {isModerator && (
                  <td>
                    {order.status === "formed" ? (
                      <div className="d-flex gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleStatusChange(order.id, "complete")}
                          disabled={updatingStatusId === order.id}
                        >
                          {updatingStatusId === order.id ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            "Завершить"
                          )}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleStatusChange(order.id, "reject")}
                          disabled={updatingStatusId === order.id}
                        >
                          {updatingStatusId === order.id ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            "Отклонить"
                          )}
                        </Button>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default PankreatitOrders;
