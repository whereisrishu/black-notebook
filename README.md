# The Black Notebook

A responsive digital journal with dated reflections, optional checkboxes, and a black-and-amber notebook look.

## Current status

The app has a single-owner Supabase sign-in and cloud-sync implementation. It is connected to the **Notebook** Supabase project on the Free plan, and the owner-scoped table with Row Level Security is installed. The app is not connected to a GitHub repository yet. No notebook answers have been uploaded, and the owner sign-in still needs to be created in Supabase Auth.

The Supabase browser SDK is loaded from jsDelivr at the fixed version `@supabase/supabase-js@2.117.3`. The public app prompts are in the static files. GitHub Pages is publicly reachable; saved answers are protected by Supabase Auth and database Row Level Security (RLS), not by hiding the app source.

## Local use

Open `index.html` in a modern browser. Choose **Continue on this device only** to use this browser’s local notebook without signing in, or sign in to sync. Device-only edits stay in the existing localStorage key `black-notebook-v1`. Use **Export** to keep a JSON backup before changing devices or switching to cloud storage.

## Connect one Supabase account

1. The **Notebook** Supabase project is already created on the Free plan.
2. The migration `supabase/migrations/20261013175633_create_notebook_state.sql` has been applied. It creates one JSON state row per authenticated user and enables owner-checked RLS policies.
3. The table is in the `public` schema and grants only `SELECT`, `INSERT`, and `UPDATE` to `authenticated`; RLS checks the row's `user_id` against `auth.uid()`.
4. Create your owner user in the Supabase dashboard. Do not add a sign-up form to the app. After creating the account, turn off new user sign-ups in Supabase Auth settings.
5. `public-config.js` already contains this project's URL and **publishable** key. Those two values are visible to browsers by design. Never put a database password, secret key, or service-role key in this file.
6. Open the app over `http://localhost` or its hosted HTTPS address and sign in with the owner email and password.

The owner account still needs to be created in Supabase Auth, and new sign-ups should be disabled afterward. The app first checks Supabase. If the account has no saved notebook yet and this browser has local entries, it asks before uploading those entries. If cloud entries already exist, it keeps any different local state in a separate recovery copy and opens the cloud version. Use **Export this device’s older entries** to download that recovery copy. Use Import after sign-in to deliberately replace cloud state with a JSON backup; the app asks before replacing it.

## Publish to GitHub Pages

1. Push the project to a GitHub repository. Keep backups and credentials out of the repository. The repository contains the app prompts and code, not notebook answers.
2. In repository **Settings → Pages**, select **GitHub Actions** as the source.
3. In repository **Settings → Secrets and variables → Actions → Variables**, add `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`. These are public client configuration values, not secret keys.
4. Push to `main` or run the **Deploy Black Notebook** workflow manually. It publishes only `index.html`, `public-config.js`, and `src/`.
5. Open the Pages URL on your phone and computer. Sign in with the same owner account on both.

GitHub Pages sites are publicly reachable, including when the source repository is private. People may see the notebook questions and login screen, but they cannot read or alter saved entries without the owner's authenticated session; Supabase RLS enforces that rule even outside the app UI.

## Privacy and recovery

- Cloud syncing stores your reflections in Supabase. This is not end-to-end encryption.
- The browser uses only the Supabase URL and publishable key. A secret/service-role key must never be deployed in the frontend.
- Keep the original device's JSON export until you have signed in from both devices and confirmed that the entries are present.
- Export remains available after sign-in. If offline, edits stay in the local cache and the page shows an unsynced status with a retry action.
- If both devices change the notebook independently, the app stops automatic saves and asks whether to load the cloud copy or replace it with this device's copy.

## Contents

Cover, the eight image-inspired sections, Weekly Check-In, and Free Writing. Dated pages have a calendar with entry markers; each question has a simple example and a writing area. Relevant short selections have optional checkboxes.

