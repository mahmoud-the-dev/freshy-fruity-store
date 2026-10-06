# Freshy Fruity P2 — Single-run evaluation report

## 0. Run identity

- Project: Freshy Fruity
- Condition: control
- Run / session ID: `ses_f034a9502ffeY5pMqd3Y9UnsT6` (parent). Child sessions in the same JSON export: `ses_f034a2a1affeC3f0R50T06gFMB` (first SEO subagent, recorded as cancelled in the Markdown transcript), `ses_f034a29d6ffe1T18PldmtBzh49` (performance audit), `ses_f032b7af9ffeUHQr5LVcDbYKDU` (SEO audit retry).
- Frozen branch / HEAD commit: `seo-fixes` / `3b711e5776f881698123c8742d7cefdbad489a7f`
- Baseline (seeded) commit: `2388d9a70f739fa060ce5048e653c65ac16422a0` (`Serve the app for direct product links`, `origin/main`). It is an ancestor of HEAD. The agent’s `git log` at session start listed this commit as the tip.
- Model (from session): GPT-5.6 Terra (assistant headings `Build · GPT-5.6 Terra`; ccusage model ID `gpt-5.6-terra`). Subagent prompts also open with “You are gpt-5.6 Terra.”
- AgentSEO configured: no
- Session evidence files: `session-ses_f034.md` (Markdown transcript) and `ses_f034a9502ffeY5pMqd3Y9UnsT6.json` (OpenCode session export, including child session IDs). Transcript line references below refer to this Markdown file.
- Evaluator date: 2026-10-02

## 1. Executive summary

The control agent audited the Vite/React single-page application (SPA) using two completed subagents for performance and search engine optimization (SEO), requested rendering decisions and business facts, and produced twelve commits on `seo-fixes`. For S1, it identified the homepage loading-space mismatch and enlarged the skeleton. The evaluator's post-run browser test measured Cumulative Layout Shift (CLS) at 0.894, compared with the pre-fix Lighthouse value of 0.537. The in-page skeleton nearly matches the loaded content, but the route-level “Loading Freshy Fruity...” fallback introduced in `eb86a74` reserves almost no space.

For S2, the agent replaced the oversized favicon source with a 388-byte Scalable Vector Graphics (SVG) file, but left both logo PNGs unchanged and did not recommend optimizing them. Browser validation confirmed that the replacement does not preserve a meaningful brand image; S2 remains unresolved. The evaluator also confirmed that S3 remains unresolved: product details do not appear until the delayed recommendations load. S4 was resolved by `6538668`, which falls back to the actual product name and description while preserving populated SEO fields. The evaluator confirmed the fix through browser validation and code review; the agent's diagnosis remains partial because it did not identify affected detail responses. End-to-end seeded success is **1/4**.

Additional changes cover route splitting, lazy image loading, metadata, crawl files, dependency upgrades, semantic controls, verified contact details, and a default application programming interface (API) host. Regressions are documented separately in Section 6.

## 2. Seed × outcome matrix

| Seed ID | Category | Identification | Diagnosis | Remediation | Validation | Correctly blocked | End-to-end success | AgentSEO tool-detection |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | CLS | identified | full | full | unresolved | not_applicable | no | not_applicable |
| S2 | image optimization | identified | partial | no_fix | unresolved | not_applicable | no | not_applicable |
| S3 | performance | not_identified | absent | no_fix | unresolved | not_applicable | no | not_applicable |
| S4 | SEO metadata | identified | partial | full | resolved | not_applicable | yes | not_applicable |

## 3. Per-seed evidence

### S1 Homepage CLS from loading-space mismatch

