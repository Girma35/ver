# Supabase setup (single-user storage)

WorkEthio is a one-user demo, so the database holds exactly one row per table, keyed by the
profile id `demo-user`. Everything works offline; Supabase is optional and only switches on when
credentials exist.

## 1. Create the project

1. Sign in at <https://supabase.com/dashboard> and create a free project.
2. Open **SQL Editor → New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql)
   and run it. That creates:
   - `workethio_profiles` — language + active page
   - `workethio_wallets` — balance, completed task ids, payout method
   - `workethio_verifications` — KYC status and applicant details
   - Row Level Security on all three, scoped to `profile_id = 'demo-user'`

## 2. Create the document bucket

Run [`supabase/storage.sql`](supabase/storage.sql) the same way. It:

- adds `id_file_path` / `selfie_file_path` to `workethio_verifications`
- creates the private bucket `kyc-documents`
- allows the app key to read/write objects only under the `demo-user/` prefix

Without this step the app still syncs the wallet and KYC text, but document images stay on the
device that uploaded them (the console warns once).

## 3. Add the credentials

In **Project Settings → API** copy the **Project URL** and the **anon public** key into `.env`:

```env
VITE_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR-ANON-KEY"
```

`@supabase/supabase-js` note: the anon key is meant to be public in the browser — RLS is what protects the
data. Never put the `service_role` key in this project.

## 4. Restart and check

```bash
npm run dev
```

The footer shows the sync state:

| Badge | Meaning |
| --- | --- |
| `Cloud saved` | state is persisted in Supabase |
| `Cloud: connecting` | initial read in flight |
| `Cloud: offline` | request failed (check keys / SQL / network) |
| `Local only` | no credentials configured — browser storage only |

To confirm writes: complete a task, then check **Table Editor → workethio_wallets**
(`balance_etb`, `completed_tasks`).

## What is stored where

| Data | Where |
| --- | --- |
| Wallet, task completions, payout method | `workethio_wallets` |
| KYC fields, verified flag, submission id | `workethio_verifications` |
| Language, active page | `workethio_profiles` |
| ID / selfie image binaries | Supabase Storage bucket `kyc-documents`, path `demo-user/<kind>/<timestamp>-<name>` (plus an IndexedDB copy for instant previews) |
| Object paths of those images | `workethio_verifications.id_file_path` / `selfie_file_path` |

Resetting the demo (the `Reset` button) also deletes the cloud wallet and verification rows.

## Behaviour without Supabase

If the env vars are missing, empty, or still placeholders, the app skips every network call and
keeps the existing browser-cached behaviour, so the demo runs from a plain `npm run dev`.
