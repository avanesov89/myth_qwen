# Мифологический портал

Масштабируемый информационный портал о мифологиях разных культур.

## Стек технологий

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Directus API** (headless CMS)

## Архитектура URL

```
/                          → Карта регионов
/{culture}                 → /greek, /norse, /armenian
/{culture}/gods            → Боги культуры
/{culture}/heroes          → Герои культуры
/{culture}/myths           → Мифы культуры
/{culture}/creatures       → Существa культуры
/{culture}/gods/{slug}     → Карточка бога
/{culture}/heroes/{slug}   → Карточка героя
/{culture}/myths/{slug}    → Карточка мифа
/{culture}/creatures/{slug}→ Карточка существа
/gods                      → Все боги (кросс-культурный)
/heroes                    → Все герои
/myths                     → Все мифы
/creatures                 → Все существа
```

## Установка

```bash
npm install
```

## Запуск

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## Переменные окружения

Создайте файл `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8055
```

## Структура проекта

```
src/
├── app/                    # Next.js App Router
│   ├── [culture]/          # Динамический маршрут культуры
│   ├── gods/               # Глобальный раздел богов
│   ├── heroes/             # Глобальный раздел героев
│   ├── myths/              # Глобальный раздел мифов
│   ├── creatures/          # Глобальный раздел существ
│   ├── layout.tsx          # Корневой layout
│   ├── page.tsx            # Главная страница
│   └── not-found.tsx       # 404 страница
├── components/             # React компоненты
│   ├── cards/              # Карточки сущностей
│   ├── layout/             # Layout компоненты
│   ├── sections/           # Секции страниц
│   └── entities/           # Компоненты сущностей
├── lib/
│   └── api/                # API слой
│       ├── client.ts       # HTTP клиент
│       ├── cultures.ts     # API культур
│       ├── entities.ts     # API сущностей
│       ├── myths.ts        # API мифов
│       └── index.ts        # Экспорты
└── types/
    └── index.ts            # TypeScript типы
```

## Git-workflow

- `main` — стабильная версия
- `dev` — рабочая версия
- feature-ветки для новых функций

```bash
# Создать feature-ветку
git checkout -b feature/new-feature dev

# После завершения
git checkout dev
git merge feature/new-feature
git push origin dev
```

## Версии

- **v0.1** — Базовая архитектура с роутингом и API слоем

## API эндпоинты

Проект использует Directus API:

- `GET /items/mythologies` — Список культур
- `GET /items/entities` — Сущности (боги, герои, существа)
- `GET /items/myths_and_legends` — Мифы

## Требования к API

Все данные загружаются через API слой (`src/lib/api/`). UI компоненты не содержат прямых fetch-запросов.
