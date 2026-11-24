# Form & Fable storefront

A responsive storefront concept for a small-batch 3D-printed objects studio. This first slice includes a homepage and interactive product catalog. Product artwork is intentionally CSS illustration rather than stock or placeholder photos.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Create and preview a production build with `npm run build` and `npm run preview`.

## Included in this slice

- Responsive homepage, product collection, and studio story.
- Sample catalog data in `src/data/products.ts`.
- Product search, category, maximum-price, and ready-to-ship filters; sorting by rating or price.
- Product quick-view with color and quantity selection, favorites, and in-memory shopping-bag feedback.

The catalog and bag currently use in-memory sample data. Checkout, payment processing, customer accounts, inventory persistence, administration, image uploads, a REST API, and a database are not connected yet. No real payment integration is included.
