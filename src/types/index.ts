// Типы для мифологических сущностей

export interface Culture {
  id: number;
  slug: string;
  title: string;
  description: string;
  status: string;
  sort?: number | null;
  date_created?: string;
}

export interface EntityType {
  id: number;
  slug: string;
  title: string;
  description: string;
  status: string;
  sort?: number | null;
  main_img?: string | null;
}

export interface Entity {
  id: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  description?: string | null;
  status: string;
  sort?: number | null;
  date_created?: string;
  main_image?: string | null;
  entity_type: number;
  mythology: number;
  gender?: 'male' | 'female' | null;
  belonging?: string | null;
  first_mention?: string | null;
  transcript?: string | null;
  gallery?: string[];
  parents?: number[];
  marriages?: number[];
  seo_title?: string | null;
  seo_description?: string | null;
  tags?: string[] | null;
}

export interface Myth {
  id: number;
  slug: string;
  title: string;
  prev_text: string;
  content: string;
  status: string;
  sort?: number | null;
  date_created?: string;
  date_updated?: string | null;
  culture: number;
  images?: string[];
  img?: string | null;
}

// Типы для API ответов
export interface ApiResponse<T> {
  data: T[];
}

export interface ApiSingleResponse<T> {
  data: T;
}

// Параметры для запросов
export interface QueryParams {
  culture?: string;
  participant?: string;
  limit?: number;
  offset?: number;
  sort?: string;
}
