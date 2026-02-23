// API для работы с культурами (mythologies)

import { fetchApi } from './client';
import type { Culture, ApiResponse } from '@/types';

export async function getCultures(): Promise<Culture[]> {
  const response = await fetchApi<ApiResponse<Culture>>('/items/mythologies');
  return response.data;
}

export async function getCultureBySlug(slug: string): Promise<Culture> {
  const response = await fetchApi<ApiResponse<Culture>>(
    `/items/mythologies?filter[slug][_eq]=${slug}`
  );
  
  if (response.data.length === 0) {
    throw new Error(`Culture "${slug}" not found`);
  }
  
  return response.data[0];
}

export async function getCultureById(id: number): Promise<Culture> {
  const response = await fetchApi<ApiResponse<Culture>>(
    `/items/mythologies?filter[id][_eq]=${id}`
  );
  
  if (response.data.length === 0) {
    throw new Error(`Culture with id ${id} not found`);
  }
  
  return response.data[0];
}
