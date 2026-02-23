/**
 * API модуль — экспорт всех функций для работы с данными
 * 
 * Этот файл предоставляет удобный способ импорта всех API функций:
 * ```ts
 * import { getCultures, getGods, getMyths } from '@/lib/api';
 * ```
 * 
 * Вместо:
 * ```ts
 * import { getCultures } from '@/lib/api/cultures';
 * import { getGods } from '@/lib/api/entities';
 * import { getMyths } from '@/lib/api/myths';
 * ```
 */

export * from './client';
export * from './cultures';
export * from './entities';
export * from './myths';
