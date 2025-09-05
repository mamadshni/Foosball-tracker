# Security Notes

This app is a client-only SPA using Supabase as a backend. Because secrets cannot be hidden in the browser, security is enforced by Supabase Row Level Security (RLS) and policies.

Key points
- Your Supabase anon key will always be present in the built client. This is normal for Supabase and safe only if RLS is configured correctly.
- Do not commit real `.env` files. Use `.env.example` and GitHub Actions secrets for builds.

Minimum hardening (recommended)
1. Require auth for writes
   - Add a `created_by uuid references auth.users` column on `players` and `games`.
   - Policies:
     - `select`: allow for all (public scoreboard) or only authenticated.
     - `insert/update/delete`: only when `created_by = auth.uid()`.
2. Use Supabase Auth (GitHub or email magic link) in the UI and call `supabase.auth.signInWithOAuth({ provider: 'github' })`.
3. Disable public write policies from `docs/supabase-schema.sql` once auth is wired.

Example policies after adding `created_by`:

```sql
alter table public.players add column if not exists created_by uuid references auth.users(id) default auth.uid();
alter table public.games add column if not exists created_by uuid references auth.users(id) default auth.uid();

alter table public.players enable row level security;
alter table public.games enable row level security;

-- Everyone can read
create policy "players select" on public.players for select using (true);
create policy "games select" on public.games for select using (true);

-- Only owners can write
create policy "players write" on public.players for insert with check (auth.uid() = created_by);
create policy "players update" on public.players for update using (auth.uid() = created_by) with check (auth.uid() = created_by);
create policy "games write" on public.games for insert with check (auth.uid() = created_by);
```

Operational
- Rotate keys if accidentally leaked.
- Restrict CORS origins in Supabase settings for your production domain.
- Keep dependencies updated and run `npm audit` in CI if desired.

