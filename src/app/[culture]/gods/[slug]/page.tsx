import Link from "next/link";
import { notFound } from "next/navigation";
import { getCultureBySlug } from "@/lib/api/cultures";
import { getEntityBySlug, getGods } from "@/lib/api/entities";
import type { Entity } from "@/types";

interface GodPageProps {
  params: Promise<{ culture: string; slug: string }>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8055';

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

// Загрузка связанных сущностей по ID (для parents/marriages)
async function loadRelatedEntities(ids: number[]): Promise<Entity[]> {
  if (!ids || ids.length === 0) return [];
  
  const entities: Entity[] = [];
  for (const id of ids) {
    try {
      const response = await fetch(`${API_BASE_URL}/items/entities/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          entities.push(data.data);
        }
      }
    } catch (error) {
      console.warn(`Entity ${id} not found or inaccessible:`, error);
    }
  }
  return entities;
}

// Страница рендерится динамически
export const dynamic = "force-dynamic";

export default async function GodPage({ params }: GodPageProps) {
  const { culture: cultureSlug, slug } = await params;

  try {
    await getCultureBySlug(cultureSlug);
  } catch (error) {
    console.error("Culture not found:", cultureSlug);
    notFound();
  }

  // Сначала получаем ID сущности по slug
  let entityId: number | null = null;
  try {
    const response = await fetch(`${API_BASE_URL}/items/entities?filter[slug][_eq]=${slug}&fields=id`);
    if (response.ok) {
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        entityId = data.data[0].id;
      }
    }
  } catch (error) {
    console.error("Failed to get entity ID:", slug);
  }

  // Загружаем сущность с relations по ID
  let god: any;
  try {
    if (!entityId) {
      notFound();
    }
    const response = await fetch(`${API_BASE_URL}/items/entities/${entityId}?fields=*,gallery.*,parents.*,marriages.*`);
    if (!response.ok) {
      notFound();
    }
    const data = await response.json();
    if (!data.data) {
      notFound();
    }
    god = data.data;
  } catch (error) {
    console.error("Entity not found:", slug);
    notFound();
  }

  // Извлекаем ID родителей и браков из relations
  const parentIds = god.parents?.map((p: any) => p.related_entities_id).filter(Boolean) || [];
  const marriageIds = god.marriages?.map((m: any) => m.related_entities_id).filter(Boolean) || [];

  // Загружаем родителей и браки
  const [parents, marriages] = await Promise.all([
    loadRelatedEntities(parentIds),
    loadRelatedEntities(marriageIds),
  ]);

  // URL изображения (main_image может быть UUID или ID)
  const mainImageUrl = god.main_image 
    ? `${API_BASE_URL}/assets/${god.main_image}` 
    : null;

  // Галерея - извлекаем directus_files_id из relations
  const galleryFileIds = god.gallery?.map((g: any) => g.directus_files_id).filter(Boolean) || [];
  const galleryImages = galleryFileIds.map((id: string) => `${API_BASE_URL}/assets/${id}`);

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

        {/* Основное изображение */}
        {mainImageUrl && (
          <div className="mb-6">
            <img 
              src={mainImageUrl} 
              alt={god.title}
              className="w-full max-w-2xl h-auto rounded-lg shadow-lg"
            />
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

        {/* Галерея */}
        {galleryImages.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Галерея</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((imgUrl: string, index: number) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`${god.title} - изображение ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
