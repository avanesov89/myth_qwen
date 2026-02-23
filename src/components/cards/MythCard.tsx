/**
 * Карточка мифа
 * 
 * Отображает превью мифа с ссылкой на страницу.
 * Используется на страницах разделов мифов и на страницах богов.
 * 
 * @example
 * ```tsx
 * <MythCard 
 *   myth={{ 
 *     id: 1, 
 *     slug: 'persefone_sale', 
 *     title: 'Похищение Персефоны',
 *     prev_text: 'Краткое описание...'
 *   }}
 *   cultureSlug="greek"
 * />
 * ```
 */

import Link from "next/link";

interface MythCardProps {
  /** Объект мифа для отображения */
  myth: {
    /** Уникальный ID мифа */
    id: number;
    /** URL-слаг для роутинга */
    slug: string;
    /** Название мифа */
    title: string;
    /** Краткое описание/превью */
    prev_text?: string;
  };
  /** Slug культуры (например, "greek") */
  cultureSlug: string;
}

export default function MythCard({ myth, cultureSlug }: MythCardProps) {
  return (
    <Link
      href={`/${cultureSlug}/myths/${myth.slug}`}
      className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
    >
      <h2 className="text-2xl font-semibold mb-2">{myth.title}</h2>
      {myth.prev_text && (
        <p className="text-gray-600">
          {myth.prev_text.slice(0, 150)}...
        </p>
      )}
    </Link>
  );
}
