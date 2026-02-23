/**
 * Карточка сущности (бог, герой, существо)
 * 
 * Отображает превью сущности с ссылкой на страницу.
 * Используется на страницах разделов (gods, heroes, creatures).
 * 
 * @example
 * ```tsx
 * <EntityCard 
 *   entity={{ id: 1, slug: 'zevs', title: 'Зевс', excerpt: 'Верховный бог...' }}
 *   cultureSlug="greek"
 *   type="gods"
 * />
 * ```
 */

import Link from "next/link";

interface EntityCardProps {
  /** Объект сущности для отображения */
  entity: {
    /** Уникальный ID сущности */
    id: number;
    /** URL-слаг для роутинга */
    slug: string;
    /** Название сущности */
    title: string;
    /** Краткое описание */
    excerpt?: string | null;
  };
  /** Slug культуры (например, "greek") */
  cultureSlug: string;
  /** Тип сущности для построения правильного URL */
  type: 'gods' | 'heroes' | 'creatures';
}

export default function EntityCard({ entity, cultureSlug, type }: EntityCardProps) {
  return (
    <Link
      href={`/${cultureSlug}/${type}/${entity.slug}`}
      className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
    >
      <h2 className="text-2xl font-semibold mb-2">{entity.title}</h2>
      {entity.excerpt && (
        <p className="text-gray-600">{entity.excerpt}</p>
      )}
    </Link>
  );
}
