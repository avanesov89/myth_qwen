import type { Metadata } from "next";
import { getEntityBySlug } from "@/lib/api/entities";

interface GodPageProps {
  params: Promise<{ culture: string; slug: string }>;
}

export async function generateMetadata({ params }: GodPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const entity = await getEntityBySlug(slug);
    return {
      title: `${entity.title} — Бог`,
      description: entity.excerpt?.slice(0, 160) || entity.description?.replace(/<[^>]*>/g, '').slice(0, 160),
      openGraph: {
        title: `${entity.title} — Бог`,
        description: entity.excerpt?.slice(0, 160) || entity.description?.replace(/<[^>]*>/g, '').slice(0, 160),
      },
    };
  } catch (error) {
    return {
      title: "Бог не найден",
    };
  }
}

export { default } from "./page";
