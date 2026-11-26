# Database + Auth + Image storage setup (Supabase)

## 1. Create the backend (5 min)
1. Create a free project at https://supabase.com
2. **SQL Editor → New query** → paste all of `supabase/schema.sql` → **Run**.
   This creates the tables (profiles, listings, reviews), security rules (RLS) and the `listing-images` storage bucket.
3. **Project Settings → API** → copy the *Project URL* and the *anon public* key.

## 2. Run locally
```bash
cp .env.example .env.local      # paste the URL + anon key
pnpm install                    # refreshes pnpm-lock.yaml for the new dependency
pnpm dev
```

## 3. Create your admin
1. Open the app → **Sign in → Create an account** with your email.
2. In Supabase SQL Editor run:
   ```sql
   update public.profiles set role = 'admin' where email = 'YOUR_EMAIL@example.com';
   ```
3. Reload the app: an **Admin** button appears in the header (`/admin`).

## 4. Deploy worldwide (Vercel)
1. Push the project to GitHub (commit the updated `pnpm-lock.yaml`; `.env.local` is git-ignored).
2. Import the repo at https://vercel.com → add the two env vars
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Deploy.
3. In Supabase **Authentication → URL Configuration**, set *Site URL* to your Vercel domain
   (needed for email-confirmation links).

## How it works
| Need | Where it lives |
|---|---|
| User credentials | Supabase Auth (passwords are hashed; never stored in your tables) |
| Admin login | Same login; `profiles.role = 'admin'` unlocks `/admin` |
| Images | Supabase Storage bucket `listing-images` (public read; users upload only into their own folder) |
| Security | Row Level Security in `schema.sql` — enforced by the database, not just the UI |

Flow: signed-in users post at `/listings/new` → listing is `pending` → admin approves at `/admin` → it appears publicly.

The anon key is safe to expose in the browser *because* RLS is enabled. Never put the `service_role` key in the front end.