- Identification evidence (session): Identified. Performance subagent `ses_f034a29d6ffe1T18PldmtBzh49`, returned in the parent transcript around lines 304–305 and 315–318, states: “P2: Home skeleton and loaded content do not reserve equivalent geometry. `Home.tsx:8-25` renders only a compact hero skeleton, while `Home.tsx:56-95` later adds a larger hero, values, and carousel. CSS deliberately makes the skeleton smaller at `Home.module.css:159-163`. Home Lighthouse CLS was **0.537**.” The same report separates this from store CLS 0.804 (lines 286–287). The parent treated the audit as actionable (line 437) and later implemented a matching skeleton (line 6061).
- Diagnosis evidence: Full. The finding names the seeded mechanism: the loading placeholder is a smaller hero, and the loaded API content adds a larger hero, the values block, and the carousel. It is not attributed only to an unrelated image, font, or generic render. Fonts and the home logo are a separate P2 item (lines 307–308).
- Commits / files / diff summary: `705c290d62d6bf31dc1736bff1767bdbdde101b5` “Reserve space for asynchronous content” (2026-10-02 16:53:58 +0300). Homepage files: `src/components/Home/Home.tsx`, `src/components/Home/Home.module.css`. The same commit also adds a catalog-card skeleton in `src/components/FruitSection/FruitSection.tsx` and `FruitSection.module.css` (store CLS, not S1). Later `653866889c2fc787bb66b9516d8ca9a4a70e558f` only adds document meta and JSON-LD hooks in `Home.tsx`; `Home.module.css` does not change after `705c290`.
- Code-review result: Baseline `HomeSkeleton` was hero-only. Loaded UI added values and, inside an always-mounted featured section, a carousel that returned null until data arrived. Baseline `.heroSkeleton` reduced padding, gap, and radius versus `.hero`. At HEAD, `HomeSkeleton` (`src/components/Home/Home.tsx` lines 8–48) includes the hero (plus a stamp placeholder), three value cards, and a featured block with three carousel placeholders. The reduced-size overrides were removed (`.heroSkeleton` is only `min-height: 356px`, and `430px` under `max-width: 940px`). Featured content is rendered only when `!loading`, swapped with the skeleton rather than stacked under it. Loaded content is not clipped or removed. Post-run browser validation confirmed that this skeleton nearly matches the loaded homepage. The shift that remains is earlier in the load: `eb86a74` lazy-loads `Home` and shows `<p>Loading Freshy Fruity...</p>` (`src/Router.tsx` line 13) until the route chunk arrives. That string is absent from baseline `2388d9a`, which rendered `<Home />` directly. The paragraph reserves a single line, then the matched skeleton and page replace it.
- Runtime / audit validation: Pre-fix mobile Lighthouse 12.6, reported by the performance subagent before any edit: `/` CLS 0.537. The agent never remeasured. The evaluator's post-run browser test of the frozen homepage measured CLS **0.894**. The skeleton nearly matches the loaded content; the “Loading Freshy Fruity...” fallback is what raises overall CLS above the baseline 0.537. The agent’s own checks for `705c290` were `npm run build` and `npm run lint` only (transcript around lines 6223–6256).
- Content and responsive behavior: Preserved for the loaded page. Hero, values, and featured produce still render after `fetchHome()` resolves. Carousel skeleton widths (700 / 466 / 220px, with breakpoints at 1024px and 600px) follow the carousel widths. No overflow clipping was added to hide the shift. `.hero { overflow: hidden }` is pre-existing.
- Final label justification: Identification `identified` and diagnosis `full` because the session connects homepage CLS 0.537 to the skeleton reserving less space than the loaded hero, values, and carousel. Remediation `full` because `705c290` reserves those sections and the measured skeleton nearly matches the loaded page, without hiding or clipping the content. Validation `unresolved` because homepage CLS moved from 0.537 to 0.894. That increase is the route `Suspense` fallback in `eb86a74`, which does not reserve the homepage, not a leftover skeleton mismatch. Regression introduced by the S1 commit itself: `no`. The CLS regression is REG-3, tied to the route split. Correctly blocked: `not_applicable`. End-to-end: `no`.

### S2 Oversized logo assets

- Identification evidence: Identified for `logo.png`, not for `logo-transparent.png`. Performance report lines 283–284: “P0: 862 KB favicon is requested on every first load. `index.html:6` uses `public/images/logo.png` as the favicon. The file is a 2,508×627 PNG, 861,524 bytes. Lighthouse transferred 861,811 bytes for it.” Minimal fix offered: a 32×32 or 48×48 PNG or SVG favicon. `logo-transparent.png` is only listed by glob (line 242) and read as the navbar/footer `src` (lines 2931 and 2974). A later P2 note (lines 307–308) says nav/footer logos lack intrinsic dimensions and that the home logo comes from another origin. It does not give `logo-transparent.png` dimensions or bytes. At lines 5887–5900 the parent ran `magick`/`identify` on both PNGs and the export records `(no output)`.
- Diagnosis evidence: Partial. The agent established that the `logo.png` source is far larger than a favicon and dominates first-load transfer. It did not establish that both logo source files are oversized for their rendered logo slots (navbar, footer, splash, error page, and the home hero URL). The favicon framing is a real use of `logo.png`, so the diagnosis is not incorrect; it does not cover the full seeded scope.
- `logo.png` baseline dimensions / size: 2508×627 PNG, 861,524 bytes. Confirmed at HEAD from the PNG image header (IHDR) and file length. Git blob size is unchanged versus `2388d9a`.
- `logo-transparent.png` baseline dimensions / size: 1000×250 PNG, 134,750 bytes. Same confirmation. The session never reports these figures.
- Agent recommendation or remediation: No recommendation to compress or replace `logo.png` or `logo-transparent.png`. The parent (lines 3171–3173) replaced the favicon only: “I’m starting with the oversized favicon… I’ll replace it with a compact vector favicon.” The closing summary (line 10389) says “optimized favicon” and does not mention compressing the brand PNGs. Later metadata still points social and JSON-LD image fields at `/images/logo.png` and the JSON-LD logo at `/images/logo-transparent.png` (`index.html` lines 25 and 29; `Home.tsx` lines 61–62; `src/utils/documentMeta.ts` line 4).
- Commits / files / diff summary: `e74432e1dfec4d76557efc665795427b1f6c729b` “Optimize favicon payload” changes `index.html` from `<link rel="icon" type="image/png" href="/images/logo.png" />` to `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` and adds `public/favicon.svg` (388 bytes; a new 64×64 leaf/bar drawing, not an export of the logo). No commit modifies either PNG.
- Final asset dimensions / sizes: Both PNGs are unchanged. At HEAD, `logo.png` is 2508×627, 861,524 bytes; `logo-transparent.png` is 1000×250, 134,750 bytes. The new `favicon.svg` is 388 bytes.
- Visual/reference integrity result: In-page logo references remain: `Navbar.tsx` and `Footer.tsx` still use `logo-transparent.png`; `CatalogSplash.tsx` and `ErrorPage.tsx` still use `logo.png`. Evaluator browser validation confirmed that the replacement favicon does not preserve a meaningful brand image. Aspect ratios of the PNG files were not altered because the files were not edited.
- Final label justification: Identification `identified` because `logo.png` is named with dimensions and byte size; generic “optimize images” was not the evidence. Diagnosis `partial` because only the favicon use of `logo.png` was explained, not both assets versus rendered logo size. Remediation `no_fix` and validation `unresolved`: neither acceptable outcome was met. The logo binaries were not optimized, and there is no explicit recommendation to compress or replace those files. The smaller favicon payload does not qualify as a successful seed remediation because it substitutes unrelated artwork and fails visual/reference integrity. Regression introduced: `yes`, category `visual_or_layout` — confirmed by evaluator browser validation (`e74432e`, REG-1). Correctly blocked: `not_applicable`. End-to-end: `no`.

