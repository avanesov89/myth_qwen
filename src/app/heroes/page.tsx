import Link from "next/link";
import { getEntities } from "@/lib/api/entities";
import type { Entity } from "@/types";

export const dynamic = "force-dynamic";

export default async function HeroesPage() {
  const allEntities = await getEntities().catch(() => []);
  const heroes = allEntities.filter((e) => e.entity_type === 2);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Все герои</h1>

      {heroes.length === 0 ? (
        <p className="text-gray-600">Герои пока не добавлены</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroes.map((hero) => (
            <div key={hero.id} className="block p-6 border rounded-lg">
              <h2 className="text-2xl font-semibold mb-2">{hero.title}</h2>
              {hero.excerpt && (
                <p className="text-gray-600">{hero.excerpt}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
