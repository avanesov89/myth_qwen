import Link from "next/link";
import { getCultures } from "@/lib/api/cultures";
import { getEntities } from "@/lib/api/entities";
import type { Culture, Entity } from "@/types";

export const dynamic = "force-dynamic";

export default async function GodsPage() {
  const [cultures, allEntities] = await Promise.all([
    getCultures().catch(() => []),
    getEntities().catch(() => []),
  ]);

  const gods = allEntities.filter((e) => e.entity_type === 1);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Все боги</h1>

      {/* Фильтр по культурам */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Фильтр по культуре:</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/gods"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Все
          </Link>
          {cultures.map((culture) => (
            <Link
              key={culture.id}
              href={`/gods?culture=${culture.slug}`}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              {culture.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Список богов */}
      {gods.length === 0 ? (
        <p className="text-gray-600">Боги пока не добавлены</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gods.map((god) => (
            <div key={god.id} className="block p-6 border rounded-lg">
              <h2 className="text-2xl font-semibold mb-2">{god.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                Культура: {god.mythology}
              </p>
              {god.excerpt && (
                <p className="text-gray-600">{god.excerpt}</p>
              )}
              <Link
                href={`/culture-${god.mythology}/gods/${god.slug}`}
                className="text-blue-600 hover:underline mt-4 inline-block"
              >
                Подробнее →
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
