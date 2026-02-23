import Link from "next/link";

interface EntityCardProps {
  entity: {
    id: number;
    slug: string;
    title: string;
    excerpt?: string | null;
  };
  cultureSlug: string;
  type: 'gods' | 'heroes' | 'creatures';
}

export default function EntityCard({ entity, cultureSlug, type }: EntityCardProps) {
  return (
    <Link
      href={`/${cultureSlug}/${type}/${entity.slug}`}
      className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
    >
      <h2 className="text-2xl font-semibold mb-2">{entity.title}</h2>
      {entity.excerpt && (
        <p className="text-gray-600">{entity.excerpt}</p>
      )}
    </Link>
  );
}
