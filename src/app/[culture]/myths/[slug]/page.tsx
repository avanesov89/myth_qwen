import Link from "next/link";
import { notFound } from "next/navigation";
import { getCultureBySlug } from "@/lib/api/cultures";
import { getMythBySlug, getMyths } from "@/lib/api/myths";
import type { Myth } from "@/types";

interface MythPageProps {
  params: Promise<{ culture: string; slug: string }>;
}

export async function generateStaticParams() {
  const cultures = ["greek", "egypt", "scandinavian"];
  const allMyths: Array<{ culture: string; slug: string }> = [];
  
  for (const culture of cultures) {
    try {
      const myths = await getMyths({ culture });
      myths.forEach((myth) => {
        allMyths.push({ culture, slug: myth.slug });
      });
    } catch (error) {
      // ignore
    }
  }
  
  return allMyths;
}

export default async function MythPage({ params }: MythPageProps) {
  const { culture: cultureSlug, slug } = await params;
  
  try {
    await getCultureBySlug(cultureSlug);
  } catch (error) {
    notFound();
  }

  let myth: Myth;
  try {
    myth = await getMythBySlug(slug);
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
        <Link href={`/${cultureSlug}/myths`} className="text-blue-600 hover:underline">
          Мифы
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{myth.title}</span>
      </nav>

      <article>
        <h1 className="text-4xl font-bold mb-4">{myth.title}</h1>
        
        {myth.prev_text && (
          <p className="text-xl text-gray-600 mb-6">{myth.prev_text}</p>
        )}

        <div className="prose max-w-none">
          {myth.content && (
            <div 
              className="mb-8"
              dangerouslySetInnerHTML={{ __html: myth.content }} 
            />
          )}
        </div>
      </article>
    </main>
  );
}
