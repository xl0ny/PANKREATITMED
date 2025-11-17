import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

/**
 * Интерфейс состояния фильтра
 * @property {string} query - Поисковый запрос для фильтрации критериев
 */
interface FilterState {
  query: string;
  // В будущем здесь может быть добавлено поле category: string
}

/**
 * Начальное состояние фильтра
 * query изначально пустая строка, что означает отсутствие фильтрации
 */
const initialState: FilterState = {
  query: "",
};

/**
 * Redux slice для управления состоянием фильтрации
 * 
 * Этот slice хранит состояние фильтра (поисковый запрос) и предоставляет
 * actions для его изменения. Состояние сохраняется при переключении страниц
 * и при входе в PWA благодаря глобальному Redux store.
 * 
 * @example
 * // Использование в компоненте:
 * const query = useSelector(selectQuery);
 * dispatch(setQuery("новый запрос"));
 * dispatch(clearQuery());
 */
const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    /**
     * Устанавливает новый поисковый запрос
     * @param {FilterState} state - Текущее состояние фильтра
     * @param {PayloadAction<string>} action - Action с новым значением query
     */
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    /**
     * Очищает поисковый запрос (устанавливает пустую строку)
     * @param {FilterState} state - Текущее состояние фильтра
     */
    clearQuery: (state) => {
      state.query = "";
    },
  },
});

// Экспортируем actions для использования в компонентах
export const { setQuery, clearQuery } = filterSlice.actions;

// Экспортируем reducer для подключения к store
export default filterSlice.reducer;

/**
 * Селектор для получения поискового запроса из store
 * Используется в компонентах через useSelector(selectQuery)
 * 
 * @param {RootState} state - Корневое состояние Redux store
 * @returns {string} Текущий поисковый запрос
 */
export const selectQuery = (state: { filter: FilterState }): string =>
  state.filter.query;

