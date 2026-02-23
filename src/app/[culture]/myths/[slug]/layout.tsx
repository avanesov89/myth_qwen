import type { Metadata } from "next";
import { getMythBySlug } from "@/lib/api/myths";

interface MythPageProps {
  params: Promise<{ culture: string; slug: string }>;
}

export async function generateMetadata({ params }: MythPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const myth = await getMythBySlug(slug);
    return {
      title: `${myth.title} — Миф`,
      description: myth.prev_text?.slice(0, 160),
      openGraph: {
        title: `${myth.title} — Миф`,
        description: myth.prev_text?.slice(0, 160),
      },
    };
  } catch (error) {
    return {
      title: "Миф не найден",
    };
  }
}

export { default } from "./page";
