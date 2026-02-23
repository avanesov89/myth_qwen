/**
 * Корневой layout приложения
 * 
 * Определяет общую структуру всех страниц:
 * - HTML язык (ru)
 * - Глобальные стили
 * - SEO метаданные по умолчанию
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts
 */

import type { Metadata } from "next";
import "./globals.css";

/**
 * SEO метаданные для главной страницы
 * 
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export const metadata: Metadata = {
  title: "Мифологический портал",
  description: "Энциклопедия мифологии разных культур",
};

/**
 * Корневой layout компонент
 * 
 * @param children — Дочерние компоненты (контент страниц)
 * @returns HTML структура с <html> и <body>
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  );
}
