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
    console.log("Loaded entity:", god);
  } catch (error) {
    console.error("Entity not found:", slug);
    notFound();
  }

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

        {god.belonging && (
          <div className="mb-4">
            <strong>Принадлежность:</strong> {god.belonging}
          </div>
        )}

        {god.gender && (
          <div className="mb-4">
            <strong>Пол:</strong> {god.gender === 'male' ? 'Мужской' : 'Женский'}
          </div>
        )}

        {god.transcript && (
          <div className="mb-4">
            <strong>Транскрипция:</strong> {god.transcript}
          </div>
        )}

        {god.first_mention && (
          <div className="mb-4">
            <strong>Первое упоминание:</strong> {god.first_mention}
          </div>
        )}
      </article>
    </main>
  );
}