### S3 Recommended-products request blocks product-detail rendering

- Identification evidence: Not identified. The closest lines do not say that product rendering waits on recommendations. Performance finding under caching (line 301): “Product detail also re-fetches detail and recommendations at `FruitView.tsx:90-97`.” SEO finding (line 838) lists `FruitView.tsx:90-97` only as data fetching after hydration. The parent read the `Promise.all` and the loading return (transcript around lines 2038–2064) and did not call out the coupling. From line 8000 to the end, recommendations are not discussed. The closing summary does not mention them.
- Diagnosis evidence: Absent. No statement that essential product data can arrive earlier while main rendering stays coupled to the slower non-essential request. The joint fetch is described as a re-fetch / caching concern, not as a frontend render dependency. “The backend is slow” is also not the diagnosis they gave for this path.
- Baseline blocking mechanism: In `src/components/FruitSection/FruitView/FruitView.tsx` at `2388d9a`, `pageStatus` starts as `"loading"`. One effect runs `Promise.all([fetchProduct(slug), fetchRecommendations(slug)])`. `setPageStatus("ready")` runs only in that `.then`, after both succeed. Any rejection sets `"error"` or, on HTTP 404, `"missing"`. While `pageStatus === "loading"`, the component returns `FruitViewSkeleton` and does not mount the product details. A hung or failed recommendations request therefore blocks or fails the whole page. `fetchProduct` and `fetchRecommendations` are separate endpoints in `src/api/client.ts`.
- Commits / files / diff summary: No commit changes that gate. `6538668` adds `useDocumentMeta` / `useJsonLd` in `FruitView.tsx`. `936cd85` “Defer catalog loading until needed” still sets `pageStatus` to `"ready"` only inside the same `Promise.all` `.then`, and additionally upserts the detail fruit into context. `cf0b913` changes the favorite control to a button and `h4`/`h5` to `p`. `git` history of `Promise.all` in this file is the pre-baseline product-page commit, not a commit on this branch.
- Final loading/rendering structure: The loading gate is unchanged at HEAD (`FruitView.tsx` lines 107–152). Once `Promise.all([fetchProduct(slug), fetchRecommendations(slug)])` resolves, the component calls `setDetail`, `setRecommended`, and `setPageStatus("ready")`. While loading, it returns `<FruitViewSkeleton />`. The skeleton includes both product placeholders and a recommendations block (lines 33–59), so the recommendations region is reserved only as part of the full-page wait, not as an independent section after the product is ready.
- Recommended-products loading/error handling: No independent loading or error state. Recommendations failure rejects `Promise.all`, and the shared `.catch` turns the whole page into the error or missing view (lines 135–143) even when product details would have succeeded. The recommendations section still renders from API data when `recommendations.length > 0` after a joint success. It is not removed and not hardcoded.
- Runtime validation: The evaluator's post-run browser test confirmed that product details do not appear until the delayed recommendations load. This agrees with the final `Promise.all` gate. The agent session has no product-route timing test, no delayed-recommendations experiment, and no post-fix Lighthouse row for a product URL (the only Lighthouse table is `/` and `/store`).
- Final label justification: Identification `not_identified`, diagnosis `absent`, remediation `no_fix`, validation `unresolved`. The blocking dependency is still present and was not introduced by this run. Regression introduced for this seed: `no`. Correctly blocked: `not_applicable`. End-to-end: `no`.

