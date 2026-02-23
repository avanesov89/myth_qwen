/**
 * Layout для страниц культуры
 * 
 * Обёртывает все страницы внутри /{culture}/...
 * Отвечает за генерацию SEO метаданных для культуры.
 * 
 * URL: /{culture}/...
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts
 */

import type { Metadata } from "next";
import { getCultureBySlug } from "@/lib/api/cultures";

/** Параметры для генерации метаданных */
interface CulturePageProps {
  params: Promise<{ culture: string }>;
}

/**
 * Генерирует SEO метаданные для страницы культуры
 * 
 * @param params — Параметры маршрута (slug культуры)
 * @returns Metadata объект для Next.js
 */
export async function generateMetadata({ params }: CulturePageProps): Promise<Metadata> {
  const { culture: cultureSlug } = await params;
  
  try {
    const culture = await getCultureBySlug(cultureSlug);
    return {
      title: `${culture.title} — Мифологический портал`,
      description: culture.description?.replace(/<[^>]*>/g, '').slice(0, 160),
      openGraph: {
        title: `${culture.title} — Мифологический портал`,
        description: culture.description?.replace(/<[^>]*>/g, '').slice(0, 160),
      },
    };
  } catch (error) {
    return {
      title: "Культура не найдена",
    };
  }
}

/**
 * Layout компонент для культуры
 * 
 * @param children — Дочерние компоненты (страницы разделов)
 * @returns JSX layout с children
 */
export default function CultureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
