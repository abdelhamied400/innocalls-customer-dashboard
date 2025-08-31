# Custom Translation System

This project now uses a custom translation system that provides the same API as Next-intl but without routing dependencies.

## Features

- **useTranslations hook**: Compatible with Next-intl's API
- **useLocale hook**: Get current locale
- **No routing**: Locale switching without URL changes
- **Client-side storage**: Locale preference stored in localStorage
- **RTL support**: Automatic direction changes for Arabic
- **Fallback support**: Falls back to default locale if translation is missing

## Usage

### Basic Translation

```tsx
import { useTranslations } from "@/providers/TranslationProvider";

function MyComponent() {
  const t = useTranslations("namespace");

  return <h1>{t("title")}</h1>;
}
```

### With Parameters

```tsx
const t = useTranslations("common.validation");

// Translation: "Password must be at least {min} characters"
const message = t("password.minLength", { min: 8 });
```

### Get Current Locale

```tsx
import { useLocale } from "@/providers/TranslationProvider";

function MyComponent() {
  const locale = useLocale(); // 'en' or 'ar'

  return <div>Current locale: {locale}</div>;
}
```

### Switch Locale

```tsx
import { useTranslationContext } from "@/providers/TranslationProvider";

function LocaleSwitcher() {
  const { setLocale } = useTranslationContext();

  return <button onClick={() => setLocale("ar")}>Switch to Arabic</button>;
}
```

## Migration from Next-intl

The API is fully compatible, so existing code should work without changes:

- `useTranslations('namespace')` - Same API
- `useLocale()` - Same API
- Translation files remain the same
- Namespace structure unchanged

## How it Works

1. **TranslationProvider**: Wraps the app and manages locale state
2. **localStorage**: Persists locale preference across sessions
3. **Dynamic loading**: Translation files loaded on-demand
4. **Fallback**: Missing translations fall back to default locale
5. **RTL support**: Automatically sets document direction

## Translation Loading

Translation files are loaded dynamically:

```typescript
// Loads /i18n/translations/en.json
await loadTranslations("en");
```

The system automatically handles:

- Caching loaded translations
- Error handling with fallbacks
- Nested object access with dot notation
- Parameter replacement in strings
