/**
 * Карточка культуры для главной страницы
 * 
 * Отображает превью культуры/мифологии с ссылкой на страницу.
 * Используется на главной странице для отображения карты регионов.
 * 
 * @example
 * ```tsx
 * <CultureCard culture={{
 *   id: 4,
 *   slug: 'greek',
 *   title: 'Греческая мифология',
 *   description: '<p>Описание...</p>'
 * }} />
 * ```
 */

import Link from "next/link";

interface CultureCardProps {
  /** Объект культуры для отображения */
  culture: {
    /** Уникальный ID культуры */
    id: number;
    /** URL-слаг для роутинга */
    slug: string;
    /** Название культуры */
    title: string;
    /** HTML-описание (будет очищено от тегов) */
    description?: string;
  };
}

export default function CultureCard({ culture }: CultureCardProps) {
  // Очищаем HTML-теги из описания для отображения текста
  const plainDescription = culture.description?.replace(/<[^>]*>/g, '') || '';

  return (
    <Link
      href={`/${culture.slug}`}
      className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
    >
      <h2 className="text-2xl font-semibold mb-2">{culture.title}</h2>
      <p className="text-gray-600">
        {plainDescription.slice(0, 150)}
        {plainDescription.length > 150 ? '...' : ''}
      </p>
    </Link>
  );
}
