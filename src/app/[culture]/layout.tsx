import type { Metadata } from "next";
import { getCultureBySlug } from "@/lib/api/cultures";

interface CulturePageProps {
  params: Promise<{ culture: string }>;
}

export async function generateMetadata({ params }: CulturePageProps): Promise<Metadata> {
  const { culture: cultureSlug } = await params;

  try {
    const culture = await getCultureBySlug(cultureSlug);
    return {
      title: `${culture.title} — Мифологический портал`,
      description: culture.description?.replace(/<[^>]*>/g, '').slice(0, 160),
      openGraph: {
        title: `${culture.title} — Мифологический портал`,
        description: culture.description?.replace(/<[^>]*>/g, '').slice(0, 160),
      },
    };
  } catch (error) {
    return {
      title: "Культура не найдена",
    };
  }
}

export default function CultureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
