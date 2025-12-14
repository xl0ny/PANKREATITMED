import { Api, HttpClient } from "./Api";
import type { AxiosRequestConfig } from "axios";

/**
 * Получение токена из localStorage
 */
const getToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Security worker для добавления токена авторизации в запросы
 */
const securityWorker = async (
  securityData: string | null
): Promise<AxiosRequestConfig | void> => {
  const token = securityData || getToken();
  if (token) {
    return {
      headers: {
        Authorization: `bearer ${token}`,
      },
    };
  }
};

/**
 * Создание HTTP клиента с настройками
 * 
 * baseURL:
 * - В dev-режиме: пустой, чтобы работал прокси Vite (server.proxy)
 * - В prod: можно указать через VITE_API_BASE_URL
 */
const httpClient = new HttpClient({
  baseURL: "/api",
  securityWorker,
  secure: true, // По умолчанию все запросы требуют авторизацию
});

/**
 * Экспорт экземпляра API клиента
 */
export const apiClient = new Api(httpClient);

/**
 * Обновление токена в securityData клиента
 */
export const updateApiToken = (token: string | null) => {
  httpClient.setSecurityData(token);
};
