/**
 * API модуль для работы с мифами и легендами
 * 
 * Предоставляет функции для загрузки данных о мифах из коллекции
 * "myths_and_legends". Каждый миф связан с культурой и может быть
 * связан с богами через M2M отношение (поле gods).
 * 
 * @example
 * ```ts
 * const myths = await getMyths({ culture: 'greek' });
 * const myth = await getMythBySlug('persefone_sale');
 * ```
 */

import { fetchApi } from './client';
import type { Myth, ApiResponse, QueryParams } from '@/types';

/**
 * Получает список мифов с фильтрацией и пагинацией
 * 
 * @param params — Параметры запроса (культура, лимит)
 * @returns Массив мифов
 * @throws Error при ошибке API
 * 
 * @example
 * ```ts
 * // Все мифы
 * const all = await getMyths();
 * 
 * // Только греческие мифы
 * const greek = await getMyths({ culture: 'greek' });
 * 
 * // С лимитом
 * const limited = await getMyths({ limit: 10 });
 * ```
 */
export async function getMyths(params?: QueryParams): Promise<Myth[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.culture) {
    queryParams.append('filter[culture][slug][_eq]', params.culture);
  }
  
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }

  const query = queryParams.toString();
  const response = await fetchApi<ApiResponse<Myth>>(
    `/items/myths_and_legends${query ? `?${query}` : ''}`
  );
  
  return response.data;
}

/**
 * Получает миф по URL-слагу
 * 
 * @param slug — URL-слаг мифа (например, "persefone_sale")
 * @returns Объект мифа
 * @throws Error если миф не найден
 * 
 * @example
 * ```ts
 * const myth = await getMythBySlug('persefone_sale');
 * ```
 */
export async function getMythBySlug(slug: string): Promise<Myth> {
  const response = await fetchApi<ApiResponse<Myth>>(
    `/items/myths_and_legends?filter[slug][_eq]=${slug}`
  );
  
  if (response.data.length === 0) {
    throw new Error(`Myth "${slug}" not found`);
  }
  
  return response.data[0];
}

/**
 * Получает список мифов конкретной культуры
 * 
 * @param culture — Slug культуры (например, "greek")
 * @returns Массив мифов этой культуры
 * 
 * @example
 * ```ts
 * const greekMyths = await getMythsByCulture('greek');
 * ```
 */
export async function getMythsByCulture(culture: string): Promise<Myth[]> {
  return getMyths({ culture });
}
