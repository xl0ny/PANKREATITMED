import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * Интерфейс пользователя
 */
interface User {
  id: number;
  login: string;
  isModerator: boolean;
}

/**
 * Интерфейс состояния авторизации
 */
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

/**
 * Начальное состояние
 */
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

/**
 * Интерфейс для запроса авторизации
 */
interface LoginRequest {
  login: string;
  password: string;
}

/**
 * Интерфейс для запроса регистрации
 */
interface RegisterRequest {
  login: string;
  password: string;
}

/**
 * Интерфейс ответа авторизации
 */
interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

/**
 * Async thunk для авторизации
 */
export const loginAsync = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/users/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Ошибка авторизации" }));
      return rejectWithValue(error.message || "Неверный логин или пароль");
    }

    return await response.json();
  } catch (error: any) {
    return rejectWithValue(error.message || "Ошибка подключения к серверу");
  }
});

/**
 * Async thunk для регистрации
 */
export const registerAsync = createAsyncThunk<
  AuthResponse,
  RegisterRequest,
  { rejectValue: string }
>("auth/register", async (credentials, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/users/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Ошибка регистрации" }));
      return rejectWithValue(error.message || "Ошибка регистрации");
    }

    return await response.json();
  } catch (error: any) {
    return rejectWithValue(error.message || "Ошибка подключения к серверу");
  }
});

/**
 * Async thunk для получения информации о пользователе
 */
export const fetchUserAsync = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/fetchUser", async (_, { getState, rejectWithValue }) => {
  const state = getState() as { auth: AuthState };
  const token = state.auth.token;

  if (!token) {
    return rejectWithValue("Токен отсутствует");
  }

  try {
    const response = await fetch("/api/users/me", {
      method: "GET",
      headers: {
        Authorization: `bearer ${token}`,
      },
    });

    if (!response.ok) {
      return rejectWithValue("Ошибка получения данных пользователя");
    }

    return await response.json();
  } catch (error: any) {
    return rejectWithValue(error.message || "Ошибка подключения к серверу");
  }
});

/**
 * Async thunk для выхода
 */
export const logoutAsync = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("auth/logout", async (token) => {
  try {
    const response = await fetch(`/api/users/auth/logout/${token}`, {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Даже если ошибка, продолжаем выход локально
      console.warn("Ошибка при выходе на сервере, но продолжаем локальный выход");
    }
  } catch (error: any) {
    // Даже при ошибке продолжаем выход локально
    console.warn("Ошибка подключения при выходе, но продолжаем локальный выход");
  }
});

/**
 * Redux slice для авторизации
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Проверка авторизации при загрузке приложения
     */
    checkAuth: (state) => {
      const token = localStorage.getItem("token");
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
      }
    },
    /**
     * Локальный выход (без запроса на сервер)
     */
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    /**
     * Очистка ошибки
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.access_token);
        state.error = null;
        // Загружаем информацию о пользователе после успешного входа
        // Это будет сделано через fetchUserAsync в компоненте
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка авторизации";
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.access_token);
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка регистрации";
        state.isAuthenticated = false;
      });

    // Fetch User
    builder
      .addCase(fetchUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка получения данных пользователя";
        // Если ошибка 401, выходим
        if (action.payload?.includes("401") || action.payload?.includes("unauthenticated")) {
          localStorage.removeItem("token");
          state.token = null;
          state.isAuthenticated = false;
          state.user = null;
        }
      });

    // Logout
    builder
      .addCase(logoutAsync.fulfilled, (state) => {
        localStorage.removeItem("token");
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { checkAuth, logout, clearError } = authSlice.actions;

// Селекторы
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;

export default authSlice.reducer;
