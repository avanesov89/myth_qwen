# Документация проекта «Мифологический портал»

## Содержание

1. [Общая информация](#общая-информация)
2. [Технологический стек](#технологический-стек)
3. [Архитектура проекта](#архитектура-проекта)
4. [Структура файлов](#структура-файлов)
5. [API слой](#api-слой)
6. [Роутинг](#роутинг)
7. [Работа с данными](#работа-с-данными)
8. [Git workflow](#git-workflow)
9. [Запуск и разработка](#запуск-и-разработка)

---

## Общая информация

**Проект:** Мифологический портал  
**Описание:** Масштабируемый информационный портал о мифологиях разных культур  
**Версия:** v0.1  
**Репозиторий:** https://github.com/avanesov89/myth_qwen

### Ключевые особенности

- **API-first архитектура** — все данные загружаются через API Directus
- **SEO-ориентированный роутинг** — корневые URL культур (`/greek`, а не `/mythology/greek`)
- **Разделение слоёв** — Data Layer / Business Logic / Presentation Layer
- **Масштабируемость** — возможность добавлять новые культуры без изменения кода

---

## Технологический стек

| Компонент | Технология | Версия | Назначение |
|-----------|------------|--------|------------|
| **Framework** | Next.js | 15.x | SSR/SSG, роутинг, мета-теги |
| **Язык** | TypeScript | 5.x | Типизация, безопасность кода |
| **Стили** | Tailwind CSS | 4.x | Утилитарные CSS классы |
| **CMS** | Directus | 10.x | Headless CMS, хранение данных |
| **API** | Directus API | - | REST API для данных |

### Почему выбраны эти технологии

**Next.js App Router:**
- Встроенная поддержка SSR и SSG
- Динамический роутинг из коробки
- Автоматическая генерация метаданных
- Оптимизация производительности

**TypeScript:**
- Типобезопасность
- Автодополнение в IDE
- Рефакторинг без ошибок
- Документирование через типы

**Directus:**
- Гибкая настройка коллекций
- M2M и O2M связи
- Встроенное управление файлами
- REST + GraphQL API

---

## Архитектура проекта

### Слои приложения

```
┌─────────────────────────────────────┐
│     Presentation Layer (UI)         │
│  /src/app                           │
│  /src/components                    │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│     Data Layer (API)                │
│  /src/lib/api                       │
│  - cultures.ts                      │
│  - entities.ts                      │
│  - myths.ts                         │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│     CMS (Directus)                  │
│  http://localhost:8055              │
│  - mythologies                      │
│  - entities                         │
│  - myths_and_legends                │
└─────────────────────────────────────┘
```

### Принципы архитектуры

1. **UI не содержит прямых fetch-запросов** — все данные через `/lib/api/`
2. **Типизация всех данных** — интерфейс для каждой сущности
3. **Обработка ошибок на уровне API** — UI получает готовые данные или пустые массивы
4. **Компоненты без состояния** — все данные загружаются на сервере

---

## Структура файлов

```
myth_qwen/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── [culture]/                # Динамический маршрут культуры
│   │   │   ├── [slug]/               # Карточки сущностей
│   │   │   │   ├── gods/
│   │   │   │   ├── heroes/
│   │   │   │   ├── myths/
│   │   │   │   └── creatures/
│   │   │   ├── gods/                 # Разделы культуры
│   │   │   ├── heroes/
│   │   │   ├── myths/
│   │   │   ├── creatures/
│   │   │   ├── layout.tsx            # Layout культуры + metadata
│   │   │   └── page.tsx              # Страница культуры
│   │   ├── gods/                     # Глобальные разделы
│   │   ├── heroes/
│   │   ├── myths/
│   │   ├── creatures/
│   │   ├── layout.tsx                # Корневой layout
│   │   ├── page.tsx                  # Главная страница
│   │   ├── not-found.tsx             # 404 страница
│   │   └── globals.css               # Глобальные стили
│   │
│   ├── components/                   # React компоненты
│   │   ├── cards/                    # Карточки сущностей
│   │   │   ├── EntityCard.tsx
│   │   │   ├── MythCard.tsx
│   │   │   └── index.ts
│   │   ├── layout/                   # Layout компоненты
│   │   │   ├── Breadcrumbs.tsx
│   │   │   └── CultureCard.tsx
│   │   │   └── index.ts
│   │   ├── sections/                 # Секции страниц
│   │   └── entities/                 # Компоненты сущностей
│   │
│   ├── lib/
│   │   └── api/                      # API слой
│   │       ├── client.ts             # Базовый HTTP клиент
│   │       ├── cultures.ts           # API культур
│   │       ├── entities.ts           # API сущностей
│   │       ├── myths.ts              # API мифов
│   │       └── index.ts              # Экспорты
│   │
│   └── types/
│       └── index.ts                  # TypeScript типы
│
├── public/                           # Статические файлы
├── .gitignore                        # Игнорируемые файлы
├── package.json                      # Зависимости и скрипты
├── tsconfig.json                     # Настройки TypeScript
├── tailwind.config.ts                # Настройки Tailwind
├── next.config.ts                    # Настройки Next.js
└── README.md                         # Краткая документация
```

---

## API слой

### Базовый клиент (`/lib/api/client.ts`)

```typescript
// Универсальная функция для GET запросов
fetchApi<T>(endpoint: string): Promise<T>

// Получение полного URL
getApiUrl(endpoint: string): string
```

### Модули API

#### Cultures (`cultures.ts`)

| Функция | Описание | Пример |
|---------|----------|--------|
| `getCultures()` | Список всех культур | `await getCultures()` |
| `getCultureBySlug(slug)` | Культура по slug | `await getCultureBySlug('greek')` |
| `getCultureById(id)` | Культура по ID | `await getCultureById(4)` |

#### Entities (`entities.ts`)

| Функция | Описание | Пример |
|---------|----------|--------|
| `getEntities(params)` | Сущности с фильтрами | `await getEntities({culture: 'greek'})` |
| `getEntityBySlug(slug)` | Сущность по slug | `await getEntityBySlug('zevs')` |
| `getGods(culture?)` | Список богов | `await getGods('greek')` |
| `getHeroes(culture?)` | Список героев | `await getHeroes('norse')` |
| `getCreatures(culture?)` | Список существ | `await getCreatures('egypt')` |

#### Myths (`myths.ts`)

| Функция | Описание | Пример |
|---------|----------|--------|
| `getMyths(params)` | Мифы с фильтрами | `await getMyths({culture: 'greek'})` |
| `getMythBySlug(slug)` | Миф по slug | `await getMythBySlug('persefone_sale')` |
| `getMythsByCulture(culture)` | Мифы культуры | `await getMythsByCulture('greek')` |

### Переменные окружения

Создайте файл `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8055
```

---

## Роутинг

### Структура URL

```
/                              → Главная (карта культур)
/{culture}                     → Страница культуры
                               Пример: /greek
/{culture}/gods                → Боги культуры
/{culture}/heroes              → Герои культуры
/{culture}/myths               → Мифы культуры
/{culture}/creatures           → Существa культуры
/{culture}/gods/{slug}         → Карточка бога
/{culture}/heroes/{slug}       → Карточка героя
/{culture}/myths/{slug}        → Карточка мифа
/{culture}/creatures/{slug}    → Карточка существа
/gods                          → Все боги (кросс-культурный)
/heroes                        → Все герои
/myths                         → Все мифы
/creatures                     → Все существа
```

### Типы маршрутов

| Тип | Пример | Метод | Описание |
|-----|--------|-------|----------|
| **Static** | `/_not-found` | SSG | Пререндерится при билде |
| **Dynamic** | `/[culture]` | SSG + SSR | `generateStaticParams` + fallback |
| **Dynamic** | `/[culture]/gods/[slug]` | SSR | `force-dynamic` |
| **Route Handler** | `/gods` | SSR | `force-dynamic` |

### Генерация статических путей

```typescript
export async function generateStaticParams() {
  const cultures = await getCultures();
  return cultures.map((culture) => ({
    culture: culture.slug,
  }));
}
```

---

## Работа с данными

### Типы данных

#### Culture (Культура)

```typescript
interface Culture {
  id: number;          // ID в Directus
  slug: string;        // URL-слаг (greek, egypt)
  title: string;       // Название
  description: string; // HTML-описание
  status: string;      // published/draft
}
```

#### Entity (Сущность)

```typescript
interface Entity {
  id: number;           // ID в Directus
  slug: string;         // URL-слаг (zevs, aid)
  title: string;        // Имя
  excerpt: string;      // Краткое описание
  entity_type: number;  // 1=Бог, 2=Герой, 4=Существо
  mythology: number;    // ID связанной культуры
  gender: 'male'|'female';
  belonging: string;    // Принадлежность
  parents: number[];    // ID родителей (M2M)
  marriages: number[];  // ID браков (M2M)
  gallery: string[];    // ID файлов (M2M)
}
```

#### Myth (Миф)

```typescript
interface Myth {
  id: number;        // ID в Directus
  slug: string;      // URL-слаг
  title: string;     // Название
  prev_text: string; // Краткое описание
  content: string;   // Полный HTML-текст
  culture: number;   // ID связанной культуры
  gods: number[];    // ID богов (M2M)
}
```

### M2M связи в Directus

#### gods (Мифы ↔ Боги)

```
myths_and_legends ──┬── myths_and_legends_gods ── entities
                    │   - id
                    │   - myths_and_legends_id
                    │   - entities_id
```

**Пример запроса:**
```typescript
// Получаем мифы с M2M связями
const response = await fetch(
  `${API_BASE_URL}/items/myths_and_legends?fields=id,title,gods.entities_id`
);

// gods возвращает массив объектов:
// [{id: 1, myths_and_legends_id: 2, entities_id: 5}]

// Фильтруем по entities_id
const filtered = myths.filter(myth => 
  myth.gods.some(g => g.entities_id === godId)
);
```

#### gallery (Сущности ↔ Файлы)

```
entities ──┬── entities_gallery ── directus_files
           │   - id
           │   - entities_id
           │   - directus_files_id (UUID)
```

**Пример использования:**
```typescript
// Получаем UUID файлов из M2M
const galleryFileIds = god.gallery?.map(g => g.directus_files_id);

// Формируем URL изображений
const galleryImages = galleryFileIds.map(id => 
  `${API_BASE_URL}/assets/${id}`
);
```

---

## Git workflow

### Ветки

| Ветка | Назначение | Protection |
|-------|------------|------------|
| `main` | Стабильная версия | ✅ Push protected |
| `dev` | Рабочая версия | - |
| `feature/*` | Новые функции | - |

### Коммиты

**Формат сообщений:**
```
<type>: <description>

[optional body]
```

**Типы коммитов:**
- `feat:` — новая функция
- `fix:` — исправление ошибки
- `docs:` — документация
- `style:` — форматирование
- `refactor:` — рефакторинг
- `chore:` — вспомогательные изменения

**Примеры:**
```bash
feat: add culture dynamic routing
fix: correctly extract entities_id from M2M gods relation
docs: add API documentation
refactor: simplify API client error handling
```

### Тегирование

```bash
# Создать тег версии
git tag v0.1

# Отправить тег на GitHub
git push origin v0.1
```

### Что НЕ коммитить

- `node_modules/`
- `.next/`
- `.env*.local`
- `.DS_Store`
- `QWEN.md` (файл памяти Qwen)

---

## Запуск и разработка

### Установка зависимостей

```bash
npm install
```

### Переменные окружения

Создайте `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8055
```

### Режимы запуска

```bash
# Development сервер (localhost:3000)
npm run dev

# Production сборка
npm run build

# Запуск production сервера
npm start

# Линтинг
npm run lint
```

### Чеклист перед коммитом

- [ ] `npm run build` проходит без ошибок
- [ ] Нет console.log в production коде (кроме отладки)
- [ ] Все типы TypeScript корректны
- [ ] Коммит атомарный (одно изменение)
- [ ] Сообщение коммита понятное

---

## Приложения

### A. Directus коллекции

| Коллекция | Поля | Связи |
|-----------|------|-------|
| `mythologies` | id, slug, title, description | - |
| `entities` | id, slug, title, excerpt, entity_type, mythology | M2M: parents, marriages, gallery |
| `myths_and_legends` | id, slug, title, prev_text, content, culture | M2M: gods |
| `entity_types` | id, slug, title, description | - |

### B. API эндпоинты

```
GET /items/mythologies              # Список культур
GET /items/mythologies/{id}         # Культура по ID
GET /items/mythologies?filter[slug][_eq]={slug}  # Культура по slug

GET /items/entities                 # Список сущностей
GET /items/entities/{id}            # Сущность по ID
GET /items/entities?filter[slug][_eq]={slug}     # Сущность по slug

GET /items/myths_and_legends        # Список мифов
GET /items/myths_and_legends/{id}   # Миф по ID

GET /files/{id}                     # Метаданные файла
GET /assets/{id}                    # Бинарный файл (изображение)
```

### C. Полезные ссылки

- [Next.js Documentation](https://nextjs.org/docs)
- [Directus API Reference](https://docs.directus.io/reference/query/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Версия документации:** v0.1  
**Дата обновления:** 23 февраля 2026
