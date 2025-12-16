import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { apiClient, updateApiToken } from "../../api/apiClient";

/**
 * Интерфейс позиции заявки
 */
interface OrderItem {
  id: number;
  criterion_id: number;
  position: number;
  value_num: number | null;
  value_indicator: boolean;
  criterion?: {
    id: number;
    code: string;
    name: string;
    description: string;
    duration: string;
    homeVisit: boolean;
    imageURL: string | null;
    status: string;
    unit: string;
    refLow: number | null;
    refHigh: number | null;
  };
}

/**
 * Интерфейс заявки
 */
interface Order {
  id: number;
  creator_id: number;
  moderator_id: number | null;
  status: "draft" | "formed" | "completed" | "rejected" | "deleted";
  formed_at: string | null;
  finished_at: string | null;
  ranson_score: number | null;
  mortality_risk: string | null;
  criteria: OrderItem[];
}

/**
 * Интерфейс фильтров заявок
 */
interface OrderFilters {
  status?: "draft" | "formed" | "completed" | "rejected";
  from_date?: string;
  to_date?: string;
}

/**
 * Интерфейс состояния заявок
 */
interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  filters: OrderFilters;
}

/**
 * Начальное состояние
 */
const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  filters: {},
};

/**
 * Получение токена из localStorage
 */
const getToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Async thunk для получения списка заявок
 */
export const fetchOrdersAsync = createAsyncThunk<
  Order[],
  OrderFilters | undefined,
  { rejectValue: string }
