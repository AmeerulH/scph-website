This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Sanity Studio

Content schemas live in [`studio/`](studio/) (same repository as the Next.js app).

```bash
cd studio
npm install
npm run dev
```

Use `npm run build` / `npm run deploy` from `studio/` when publishing the hosted Studio. After changing schemas, deploy to the Sanity content lake with `cd studio && npx sanity schema deploy`. Schema files are under `studio/schemaTypes/`.

Seed the GTP 2026 programme document from [`src/components/gtp/programmes/data.tsx`](src/components/gtp/programmes/data.tsx) (requires `SANITY_API_TOKEN` in `.env.local`): `npm run import-gtp-programme`. Uses **`SANITY_DATASET`** from `.env.local` (defaults to `production`). When `SANITY_DATASET=development` (or `GTP_APPEND_TEST_SESSION=1`), Day 1 gets an extra **23:59 test lightning session** so you can confirm the site reads Sanity. Preview payload: `DRY_RUN=1 npm run import-gtp-programme`. Then open Studio (**same dataset** as in `.env.local`) and **Publish** if needed.

The Next.js app reads Sanity using [`src/sanity/client.ts`](src/sanity/client.ts). Set **`SANITY_DATASET`** in `.env.local` (e.g. `development`) to point the site at a non-production dataset locally; omit it to use `production`.

# scph-website
