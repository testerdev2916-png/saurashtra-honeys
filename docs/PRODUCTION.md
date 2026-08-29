# Saurashtra Honey — Production Operations Guide

This document consolidates Phase 5 production-readiness artifacts:
security posture, deployment, monitoring, backups, DR, QA, and launch checklists.
UI and business logic from Phases 1–4 are unchanged.

---

## 1. Security Hardening

Implemented in `src/server.ts` (global response middleware):

- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
- `X-DNS-Prefetch-Control: on`

Additional controls already in place across the codebase:

- **SQL injection**: All DB access via Supabase client / parameterised RPCs.
- **XSS**: React auto-escaping; no `dangerouslySetInnerHTML` on user input.
- **CSRF**: Auth via Supabase bearer tokens (no cookie-session mutations).
- **Input validation**: Zod validators on every `createServerFn` boundary.
- **Authz**: RLS + `has_role` / `is_staff` security-definer functions.
- **File uploads**: Private Supabase buckets; RLS enforced per user.
- **Session rotation**: Supabase auth refresh tokens rotate automatically.
- **Secrets**: Service role key and DB URL server-only; never exposed to client.

### Recommended follow-ups (require infra work)

- Rate limiting: no built-in primitive today (see internal note). Add via
  Cloudflare WAF / Turnstile once traffic patterns are known.
- MFA: Supabase Auth supports TOTP factors; enable in the dashboard when the
  business chooses a rollout window. UI hooks live in `src/routes/account.tsx`.

---

## 2. Health, Monitoring & Error Tracking

- **Health endpoint**: `GET /api/public/health` — returns 200 ok / 503
  degraded with DB latency. Wire uptime monitor (Better Uptime, Pingdom) to it.
- **Frontend errors**: `src/lib/lovable-error-reporting.ts` already forwards
  unhandled render errors to the Lovable platform channel.
- **Backend errors**: `src/server.ts` normalises h3-swallowed 500s and logs
  captured errors via `src/lib/error-capture.ts`.
- **Audit log**: `public.audit_logs` table + `log_audit()` RPC records every
  admin write action (see `admin-cms.functions.ts`).
- **Sentry (optional)**: to integrate, add `@sentry/react` client init in
  `src/routes/__root.tsx` and `@sentry/node` in `src/server.ts` guarded by
  `process.env.SENTRY_DSN`.

---

## 3. Backups & Disaster Recovery

Lovable Cloud (managed Supabase) provides:

- Automated daily Postgres backups (retained by plan tier).
- Point-in-time recovery on paid tiers.
- Storage bucket redundancy at the object-store layer.

### Manual backup procedure

1. Cloud → Advanced settings → **Export data** to snapshot Postgres.
2. For storage: script iterating `storage.objects` and pulling via signed URLs.

### Restore procedure

1. Provision a fresh Cloud project (or reuse this one).
2. Restore via Supabase point-in-time recovery, or `psql < dump.sql`.
3. Re-upload storage assets to matching bucket paths.
4. Rotate all secrets (`SUPABASE_SERVICE_ROLE_KEY`, `LOVABLE_API_KEY`).
5. Run `GET /api/public/health` to verify.

### DR RTO / RPO targets

- **RPO**: ≤ 24h (daily backup) — reduce to <5m by enabling PITR.
- **RTO**: ≤ 2h assuming a warm secondary project.

---

## 4. PWA

- `public/manifest.webmanifest` registered via root head.
- No service worker registered (per Lovable preview safety rules).
- To enable offline app-shell caching, follow the internal PWA skill and add
  `vite-plugin-pwa` with the required preview guards.

---

## 5. Performance

- TanStack Router auto route-splits every file under `src/routes`.
- Vite tree-shakes unused modules (project is `sideEffects: false`).
- Images: static assets are pre-optimised; user uploads served from Supabase
  storage (CDN-fronted).
