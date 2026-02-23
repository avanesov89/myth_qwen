/**
 * API модуль для работы с культурами/мифологиями
 * 
 * Предоставляет функции для загрузки данных о культурах из Directus.
 * Данные хранятся в коллекции "mythologies".
 * 
 * @example
 * ```ts
 * const cultures = await getCultures();
 * const greek = await getCultureBySlug('greek');
 * ```
 */

import { fetchApi } from './client';
import type { Culture, ApiResponse } from '@/types';

/**
 * Получает список всех культур
 * 
 * @returns Массив всех доступных культур
 * @throws Error при ошибке API
 * 
 * @example
 * ```ts
 * const cultures = await getCultures();
 * //返回: [{id: 4, slug: "greek", title: "Греческая мифология"}, ...]
 * ```
 */
export async function getCultures(): Promise<Culture[]> {
  const response = await fetchApi<ApiResponse<Culture>>('/items/mythologies');
  return response.data;
}

/**
 * Получает культуру по URL-слагу
 * 
 * @param slug — URL-слаг культуры (например, "greek", "egypt")
 * @returns Объект культуры
 * @throws Error если культура не найдена
 * 
 * @example
 * ```ts
 * const greek = await getCultureBySlug('greek');
 * ```
 */
export async function getCultureBySlug(slug: string): Promise<Culture> {
  const response = await fetchApi<ApiResponse<Culture>>(
    `/items/mythologies?filter[slug][_eq]=${slug}`
  );
  
  if (response.data.length === 0) {
    throw new Error(`Culture "${slug}" not found`);
  }
  
  return response.data[0];
}

/**
 * Получает культуру по ID
 * 
 * @param id — Уникальный идентификатор культуры
 * @returns Объект культуры
 * @throws Error если культура не найдена
 * 
 * @example
 * ```ts
 * const greek = await getCultureById(4);
 * ```
 */
export async function getCultureById(id: number): Promise<Culture> {
  const response = await fetchApi<ApiResponse<Culture>>(
    `/items/mythologies?filter[id][_eq]=${id}`
  );
  
  if (response.data.length === 0) {
    throw new Error(`Culture with id ${id} not found`);
  }
  
  return response.data[0];
}
