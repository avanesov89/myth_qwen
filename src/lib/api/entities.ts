/**
 * API модуль для работы с сущностями (боги, герои, существа)
 * 
 * Предоставляет функции для загрузки данных о мифологических персонажах.
 * Все сущности хранятся в коллекции "entities" и различаются по полю entity_type:
 * - 1 = Бог
 * - 2 = Герой
 * - 4 = Существо
 * - 6 = Титан
 * 
 * @example
 * ```ts
 * const gods = await getGods('greek');
 * const zeus = await getEntityBySlug('zevs');
 * ```
 */

import { fetchApi } from './client';
import type { Entity, ApiResponse, QueryParams } from '@/types';

/**
 * Получает список сущностей с фильтрацией и пагинацией
 * 
 * @param params — Параметры запроса (культура, лимит, offset)
 * @returns Массив сущностей
 * @throws Error при ошибке API
 * 
 * @example
 * ```ts
 * // Все сущности
 * const all = await getEntities();
 * 
 * // Только греческие
 * const greek = await getEntities({ culture: 'greek' });
 * 
 * // С пагинацией
 * const page = await getEntities({ limit: 10, offset: 20 });
 * ```
 */
export async function getEntities(params?: QueryParams): Promise<Entity[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.culture) {
    queryParams.append('filter[mythology][slug][_eq]', params.culture);
  }
  
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  
  if (params?.offset) {
    queryParams.append('offset', params.offset.toString());
  }

  const query = queryParams.toString();
  const response = await fetchApi<ApiResponse<Entity>>(
    `/items/entities${query ? `?${query}` : ''}`
  );
  
  return response.data;
}

/**
 * Получает сущность по URL-слагу
 * 
 * @param slug — URL-слаг сущности (например, "zevs", "aid")
 * @returns Объект сущности
 * @throws Error если сущность не найдена
 * 
 * @example
 * ```ts
 * const zeus = await getEntityBySlug('zevs');
 * ```
 */
export async function getEntityBySlug(slug: string): Promise<Entity> {
  const response = await fetchApi<ApiResponse<Entity>>(
    `/items/entities?filter[slug][_eq]=${slug}`
  );
  
  if (response.data.length === 0) {
    throw new Error(`Entity "${slug}" not found`);
  }
  
  return response.data[0];
}

/**
 * Получает список богов (entity_type = 1)
 * 
 * @param culture — Опциональный фильтр по культуре (slug)
 * @returns Массив богов
 * 
 * @example
 * ```ts
 * // Все боги
 * const allGods = await getGods();
 * 
 * // Только греческие боги
 * const greekGods = await getGods('greek');
 * ```
 */
export async function getGods(culture?: string): Promise<Entity[]> {
  const params: QueryParams = culture ? { culture } : {};
  const entities = await getEntities(params);
  return entities.filter(e => e.entity_type === 1);
}

/**
 * Получает список героев (entity_type = 2)
 * 
 * @param culture — Опциональный фильтр по культуре (slug)
 * @returns Массив героев
 * 
 * @example
 * ```ts
 * const greekHeroes = await getHeroes('greek');
 * ```
 */
export async function getHeroes(culture?: string): Promise<Entity[]> {
  const entities = await getEntities(culture ? { culture } : undefined);
  return entities.filter(e => e.entity_type === 2);
}

/**
 * Получает список существ (entity_type = 4)
 * 
 * @param culture — Опциональный фильтр по культуре (slug)
 * @returns Массив существ
 * 
 * @example
 * ```ts
 * const norseCreatures = await getCreatures('norse');
 * ```
 */
export async function getCreatures(culture?: string): Promise<Entity[]> {
  const entities = await getEntities(culture ? { culture } : undefined);
  return entities.filter(e => e.entity_type === 4);
}
