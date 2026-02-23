import { getEntities } from "@/lib/api/entities";
import type { Entity } from "@/types";

export const dynamic = "force-dynamic";

export default async function CreaturesPage() {
  const allEntities = await getEntities().catch(() => []);
  const creatures = allEntities.filter((e) => e.entity_type === 4);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Все существа</h1>

      {creatures.length === 0 ? (
        <p className="text-gray-600">Существа пока не добавлены</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creatures.map((creature) => (
            <div key={creature.id} className="block p-6 border rounded-lg">
              <h2 className="text-2xl font-semibold mb-2">{creature.title}</h2>
              {creature.excerpt && (
                <p className="text-gray-600">{creature.excerpt}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
