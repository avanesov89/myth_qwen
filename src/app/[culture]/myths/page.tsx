import Link from "next/link";
import { notFound } from "next/navigation";
import { getCultureBySlug } from "@/lib/api/cultures";
import { getMyths } from "@/lib/api/myths";
import type { Myth } from "@/types";

interface MythsPageProps {
  params: Promise<{ culture: string }>;
}

export async function generateStaticParams() {
  const cultures = ["greek", "egypt", "scandinavian"];
  return cultures.map((culture) => ({ culture }));
}

export default async function MythsPage({ params }: MythsPageProps) {
  const { culture: cultureSlug } = await params;
  
  try {
    await getCultureBySlug(cultureSlug);
  } catch (error) {
    notFound();
  }

  const myths = await getMyths({ culture: cultureSlug }).catch(() => []);

  return (
    <main className="container mx-auto px-4 py-8">
      <nav className="mb-4 text-sm">
        <Link href={`/${cultureSlug}`} className="text-blue-600 hover:underline">
          {cultureSlug}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">Мифы</span>
      </nav>

      <h1 className="text-4xl font-bold mb-8">Мифы {cultureSlug}</h1>

      {myths.length === 0 ? (
        <p className="text-gray-600">Мифы пока не добавлены</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myths.map((myth) => (
            <Link
              key={myth.id}
              href={`/${cultureSlug}/myths/${myth.slug}`}
              className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-2">{myth.title}</h2>
              {myth.prev_text && (
                <p className="text-gray-600">{myth.prev_text.slice(0, 150)}...</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
