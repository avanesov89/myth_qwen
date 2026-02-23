import Link from "next/link";
import { getMyths } from "@/lib/api/myths";
import type { Myth } from "@/types";

export const dynamic = "force-dynamic";

export default async function MythsPage() {
  const myths = await getMyths().catch(() => []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Все мифы</h1>

      {myths.length === 0 ? (
        <p className="text-gray-600">Мифы пока не добавлены</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myths.map((myth) => (
            <Link
              key={myth.id}
              href={`/culture-${myth.culture}/myths/${myth.slug}`}
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
