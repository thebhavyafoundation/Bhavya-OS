# PR #32 — Pre-Deploy Production Baseline

Captured read-only, immediately **before** human merge of PR #32.

|                           |                                                                      |
| ------------------------- | -------------------------------------------------------------------- |
| **Captured (UTC)**        | `2026-10-16T21:23:21Z`                                               |
| **Captured (local)**      | `2026-10-17 02:53:24 +05:30`                                         |
| **master SHA at capture** | `bd307fbc86374460b3f50d99bc7e2211118adb9d`                           |
| **Production URL**        | `https://bhavya-foundation.thebhavyafoundation.workers.dev`          |
| **Worker name**           | `bhavya-foundation`                                                  |
| **Edge POP**              | `DEL` (cf-ray suffix, all routes)                                    |
| **Method**                | Unauthenticated GET only. No login, no form submission, no mutation. |

## Routes

| Route                                               | Purpose                 | Status | Bytes   | SHA-256                                                            | Marker                                                                     |
| --------------------------------------------------- | ----------------------- | ------ | ------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `/`                                                 | homepage                | 200    | 44,629  | `7413939E18B6C28D5EEEAB47AA25455FA694D37D222EB6B695A560F257DA7575` | `<title>` = "Bhavya Foundation - For People. For Nature. For Generations." |
| `/curriculum`                                       | curriculum registry     | 200    | 185,498 | `AF03E161F6BFB4CCD4CB27F86B9CB9080091E65D426E30611CE3F502C48CA810` | **86** modules                                                             |
| `/curriculum/levels`                                | academy levels          | 200    | 73,034  | `A66C31162F646C9660655788211521ABB0AD86E82D70198EF4059EF3A4638672` | "13 Levels of AI Mastery"                                                  |
| `/about`                                            | about                   | 200    | 30,849  | `B4E5E516CB94C499B6EA8BD3ACE7E29DC5C7A74CF1A0B2CB5632562D68565FA7` | "About Bhavya Foundation"                                                  |
| `/os`                                               | OS route                | 200    | 19,817  | `6DF53DA142814905AD1235E920459B3CD323637EEAA2B02E1D7102920CD484E2` | "Bhavya OS \| Bhavya Foundation"                                           |
| `/manifest.json`                                    | **public static asset** | 200    | 560     | `1D7C45D4E5656A8F1C1343E42FDCD719CE719A52AA6C9A36013EE4F27C2637EE` | `"name"` = "Bhavya Foundation"                                             |
| `/definitely-not-a-real-route-9f2a`                 | **expected 404**        | 404    | —       | n/a (error body not hashed)                                        | correct not-found behaviour                                                |
| `/diagrams/architecture/bhavya-os-architecture.svg` | additional asset probe  | 404    | —       | n/a (error body not hashed)                                        | see note                                                                   |

> Hashes are SHA-256 over the exact response body bytes and were computed, not
> inferred. A post-deploy claim of "byte identical" must be demonstrated by
> re-hashing and comparing against these values — not asserted.

## Notes on the two 404s

**`/definitely-not-a-real-route-9f2a` (404)** is the intended control: unknown
routes correctly return not-found.

**`/diagrams/architecture/bhavya-os-architecture.svg` (404)** is **expected
pre-merge, not a defect**. The Diagram Design work lives only on feature
branches (`feat/diagram-design-pilot` / PR #31) and is not on `master`. This
path is recorded so that a post-deploy 404 here is not mistaken for a
regression, and so a post-deploy **200** would confirm master moved.

## Worker deployment metadata — deliberately not retrieved

The Cloudflare Worker **version ID and "last modified" timestamp were not
captured**. Reading them requires Cloudflare API credentials, and this task is
forbidden from touching secrets or authenticating to Cloudflare.

What is recorded instead is the **expected observable change**: after a
successful deploy, the Cloudflare dashboard's Worker modified timestamp for
`bhavya-foundation` must move from its pre-merge value. That value must be read
by a human from the dashboard; this record intentionally does not guess it.

As an indirect freshness signal, all six 200 responses carried a
`cf-ray` header on edge POP `DEL` with **no `age` header**, i.e. not served from
a stale cache at capture time.

## Deployment history context at capture

| Date (UTC)     | master SHA | Cloudflare deploy               |
| -------------- | ---------- | ------------------------------- |
| 2026-10-16     | `bd307fbc` | **failure** (run `38960641361`) |
| 2026-10-16     | `3a3cbd22` | failure (`38925366894`)         |
| 2026-10-14     | `39648655` | failure (`38645120491`)         |
| 2026-10-04     | `e53f95a1` | failure (`37216721603`)         |
| **2026-10-02** | `3b715c7a` | **last success**                |

So at capture, production serves the **2026-10-02** build. Merging PR #32 is
expected to be the **first successful Cloudflare deployment since 2026-10-02**
if and only if the `@libsql/isomorphic-ws` packaging repair holds in the
deploy-time bundling.

## Post-merge comparison checklist

To prove a successful deploy rather than assume one:

1. Worker `bhavya-foundation` modified timestamp changed from pre-merge value.
2. Deployed commit equals the PR #32 merge commit on `master`.
3. Re-request all six 200 routes and re-hash; compare against the table above.
4. Confirm `/curriculum` still reports **86** modules.
5. Confirm `/definitely-not-a-real-route-9f2a` still returns 404.
6. Note whether `/diagrams/architecture/bhavya-os-architecture.svg` changed
   from 404 (it should remain 404 — Diagram Design is not on `master`).
7. Watch for JavaScript console errors and failed network resources.

Read-only: no authentication, no form submission, no production data mutation.
