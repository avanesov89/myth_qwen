import Link from "next/link";
import { notFound } from "next/navigation";
import { getCultureBySlug } from "@/lib/api/cultures";
import { getHeroes } from "@/lib/api/entities";
import type { Entity } from "@/types";

interface HeroesPageProps {
  params: Promise<{ culture: string }>;
}

export async function generateStaticParams() {
  const cultures = ["greek", "egypt", "scandinavian"];
  return cultures.map((culture) => ({ culture }));
}

export default async function HeroesPage({ params }: HeroesPageProps) {
  const { culture: cultureSlug } = await params;
  
  try {
    await getCultureBySlug(cultureSlug);
  } catch (error) {
    notFound();
  }

  const heroes = await getHeroes(cultureSlug).catch(() => []);

  return (
    <main className="container mx-auto px-4 py-8">
      <nav className="mb-4 text-sm">
        <Link href={`/${cultureSlug}`} className="text-blue-600 hover:underline">
          {cultureSlug}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">Герои</span>
      </nav>

      <h1 className="text-4xl font-bold mb-8">Герои {cultureSlug}</h1>

      {heroes.length === 0 ? (
        <p className="text-gray-600">Герои пока не добавлены</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroes.map((hero) => (
            <Link
              key={hero.id}
              href={`/${cultureSlug}/heroes/${hero.slug}`}
              className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-2">{hero.title}</h2>
              {hero.excerpt && (
                <p className="text-gray-600">{hero.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
