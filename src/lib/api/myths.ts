// API для работы с мифами (myths_and_legends)

import { fetchApi } from './client';
import type { Myth, ApiResponse, QueryParams } from '@/types';

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

export async function getMythBySlug(slug: string): Promise<Myth> {
  const response = await fetchApi<ApiResponse<Myth>>(
    `/items/myths_and_legends?filter[slug][_eq]=${slug}`
  );
  
  if (response.data.length === 0) {
    throw new Error(`Myth "${slug}" not found`);
  }
  
  return response.data[0];
}

export async function getMythsByCulture(culture: string): Promise<Myth[]> {
  return getMyths({ culture });
}
