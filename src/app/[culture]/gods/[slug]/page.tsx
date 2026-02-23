import Link from "next/link";
import { notFound } from "next/navigation";
import { getCultureBySlug } from "@/lib/api/cultures";
import { getEntityBySlug, getGods } from "@/lib/api/entities";
import type { Entity } from "@/types";

interface GodPageProps {
  params: Promise<{ culture: string; slug: string }>;
}

// Генерируем пути на основе данных из API
export async function generateStaticParams() {
  const cultures = ["greek", "egypt", "scandinavian"];
  const allGods: Array<{ culture: string; slug: string }> = [];

  for (const culture of cultures) {
    try {
      const gods = await getGods(culture);
      gods.forEach((god) => {
        allGods.push({ culture, slug: god.slug });
      });
    } catch (error) {
      console.error(`Failed to fetch gods for ${culture}:`, error);
    }
  }

  console.log("Generated god paths:", allGods);
  return allGods;
}

// Загрузка связанных сущностей по ID
async function loadRelatedEntities(ids: number[]): Promise<Entity[]> {
  if (!ids || ids.length === 0) return [];
  
  const entities: Entity[] = [];
  for (const id of ids) {
    try {
      const response = await fetch(`http://localhost:8055/items/entities/${id}`);
      if (response.ok) {
        const data = await response.json();
        entities.push(data.data);
      }
    } catch (error) {
      console.error(`Failed to load entity ${id}:`, error);
    }
  }
  return entities;
}

// Страница рендерится динамически
export const dynamic = "force-dynamic";

export default async function GodPage({ params }: GodPageProps) {
  const { culture: cultureSlug, slug } = await params;

  console.log("Rendering god page:", { cultureSlug, slug });

  try {
    await getCultureBySlug(cultureSlug);
  } catch (error) {
    console.error("Culture not found:", cultureSlug);
    notFound();
  }

  let god: Entity;
  try {
    god = await getEntityBySlug(slug);
    console.log("Loaded entity:", JSON.stringify(god, null, 2));
  } catch (error) {
    console.error("Entity not found:", slug);
    notFound();
  }

  // Загружаем родителей и браки
  const [parents, marriages] = await Promise.all([
    loadRelatedEntities(god.parents || []),
    loadRelatedEntities(god.marriages || []),
  ]);

  return (
    <main className="container mx-auto px-4 py-8">
      <nav className="mb-4 text-sm">
        <Link href={`/${cultureSlug}`} className="text-blue-600 hover:underline">
          {cultureSlug}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/${cultureSlug}/gods`} className="text-blue-600 hover:underline">
          Боги
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{god.title}</span>
      </nav>

      <article>
        <h1 className="text-4xl font-bold mb-4">{god.title}</h1>

        {god.excerpt && (
          <div className="text-xl text-gray-600 mb-6">
            {god.excerpt}
          </div>
        )}

        <dl className="space-y-4">
          {god.belonging && (
            <div>
              <dt className="font-semibold">Принадлежность:</dt>
              <dd>{god.belonging}</dd>
            </div>
          )}

          {god.gender && (
            <div>
              <dt className="font-semibold">Пол:</dt>
              <dd>{god.gender === 'male' ? 'Мужской' : god.gender === 'female' ? 'Женский' : god.gender}</dd>
            </div>
          )}

          {god.transcript && (
            <div>
              <dt className="font-semibold">Транскрипция:</dt>
              <dd>{god.transcript}</dd>
            </div>
          )}

          {god.first_mention && (
            <div>
              <dt className="font-semibold">Первое упоминание:</dt>
              <dd>{god.first_mention}</dd>
            </div>
          )}

          {parents.length > 0 && (
            <div>
              <dt className="font-semibold">Родители:</dt>
              <dd>
                <ul className="list-disc list-inside">
                  {parents.map((parent) => (
                    <li key={parent.id}>
                      <Link
                        href={`/${cultureSlug}/gods/${parent.slug}`}
                        className="text-blue-600 hover:underline"
                      >
                        {parent.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}

          {marriages.length > 0 && (
            <div>
              <dt className="font-semibold">Брачные союзы:</dt>
              <dd>
                <ul className="list-disc list-inside">
                  {marriages.map((spouse) => (
                    <li key={spouse.id}>
                      <Link
                        href={`/${cultureSlug}/gods/${spouse.slug}`}
                        className="text-blue-600 hover:underline"
                      >
                        {spouse.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      </article>
    </main>
  );
}
