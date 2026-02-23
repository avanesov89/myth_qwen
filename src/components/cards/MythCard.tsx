import Link from "next/link";

interface MythCardProps {
  myth: {
    id: number;
    slug: string;
    title: string;
    prev_text?: string;
  };
  cultureSlug: string;
}

export default function MythCard({ myth, cultureSlug }: MythCardProps) {
  return (
    <Link
      href={`/${cultureSlug}/myths/${myth.slug}`}
      className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
    >
      <h2 className="text-2xl font-semibold mb-2">{myth.title}</h2>
      {myth.prev_text && (
        <p className="text-gray-600">
          {myth.prev_text.slice(0, 150)}...
        </p>
      )}
    </Link>
  );
}