>("orders/fetchOrders", async (filters = {}, { rejectWithValue }) => {
  const token = getToken();
  if (!token) {
    return rejectWithValue("Требуется авторизация");
  }

  try {
    updateApiToken(token);
    const response = await apiClient.pankreatitordersList({
      status: filters.status,
      from_date: filters.from_date,
      to_date: filters.to_date,
    });

    const data = response.data;
    // API может вернуть объект с массивом или сам массив
    const orders = Array.isArray(data) ? data : (data as any)?.items || [];
    
    // Нормализуем каждую заявку: убеждаемся, что criteria всегда массив
    return orders.map((order: any) => {
      // Нормализуем критерии: конвертируем PascalCase из API в camelCase
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
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Ошибка подключения к серверу";
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk для получения заявки по ID
 */
export const fetchOrderByIdAsync = createAsyncThunk<
  Order,
  number,
  { rejectValue: string }
>("orders/fetchOrderById", async (id, { rejectWithValue }) => {
  const token = getToken();
  if (!token) {
    return rejectWithValue("Требуется авторизация");
  }

  try {
    updateApiToken(token);
    const response = await apiClient.id.pankreatitordersDetail({ id });

    const data = response.data;
    if (!data) {
      return rejectWithValue("Заключение не найдено");
    }
    
    // Нормализуем данные: убеждаемся, что criteria всегда массив
    if (data && !Array.isArray((data as any).criteria)) {
      (data as any).criteria = (data as any).criteria || [];
    }
    
    // Нормализуем критерии: конвертируем PascalCase из API в camelCase
    if ((data as any).criteria && Array.isArray((data as any).criteria)) {
      (data as any).criteria = (data as any).criteria.map((item: any) => ({
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
      }));
    }
    
    return data as Order;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Ошибка подключения к серверу";
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk для формирования заявки (перевод из draft в formed)
 */
export const formOrderAsync = createAsyncThunk<
  void,
  number,
  { rejectValue: string }
>("orders/formOrder", async (id, { rejectWithValue, dispatch }) => {
  const token = getToken();
  if (!token) {
    return rejectWithValue("Требуется авторизация");
  }

  try {
    updateApiToken(token);
    await apiClient.id.formUpdate({ id });

    // Обновляем текущую заявку после формирования (чтобы получить рассчитанный Ranson score)
    await dispatch(fetchOrderByIdAsync(id));
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Ошибка подключения к серверу";
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk для удаления заявки (только для draft)
 */
export const deleteOrderAsync = createAsyncThunk<
  void,
  number,
  { rejectValue: string }
>("orders/deleteOrder", async (id, { rejectWithValue, dispatch }) => {
  const token = getToken();
  if (!token) {
    return rejectWithValue("Требуется авторизация");
  }

  try {
    updateApiToken(token);
    await apiClient.id.pankreatitordersDelete({ id });

    // Обновляем список заявок
    await dispatch(fetchOrdersAsync());
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Ошибка подключения к серверу";
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk для обновления позиции заявки
 */
export const updateOrderItemAsync = createAsyncThunk<
  void,
  { orderId: number; criterionId: number; data: { position?: number; value_num?: number } },
  { rejectValue: string }
>("orders/updateOrderItem", async ({ orderId, criterionId, data }, { rejectWithValue, dispatch }) => {
  const token = getToken();
  if (!token) {
    return rejectWithValue("Требуется авторизация");
  }

  try {
    updateApiToken(token);
    await apiClient.items.itemsUpdate(
      {
        pankreatit_order_id: orderId,
        criterion_id: criterionId,
      },
      {
        position: data.position,
        value_num: data.value_num,
      }
    );

    // Обновляем текущую заявку
    await dispatch(fetchOrderByIdAsync(orderId));
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Ошибка подключения к серверу";
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk для удаления позиции из заявки
 */
export const removeOrderItemAsync = createAsyncThunk<
  void,
  { orderId: number; criterionId: number },
  { rejectValue: string }
>("orders/removeOrderItem", async ({ orderId, criterionId }, { rejectWithValue, dispatch }) => {
  const token = getToken();
  if (!token) {
    return rejectWithValue("Требуется авторизация");
  }

  try {
    updateApiToken(token);
    await apiClient.items.itemsDelete({
      pankreatit_order_id: orderId,
      criterion_id: criterionId,
    });

    // Обновляем текущую заявку
    await dispatch(fetchOrderByIdAsync(orderId));
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Ошибка подключения к серверу";
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk для изменения статуса заявки (модератор)
 */
export const updateOrderStatusAsync = createAsyncThunk<
  void,
  { id: number; status: "complete" | "reject" },
  { rejectValue: string }
>("orders/updateOrderStatus", async ({ id, status }, { rejectWithValue, dispatch, getState }) => {
  const token = getToken();
  if (!token) {
    return rejectWithValue("Требуется авторизация");
  }

  try {
    updateApiToken(token);
    
    // API ожидает "completed" или "rejected" (с окончанием -ed)
    const apiStatus = status === "complete" ? "completed" : "rejected";
    
    console.log(`[updateOrderStatusAsync] Отправка запроса: id=${id}, status=${apiStatus}`);
    
    const response = await apiClient.id.putId({ id, status: apiStatus });
    
    console.log(`[updateOrderStatusAsync] Ответ получен:`, response);
    
    // Проверяем ответ
    if (!response) {
      return rejectWithValue("Пустой ответ от сервера");
    }

    // Обновляем список заявок с текущими фильтрами
    const state = getState() as { orders: OrdersState };
    await dispatch(fetchOrdersAsync(state.orders.filters));
  } catch (error: any) {
    console.error("Ошибка при изменении статуса заявки:", error);
    console.error("Детали ошибки:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    
    let errorMessage = "Ошибка подключения к серверу";
    
    if (error.response) {
      // Показываем реальное сообщение от сервера без дополнительных пояснений
      errorMessage = error.response.data?.message || 
                    error.response.data?.detail || 
                    error.response.data?.error ||
                    `Ошибка сервера: ${error.response.status}`;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return rejectWithValue(errorMessage);
  }
});

/**
 * Redux slice для заявок
 */
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    /**
     * Установка фильтров
     */
    setFilters: (state, action: PayloadAction<OrderFilters>) => {
      state.filters = action.payload;
    },
    /**
     * Очистка фильтров
     */
    clearFilters: (state) => {
      state.filters = {};
    },
    /**
     * Очистка текущей заявки
     */
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    /**
     * Очистка всех заявок
     */
    clearOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    // Fetch Orders
    builder
      .addCase(fetchOrdersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrdersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка получения списка заключений";
      });

    // Fetch Order By ID
    builder
      .addCase(fetchOrderByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка получения заключения";
      });

    // Form Order
    builder
      .addCase(formOrderAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(formOrderAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(formOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка формирования заключения";
      });

    // Delete Order
    builder
      .addCase(deleteOrderAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrderAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка удаления заключения";
      });

    // Update Order Status
    builder
      .addCase(updateOrderStatusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatusAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateOrderStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка изменения статуса заключения";
      });
  },
});

export const { setFilters, clearFilters, clearCurrentOrder, clearOrders } = ordersSlice.actions;

// Селекторы
export const selectOrders = (state: { orders: OrdersState }) => state.orders.orders;
export const selectCurrentOrder = (state: { orders: OrdersState }) => state.orders.currentOrder;
export const selectOrdersLoading = (state: { orders: OrdersState }) => state.orders.loading;
export const selectOrdersError = (state: { orders: OrdersState }) => state.orders.error;
export const selectOrderFilters = (state: { orders: OrdersState }) => state.orders.filters;

export default ordersSlice.reducer;
