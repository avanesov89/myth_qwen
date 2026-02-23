import Link from "next/link";
import { notFound } from "next/navigation";
import { getCultureBySlug } from "@/lib/api/cultures";
import { getEntityBySlug, getHeroes } from "@/lib/api/entities";
import type { Entity } from "@/types";

interface HeroPageProps {
  params: Promise<{ culture: string; slug: string }>;
}

export async function generateStaticParams() {
  const cultures = ["greek", "egypt", "scandinavian"];
  const allHeroes: Array<{ culture: string; slug: string }> = [];
  
  for (const culture of cultures) {
    try {
      const heroes = await getHeroes(culture);
      heroes.forEach((hero) => {
        allHeroes.push({ culture, slug: hero.slug });
      });
    } catch (error) {
      // ignore
    }
  }
  
  return allHeroes;
}

export default async function HeroPage({ params }: HeroPageProps) {
  const { culture: cultureSlug, slug } = await params;
  
  try {
    await getCultureBySlug(cultureSlug);
  } catch (error) {
    notFound();
  }

  let hero: Entity;
  try {
    hero = await getEntityBySlug(slug);
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
        <Link href={`/${cultureSlug}/heroes`} className="text-blue-600 hover:underline">
          Герои
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{hero.title}</span>
      </nav>

      <article>
        <h1 className="text-4xl font-bold mb-4">{hero.title}</h1>
        
        {hero.excerpt && (
          <div className="text-xl text-gray-600 mb-6">
            {hero.excerpt}
          </div>
        )}

        {hero.gender && (
          <div className="mb-4">
            <strong>Пол:</strong> {hero.gender === 'male' ? 'Мужской' : 'Женский'}
          </div>
        )}
      </article>
    </main>
  );
}
