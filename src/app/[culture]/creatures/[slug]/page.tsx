import Link from "next/link";
import { notFound } from "next/navigation";
import { getCultureBySlug } from "@/lib/api/cultures";
import { getEntityBySlug, getCreatures } from "@/lib/api/entities";
import type { Entity } from "@/types";

interface CreaturePageProps {
  params: Promise<{ culture: string; slug: string }>;
}

export async function generateStaticParams() {
  const cultures = ["greek", "egypt", "scandinavian"];
  const allCreatures: Array<{ culture: string; slug: string }> = [];
  
  for (const culture of cultures) {
    try {
      const creatures = await getCreatures(culture);
      creatures.forEach((creature) => {
        allCreatures.push({ culture, slug: creature.slug });
      });
    } catch (error) {
      // ignore
    }
  }
  
  return allCreatures;
}

export default async function CreaturePage({ params }: CreaturePageProps) {
  const { culture: cultureSlug, slug } = await params;
  
  try {
    await getCultureBySlug(cultureSlug);
  } catch (error) {
    notFound();
  }

  let creature: Entity;
  try {
    creature = await getEntityBySlug(slug);
  } catch (error) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <nav className="mb-4 text-sm">
        <Link href={`/${cultureSlug}`} className="text-blue-600 hover:underline">
          {cultureSlug}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/${cultureSlug}/creatures`} className="text-blue-600 hover:underline">
          Существa
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{creature.title}</span>
      </nav>

      <article>
        <h1 className="text-4xl font-bold mb-4">{creature.title}</h1>
        
        {creature.excerpt && (
          <div className="text-xl text-gray-600 mb-6">
            {creature.excerpt}
          </div>
        )}

        {creature.belonging && (
          <div className="mb-4">
            <strong>Тип:</strong> {creature.belonging}
          </div>
        )}
      </article>
    </main>
  );
}