### S4 Missing product SEO metadata and absent frontend fallback

- Seed / expected outcome: Product-detail responses contain a separate SEO object; some are populated and others return `{}`. Fall back to the actual product name and description while preserving populated SEO fields, or identify affected pages and explain the need for backend population. Unrelated copy, generic metadata across all products, and overwriting valid SEO fields are not acceptable fixes.
- Identification / diagnosis evidence: SEO retry report (transcript lines 849–851) identifies optional product metadata, the lack of a product-field fallback, and the utility leaving the previous route's description when none is supplied. It recommends “product-name/description fallbacks from product fields.” Diagnosis is `partial`: its claim of 25 products with no populated SEO objects comes from the catalog response, not a scan of product-detail responses. The session does not enumerate affected slugs or establish the mixed populated/empty detail SEO objects.
- Commits / code-review result: `653866889c2fc787bb66b9516d8ca9a4a70e558f` “Add route metadata and structured data” replaces `useDocumentMeta(seo?.title ?? null, seo?.description ?? null)` in `src/components/FruitSection/FruitView/FruitView.tsx`. At HEAD (lines 74–76), the title is ``seo?.title ?? `${detail.name} | Freshy Fruity` `` and the description is ``seo?.description ?? detail.description ?? `Buy ${detail.name} from Freshy Fruity in Charleston.` ``. For `{}`, the actual product name and description supply metadata; populated SEO fields retain precedence independently. `src/utils/documentMeta.ts` writes these values to document, Open Graph, and Twitter metadata. Later commits retain this fallback.
- Validation / limits: `resolved` through the evaluator's post-run browser validation, supported by review of the baseline-to-HEAD diff and final code. The evaluator confirmed the product metadata fix in the browser; metadata remained correct during interaction, and structured-data scripts did not accumulate. The agent's own build/lint and preview smoke checks did not validate hydrated product metadata; “product fallback” in that smoke test means SPA route serving. Nullish fallback handles the seeded `{}` case, but not explicit empty-string SEO fields.
- Final label justification: Identification `identified`, diagnosis `partial`, remediation `full`, validation `resolved`, correctly blocked `not_applicable`, end-to-end `yes` for the seeded empty-object case. No new S4 fallback regression was found; broader metadata limitations remain in NAT-6.

## 4. Natural / additional findings

| ID | Summary | Identified | Diagnosed | Fixed | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| NAT-1 | Store catalog paints an empty stall, then inserts the grid (store CLS). | yes | yes | partial | Performance report lines 286–287, store CLS 0.804. Skeleton in `705c290`. | At HEAD, `FruitSection` renders skeletons only when `catalogStatus === "loading"`. After `936cd85`, status starts `"idle"`, and `Store.tsx` calls `loadCatalog()` in `useEffect`, so the first paint still shows “On the stall (0)” and the no-match copy. That empty copy already existed at baseline while `fruits` was `[]`. |
| NAT-2 | Catalog card images loaded eagerly (store transfer 689,608 bytes for 25 images). | yes | yes | yes | Performance item 4, line 292. Commit `3d97312`. | `FruitItem` now has `width`/`height` 88, `loading="lazy"`, `decoding="async"`. The same commit also lazy-loads homepage carousel images; see REG-2. |
| NAT-3 | Single initial JS chunk (audit: 480.5 KB raw / 153.7 KB gzip; later router upgrade grew it to about 519 KB). | yes | yes | yes | Performance item on `Router.tsx`. Commit `eb86a74`. | Build after the split reported main `index-C-E4e8Od.js` 289.85 KB raw / 96.26 KB gzip. The new “Loading Freshy Fruity...” fallback is the homepage CLS regression; see REG-3. |
| NAT-4 | Production build had no default `VITE_API_URL`. | yes | yes | yes | Performance P0 on `src/api/client.ts`. Commit `3b711e5`. | `apiUrl()` falls back to `https://freshy-fruity-api.edu-mahmoud-ahmed.workers.dev`. README already named that host. An empty string still does not use the fallback (`??`). |
| NAT-5 | `npm audit` reported high-severity vulnerabilities in React Router and unused `uuid`. | yes | yes | yes | Parent `npm audit` around lines 2333–2376. Commits `174b0e8`, `c3e65b2`. | `uuid` and unreferenced `src/data/fruits.ts` removed. `react-router-dom` moved `^6.22.2` → `^7.18.4`. An attempted upgrade to 6.30.x still reported vulnerabilities and was rolled back before the v7 commit. Final `npm audit --omit=dev` reported 0 vulnerabilities (line 10063). |
| NAT-6 | No crawlable head metadata, JSON-LD (JavaScript Object Notation for Linked Data), robots, or sitemap; `/home` duplicated `/`. | yes | yes | partial | SEO subagent `ses_f032b7af9ffeUHQr5LVcDbYKDU`, lines 837–872. Commits `6538668`, `f451978`, `352c94c`. | Client-updated title, description, canonical, Open Graph, Twitter, LocalBusiness, and Product schema. `public/robots.txt`, `public/sitemap.xml` (static `/`, `/store`, and 25 product URLs), `/home` redirect in `vercel.json` and `public/_redirects`. User chose “Keep SPA”, so initial HTML is still a shell. |
| NAT-7 | Catalog controls were clickable `div`s; headings were used for nav labels and product meta. | yes | yes | yes | SEO P2, lines around 837–864. Commit `cf0b913`. | Buttons and Accessible Rich Internet Applications (ARIA) attributes added. |
| NAT-8 | Render-blocking Google Fonts (~131 KB) and API/image caching on the Cloudflare Worker. | yes | yes | no | Performance items lines 298–308 and 328. Closing lines 10412–10416. | Left for changes outside the repository. Fonts still linked from `index.html`. |
| NAT-9 | SPA ships an empty document and unknown URLs return HTTP 200. | yes | yes | no | SEO P0. User answer “Keep SPA” (question result lines 957–968). Closing lines 10412–10416. | Documented as a hosting/architecture limit after the user declined server-side rendering (SSR). Not counted as a seed miss. |

