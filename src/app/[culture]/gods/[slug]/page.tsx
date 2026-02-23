/**
 * Страница бога
 * 
 * Отображает подробную информацию о божестве:
 * - Имя и описание
 * - Основное изображение
 * - Галерея
 * - Характеристики (пол, принадлежность, транскрипция)
 * - Родители и брачные союзы (с ссылками)
 * - Мифы с участием этого бога
 * 
 * URL: /{culture}/gods/{slug}
 * Примеры: /greek/gods/zevs, /greek/gods/aid
 * 
 * @feature
 * - Динамический роутинг по slug
 * - Загрузка M2M связей (родители, браки, мифы)
 * - Загрузка изображений из Directus Files
 * - SSR для актуальных данных
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCultureBySlug } from "@/lib/api/cultures";
import { getGods } from "@/lib/api/entities";
import type { Entity } from "@/types";

/** Параметры страницы бога */
interface GodPageProps {
  params: Promise<{ culture: string; slug: string }>;
}

/** Базовый URL API Directus */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8055';

/**
 * Генерирует статические пути для SSG
 * 
 * Загружает всех богов из известных культур и создаёт
 * пути для предварительной генерации.
 * 
 * @returns Массив путей вида {culture: 'greek', slug: 'zevs'}
 */
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

/**
 * Загружает мифы, где участвует указанный бог
 * 
 * M2M связь: myths_and_legends.gods — массив объектов
 * с полем entities_id. Фильтруем мифы по этому полю.
 * 
 * @param godId — ID бога в коллекции entities
 * @returns Массив мифов с этим богом
 */
async function loadMythsByGodId(godId: number): Promise<any[]> {
  try {
    // Загружаем все мифы с полями gods (M2M relation)
    const response = await fetch(
      `${API_BASE_URL}/items/myths_and_legends?fields=id,title,slug,prev_text,culture,gods.entities_id`
    );
    if (response.ok) {
      const data = await response.json();
      const allMyths = data.data || [];
      console.log("All myths:", allMyths);
      console.log("Filtering for godId:", godId);
      // Фильтруем мифы, где gods содержит entities_id = godId
      const filtered = allMyths.filter((myth: any) => 
        Array.isArray(myth.gods) && myth.gods.some((g: any) => g.entities_id === godId)
      );
      console.log("Filtered myths:", filtered);
      return filtered;
    }
  } catch (error) {
    console.warn(`Failed to load myths for god ${godId}:`, error);
  }
  return [];
}

/**
 * Загружает связанные сущности по ID (для родителей и браков)
 * 
 * @param ids — Массив ID сущностей
 * @returns Массив объектов сущностей
 */
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

/** Страница рендерится динамически на каждом запросе */
export const dynamic = "force-dynamic";

/**
 * Главный компонент страницы бога
 * 
 * @param params — Параметры маршрута (culture, slug)
 * @returns JSX страницы бога
 */
export default async function GodPage({ params }: GodPageProps) {
  const { culture: cultureSlug, slug } = await params;

  // Проверяем существование культуры
  try {
    await getCultureBySlug(cultureSlug);
  } catch (error) {
    console.error("Culture not found:", cultureSlug);
    notFound();
  }

  // Получаем ID сущности по slug (фильтрация на клиенте т.к. filter не работает)
  let entityId: number | null = null;
  try {
    const response = await fetch(`${API_BASE_URL}/items/entities?fields=id,slug`);
    if (response.ok) {
      const data = await response.json();
      const entity = data.data?.find((e: any) => e.slug === slug);
      if (entity) {
        entityId = entity.id;
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

  // Загружаем мифы с этим богом
  const myths = await loadMythsByGodId(entityId);

  // Извлекаем ID родителей и браков из M2M relations
  const parentIds = god.parents?.map((p: any) => p.related_entities_id).filter(Boolean) || [];
  const marriageIds = god.marriages?.map((m: any) => m.related_entities_id).filter(Boolean) || [];

  // Загружаем объекты родителей и супругов
  const [parents, marriages] = await Promise.all([
    loadRelatedEntities(parentIds),
    loadRelatedEntities(marriageIds),
  ]);

  // URL основного изображения
  const mainImageUrl = god.main_image 
    ? `${API_BASE_URL}/assets/${god.main_image}` 
    : null;

  // Массив URL изображений галереи (directus_files_id из M2M)
  const galleryFileIds = god.gallery?.map((g: any) => g.directus_files_id).filter(Boolean) || [];
  const galleryImages = galleryFileIds.map((id: string) => `${API_BASE_URL}/assets/${id}`);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Хлебные крошки */}
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
        {/* Заголовок */}
        <h1 className="text-4xl font-bold mb-4">{god.title}</h1>

        {/* Описание */}
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

        {/* Характеристики */}
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

          {/* Родители */}
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

          {/* Брачные союзы */}
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

        {/* Мифы с участием бога */}
        {myths.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Мифы с участием {god.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myths.map((myth) => (
                <Link
                  key={myth.id}
                  href={`/${myth.culture?.slug || cultureSlug}/myths/${myth.slug}`}
                  className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">{myth.title}</h3>
                  {myth.prev_text && (
                    <p className="text-gray-600 text-sm">
                      {myth.prev_text.slice(0, 150)}...
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

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
