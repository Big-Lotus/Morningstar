# Supabase setup and verification

This app can run with local fallback data, but these steps make it behave like a real Supabase-backed data app.

## 1. Create the Supabase project

1. Create a new Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Run `supabase/seed.sql`.

If you already created the database before the custom source constraint update,
also run `supabase/migrations/20260530_custom_sources_user_scoped.sql`.
If you added the vocabulary meaning field after the first setup, run
`supabase/migrations/20260531_saved_vocabulary_meaning.sql`.
If you switched to the Korea Herald category model, run
`supabase/migrations/20260531_korea_herald_categories.sql` and
`supabase/migrations/20260531_articles_n8n_fields.sql`.

## 2. Add local environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Restart the dev server after adding the file.

## 3. Verify read access

```bash
npm run verify:supabase
```

This checks that the app can connect to Supabase and read seeded articles.

## 4. Verify write access

```bash
npm run verify:supabase:write
```

This creates a temporary user plus rows for interests, bookmarks, custom sources, investigations, vocabulary, shared analysis, comments, polls, options, and votes. It then removes the temporary user, and related rows are cleaned up through cascade deletes.

## 5. Test in the app

1. Start the app with `npm run dev`.
2. Open `http://localhost:3000`.
3. Create a username/password account.
4. Select interests.
5. Save and unsave a home article.
6. Open Investigate and add/delete a custom source.
7. Create an investigation.
8. Refresh the page and log in again to confirm persisted data loads from Supabase.