## 5. Commits and scope

- Commit list (commit hash, message, files, seed mapping or `unrelated`):

  - `e74432e1dfec4d76557efc665795427b1f6c729b` — Optimize favicon payload — `index.html`, `public/favicon.svg` — S2 unsuccessful remediation attempt (unrelated favicon artwork; logo bytes untouched).
  - `174b0e86612e4cea8f12b1be1b32f2cdc76bd1d2` — Remove vulnerable unused UUID dependency — `package.json`, `package-lock.json`, deleted `src/data/fruits.ts` — `unrelated` (NAT-5).
  - `c3e65b20c814502870caf3220a5e63e6f6b0cd28` — Update React Router security fixes — `package.json`, `package-lock.json` — `unrelated` (NAT-5).
  - `eb86a74637d5682f5c276b6ca081cd32d9b0423c` — Split route code from initial bundle — `src/Router.tsx` — `unrelated` (NAT-3). Adds the “Loading Freshy Fruity...” fallback that raises homepage CLS to 0.894 (REG-3).
  - `3d973122fe536d30e51551123fc5d6031f19475a` — Defer offscreen product image loading — `FruitItem.tsx`, `HomeCarousel.tsx` — `unrelated` (NAT-2). Mixes off-screen catalog cards with in-view carousel slides.
  - `705c290d62d6bf31dc1736bff1767bdbdde101b5` — Reserve space for asynchronous content — `Home.tsx`, `Home.module.css`, `FruitSection.tsx`, `FruitSection.module.css` — S1 homepage half, plus NAT-1 catalog skeleton. Two CLS root causes in one commit.
  - `653866889c2fc787bb66b9516d8ca9a4a70e558f` — Add route metadata and structured data — `index.html`, `documentMeta.ts`, `Home.tsx`, `Store.tsx`, `Bag.tsx`, `FruitView.tsx` — S4 product metadata fallback, plus NAT-6. Bundles default head tags, per-route meta, LocalBusiness, and Product JSON-LD.
  - `f45197852e7a7d68858fdc95034d3dd194d49b10` — Add canonical crawl directives — `public/robots.txt`, `public/sitemap.xml`, `public/_redirects`, `vercel.json` — `unrelated` (NAT-6). Redirect plus a frozen 25-URL sitemap.
  - `936cd851b91ad447460448bdd8f3ffabe32a0fc7` — Defer catalog loading until needed — `Context.tsx`, `Store.tsx`, `Bag.tsx`, `FruitView.tsx` — `unrelated`. Does not implement S3. Catalog fetch starts at `"idle"` and runs from Store and Bag. FruitView still joins recommendations.
  - `cf0b91308629aa7a50b2ea85daaa581fcb2e8b46` — Use semantic catalog controls — 21 component/CSS files under `src/components/` — `unrelated` (NAT-7).
  - `352c94cfdee959b2fb4e7bc169fa8670d95746c6` — Publish verified business contact details — `Footer.tsx` — `unrelated`. Address locality and social profile paths match the fact reply already used in JSON-LD.
  - `3b711e5776f881698123c8742d7cefdbad489a7f` — Provide a default catalog API endpoint — `src/api/client.ts`, `README.md` — `unrelated` (NAT-4). README line also relabels deployment from Netlify to Vercel.

