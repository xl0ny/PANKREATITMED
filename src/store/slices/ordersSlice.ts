import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

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
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.from_date) params.set("from_date", filters.from_date);
    if (filters.to_date) params.set("to_date", filters.to_date);

    const url = `/api/pankreatitorders${params.toString() ? `?${params.toString()}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `bearer ${token}`,
      },
    });

    if (!response.ok) {
      return rejectWithValue("Ошибка получения списка заявок");
    }

    const data = await response.json();
    // API может вернуть объект с массивом или сам массив
    const orders = Array.isArray(data) ? data : data.items || [];
    
    // Нормализуем каждую заявку: убеждаемся, что criteria всегда массив
    return orders.map((order: any) => ({
      ...order,
      criteria: Array.isArray(order.criteria) ? order.criteria : [],
    }));
  } catch (error: any) {
    return rejectWithValue(error.message || "Ошибка подключения к серверу");
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
    const response = await fetch(`/api/pankreatitorders/${id}`, {
      method: "GET",
      headers: {
        Authorization: `bearer ${token}`,
      },
    });

    if (!response.ok) {
      return rejectWithValue("Заявка не найдена");
    }

    const data = await response.json();
    
    // Нормализуем данные: убеждаемся, что criteria всегда массив
    if (data && !Array.isArray(data.criteria)) {
      data.criteria = data.criteria || [];
    }
    
    // Нормализуем критерии: конвертируем snake_case в camelCase для совместимости
    if (data.criteria && Array.isArray(data.criteria)) {
      data.criteria = data.criteria.map((item: any) => ({
        ...item,
        criterion: item.criterion ? {
          ...item.criterion,
          homeVisit: item.criterion.homeVisit ?? item.criterion.home_visit ?? false,
          imageURL: item.criterion.imageURL ?? item.criterion.image_url ?? null,
          refLow: item.criterion.refLow ?? item.criterion.ref_low ?? null,
          refHigh: item.criterion.refHigh ?? item.criterion.ref_high ?? null,
        } : null,
      }));
    }
    
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Ошибка подключения к серверу");
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
    const response = await fetch(`/api/pankreatitorders/${id}/form`, {
      method: "PUT",
      headers: {
        Authorization: `bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Ошибка формирования заявки" }));
      return rejectWithValue(error.message || "Ошибка формирования заявки");
    }

    // Обновляем текущую заявку после формирования (чтобы получить рассчитанный Ranson score)
    await dispatch(fetchOrderByIdAsync(id));
  } catch (error: any) {
    return rejectWithValue(error.message || "Ошибка подключения к серверу");
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
    const response = await fetch(`/api/pankreatitorders/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Ошибка удаления заявки" }));
      return rejectWithValue(error.message || "Ошибка удаления заявки");
    }

    // Обновляем список заявок
    await dispatch(fetchOrdersAsync());
  } catch (error: any) {
    return rejectWithValue(error.message || "Ошибка подключения к серверу");
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
    const response = await fetch(
      `/api/pankreatitorders/items?pankreatit_order_id=${orderId}&criterion_id=${criterionId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      return rejectWithValue("Ошибка обновления позиции");
    }

    // Обновляем текущую заявку
    await dispatch(fetchOrderByIdAsync(orderId));
  } catch (error: any) {
    return rejectWithValue(error.message || "Ошибка подключения к серверу");
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
    const response = await fetch(
      `/api/pankreatitorders/items?pankreatit_order_id=${orderId}&criterion_id=${criterionId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return rejectWithValue("Ошибка удаления позиции");
    }

    // Обновляем текущую заявку
    await dispatch(fetchOrderByIdAsync(orderId));
  } catch (error: any) {
    return rejectWithValue(error.message || "Ошибка подключения к серверу");
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
        state.error = action.payload || "Ошибка получения списка заявок";
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
        state.error = action.payload || "Ошибка получения заявки";
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
        state.error = action.payload || "Ошибка формирования заявки";
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
        state.error = action.payload || "Ошибка удаления заявки";
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
