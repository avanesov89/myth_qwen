/**
 * Базовый API клиент для взаимодействия с Directus CMS
 * 
 * Предоставляет универсальные функции для HTTP запросов к API.
 * Все данные загружаются через этот слой — UI компоненты не делают
 * прямых fetch-запросов к API.
 * 
 * @see https://docs.directus.io/reference/query/
 */

/** Базовый URL API Directus. Берётся из переменных окружения или используется значение по умолчанию */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8055';

/**
 * Выполняет GET запрос к API Directus
 * 
 * @param endpoint — путь к endpoint (например, "/items/entities")
 * @returns Promise с распарсенными JSON данными
 * @throws Error при статусе 404 или других ошибках HTTP
 * 
 * @example
 * ```ts
 * const data = await fetchApi<ApiResponse<Entity>>('/items/entities');
 * ```
 */
export async function fetchApi<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Not found');
    }
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Возвращает полный URL для API endpoint
 * 
 * @param endpoint — путь к endpoint
 * @returns Полный URL включая базовый
 * 
 * @example
 * ```ts
 * const url = getApiUrl('/items/entities');
 * //返回: "http://localhost:8055/items/entities"
 * ```
 */
export function getApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}
