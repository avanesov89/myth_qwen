// API для работы с сущностями (entities) - боги, герои, существа

import { fetchApi } from './client';
import type { Entity, ApiResponse, QueryParams } from '@/types';

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

export async function getEntityBySlug(slug: string): Promise<Entity> {
  const response = await fetchApi<ApiResponse<Entity>>(
    `/items/entities?filter[slug][_eq]=${slug}`
  );
  
  if (response.data.length === 0) {
    throw new Error(`Entity "${slug}" not found`);
  }
  
  return response.data[0];
}

export async function getGods(culture?: string): Promise<Entity[]> {
  // entity_type: 1 = Бог (из API)
  const params: QueryParams = culture ? { culture } : {};
  const entities = await getEntities(params);
  return entities.filter(e => e.entity_type === 1);
}

export async function getHeroes(culture?: string): Promise<Entity[]> {
  // entity_type: 2 = Герой (из API)
  const entities = await getEntities(culture ? { culture } : undefined);
  return entities.filter(e => e.entity_type === 2);
}

export async function getCreatures(culture?: string): Promise<Entity[]> {
  // entity_type: 4 = Существо (из API)
  const entities = await getEntities(culture ? { culture } : undefined);
  return entities.filter(e => e.entity_type === 4);
}
