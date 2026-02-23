import Link from "next/link";

interface CultureCardProps {
  culture: {
    id: number;
    slug: string;
    title: string;
    description?: string;
  };
}

export default function CultureCard({ culture }: CultureCardProps) {
  const plainDescription = culture.description?.replace(/<[^>]*>/g, '') || '';

  return (
    <Link
      href={`/${culture.slug}`}
      className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
    >
      <h2 className="text-2xl font-semibold mb-2">{culture.title}</h2>
      <p className="text-gray-600">
        {plainDescription.slice(0, 150)}
        {plainDescription.length > 150 ? '...' : ''}
      </p>
    </Link>
  );
}
