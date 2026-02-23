import Link from "next/link";
import { notFound } from "next/navigation";
import { getCultureBySlug } from "@/lib/api/cultures";
import { getCreatures } from "@/lib/api/entities";
import type { Entity } from "@/types";

interface CreaturesPageProps {
  params: Promise<{ culture: string }>;
}

export async function generateStaticParams() {
  const cultures = ["greek", "egypt", "scandinavian"];
  return cultures.map((culture) => ({ culture }));
}

export default async function CreaturesPage({ params }: CreaturesPageProps) {
  const { culture: cultureSlug } = await params;
  
  try {
    await getCultureBySlug(cultureSlug);
  } catch (error) {
    notFound();
  }

  const creatures = await getCreatures(cultureSlug).catch(() => []);

  return (
    <main className="container mx-auto px-4 py-8">
      <nav className="mb-4 text-sm">
        <Link href={`/${cultureSlug}`} className="text-blue-600 hover:underline">
          {cultureSlug}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">Существа</span>
      </nav>

      <h1 className="text-4xl font-bold mb-8">Существа {cultureSlug}</h1>

      {creatures.length === 0 ? (
        <p className="text-gray-600">Существа пока не добавлены</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creatures.map((creature) => (
            <Link
              key={creature.id}
              href={`/${cultureSlug}/creatures/${creature.slug}`}
              className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-2">{creature.title}</h2>
              {creature.excerpt && (
                <p className="text-gray-600">{creature.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
