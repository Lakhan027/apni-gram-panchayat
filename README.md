# अपनी ग्राम पंचायत — Appliyas

Public (People's) section of a Hindi-first Gram Panchayat portal for **Gram Panchayat Appliyas, Tehsil Hurda, District Bhilwara, Rajasthan**.

> **Note:** the figures, works, payments and dates in `data/` are sample content and must be replaced with verified Panchayat records before going live. No real names, Aadhaar, bank or phone numbers are used.

## Stack

- Next.js 14 (App Router, `output: 'export'` → fully static), TypeScript (strict), Tailwind CSS, Lucide icons
- Mukta font via `next/font/google`
- No backend, database, login, payment or external API. Search, filters, sorting, CSV export and form validation run in the browser.

## Requirements

- Node.js **18.17+** (tested on Node 24)
- npm 9+

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
npm run start      # serves ./out locally (npx serve)
npm run typecheck
npm test              # unit + integration tests (Vitest)
npm run test:watch    # re-run on change (use this for TDD)
npm run test:coverage
npm run test:build    # next build, then checks the real out/ folder
```

## Pages

| Route | Page |
| --- | --- |
| `/` | मुख्य पृष्ठ (Home) |
| `/about` | पंचायत परिचय |
| `/works`, `/works/[id]` | विकास कार्य + detail |
| `/mgnrega` | VB—G RAM G (NREGA) |
| `/mgnrega/apply-work` | कार्य के लिए आवेदन (form, frontend only) |
| `/mgnrega/new-job-card` | नया जॉब कार्ड बनाने हेतु (form, frontend only) |
| `/mgnrega/mistol` | मिसटोल |
| `/services/digital-signature` (+ `/noc`, `/ration-card`, `/light-file`) | डिजिटल सिग्नेचर + 3 guidance pages |
| `/services/digital-services` | डिजिटल सेवाएँ (how-to guide + 7 official portals, open in a new tab) |
| `/services/house-patta` | आवासीय मकान पट्टा (guidance) |
| `/budget` | बजट एवं खर्च (print + CSV) |
| `/gram-sabha` | पंचायत बैठक (कोरम) |
| `/schemes`, `/schemes/[id]` | सरकारी योजनाएँ + detail |
| `/notices` | सूचनाएँ |
| `/complaints` | शिकायत / सुझाव (online filing not live yet — nothing stored or sent) |
| `/contact` | संपर्क |
| `/sarpanch` | हमारे सरपंच — profile (data in `data/sarpanch.json`) |
| `/members` | पंचायत सदस्य (member cards) |
| `/gallery` | गैलरी (village photos + large preview) |
| `/admin` | Coming Soon only |
| any other | Hindi 404 |

## Project layout

```
app/          routes (server components by default)
components/   layout/, home/, ui/, works/, notices/, mgnrega/, budget/, gram-sabha/, schemes/, forms/
tests/        unit, data, component and integration tests
data/         *.json sample data
lib/
  types.ts       data models
  data.ts        the ONLY place that reads data
  format.ts      ₹ Indian format, Hindi dates, % and budget math
  constants.ts   nav links, status colours, category keys
  schedule.ts    behind-schedule / deadline-near logic
  i18n/          dictionary, translate(), LanguageProvider, <T>/<L>
  validation.ts  complaint form rules
public/images/ placeholder illustrations
```

## Replacing sample JSON with real data

1. **Edit JSON directly** (simplest): update files in `data/`, keep the shapes in `lib/types.ts`. Only publish records verified from an authorised source.
2. **Connect the Node.js/Express + PostgreSQL API later**: change only `lib/data.ts`. Each function is already `async`, e.g.

   ```ts
   const API = process.env.NEXT_PUBLIC_API_URL;
   export async function getWorks(): Promise<Work[]> {
     const res = await fetch(`${API}/works`, { next: { revalidate: 300 } });
     if (!res.ok) throw new Error('works');
     return res.json();
   }
   ```

   Pages and components do not need changes. If you need live data on every request, remove `output: 'export'` from `next.config.mjs` and deploy as a Node app.

### Data rules

- Budget: **approved** amounts come from `budget.json → lines`; **recorded** and **verified** amounts are computed only from `budget.json → payments` (see `budgetTotals` / `workWiseRows` in `lib/format.ts`), so every total matches.
- VB—G RAM G (NREGA) wages are never shown as deposited unless `status` is `verified`; reference numbers show only for verified rows.
- Never add worker names, Aadhaar, bank account or villagers' phone numbers.
- Unverified scheme links / eligibility show `[आधिकारिक लिंक — सत्यापन हेतु]`.

## Language (हिंदी / English)

- The site is Hindi by default. The **English / हिंदी** button in the header (inside the menu on phones) switches every page; the choice is saved in the browser (`localStorage` key `agp-lang`).
- UI text lives in `lib/i18n/dictionary.ts` — every key must exist in both languages (a test enforces this, and that English has no Devanagari left).
- Data text: each JSON record may carry an `en` block (e.g. `"en": { "name": "…" }`). If it is missing, the Hindi original is shown.
- Pages are pre-rendered in Hindi; English is applied in the browser after load. Page `<title>`s stay Hindi.
- In components use `useLang()` (`t`, `pick`, `lang`); in server components use the small client leaves `<T k="…" />`, `<L hi="…" en="…" />`, `<DateText />`, `<ShortINR />` from `lib/i18n/T.tsx`.

## Official links

Each scheme in `data/schemes.json` has an `officialLink` (or `null`). Links open in a new tab with `rel="noopener noreferrer"`; schemes without a verified link show a **जल्द आ रहा है / Coming Soon** badge and popup instead of an empty link (`components/schemes/OfficialLink.tsx`). A test requires every link to be `https://…gov.in` with no tracking parameters (`utm_…`).

| Scheme | Official site |
| --- | --- |
| चंबल पेयजल योजना | PHED Rajasthan — Chambal–Bhilwara Water Supply Project (Project 10) |
| घरेलू नल कनेक्शन | Jal Jeevan Mission |
| व्यक्तिगत घरेलू शौचालय | Swachh Bharat Mission (Gramin) |
| वृद्धावस्था / विधवा / दिव्यांग पेंशन | Jan Soochna Portal — Social Security Pension |
| VB—G RAM G (NREGA) जॉब कार्ड (and the NREGA page) | nrega.dord.gov.in |
| जन्म / मृत्यु प्रमाण पत्र, संपत्ति रिकॉर्ड | Coming Soon (no verified link yet) |

## Schedule flags (समय से पीछे)

Works whose expected completion date has passed (and are not complete) are flagged **समय से पीछे / Behind schedule**; works due within 30 days with under 90 % progress are **समय सीमा निकट / Deadline near**. Logic: `lib/schedule.ts`. Because the site is static, "today" is the build date — rebuild/redeploy regularly (e.g. a daily scheduled deploy) to keep flags current.

## Tests

| Folder | What it covers |
| --- | --- |
| `tests/lib` | Unit tests: money/date formatting, budget math, CSV, validation, data layer, schedule logic, i18n helpers |
| `tests/data` | Data integrity: IDs, enums, cross-references, payments ≤ approved, privacy (no Aadhaar/phone-like numbers) |
| `tests/components` | Component tests with Testing Library: header/menu/search, filters, tables, form, gallery, budget CSV/print, language switcher |
| `tests/integration` | Whole pages rendered with real data; and (`npm run test:build`) checks on the built `out/` folder — every route exists, one `<h1>`, all links/assets resolve |

The schedule and language features were built test-first (red → green → refactor): `tests/lib/schedule.test.ts`, `tests/components/schedule-ui.test.tsx`, `tests/lib/i18n.test.ts`, `tests/components/language.test.tsx`.

## Deploy

`npm run build` produces a static `out/` folder.

- **Vercel**: import the repo — framework "Next.js", no extra settings.
- **Netlify**: build command `npm run build`, publish directory `out`.
- **Any static host / Nginx**: upload the contents of `out/`. `trailingSlash: true` is set, so every route is a folder with `index.html`; serve `404.html` for unknown paths.

## Accessibility & responsiveness

- `<html lang="hi">`, skip link, semantic landmarks, visible green focus ring, `Esc` closes menu / search / photo viewer.
- Mobile-first; tables become card lists below `md`, scroll with a sticky first column from `md` to `lg`, full tables from `lg`.
- Status is always shown with text + icon, never colour alone. Respects `prefers-reduced-motion`.