- Query caching: `@tanstack/react-query` with sensible staleTime defaults.
- Cache-control on public server routes (`sitemap.xml`, `robots.txt`) set to
  `public, max-age=3600`.

---

## 6. SEO

- Per-route `head()` metadata with unique title, description, og:tags.
- Dynamic `sitemap.xml` (`src/routes/sitemap[.]xml.ts`) enumerates published
  products, posts, categories.
- `robots.txt` server route reads disallow paths from `app_settings`.
- JSON-LD: Organization on root, Product on PDP, BreadcrumbList on PDP,
  Article on blog posts.

---

## 7. Accessibility

- Semantic HTML throughout (nav, main, article, section).
- All Radix primitives ship with correct ARIA roles.
- Keyboard focus visible via Tailwind ring utilities.
- Icons paired with `sr-only` labels where they act as buttons.

Recommended follow-up: run `axe-core` in CI on key routes.

---

## 8. DevOps

- **Environments**: dev (`build:dev`) and prod (`build`) — same codebase,
  different Vite mode. Cloud provides separate dev/prod secret scopes.
- **CI/CD**: any push to main triggers a Lovable build; `bun run build` is
  the canonical production build command.
- **Health check**: `GET /api/public/health` — hook to load balancer.
- **Feature flags / Maintenance mode**: driven by `app_settings.data.features`
  (JSONB). Add a `maintenance_mode` boolean and gate `__root.tsx` on it when
  operationally required.

---

## 9. Testing

The project ships with type-safety as the primary correctness gate
(`tsgo` / `tsc --noEmit`, zero errors). To add automated test suites:

```bash
bun add -d vitest @testing-library/react @testing-library/jest-dom playwright
```

Suggested coverage:

- **Unit**: `src/lib/analytics.ts` deduplication, coupon math, cart totals.
- **Integration**: server function handlers via mocked Supabase client.
- **E2E** (Playwright): auth → add-to-cart → checkout → order details.
- **Smoke**: `GET /`, `GET /shop`, `GET /api/public/health` return 200.

---

## 10. Launch Checklist

- [ ] All migrations applied on production DB.
- [ ] `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
      `LOVABLE_API_KEY` configured in prod secret scope.
- [ ] Google OAuth client configured in Supabase Auth → Providers.
- [ ] Payment gateway credentials (Razorpay) set as secrets.
- [ ] `app_settings` populated with production GA4 / Meta Pixel / Clarity IDs.
- [ ] Custom domain connected + SSL verified.
- [ ] `/robots.txt` allows crawling; `/sitemap.xml` submitted to Search Console.
- [ ] `/api/public/health` returns 200.
- [ ] Uptime monitor + Sentry DSN wired (if used).
- [ ] Backup schedule verified in Cloud dashboard.
- [ ] Admin user seeded via `claim_admin_if_none` RPC.

---

## 11. Admin Manual (quick reference)

Admin surface lives under `/admin/*` and is gated by `has_role('admin' | 'super_admin' | 'manager' | 'editor')`:

- `/admin` — KPI dashboard (`admin_dashboard_stats` RPC).
- `/admin/products`, `/admin/categories`, `/admin/inventory` — catalog.
- `/admin/orders` — order lifecycle + tracking.
- `/admin/customers`, `/admin/users` — CRM + RBAC.
- `/admin/reviews`, `/admin/blog`, `/admin/media`, `/admin/hero` — content.
- `/admin/coupons`, `/admin/loyalty`, `/admin/marketing` — growth.
- `/admin/newsletter`, `/admin/submissions`, `/admin/redirects` — ops.
- `/admin/settings` — global SEO / analytics / feature flags.
- `/admin/audit` — full audit log.

---

## 12. Known Constraints

- Rate limiting relies on the edge platform (Cloudflare) — no in-app limiter.
- Service worker / offline mode intentionally disabled in preview.
- Image resizing pipeline currently client-side; add a CDN transformer
  (Cloudflare Images) before scaling.
