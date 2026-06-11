# VoltGear — Computer Accessories Store

A production-quality ecommerce storefront for **VoltGear**, a fictional brand selling computer
accessories (keyboards, mice, headsets, monitors, hubs and desk gear). The frontend is fully wired
to **Payload CMS 3** running natively inside the same Next.js app — every product, category, page,
nav link and site setting is editable from the admin panel. **No product data is hardcoded.**

> Built on the Next.js App Router with React Server Components and the Payload **Local API** for all
> server-rendered data fetching (no REST/GraphQL round-trips from the frontend).

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js (App Router, RSC, TypeScript strict) |
| CMS / backend | Payload CMS 3 (in-process, Local API) |
| Database | SQLite (`@payloadcms/db-sqlite`) for local dev |
| Styling | Tailwind CSS v4 + customised shadcn/ui |
| Icons | lucide-react |
| Fonts | Geist Sans (UI) + Geist Mono (prices / SKUs) via `next/font` |
| Cart | React Context + `localStorage` (`useCart()` hook) |
| Validation | zod + react-hook-form (checkout) |

> **Note on versions:** this project runs **Next.js 16** (and Payload 3.85), which is what the
> environment ships. The architecture is identical to Next 15; nothing here depends on a 16-only API.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables and adjust as needed
cp .env.example .env

# 3. Seed the database (6 categories, 18 products, About page, nav/footer/settings)
npm run seed

# 4. Run the dev server
npm run dev
```

Open <http://localhost:3000> for the storefront and <http://localhost:3000/admin> for the Payload
admin. On first visit to `/admin` you'll be asked to create an admin user.

### Windows note

The SQLite driver (`libsql`) needs the **Microsoft Visual C++ Redistributable (x64)**. If the dev
server boots but crashes on first DB access with _"The specified module could not be found"_, install
it once:

```powershell
winget install --id Microsoft.VCRedist.2015+.x64 -e
```

---

## Environment variables

| Variable | Purpose |
| --- | --- |
| `PAYLOAD_SECRET` | Secret used to sign Payload tokens. **Change this.** |
| `DATABASE_URL` | SQLite connection string, e.g. `file:./vitecommerce.db` |
| `NEXT_PUBLIC_SERVER_URL` | Public site URL (used for metadata, sitemap, JSON-LD) |

A working `.env` is included for local development. Rotate `PAYLOAD_SECRET` before deploying.

---

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Next.js + Payload dev server |
| `npm run seed` | Wipe and re-seed the database (destructive) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run generate:types` | Regenerate `src/payload-types.ts` from the config |
| `npm run lint` | ESLint |

---

## Project structure

```
src/
  app/(app)/
    (storefront)/        # Public site (Header + Footer layout)
      page.tsx           # Home
      shop/              # Catalog (filters, sort, pagination — URL-driven)
      category/[slug]/   # Category catalog
      product/[slug]/    # Product detail (ISR, JSON-LD)
      cart/              # Full cart page
      about/             # CMS-driven page (block layout)
    checkout/            # Slim-layout checkout + confirmation + server action
    not-found.tsx        # On-brand 404
    sitemap.ts / robots.ts
  app/(payload)/         # Payload admin + API (generated scaffold)
  collections/           # Products, Categories, Media, Orders, Pages, Users
  globals/               # Header, Footer, SiteSettings
  blocks/                # Page layout blocks (rich text, image+text, stats, team, CTA)
  fields/                # Reusable slug + SEO field groups
  components/            # Design system + feature components
  providers/             # Theme + Cart + Toaster
  lib/                   # Local API client, queries, money, media, checkout schema
  seed/                  # Seed script + placeholder image generator
```

---

## Content model (Payload)

- **Products** — title, slug, description (rich text), short description, price, compareAtPrice
  (drives sale badges), SKU, stock, images, category, brand, specs, features, badges, related
  products, status (draft/published), SEO.
- **Categories** — name, slug, description, image, featured.
- **Media** — uploads with required alt text and `thumbnail` / `card` / `full` image sizes.
- **Orders** — order number, customer + shipping address, line items (with price snapshot),
  totals, status. Created by the checkout server action.
- **Pages** — hero + a block-based layout (rich text, image+text, stats, team/values, CTA).
- **Globals** — `Header` (announcement + nav), `Footer` (link columns + socials),
  `SiteSettings` (store name, logo, support email, free-shipping threshold, flat shipping rate).

### Adding a product in the admin

1. Go to `/admin` → **Shop → Products → Create New**.
2. Fill in title, price, stock and brand; upload at least one image (Media).
3. Add specs/features rows, pick a category and badges.
4. Set **Status** to **Published** and save. It appears instantly on the storefront (catalog pages
   are dynamic; product pages revalidate every 60s via ISR).

---

## How the cart & checkout work

- The cart lives entirely client-side in `localStorage` via `CartProvider` / `useCart()`. Adding an
  item opens the slide-in drawer; the badge count, drawer and `/cart` page all stay in sync (and
  across tabs).
- Quantities are clamped to available stock.
- Checkout (`/checkout`) validates with zod + react-hook-form and submits via a **server action**
  (`createOrder`). The action **re-fetches every product server-side**, re-prices from the database
  (never trusting client prices), re-checks stock, creates the Order, decrements stock, and returns
  an order number. The client then clears the cart and redirects to the confirmation page.
- Payment is a clearly-labelled **demo** — no real charge is made.

---

## Swapping SQLite → Postgres (production)

SQLite is great for local dev but most production deployments use Postgres.

1. Install the adapter:

   ```bash
   npm install @payloadcms/db-postgres
   ```

2. Swap the adapter in `src/payload.config.ts`:

   ```ts
   import { postgresAdapter } from '@payloadcms/db-postgres'

   export default buildConfig({
     // ...
     db: postgresAdapter({
       pool: { connectionString: process.env.DATABASE_URL || '' },
     }),
   })
   ```

3. Point `DATABASE_URL` at your Postgres instance and create/run migrations:

   ```bash
   npm run payload migrate:create
   npm run payload migrate
   ```

   In development the adapter uses `push: true` (auto-sync schema). Set `push: false` against
   production databases and rely on migrations to avoid data loss.

For Vercel, `@payloadcms/db-vercel-postgres` + `@payloadcms/storage-vercel-blob` (for media) are the
drop-in equivalents.

---

## Quality notes

- **RSC-first**: only the cart, drawer, gallery, filters, theme toggle and checkout form are client
  components.
- **Accessibility**: semantic landmarks, keyboard-navigable drawer/menus with Radix focus traps,
  ARIA labels on icon buttons, alt text sourced from the CMS, a visible volt focus ring, and
  `prefers-reduced-motion` support.
- **SEO**: per-page metadata + OpenGraph, a generated `sitemap.xml` and `robots.txt`, and
  `Product` JSON-LD on detail pages.
- **States**: loading skeletons (`loading.tsx`), empty states, and an error boundary.

---

## Known limitations (deliberate, for a demo)

- Email is not wired up (no order-confirmation emails). Add `@payloadcms/email-nodemailer` in the
  Payload config to enable it.
- Payment is simulated; integrate Stripe (or another processor) in the checkout server action for
  real charges.
- Product images are generated placeholders created by the seed script.
