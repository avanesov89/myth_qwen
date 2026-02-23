import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-4">Страница не найдена</h2>
        <p className="text-gray-600 mb-8">
          Запрошенная страница не существует или была удалена.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          На главную
        </Link>
      </div>
    </main>
  );
}
