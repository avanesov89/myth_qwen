/**
 * Компонент навигационных "хлебных крошек" (Breadcrumbs)
 * 
 * Отображает цепочку навигации для текущей страницы.
 * Используется на всех страницах для улучшения UX и SEO.
 * 
 * @example
 * ```tsx
 * <Breadcrumbs items={[
 *   { label: 'Главная', href: '/' },
 *   { label: 'Греция', href: '/greek' },
 *   { label: 'Боги', href: '/greek/gods' },
 *   { label: 'Зевс' } // без href — текущая страница
 * ]} />
 * ```
 */

import Link from "next/link";

/** Элемент хлебных крошек */
interface BreadcrumbItem {
  /** Текст ссылки */
  label: string;
  /** URL для перехода (не указывается для текущей страницы) */
  href?: string;
}

interface BreadcrumbsProps {
  /** Массив элементов навигации */
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="mb-4 text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {/* Разделитель между элементами */}
            {index > 0 && <span className="mx-2 text-gray-400">/</span>}
            
            {/* Ссылка или текст */}
            {item.href ? (
              <Link
                href={item.href}
                className="text-blue-600 hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-600">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
