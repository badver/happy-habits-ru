# Психолог онлайн — Happy Habits

Лендинг для онлайн-консультаций психолога, построенный на Hugo.

## Требования

- [Hugo](https://gohugo.io/) версии 0.120.0 или выше
- [Node.js](https://nodejs.org/) версии 18 или выше (для тестирования)

## Установка

1. Установите Hugo:
   ```bash
   # macOS
   brew install hugo

   # Linux
   snap install hugo

   # Windows
   choco install hugo-extended
   ```

2. Установите зависимости для тестирования:
   ```bash
   npm install
   ```

## Запуск локально

### Режим разработки

Запустить локальный сервер разработки с автоматической перезагрузкой:

```bash
hugo server -D
```

Сайт будет доступен по адресу: http://localhost:1313

### Сборка для продакшена

Собрать статические файлы для деплоя:

```bash
hugo --gc --minify
```

Собранные файлы будут находиться в директории `public/`.

## Тестирование

### Playwright тесты

Запустить E2E тесты:

```bash
npx playwright test
```

Запустить тесты в UI режиме:

```bash
npx playwright test --ui
```

Посмотреть отчет о тестах:

```bash
npx playwright show-report
```

### Установка браузеров для Playwright

При первом запуске установите браузеры:

```bash
npx playwright install
```

## Деплой

### Netlify

Сайт настроен для автоматического деплоя на Netlify. Конфигурация находится в `netlify.toml`.

**Автоматический деплой:**
- Push в main ветку → деплой в продакшен
- Pull Request → деплой preview версии

**Ручной деплой:**

1. Установите Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Авторизуйтесь:
   ```bash
   netlify login
   ```

3. Деплой:
   ```bash
   netlify deploy --prod
   ```

### Другие платформы

Сайт можно задеплоить на любую платформу, поддерживающую статические сайты:

- **Vercel**: `vercel --prod`
- **GitHub Pages**: скопируйте содержимое `public/` в gh-pages ветку
- **Cloudflare Pages**: подключите репозиторий и укажите build команду `hugo --gc --minify`

## Структура проекта

```
.
├── assets/          # CSS, JS, изображения (необработанные)
├── content/         # Markdown файлы контента
├── data/            # JSON/YAML данные
├── layouts/         # HTML шаблоны
├── static/          # Статические файлы (копируются как есть)
├── tests/           # Playwright E2E тесты
├── config.toml      # Конфигурация Hugo
└── netlify.toml     # Конфигурация Netlify
```

## Конфигурация

### Analytics

В `config.toml` можно указать ID счетчиков:

```toml
[params]
  yandexMetrikaID = "YOUR_ID"
  googleAnalyticsID = "YOUR_ID"
```

### Базовый URL

Измените `baseURL` в `config.toml` для вашего домена:

```toml
baseURL = "https://your-domain.ru/"
```

## Полезные команды

```bash
# Проверка версии Hugo
hugo version

# Очистка кэша
hugo --gc

# Просмотр всех доступных команд
hugo help

# Создать новую страницу
hugo new content/page-name.md
```

## Поддержка

Сайт: https://happy-habits.ru/

## Лицензия

Proprietary
