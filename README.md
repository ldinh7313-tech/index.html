# Forme — Printed Objects

A React, TypeScript, Vite, and Tailwind CSS storefront prototype for a small-batch 3D-printed objects shop. The current milestone covers the homepage and product catalog; it is a frontend-only prototype, not a production e-commerce system.

## Run locally

Requirements: Node.js 20.19 or newer and npm.

```sh
npm install
npm run dev
```

Vite prints a local URL (normally `http://localhost:5173`). To make and preview a production build:

```sh
npm run build
npm run preview
```

## Included in this milestone

- Responsive homepage, collection highlights, product catalog, and studio story.
- Product search, category, popularity, availability, and price filters; sorting by featured, newest, and price.
- Product detail dialog with sample dimensions, materials, production times, and selectable colors.
- Shopping bag with quantity and removal controls, sample shipping calculation, and browser-local persistence.
- Newsletter form interaction and labeled product-image placeholders.

Sample products and prices are for development only. Replace the product data in `src/products.ts` and the CSS placeholder artwork with approved product photography before launch.

## Not configured yet

There is no backend, database, customer authentication, order management, image-upload service, or payment processing in this milestone. The checkout action is intentionally disabled: the shopping bag is a local preview only and does not create an order or accept payment details. Do not treat it as a live checkout.

Before accepting real orders, add a server-side API and PostgreSQL database for products, inventory, customer records, and orders; use password hashing and secure sessions for accounts; store uploaded product images in private/configured object storage; and integrate Stripe Checkout or another provider through server-side endpoints. Keep secrets in server environment variables, never in the frontend. Test gateway integration in the provider's test mode before enabling live charges.

## Deployment

The current frontend can be deployed as a static Vite site to a host such as Vercel, Netlify, or Cloudflare Pages. Use `npm run build` as the build command and `dist` as the output directory. Since no backend is included, deployment only publishes the prototype; the disabled checkout and local-only cart are not suitable for taking orders.
