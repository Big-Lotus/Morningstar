# Supabase setup and verification

This app can run with local fallback data, but these steps make it behave like a real Supabase-backed data app.

## 1. Create the Supabase project

1. Create a new Supabase project.
2. Open the SQL editor.
3. Run `supabase/apply_rss_article_schema.sql` if you want to reset `articles`
   to the minimal RSS-only shape.
4. Or run `supabase/schema.sql` followed by `supabase/seed.sql` on a new project.

If you already created the database before the custom source constraint update,
also run `supabase/migrations/20260530_custom_sources_user_scoped.sql`.
If you added the vocabulary meaning field after the first setup, run
`supabase/migrations/20260531_saved_vocabulary_meaning.sql`.
If you switched to the Korea Herald category model, run
`supabase/migrations/20260531_korea_herald_categories.sql` and
`supabase/migrations/20260531_articles_n8n_fields.sql`.
If you are enabling Supabase Auth email/password accounts, run
`supabase/migrations/20260620_supabase_auth_profiles.sql`.

## 2. Add local environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Restart the dev server after adding the file.

## 3. Configure Auth URLs

In the Supabase dashboard, open Auth > URL Configuration.

Add the auth callback and password reset routes to Redirect URLs:

```text
http://localhost:3000/auth/callback
http://localhost:3000/reset-password
```

For deployed environments, also add the production equivalent, for example:

```text
https://your-domain.com/reset-password
https://your-domain.com/auth/callback
```

Keep email confirmation enabled for the production-style signup flow. Signup
confirmation emails use `/auth/callback`, and password reset emails use
`/reset-password`.

## 4. Verify read access

```bash
npm run verify:supabase
```

This checks that the app can connect to Supabase and read seeded articles.

## 5. Verify write access

```bash
npm run verify:supabase:write
```

This creates a temporary user plus rows for interests, bookmarks, custom sources, investigations, vocabulary, shared analysis, comments, polls, options, and votes. It then removes the temporary user, and related rows are cleaned up through cascade deletes.

## 6. Test in the app

1. Start the app with `npm run dev`.
2. Open `http://localhost:3000`.
3. Use the sign-up form to create an email/password account with a username.
4. The app opens the email verification page.
5. Click the Supabase confirmation link in the email.
6. After `/auth/callback` finishes, log in or continue into the app.
7. Select interests.
8. Save and unsave a home article.
9. Open Investigate and add/delete a custom source.
10. Create an investigation.
11. Refresh the page and log in again to confirm persisted data loads from Supabase.

Login no longer creates accounts automatically. If a user tries to log in with
an unknown email or a wrong password, the app shows `없는 ID 또는 비밀번호 입니다.`

To test password reset, click `Forgot password?`, enter the account email on
the reset screen, and submit it. Supabase sends a recovery email. The link opens
`/reset-password`, where the user can set a new password.

Supabase's default email service is intended for testing and can hit rate limits
quickly during repeated signup or password-reset tests. For production, configure
Custom SMTP in the Supabase Auth settings.
