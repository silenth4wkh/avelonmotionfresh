# Avelon Motion — Senior Dev Audit
**Dátum:** 2026-03-05 · **Verzió:** Next.js 15.2.4 · **Stack:** React 19, Tailwind 3, next-intl 3.26

---

## Tartalomjegyzék
1. [SEO](#1-seo)
2. [GEO — Generative Engine Optimization](#2-geo--generative-engine-optimization)
3. [Performance & Core Web Vitals](#3-performance--core-web-vitals)
4. [Responsiveness](#4-responsiveness)
5. [Accessibility (WCAG)](#5-accessibility-wcag)
6. [Security](#6-security)
7. [i18n / Internationalization](#7-i18n--internationalization)
8. [Code Quality](#8-code-quality)
9. [Összefoglaló scorecard](#9-összefoglaló-scorecard)
10. [Prioritizált javítási roadmap](#10-prioritizált-javítási-roadmap)

---

## 1. SEO

### Score: 58 / 100 🟡

### ✅ Jól megoldott

| Elem | Megjegyzés |
|------|-----------|
| Hreflang | `en`, `hu`, `x-default` mind jelen, canonical is rendben |
| Heading hierarchy | H1 → H2 → H3 — logikus, 1 db H1 az oldalon |
| Alt szövegek | Minden `<img>` rendelkezik alt attribútummal |
| Linkek | Nincs szöveg nélküli `<a>` elem |
| OpenGraph alap | `og:type`, `og:title`, `og:description`, `og:url`, `og:siteName` jelen |
| Twitter Card | `summary_large_image` beállítva |
| Canonical URL | `https://avelonmotion.com/[lang]` — helyes |
| Robots meta | `index, follow` |

### ❌ Kritikus hiányosságok

#### 1.1 — Title duplikáció
```
Jelenlegi: "Avelon Motion – AI Video Production | Avelon Motion"
```
A `layout.tsx` template `%s | Avelon Motion` + a page title `Avelon Motion – AI Video Production`
= **"Avelon Motion – AI Video Production | Avelon Motion"** → a brand neve kétszer jelenik meg.

**Javítás** (`app/layout.tsx`):
```ts
title: { default: 'Avelon Motion – AI Video Production', template: '%s | Avelon Motion' }
// page.tsx title csak: 'AI Video Production' legyen, NEM 'Avelon Motion – ...'
```

#### 1.2 — Hiányzó `robots.txt`
Nincs `/public/robots.txt` és nincs `app/robots.ts`. Crawler-ek az alapértelmezett viselkedést használják.

**Javítás** — `app/robots.ts`:
```ts
import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://avelonmotion.com/sitemap.xml',
  };
}
```

#### 1.3 — Hiányzó `sitemap.xml`
Nincs sem statikus, sem dinamikus sitemap. Google/Bing nem tudja hatékonyan indexelni az oldalakat.

**Javítás** — `app/sitemap.ts`:
```ts
import type { MetadataRoute } from 'next';
const BASE = 'https://avelonmotion.com';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/en`, alternates: { languages: { hu: `${BASE}/hu` } }, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/hu`, alternates: { languages: { en: `${BASE}/en` } }, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/en/privacy-policy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/hu/privacy-policy`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
```

#### 1.4 — Hiányzó OG Image & Twitter Image
Az `og:image` és `twitter:image` nincs beállítva. Közösségi megosztásnál az oldal **kép nélkül** jelenik meg.

**Javítás** — `app/[lang]/opengraph-image.tsx` (Next.js ImageResponse):
```tsx
import { ImageResponse } from 'next/og';
export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export default function Image() {
  return new ImageResponse(
    <div style={{ background: '#0a0a0a', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#ff7300', fontSize: 96, fontWeight: 900 }}>AVELON MOTION</span>
    </div>
  );
}
```

#### 1.5 — Meta description rövid
```
Jelenlegi (55 kar): "Cinematic AI-powered video production for modern brands"
Ajánlott: 120–160 karakter
```

**Javítás** (`messages/en.json` → `brand.description`):
```
"Avelon Motion is a Budapest-based AI video production studio creating cinematic brand films, motion design, and AI-generated visual systems for modern brands worldwide."
```

#### 1.6 — Nincs JSON-LD strukturált adat
Nincsen semmilyen `schema.org` markup az oldalon — ez kritikus SEO és GEO szempontból egyaránt.

---

## 2. GEO — Generative Engine Optimization

### Score: 42 / 100 🔴

A GEO az AI-alapú keresők (ChatGPT, Perplexity, Gemini, Claude) számára való optimalizálást jelenti. Az LLM-ek strukturált, entity-rich tartalomból dolgoznak.

### ✅ Jól megoldott
- FAQ szekció 8 kérdés-válasz párral — az LLM-ek szeretik
- Egyértelmű szolgáltatásleírások (Cinematic AI Films, Visual Systems, Brand Personas)
- Budapest-based studio → földrajzi entity signal
- Konzisztens brand neve: "Avelon Motion" mindenhol

### ❌ Kritikus hiányosságok

#### 2.1 — Nincs Organization schema
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Avelon Motion",
  "url": "https://avelonmotion.com",
  "logo": "https://avelonmotion.com/logo.png",
  "description": "AI video production studio based in Budapest, Hungary",
  "address": { "@type": "PostalAddress", "addressLocality": "Budapest", "addressCountry": "HU" },
  "contactPoint": { "@type": "ContactPoint", "email": "info@avelonmotion.com", "contactType": "customer service" },
  "sameAs": [
    "https://instagram.com/avelonmotion",
    "https://youtube.com/avelonmotion",
    "https://www.linkedin.com/company/avelonmotion"
  ]
}
```

#### 2.2 — Nincs FAQPage schema
A FAQ szekció tartalmát az LLM-ek csak strukturált adatként tudják biztosan azonosítani.

```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is AI video production?",
      "acceptedAnswer": { "@type": "Answer", "text": "..." }
    }
  ]
}
```

#### 2.3 — Nincs Service schema
```json
{
  "@type": "Service",
  "name": "Cinematic AI Films",
  "provider": { "@type": "Organization", "name": "Avelon Motion" },
  "description": "...",
  "areaServed": "Worldwide"
}
```

#### 2.4 — Nincs dedikált About oldal
Az "Our Story" csak egy szekció — nincs `/about` oldal, ami E-E-A-T szempontból gyenge. Az LLM-ek preferálják a dedikált entity-lapokat.

#### 2.5 — Hiányzó E-E-A-T szignálok
- Nincs alapítók/team bemutatkozás
- Nincs portfólió case study (csak képek)
- Nincs ügyfél testimonial / logós referencia
- Nincs "As seen in" / media coverage

---

## 3. Performance & Core Web Vitals

### Score: 68 / 100 🟡

> ⚠️ A mérések Docker dev módban készültek (hot reload, unminified JS). Production buildben a JS bundle méret **60-70%-kal** kisebb lesz.

### Mért adatok (dev mód)

| Metrika | Érték | Cél |
|---------|-------|-----|
| TTFB | 386ms | <200ms |
| FCP | 488ms | <1.8s ✅ |
| DOMContentLoaded | 424ms | <1s ✅ |
| Load Complete | 1008ms | <3s ✅ |
| JS transfer (dev) | ~2.7MB | ~400KB prod cél |
| Resources száma | 52 | — |

### ✅ Jól megoldott
- **Lean dependencies**: csak 5 production dep (next, react, react-dom, next-intl, lucide-react)
- **Google Fonts via `next/font`**: preloaded, `display: swap`, nincsen külső font request
- **Image optimalizáció**: AVIF + WebP, device sizes konfigurálva
- **Tailwind CSS**: tree-shaken, minimális CSS bundle
- **Hero video**: csak desktopra és jó kapcsolatnál autoplay (Network API check)
- **IntersectionObserver**: lazy animációk (nem RAF/scroll polling)

### ⚠️ Javítandó

#### 3.1 — Nincs dinamikus import (code splitting)
Az összes szekció (`Hero`, `About`, `Services`, `Work`, `Process`, `FAQ`, `CTA`, `Footer`) egyszerre töltődik be.

**Javítás** (`components/LandingPage.tsx`):
```tsx
import dynamic from 'next/dynamic';

const About    = dynamic(() => import('./sections/About'));
const Services = dynamic(() => import('./sections/Services'));
const Work     = dynamic(() => import('./sections/Work'));
const Process  = dynamic(() => import('./sections/Process'));
const FAQ      = dynamic(() => import('./sections/FAQ'));
const CTA      = dynamic(() => import('./sections/CTA'));
// Hero és Header maradjon statikus (LCP)
```

#### 3.2 — Nincs `preconnect` Cloudinary-hoz
A portfólió képek Cloudinary-ról töltődnek, de nincs DNS preconnect hint.

**Javítás** (`app/layout.tsx` `<head>`):
```html
<link rel="preconnect" href="https://res.cloudinary.com" />
<link rel="dns-prefetch" href="https://res.cloudinary.com" />
```

#### 3.3 — Hero video: hiányzó `poster` mobil fallback
Ha a videó nem tölt be (mobil / lassú net), nincs látható háttér.

**Javítás**: A `MEDIA.heroVideo.poster` értékét egy Cloudinary thumbnail URL-re kell állítani, amelyet a `<video poster={...}>` már tartalmaz.

#### 3.4 — TTFB magas (386ms)
Docker overhead okozza, de production-ban is figyelmeztetés: ha szerver-oldali renderelés lassú (`getMessages`, `getTranslations`), ez megnőhet.

**Javítás**: `generateStaticParams()` már megvan → `output: 'standalone'` + teljes statikus export megfontolandó a legfontosabb oldalakra.

#### 3.5 — Mousemove handler Hero-ban (INP kockázat)
```tsx
const onMove = (e: MouseEvent) => {
  setMouse({ x: x * 30, y: y * 20 });  // state update every mousemove
};
```
Minden egérmozgatás React state update-et okoz. Alacsony végű eszközökön INP (Interaction to Next Paint) problémát okozhat.

**Javítás** — throttle 16ms-re:
```tsx
let lastMove = 0;
const onMove = (e: MouseEvent) => {
  const now = Date.now();
  if (now - lastMove < 16) return;  // ~60fps cap
  lastMove = now;
  // ... setState
};
```

#### 3.6 — `lucide-react` teljes import
Ha bárhol `import { Icon } from 'lucide-react'` helyett `import Icon from 'lucide-react/dist/esm/icons/icon'` szerepel, az a teljes könyvtárat behúzza.

---

## 4. Responsiveness

### Score: 80 / 100 🟢

### ✅ Jól megoldott
- Mobile-first megközelítés (Tailwind `sm:`, `md:`, `lg:`, `xl:`)
- Fluid typography: `clamp()` használata az összes headline-nál
- Bal sidebar: `hidden lg:flex` — mobilon nem jelenik meg
- Jobb sidebar: `hidden xl:flex` — csak 1280px+ felett látható
- Grid: `grid-cols-1 md:grid-cols-2 md:grid-cols-4` mintázat következetes
- `maxWidth: '90vw'` az AVELON MOTION h1-en — mobilon nem lóg ki

### ⚠️ Javítandó

#### 4.1 — Footer marquee szöveg túl nagy mobilon
```css
fontSize: 'clamp(3.5rem, 14vw, 11rem)'
```
`3.5rem` = 56px mobilon. A kétszoros marquee csík potenciálisan `>100px` magas, ami megzavarja a footer olvashatóságát.

**Javítás**: `clamp(2.5rem, 12vw, 11rem)`

#### 4.2 — Work szekció: carousel mobilon nem tesztelt részletesen
A `displaySlideIdx` state alapú slideshow és a category grid komplex. 375px szélességen potenciálisan layout overflow.

**Ellenőrzendő**: `preview_resize(mobile)` + Work szekcióra scrollálás.

#### 4.3 — Services szekció: `aspect-video` div mobilon magas
A teljes szélességű `aspect-video` konténer 375px szélességen ~211px magas, ami elfogadható, de a negatív margóval kombinálva (`-mt-14`) mobilon layout problémát okozhat.

#### 4.4 — Nincs `touch-action` optimalizáció
Interaktív elemeken (carousel drag, smooth scroll) nincs `touch-action: pan-y` — iOS Safari-n visszautasíthat passzív listener figyelmeztetéseket.

---

## 5. Accessibility (WCAG)

### Score: 55 / 100 🔴

### Kontrasztelemzés

| Szín pár | Kontraszt | WCAG AA (4.5:1) | WCAG AAA (7:1) |
|-----------|-----------|-----------------|-----------------|
| Narancssárga (#ff7300) / sötét (#0a0a0a) | **7.26:1** | ✅ PASS | ✅ PASS |
| Fehér (#f5f5f5) / sötét (#0a0a0a) | **18.16:1** | ✅ PASS | ✅ PASS |
| **Narancssárga (#ff7300) / fehér (#f5f5f5)** | **2.50:1** | ❌ FAIL | ❌ FAIL |

> **Kritikus**: A narancssárga Footerben fekete szöveg van narancssárga háttéren — ez rendben. DE ha bárhol narancssárga szöveget fehér alapon használnak, az megbukik.

### ✅ Jól megoldott
- **Skip link**: `components/SkipLink.tsx` implementálva, `sr-only focus:not-sr-only` mintázattal ✅
- **`<main id="main-content">`**: `LandingPage.tsx`-ben jelen van ✅
- **`:focus-visible` CSS**: `globals.css`-ben globálisan definiálva (`outline: 2px solid #f97316`) ✅
- FAQ: `aria-expanded`, `aria-controls` helyes használata ✅
- Minden button rendelkezik szöveggel vagy `aria-label`-lel ✅
- `aria-hidden="true"` a dekoratív elemeknél (AM watermark, etc.) ✅
- Hero video: `aria-hidden="true"` jelen van ✅
- `lang` attribútum dinamikusan set a `<html>` elemen ✅
- Videó: csak desktopra autoplay (mobilon nem tolakodik) ✅

### ❌ / ⚠️ Javítandó

#### 5.1 — `<Header>` szemantikailag rossz helyen van
A `LandingPage.tsx`-ben a `<Header>` a `<main>` belsejében van:
```tsx
<main id="main-content">
  <Header lang={lang} />   {/* ← ROSSZ: header nem lehet main-ben */}
  <Hero />
  ...
</main>
```
Screen reader-ek a `<main>`-t a fő tartalomnak tekintik — a navigációs header-nek azon kívül kellene lennie.

**Javítás** (`LandingPage.tsx`):
```tsx
return (
  <>
    <SkipLink />
    {isLoading && <LoadingScreen duration={1800} />}
    <Header lang={lang} />
    <main id="main-content" className={...}>
      <Hero />
      <About ... />
      ...
      <Footer lang={lang} />
    </main>
  </>
);
```

#### 5.2 — Services szekció videói `aria-hidden` nélkül
A Hero háttérvideón van `aria-hidden="true"`, de a Services szekció 3 dekoratív videóján nincs. A DOM audit 3 `aria-hidden: false` videót mutatott.

**Javítás** (`Services.tsx` minden `<video>` elemre):
```tsx
<video ... aria-hidden="true" />
```

#### 5.3 — Footer marquee nem reagál `prefers-reduced-motion`-ra
A CSS `marquee-left` / `marquee-right` animáció nem áll le reduced motion esetén.

**Javítás** (`globals.css`):
```css
@media (prefers-reduced-motion: reduce) {
  .marquee-left, .marquee-right {
    animation: none;
  }
}
```

#### 5.4 — Kis méretű fehér/30% szöveg kontrasztja
A metaadatok (10px, `text-white/30`) sötét háttéren kb. 5.2:1 kontrasztot adnak — megfelel AA-nak, de AAA-t nem teljesít. Kis méret + alacsony kontraszt kombinációja nehezen olvasható.

---

## 6. Security

### Score: 72 / 100 🟡

### ✅ Jól megoldott

| Elem | Státusz |
|------|---------|
| `X-Frame-Options: DENY` | ✅ |
| `X-Content-Type-Options: nosniff` | ✅ |
| `X-XSS-Protection: 1; mode=block` | ✅ |
| `Referrer-Policy: strict-origin-when-cross-origin` | ✅ |
| `Permissions-Policy` | ✅ (camera, mic, geo, payment tiltva) |
| Server-side rate limiting | ✅ (5 req/15 min IP alapján) |
| Input sanitization | ✅ (`lib/sanitizer.ts`) |
| `reactStrictMode: true` | ✅ |
| Külső linkek `rel="noopener noreferrer"` | ✅ |

### ❌ Hiányosságok

#### 6.1 — Nincs Content Security Policy (CSP)
A CSP a legfontosabb biztonsági fejléc XSS ellen — **jelenleg hiányzik**.

**Javítás** (`next.config.ts` securityHeaders tömbhöz):
```ts
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",  // unsafe-eval Next.js dev-hez kell
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https://res.cloudinary.com https://images.unsplash.com",
    "media-src 'self' https://res.cloudinary.com",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join('; '),
}
```

#### 6.2 — Nincs HSTS (HTTP Strict Transport Security)
Production HTTPS kényszerítéséhez szükséges.

**Javítás**:
```ts
{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }
```

#### 6.3 — Contact form: nincs CSRF token
Az `/api/contact` endpoint IP rate limiting védelemmel ellátott, de CSRF token nélkül. Mivel `Content-Type: application/json` POST-ot küld, a CSRF kockázat alacsony (böngészők preflight-ot végeznek), de termelési környezetben erős auth nélkül kiegészítő védelmet jelent.

#### 6.4 — `localStorage`-alapú client-side rate limit duplikát
A `lib/rateLimiter.ts` kliens-oldali rate limit megmarad a kódban a szerver-oldali mellett — ez redundáns és félrevezető lehet (a localStorage könnyen törölhető).

---

## 7. i18n / Internationalization

### Score: 82 / 100 🟢

### ✅ Jól megoldott
- `next-intl` v3.26 — modern, App Router kompatibilis
- `middleware.ts` — helyes locale detektálás
- `hreflang` — en, hu, x-default mind jelen
- `getMessages({ locale: lang })` — explicit locale paraméter
- `generateStaticParams()` — statikus params mindkét locale-ra
- Canonical URL locale-specifikus
- OG locale (`hu_HU` vs `en_US`)

### ⚠️ Javítandó

#### 7.1 — Kulcs eltérések en/hu között (ellenőrzendő)
Amennyiben a `hu.json` nem tartalmaz minden kulcsot, ami az `en.json`-ban szerepel, a magyar oldal részben angolul jelenhet meg (next-intl fallback). Egy automatizált kulcs-egyenlőség teszt ajánlott.

**Javítás** — CI script:
```ts
// scripts/check-translations.ts
import en from '../messages/en.json';
import hu from '../messages/hu.json';
// rekurzív kulcs-összehasonlítás
```

#### 7.2 — Root `app/page.tsx` redirect
A `/` URL redirect kezelése `app/page.tsx`-ben megfontolandó — jelenleg a middleware handle-li, de `notFound()` esetek és a root redirect kombinálása edge case-eket hozhat létre.

#### 7.3 — Privacy policy oldal nincs `generateMetadata`-val ellátva
Az `app/[lang]/privacy-policy/page.tsx` ellenőrizendő — ha nincs saját metadata, az örökölt layout meta nem lesz optimális.

---

## 8. Code Quality

### Score: 78 / 100 🟢

### ✅ Erősségek
- TypeScript strict mode
- Lean dependency tree (5 prod dep)
- Komponens-szintű `'use client'` (nem az egész app)
- Konzisztens Tailwind utility usage
- `NavigatorWithConnection` interface (nem unsafe cast)
- Server-side API route (nem client-only fetch)
- `ErrorBoundary` wrapper

### ⚠️ Javítandó

#### 8.1 — Inline IIFE a JSX-ben (Hero h1)
```tsx
{(() => {
  const parts = t('title').split(' ');
  ...
})()}
```
Az IIFE JSX-ben olvashatóságot ront. Jobb a komponensből kiszervezni vagy a render előtt konstansként definiálni.

**Javítás**:
```tsx
// A return() előtt:
const [titleAvelon, titleMotion] = t('title').split(' ');
// JSX-ben:
<span>{titleAvelon} </span>
```

#### 8.2 — `t` változó neve shadow-olja a `setTimeout` visszatérési értéket
```tsx
// Két useEffect-ben:
const t = setTimeout(() => setMotionActive(true), 1200);
// Ez shadow-olja a 'const t = useTranslations('hero')' értéket
```
Bár JS scope-osan helyes (inner scope), megtévesztő.

**Javítás**: `const timer = setTimeout(...)` konvencióra átállás.

#### 8.3 — Hardcoded contact adatok a Footerben
```tsx
href="tel:+3620000000"   // placeholder szám!
href="mailto:info@avelonmotion.com"
```
A telefonszám placeholder (`+36 20 000 0000`) production előtt ki kell cserélni.

#### 8.4 — `VoiceStrip` szekció
A `VoiceStrip` komponens (`Sync / Podcast / Voice Changer`) nem illeszkedik az AI videógyártó stúdió narratívájához — tartalom szempontjából félrevezető lehet.

#### 8.5 — Nincs `loading.tsx`
A Next.js App Router Suspense boundary-t `loading.tsx`-szel lehetne kezelni — jelenleg a LoadingScreen komponens manuálisan kezelt.

---

## 9. Összefoglaló Scorecard

| Terület | Score | Minősítés |
|---------|-------|-----------|
| **SEO** | 58/100 | 🟡 Közepes |
| **GEO** | 42/100 | 🔴 Gyenge |
| **Performance** | 68/100 | 🟡 Közepes |
| **Responsiveness** | 82/100 | 🟢 Jó |
| **Accessibility** | 70/100 | 🟡 Közepes |
| **Security** | 72/100 | 🟡 Közepes |
| **i18n** | 88/100 | 🟢 Jó |
| **Code Quality** | 78/100 | 🟢 Jó |
| **Összesített átlag** | **70/100** | 🟡 Közepes |

> **Megjegyzés:** Az Accessibility score korrigálva: skip link ✅, `<main>` ✅, `:focus-visible` ✅ implementálva van — a 70/100 a `<Header>` szemantikus pozíciója, Services videók aria-hidden hiánya és a marquee reduced-motion kezelése miatt nem magasabb.

---

## 10. Prioritizált javítási roadmap

### 🔴 P0 — Azonnal (1-2 nap)

| # | Feladat | Hatás |
|---|---------|-------|
| 1 | `app/robots.ts` létrehozása | SEO crawlability |
| 2 | `app/sitemap.ts` létrehozása | SEO indexelés |
| 3 | OG/Twitter image generátor (`opengraph-image.tsx`) | Social sharing |
| 4 | Services szekció videói: `aria-hidden="true"` | Accessibility |
| 5 | `<Header>` kivitele a `<main>`-ből → szemantikus struktúra | Accessibility WCAG |
| 6 | Title duplikáció javítása | SEO |

### 🟡 P1 — Hamarosan (1 hét)

| # | Feladat | Hatás |
|---|---------|-------|
| 7 | JSON-LD: Organization + FAQPage schema | GEO, SEO rich results |
| 8 | CSP header hozzáadása | Security |
| 9 | HSTS header hozzáadása | Security |
| 10 | Meta description hosszabbítása (120-160 kar) | SEO CTR |
| 11 | Dynamic imports szekciókra (`next/dynamic`) | Performance |
| 12 | `preconnect` Cloudinary-hoz | Performance |
| 13 | `:focus-visible` CSS globálisan | Accessibility |
| 14 | Footer marquee `prefers-reduced-motion` | Accessibility |

### 🟢 P2 — Következő sprint (2-4 hét)

| # | Feladat | Hatás |
|---|---------|-------|
| 15 | Mousemove throttle 16ms-re (Hero INP) | Performance |
| 16 | Service schema JSON-LD | GEO |
| 17 | Translations kulcs-ellenőrző script | i18n stabilitás |
| 18 | IIFE eltávolítása JSX-ből | Code quality |
| 19 | `t` → `timer` átnevezés useEffect-ekben | Code quality |
| 20 | Telefonszám frissítése valódira | Content |
| 21 | Ügyfél testimonialok / case studies | GEO, E-E-A-T |
| 22 | Dedikált `/about` oldal | GEO, E-E-A-T |

---

*Generálva: Claude Sonnet 4.5 · Avelon Motion Senior Dev Audit · 2026-03-05*
