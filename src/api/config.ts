/**
 * Конфигурация API
 * 
 * VITE_API_BASE_URL - базовый URL бэкенда
 * - В dev-режиме: оставляем пустым, чтобы работал прокси Vite (server.proxy)
 * - В prod: указываем абсолютный URL бэкенда (если он публичный)
 *   Например: "http://your-backend.com" или "https://api.example.com"
 * 
 * Если не указан, запросы идут относительно текущего домена
 * (на GitHub Pages это вызовет 404, но сработает fallback на моки)
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

/**
 * Формирует полный URL для API запроса
 * @param path - путь API (например, "/api/criteria")
 * @returns полный URL или относительный путь (если API_BASE_URL пустой)
 */
export function getApiUrl(path: string): string {
  // Убираем лишние слэши
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  
  if (!API_BASE_URL) {
    // В dev-режиме возвращаем относительный путь (прокси Vite обработает)
    // В prod на GitHub Pages это вызовет 404, но сработает fallback на моки
    return cleanPath
  }
  
  // В prod с указанным API_BASE_URL формируем абсолютный URL
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL
  return `${base}${cleanPath}`
}

