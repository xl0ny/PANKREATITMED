import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { apiClient, updateApiToken } from "../../api/apiClient";

/**
 * Интерфейс ответа корзины
 */
interface CartResponse {
  pankreatit_order_id: number;
  criteria_amount: number;
}

/**
 * Интерфейс состояния корзины
 */
interface CartState {
  draftOrderId: number | null;
  itemsCount: number;
  loading: boolean;
  error: string | null;
}

/**
 * Начальное состояние
 */
const initialState: CartState = {
  draftOrderId: null,
  itemsCount: 0,
  loading: false,
  error: null,
};

/**
 * Получение токена из localStorage
 */
const getToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Async thunk для получения информации о корзине
 */
export const fetchCartAsync = createAsyncThunk<
  CartResponse,
  void,
  { rejectValue: string }
>("cart/fetchCart", async (_, { rejectWithValue }) => {
  const token = getToken();
  if (!token) {
    return rejectWithValue("Требуется авторизация");
  }

  try {
    updateApiToken(token);
    const response = await apiClient.cart.cartList();

    const data = response.data;
    if (!data) {
      // Если данных нет, значит корзины нет, это нормально
      return { pankreatit_order_id: 0, criteria_amount: 0 };
    }

    return {
      pankreatit_order_id: (data as any).pankreatit_order_id || 0,
      criteria_amount: (data as any).criteria_amount || 0,
    };
  } catch (error: any) {
    // Если 404 - значит корзины нет, это нормально
    if (error.response?.status === 404) {
      return { pankreatit_order_id: 0, criteria_amount: 0 };
    }
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Ошибка подключения к серверу";
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk для добавления услуги в черновик
 */
export const addToCartAsync = createAsyncThunk<
  void,
  number,
  { rejectValue: string }
>("cart/addToCart", async (criterionId, { rejectWithValue, dispatch }) => {
  const token = getToken();
  if (!token) {
    return rejectWithValue("Требуется авторизация");
  }

  try {
    updateApiToken(token);
    await apiClient.id.addToDraftCreate({ id: criterionId });

    // Обновляем информацию о корзине
    await dispatch(fetchCartAsync());
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Ошибка подключения к серверу";
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk для удаления услуги из черновика
 */
export const removeFromCartAsync = createAsyncThunk<
  void,
  { orderId: number; criterionId: number },
  { rejectValue: string }
>("cart/removeFromCart", async ({ orderId, criterionId }, { rejectWithValue, dispatch }) => {
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

    // Обновляем информацию о корзине
    await dispatch(fetchCartAsync());
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Ошибка подключения к серверу";
    return rejectWithValue(errorMessage);
  }
});

/**
 * Async thunk для обновления позиции в корзине
 */
export const updateCartItemAsync = createAsyncThunk<
  void,
  { orderId: number; criterionId: number; data: { position?: number; value_num?: number } },
  { rejectValue: string }
>("cart/updateCartItem", async ({ orderId, criterionId, data }, { rejectWithValue, dispatch }) => {
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

    // Обновляем информацию о корзине
    await dispatch(fetchCartAsync());
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Ошибка подключения к серверу";
    return rejectWithValue(errorMessage);
  }
});

/**
 * Redux slice для корзины
 */
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /**
     * Очистка корзины
     */
    clearCart: (state) => {
      state.draftOrderId = null;
      state.itemsCount = 0;
      state.error = null;
    },
    /**
     * Установка количества вручную (для синхронизации)
     */
    setItemsCount: (state, action: PayloadAction<number>) => {
      state.itemsCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder
      .addCase(fetchCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.draftOrderId = action.payload.pankreatit_order_id || null;
        state.itemsCount = action.payload.criteria_amount || 0;
        state.error = null;
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.loading = false;
        // Не устанавливаем ошибку, если просто нет корзины
        if (action.payload !== "Требуется авторизация") {
          state.error = action.payload || "Ошибка получения данных корзины";
        }
      });

    // Add To Cart
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка добавления в заключение";
      });

    // Remove From Cart
    builder
      .addCase(removeFromCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка удаления из заключения";
      });

    // Update Cart Item
    builder
      .addCase(updateCartItemAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка обновления позиции";
      });
  },
});

export const { clearCart, setItemsCount } = cartSlice.actions;

// Селекторы
export const selectDraftOrderId = (state: { cart: CartState }) => state.cart.draftOrderId;
export const selectItemsCount = (state: { cart: CartState }) => state.cart.itemsCount;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.loading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;

export default cartSlice.reducer;