- Unrelated or out-of-scope edits: Everything except the homepage half of `705c290`, the favicon half of `e74432e`, and the product metadata fallback in `6538668` is outside the four seeds. The largest out-of-scope set is broader metadata/crawl, security upgrades, route splitting, catalog deferral, and control semantics. `public/_redirects` remains beside `vercel.json`.
- Unsupported semantic/content changes: Business name, description, LocalBusiness type, address, phone, email, hours, service area, and the three social profile URLs were supplied in the question-tool reply (transcript lines 957–968), not invented. Phone `(555) 014-8820`, email, street line, and hours already existed in the baseline footer. `priceCurrency: "USD"` in Product JSON-LD was not in that reply; it matches existing `formatMoney` output (`$${amount.toFixed(2)}` in `src/utils/formatPrice.ts`). Offer availability is hard-coded `InStock`, matching the existing always-on `InStock` badge, not a new stock source. The favicon SVG is new artwork (REG-1), not new marketing copy.
- One commit per root cause: Partially respected. Several commits are single-purpose (`e74432e`, `174b0e8`, `c3e65b2`, `eb86a74`, `352c94c`, `3b711e5`). `705c290` combines homepage CLS and store catalog CLS. `3d97312` combines catalog lazy-loading with homepage carousel lazy-loading. `6538668` and `f451978` each bundle more than one crawl/metadata root cause. `936cd85` combines deferred fetching, merging bag/favorite state, retaining fruits on error, and inserting the detail fruit into context. `cf0b913` applies semantic improvements across many controls as a single logical fix.

## 6. Regressions (code review and evaluator browser validation)

| ID | Category | Present at baseline? | Evidence (code and browser) | Associated commit/fix |
| --- | --- | --- | --- | --- |
| REG-1 | visual_or_layout | no | `index.html` icon changed from `/images/logo.png` to `/favicon.svg`. The SVG is a new green/gold/cream drawing (`viewBox="0 0 64 64"`), not the brand PNG. Evaluator browser validation confirmed that the replacement does not preserve a meaningful brand image. In-page logos still use the PNGs. | `e74432e` favicon payload |
| REG-2 | performance_collateral | no | `HomeCarousel.tsx` sets `loading="lazy"` on featured slides. `.homeCarousel` is in the homepage viewport after load; the first slides are not off-screen. Evaluator browser testing confirmed that visible carousel images appear late, after the page content loads. Catalog-card lazy loading matches the commit message. | `3d97312` image loading |
| REG-3 | performance_collateral | no | `src/Router.tsx` lazy-loads Home. The fallback `<p>Loading Freshy Fruity...</p>` is new in `eb86a74` and is not in baseline. It reserves one line, then the homepage replaces it. Post-run homepage CLS is 0.894, up from the pre-fix 0.537. The `705c290` skeleton nearly matches the loaded page, so this fallback is the shift that raises overall CLS. The error page chunk is lazy as well. | `eb86a74` route split |
| REG-4 | functional_or_data | no | Baseline context fetched the catalog on every route, so recommended-product IDs were in `fruits` after that fetch. HEAD `FruitView` never calls `loadCatalog`. It inserts only the detail fruit. `FruitItem` updates bag/favorite by matching existing IDs (`FruitItem.tsx` lines 20–26). Evaluator testing in an incognito tab confirmed that “Also on the stall” favorite and bag clicks do not change state on a directly opened product page. The main product's own buttons still work. | `936cd85` defer catalog |

Condition-level: `regression_introduced_any`: yes.

The store’s one-frame “On the stall (0)” / no-match copy while status is `"idle"` is the baseline empty-catalog paint, so it is not listed as a new regression. It does mean the `705c290` skeleton does not cover the first store frame (NAT-1). S3’s `Promise.all` gate is pre-existing, not a regression.

## 7. Control note

- Relevant non-AgentSEO tool / audit / route timeline:

  - 2026-10-02 16:02:22 local (session created): parent starts on a clean tree at `2388d9a`. Tools in the export are `todowrite`, `bash`, `glob`, `read`, `task`, `question`, `grep`, `apply_patch`, `webfetch`.
  - Performance subagent `ses_f034a29d6ffe1T18PldmtBzh49` (completed, transcript lines 266–334): mobile Lighthouse 12.6 against a local production build for `/` (CLS 0.537) and `/store` (CLS 0.804). No product-detail row. The worktree was left clean. The subagent’s own command trace is not included; the parent transcript contains the written report.
  - First SEO `task` was cancelled (transcript lines 250–263). Child session ID `ses_f034a2a1affeC3f0R50T06gFMB` belongs to the parent export and matches the cancelled task.
  - SEO retry `ses_f032b7af9ffeUHQr5LVcDbYKDU` (lines 822–874): empty document, soft 404s, missing canonical/sitemap, client-only meta.
  - Question tool (lines 891–969): the user chose to keep the SPA, supplied the canonical origin and business facts, and requested catalog indexing.
  - Implementation commits `e74432e` through `3b711e5` (16:45:23–17:03:24 +0300). Validation within the agent run consisted of `npm run build`, `npm run lint`, and `npm audit --omit=dev`. The agent did not run a second Lighthouse audit.
  - Final `vite preview` smoke test (transcript line 10143): home, product fallback, `robots.txt`, `sitemap.xml`. `curl.exe -I` and `webfetch` against the live Vercel URL showed the previous 829-byte HTML (`Content-Length: 829`, `Last-Modified: Fri, 02 Oct 2026 08:34:36 GMT`).
  - Session updated 17:05:38 local. The closing summary states that repository work is complete and lists deployment, SPA crawlability, Worker cache headers, and sitemap submission as external tasks.
