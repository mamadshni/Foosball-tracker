## Deploy + Database Setup

### 1) Supabase (free tier)

- Create a project at https://supabase.com (free tier is fine)
- Open SQL editor and run: `docs/supabase-schema.sql`
- Get Project URL and anon public key
- Copy `.env.example` to `.env` and set:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

Optional: seed players with one insert:

```
insert into public.players (id, name) values (gen_random_uuid(), 'Alice');
```

### 2) Local run

```
npm i
npm run dev
```

### 3) GitHub Pages

- Push repo to GitHub
- Add repository secrets for build (if you don't commit `.env`):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

Workflow example (create `.github/workflows/deploy.yml`):

```
name: Deploy
on:
  push:
    branches: [ main ]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Notes:
- SPA routing: GitHub Pages needs a 404 fallback to `index.html`. The deploy action handles it; if not, copy `dist/index.html` to `dist/404.html`.
- If your repo is not user/organization pages, set `base` in `vite.config.ts` to `/<repo-name>/`.

### 4) Production checklist

- RLS: Current policies allow public writes for simplicity. Lock these down before public launch.
- Analytics: optional Cloudflare or Plausible.
- Backups: export regularly on free tier.

