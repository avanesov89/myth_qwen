import Link from "next/link";
import { getCultures } from "@/lib/api/cultures";
import type { Culture } from "@/types";

export const dynamic = "force-dynamic";

async function getRegions(): Promise<Culture[]> {
  try {
    return await getCultures();
  } catch (error) {
    console.error("Failed to fetch cultures:", error);
    return [];
  }
}

export default async function HomePage() {
  const cultures = await getRegions();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Мифологический портал
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Выберите культуру для изучения мифологии
      </p>
      
      {cultures.length === 0 ? (
        <p className="text-center text-gray-500">
          Культуры пока не добавлены
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cultures.map((culture) => (
            <Link
              key={culture.id}
              href={`/${culture.slug}`}
              className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-2">
                {culture.title}
              </h2>
              <p className="text-gray-600">
                {culture.description?.replace(/<[^>]*>/g, '').slice(0, 150)}
                {culture.description && culture.description.length > 150 ? '...' : ''}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