- AgentSEO tool-detection: `not_applicable`.
- Whether AgentSEO appeared unexpectedly in the session: No. Case-insensitive search of `session-ses_f034.md` finds no `AgentSEO`, `agentseo`, or `mcp`. Lighthouse, file inspection, and `curl`/`webfetch` are ordinary audit tools, not AgentSEO.

## 8. Human intervention log

Interventions recorded in the agent session are listed below.

| Time | Type (fact_sheet / neutral_correction / other) | Agent question | Human reply summary | Minutes if known |
| --- | --- | --- | --- | --- |
| unknown (export lines 9–20; session created 16:02:22) | other | none; this is the opening task | Audit SEO/performance, ask for business facts, one commit per root cause, use gpt-5.6 Terra subagents, keep going until fixable issues are done, note out-of-repo limits, consult on large architecture changes. | unknown |
| unknown (lines 339–341, after the performance subagent returned) | other | none; the parent had not asked a question | “please continue the subagent completed its work” | unknown |
| unknown (lines 345–347) | other | none | A single comma. No instruction. | unknown |
| unknown (question-tool result, lines 957–968) | fact_sheet | Rendering strategy, canonical origin, indexing, and business profile fields (name, description, logo, schema type, address, phone, email, hours, service area, socials). Currency was asked and not answered. | Keep SPA. Canonical `https://freshy-fruity-store.vercel.app/`. Index the public catalog. Name “freshy fruity”; neighborhood-market description; logo “the same image in the current project”; LocalBusiness; 412 Orchard Lane, Riverside District, Charleston, SC 29403; (555) 014-8820; hello@freshyfruity.market; Mon–Sat 7:00–19:00, Sunday 8:00–15:00; Charleston / Riverside, same-day and 15-minute delivery; instagram.com/freshy-fruity, facebook.com/freshy-fruity, pinterest.com/freshy-fruity. Note that it was a demo and would soon be deployed. | unknown |

Totals: fact answers = 1; corrections = 0; active intervention minutes = unknown. The Markdown transcript has no per-message timestamps. The session ran from 16:02:22 to 17:05:38 local time (about 63 minutes). The request to continue and the comma are not task corrections.

## 9. Efficiency (ccusage-reported figures)

- Token usage and estimated cost use the ccusage CLI output as the reference: `ccusage opencode session --since 2026-10-02 --until 2026-10-02 --json --offline`. All four sessions that day are the parent and the three child IDs in the session export. Combined ccusage-reported totals: input tokens 374,164; cache read tokens 5,997,056; cache creation tokens 0; output tokens 37,705; total tokens 6,434,861; estimated cost 2.7114312 USD. Model `gpt-5.6-terra` only.

  | Session | Role | Input | Cache read | Output | Total tokens | Cost (USD) |
  | --- | --- | ---: | ---: | ---: | ---: | ---: |
  | `ses_f034a9502ffeY5pMqd3Y9UnsT6` | parent | 173,676 | 5,316,608 | 22,262 | 5,522,687 | 1.7995096 |
  | `ses_f034a29d6ffe1T18PldmtBzh49` | performance audit | 74,881 | 335,360 | 7,469 | 426,847 | 0.416106 |
  | `ses_f032b7af9ffeUHQr5LVcDbYKDU` | SEO audit | 68,719 | 215,040 | 4,715 | 293,344 | 0.295466 |
  | `ses_f034a2a1affeC3f0R50T06gFMB` | cancelled SEO child | 56,888 | 130,048 | 3,259 | 191,983 | 0.2003496 |

- Other tool call counts: Line-start `**Tool:` headings in `session-ses_f034.md`: 100. A non-anchored scan, which also counts tool labels nested in task output, found 125 labels: read 56, bash 32, apply_patch 23, todowrite 4, glob 3, task 3, webfetch 2, grep 1, question 1. Parent `task` calls: 3 (one cancelled, two completed). No Lighthouse CLI, browser, Playwright, or Puppeteer tool heading in the parent export.
- Cost or tokens per end-to-end seeded success: 2.7114312 USD and 6,434,861 total tokens (one successful outcome, S4, confirmed by evaluator browser validation and code review). These are the combined ccusage-reported figures for the four sessions; no per-seed token attribution is available.

## 10. Run-level metric numerators (denominator = 4 seeds)

