import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./slices/filterSlice";

/**
 * Redux store для всего приложения
 * 
 * Store централизует управление состоянием приложения. В данном случае
 * он хранит состояние фильтрации, которое сохраняется при переключении
 * страниц и при входе в PWA.
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
    // Подключаем reducer для фильтрации
    filter: filterReducer,
    // В будущем здесь могут быть добавлены другие reducers:
    // cart: cartReducer,
    // user: userReducer,
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

