import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./slices/filterSlice";
import authReducer from "./slices/authSlice";
import ordersReducer from "./slices/ordersSlice";
import cartReducer from "./slices/cartSlice";

/**
 * Redux store для всего приложения
 * 
 * Store централизует управление состоянием приложения. Использует Redux Toolkit,
 * который включает redux-thunk по умолчанию для асинхронных действий.
 * 
 * @example
 * // Использование в компоненте:
 * import { useSelector, useDispatch } from 'react-redux';
 * import { selectQuery, setQuery } from './store/slices/filterSlice';
 * 
 * const query = useSelector(selectQuery);
 * const dispatch = useDispatch();
 * dispatch(setQuery("новый запрос"));
 */
export const store = configureStore({
  reducer: {
    // Фильтрация критериев
    filter: filterReducer,
    // Авторизация и пользователь
    auth: authReducer,
    // Заявки
    orders: ordersReducer,
    // Корзина (черновик заявки)
    cart: cartReducer,
  },
});

/**
 * Тип для TypeScript, представляющий корневое состояние store
 * Используется для типизации селекторов и других операций со store
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Тип для TypeScript, представляющий тип dispatch функции
 * Используется для типизации dispatch в компонентах
 */
export type AppDispatch = typeof store.dispatch;

