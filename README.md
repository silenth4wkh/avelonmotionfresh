# Avelon Motion – Fázis 1

Next.js 15 + TypeScript (strict) + Tailwind CSS + Vitest alapok.

## Refaktor terv

Lásd: `C:\Users\David\REFACTOR_TERV_AVELON_MOTION.md`

## Telepítés és futtatás

```bash
cd avelon-motion-fresh
npm install
npm run dev
```

→ http://localhost:3000

## Parancsok

| Parancs | Leírás |
|---------|--------|
| `npm run dev` | Dev szerver |
| `npm run build` | Production build |
| `npm run start` | Production szerver |
| `npm run test` | Vitest tesztek |
| `npm run lint` | ESLint |

## Docker

**Fontos:** Futtasd a `avelon-motion-fresh` mappából – ne az `avelon-motion` (régi) mappából.

```bash
cd C:\Users\David\avelon-motion-fresh

# Fejlesztés (hot reload)
docker compose -f docker-compose.dev.yml up --build

# Production
docker compose up --build
```

→ http://localhost:3002

Ha a régi `avelon-motion` compose fut, állítsd le: `docker compose -f docker-compose.dev.yml down` (a régi mappában).

## Fázis 1 ✓

- [x] Next.js 15 App Router
- [x] TypeScript (`strict`, `noUncheckedIndexedAccess`)
- [x] Tailwind CSS
- [x] next-intl, lucide-react
- [x] Vitest + React Testing Library + jest-dom + jsdom
- [x] Font: IBM Plex Sans (body), Barlow (display) — reference vertical.framer.media editorial style
- [x] vitest.config.ts, vitest.setup.ts

## Fázis 2 ✓

- [x] types/ (language, media, sections)
- [x] messages/en.json, messages/hu.json
- [x] lib/ (sanitizer, rateLimiter, storage, errorReporter, mediaValidator, media)
- [x] lib/i18n.ts + next-intl plugin

## Fázis 3 ✓

- [x] app/page.tsx → redirect /en
- [x] app/[lang]/layout.tsx + generateMetadata (hreflang, OG, Twitter)
- [x] app/[lang]/page.tsx (hero fordításokkal)
- [x] app/[lang]/privacy-policy/page.tsx
- [x] app/not-found.tsx
- [x] ErrorBoundary a root layout-ban

## Fázis 4 ✓

- [x] components/sections/ (Header, Hero, About, Services, Work, Process, FAQ, CTA, Footer)
- [x] LandingPage + useScrollAnimation
- [x] ui/ (PrimaryButton, SectionTitle, SectionSubtitle)
- [x] CookieConsent, LazyImage, LoadingScreen, SkipLink
- [x] FAQ link a navigációban
- [x] globals.css, tailwind theme (primary, secondary, neutral)
- [x] public/noise.svg

## Fázis 5 ✓

- [x] __tests__/lib/sanitizer.test.ts
- [x] __tests__/lib/rateLimiter.test.ts
- [x] __tests__/lib/storage.test.ts
- [x] __tests__/components/CTA.test.tsx
- [x] __tests__/components/Header.test.tsx
- [x] __tests__/components/CookieConsent.test.tsx

## Fázis 6 ✓

- [x] package.json: name "avelon-motion", duplikátum postcss eltávolítva
- [x] Footer: `/${lang}#services`, `/${lang}#about` stb. (Link komponensek)
- [x] Copyright: messages-ben `© {year} Avelon Motion`
- [x] Legacy fájlok: nem kerültek át (tiszta projekt)

## Következő prioritások (REFACTOR_TERV 8.)

1. Valódi e-mail API (Resend / SendGrid)
2. messages kulcsstruktúra (items.X vs serviceX)
3. Valódi képek és hero videó (Cloudinary)
4. Hero: H1 branding + statisztikák
5. Schema.org, Loading screen, Form hibaüzenetek (HU), Analytics
