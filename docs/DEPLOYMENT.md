[Tiếng Việt](DEPLOYMENT.vi.md)

# Deployment on Vercel Hobby

No cloud resources were created or purchased. Use Neon free tier and Vercel Hobby within their terms and monitor quotas.

1. Create Neon PostgreSQL and execute `migrations/001_initial.sql` in its SQL editor. It uses a transaction and is repeatable. Use the supplied TLS connection string.
2. Configure a Google OAuth Web application with scope `openid`, consent screen and test users if required. Register the exact callback `https://YOUR_HOST/api/auth/callback`.
3. Import the repository into Vercel, select Node 22+, install `npm ci`, build `npm run build`, output `dist`. `vercel.json` routes API paths to the Node serverless handler.
4. Set server-only variables and redeploy:

| Variable             | Value                                                                  |
| -------------------- | ---------------------------------------------------------------------- |
| DATABASE_URL         | Neon connection string                                                 |
| GOOGLE_CLIENT_ID     | Google web client ID                                                   |
| GOOGLE_CLIENT_SECRET | Google client secret                                                   |
| SESSION_SECRET       | At least 32 random characters; generate with `openssl rand -base64 48` |
| APP_URL              | Exact HTTPS origin without trailing slash                              |

Never use a `VITE_` prefix for secrets or commit `.env` files. No child email is needed.

## Local and release checks

For frontend-only development use `npm run dev`. For APIs, copy `.env.example` to `.env.local`, configure a separate development Neon database, apply the migration and run `npx vercel dev`. Match Google callback/origin exactly. Cookies stay Secure; test local authentication in a compatible secure context. Use a stable deployed origin rather than arbitrary preview URLs for OAuth testing.

Before release: authenticate, create a nickname, plant and decorate; sign in on a second device and select the same profile. Test two unrelated parents, expiry/relogin, offline reload and pending retry. An embedded PostgreSQL test is not a live Neon or OAuth test.

## Updates and privacy

Add a new version for future migrations and back up before destructive changes. New service workers activate after old tabs close. API responses are never cached. Sessions last 30 days; accounts and progress have no TTL. Rate buckets expire and are cleaned during requests; no cron/server is required.

Logout clears the cookie while local gardens remain playable. Use trusted devices. Self-service account deletion/export is not implemented; an administrator can delete a parent in Neon and cascade its profiles. Add a parent-facing procedure before broad public release.