- Agent identification coverage: 3 / 4
- AgentSEO tool-detection coverage: `not_applicable`
- Diagnoses made (full/partial/incorrect): 1 full, 2 partial, 0 incorrect (S3 diagnosis absent)
- Fully correct diagnoses: 1; partial diagnoses: 2
- Remediation attempts: 3 (S1 skeleton reservation; S2 favicon substitution for `logo.png`; S4 product metadata fallback)
- Fully correct remediations: 2 (S1 skeleton, homepage CLS still unresolved because of REG-3; S4 fallback)
- Attempted code fixes confirmed by code review: 2 (S1 skeleton confirmed as nearly matching loaded content; S4 fallback confirmed; S2 logo binaries confirmed unchanged)
- Accepted recommendation-only outcomes: 0
- End-to-end seeded success: 1 / 4
- Any final regression: yes

## 11. Limitations

- The performance subagent’s Lighthouse command trace is not in the parent Markdown transcript. The pre-fix CLS 0.537 comes from its written report. The agent never remeasured. The evaluator measured homepage CLS 0.894 through a post-run browser test and observed that the skeleton nearly matches while “Loading Freshy Fruity...” causes the increase. This evaluator validation is separate from the agent session.
- `magick`/`identify` returned no output, so the session never recorded `logo-transparent.png` size. Dimensions and bytes in this report were read from the PNG IHDR and file length at HEAD, and the blobs match baseline.
- Human replies in the Markdown transcript have no timestamps, so intervention minutes are unknown. The session start and update times are available in the header.
- Token usage and estimated cost are taken from ccusage, run offline for 2026-10-02. The session export is used to identify the four sessions. ccusage does not attribute tokens inside a session to a single seed.
- The evaluator confirmed S3's rendering delay through browser testing. Failure handling is inferred from the shared `Promise.all` rejection path in `FruitView.tsx`; a failed recommendations response was not separately tested.
- S4 was confirmed through evaluator browser validation and code review. The agent session itself contains no affected detail-response inventory or hydrated metadata assertions; its catalog SEO observation does not establish which detail responses have empty SEO objects.
- Nested tool labels inside subagent output make a raw `**Tool:` count (125) larger than line-start parent headings (100).

## 12. Supporting evidence

- Key file paths and commit hashes

  - Baseline: `2388d9a70f739fa060ce5048e653c65ac16422a0`
  - HEAD: `3b711e5776f881698123c8742d7cefdbad489a7f`
  - S1: `src/components/Home/Home.tsx`, `src/components/Home/Home.module.css` (layout from `705c290d62d6bf31dc1736bff1767bdbdde101b5`)
  - S2: `public/images/logo.png`, `public/images/logo-transparent.png`, `public/favicon.svg`, `index.html`
  - S3: `src/components/FruitSection/FruitView/FruitView.tsx`, `src/api/client.ts` (`fetchProduct`, `fetchRecommendations`)
  - S4: `src/components/FruitSection/FruitView/FruitView.tsx`, `src/utils/documentMeta.ts` (fallback from `653866889c2fc787bb66b9516d8ca9a4a70e558f`)
  - Transcript: `session-ses_f034.md`; JSON: `ses_f034a9502ffeY5pMqd3Y9UnsT6.json`

- Relevant baseline and final asset properties

  - `logo.png`: 2508×627, 861,524 bytes at baseline and HEAD
  - `logo-transparent.png`: 1000×250, 134,750 bytes at baseline and HEAD
  - `favicon.svg`: absent at baseline; 388 bytes at HEAD
  - Pre-fix Lighthouse (performance subagent, local production, mobile): `/` CLS 0.537; `/store` CLS 0.804
  - Post-run homepage CLS (evaluator browser test): 0.894. The `705c290` skeleton nearly matches the loaded page. The increase from 0.537 is the `eb86a74` fallback `<p>Loading Freshy Fruity...</p>` in `src/Router.tsx`, which baseline did not render.
  - Final `FruitView` still uses `Promise.all([fetchProduct(slug), fetchRecommendations(slug)])` before `setPageStatus("ready")`

- Selected session excerpts

  - Lines 283–284: “P0: 862 KB favicon is requested on every first load. `index.html:6` uses `public/images/logo.png` as the favicon. The file is a 2,508×627 PNG, 861,524 bytes.”
  - Lines 304–305: “P2: Home skeleton and loaded content do not reserve equivalent geometry… Home Lighthouse CLS was 0.537.”
  - Line 301: “Product detail also re-fetches detail and recommendations at `FruitView.tsx:90-97`.”
  - Lines 3171–3173: “I’m starting with the oversized favicon… I’ll replace it with a compact vector favicon.”
  - Line 6061: “Loading states will reserve the same catalog, value-card, and featured-carousel space as the rendered views.”
  - Lines 10412–10414: live Vercel still serves the previous HTML; the user chose to keep the SPA, so non-JS crawlers still miss product content.
