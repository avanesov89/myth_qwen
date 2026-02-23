// Базовый API клиент для Directus

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8055';

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

export function getApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}
