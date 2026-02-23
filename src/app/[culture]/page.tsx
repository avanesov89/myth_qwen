import Link from "next/link";
import { notFound } from "next/navigation";
import { getCultureBySlug, getCultures } from "@/lib/api/cultures";
import { getGods, getHeroes, getMyths, getCreatures } from "@/lib/api";
import type { Culture } from "@/types";

interface CulturePageProps {
  params: Promise<{ culture: string }>;
}

export async function generateStaticParams() {
  try {
    const cultures = await getCultures();
    return cultures.map((culture) => ({
      culture: culture.slug,
    }));
  } catch (error) {
    return [];
  }
}

export default async function CulturePage({ params }: CulturePageProps) {
  const { culture: cultureSlug } = await params;
  
  let culture: Culture;
  try {
    culture = await getCultureBySlug(cultureSlug);
  } catch (error) {
    notFound();
  }

  const [gods, heroes, myths, creatures] = await Promise.all([
    getGods(cultureSlug).catch(() => []),
    getHeroes(cultureSlug).catch(() => []),
    getMyths({ culture: cultureSlug }).catch(() => []),
    getCreatures(cultureSlug).catch(() => []),
  ]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{culture.title}</h1>
      <p className="text-gray-600 mb-8">
        {culture.description?.replace(/<[^>]*>/g, '')}
      </p>

      <nav className="mb-8">
        <ul className="flex flex-wrap gap-4">
          <li>
            <Link
              href={`/${cultureSlug}/gods`}
              className="text-blue-600 hover:underline"
            >
              Боги ({gods.length})
            </Link>
          </li>
          <li>
            <Link
              href={`/${cultureSlug}/heroes`}
              className="text-blue-600 hover:underline"
            >
              Герои ({heroes.length})
            </Link>
          </li>
          <li>
            <Link
              href={`/${cultureSlug}/myths`}
              className="text-blue-600 hover:underline"
            >
              Мифы ({myths.length})
            </Link>
          </li>
          <li>
            <Link
              href={`/${cultureSlug}/creatures`}
              className="text-blue-600 hover:underline"
            >
              Существa ({creatures.length})
            </Link>
          </li>
        </ul>
      </nav>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gods.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Боги</h2>
            <ul className="space-y-2">
              {gods.slice(0, 5).map((god) => (
                <li key={god.id}>
                  <Link
                    href={`/${cultureSlug}/gods/${god.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {god.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {myths.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Мифы</h2>
            <ul className="space-y-2">
              {myths.slice(0, 5).map((myth) => (
                <li key={myth.id}>
                  <Link
                    href={`/${cultureSlug}/myths/${myth.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {myth.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>
    </main>
  );
}
