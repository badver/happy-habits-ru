# Tasks: Лендинг для частного психолога/психотерапевта

**Input**: Design documents from `/Users/wish/projects/private/psych-web/specs/001-/`
**Prerequisites**: plan.md ✅, spec.md ✅
**Branch**: `001-`
**Tech Stack**: Hugo static site, Netlify hosting, Playwright MCP testing

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → ✅ Found: Hugo static site, Mobile-First, Russian only
   → ✅ Extract: 10 content blocks, Telegram/WhatsApp deeplinks, analytics
2. Load optional design documents:
   → data-model.md: Not created (static site, no backend)
   → contracts/: Created (analytics, deeplinks, content-blocks)
   → research.md: Documented in plan.md Phase 0
3. Generate tasks by category:
   → ✅ Setup: Hugo init, Netlify, asset pipeline (3 tasks)
   → ✅ Tests: Playwright MCP tests (8 tasks, TDD approach)
   → ✅ Core: HTML partials, CSS, JS (14 tasks)
   → ✅ Content: Russian text, testimonials, images (4 tasks)
   → ✅ Integration: Analytics, SEO, accessibility (5 tasks)
   → ✅ Polish: Test execution, Lighthouse audit (3 tasks)
4. Apply task rules:
   → Different files = marked [P] for parallel
   → Tests before implementation (TDD mandatory)
5. Number tasks sequentially (T001-T037)
6. Generate dependency graph below
7. Create parallel execution examples
8. Validate task completeness
9. Return: SUCCESS (37 tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions
- TDD approach: Tests MUST FAIL before implementation

## Path Conventions
Hugo static site structure:
- `config.toml` — Hugo configuration
- `content/_index.md` — Landing page Russian content
- `layouts/index.html` — Main template
- `layouts/partials/*.html` — Content block components
- `assets/css/main.css` — Mobile-First CSS
- `assets/js/*.js` — Analytics, deeplinks, A/B tests
- `static/` — robots.txt, images
- `tests/playwright/*.spec.js` — Playwright MCP tests

---

## Phase 3.1: Setup

- [x] **T001** Initialize Hugo project with config.toml (lang=ru, baseURL, title, analytics IDs)
  - Path: `config.toml`
  - Hugo version: v0.120+
  - Configure: languageCode=ru-RU, disableKinds=[RSS, sitemap auto-generated]
  - Add Yandex.Metrika ID, Google Analytics 4 ID as params
  - Dependencies: None

- [x] **T002** [P] Setup Netlify deployment configuration
  - Path: `netlify.toml`
  - Hugo build command: `hugo --gc --minify`
  - Publish directory: `public`
  - Node version: 18 (for Playwright tests in CI)
  - Preview deployments: enabled for all branches
  - Dependencies: None (parallel with T001)

- [x] **T003** [P] Configure Hugo asset pipeline
  - Path: `config.toml` (asset processing section)
  - SCSS compilation with autoprefixer
  - JavaScript bundling and minification
  - Image processing: resize, WebP conversion, lazy-load
  - Critical CSS inlining strategy
  - Dependencies: T001 (needs base config.toml)

---

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

Use Playwright MCP tools: `mcp__playwright__browser_navigate`, `mcp__playwright__browser_click`, `mcp__playwright__browser_snapshot`, etc.

- [x] **T004** [P] Contract test: Telegram deeplink in tests/playwright/deeplink-telegram.spec.js
  - Verify: Button `[data-cta="telegram"]` opens `tg://resolve?domain=happy_habits_ru`
  - Verify: Pre-filled text: «Здравствуйте! Хочу записаться на бесплатную диагностику (30 минут)»
  - Verify: Fallback to `https://t.me/happy_habits_ru` if app not installed
  - Use: `mcp__playwright__browser_click` on Telegram button
  - **MUST FAIL** initially (button doesn't exist yet)
  - Dependencies: None (parallel task)

- [x] **T005** [P] Contract test: WhatsApp deeplink in tests/playwright/deeplink-whatsapp.spec.js
  - Verify: Button `[data-cta="whatsapp"]` opens `https://wa.me/905071754633`
  - Verify: Pre-filled text matches Telegram (same message)
  - Verify: Fallback to `https://web.whatsapp.com/` if app not installed
  - Use: `mcp__playwright__browser_click` on WhatsApp button
  - **MUST FAIL** initially (button doesn't exist yet)
  - Dependencies: None (parallel task)

- [x] **T006** [P] Contract test: Analytics events in tests/playwright/analytics.spec.js
  - Verify: Click on Telegram button fires `gtag('event', 'cta_messenger_click', { messenger_type: 'telegram', button_position: 'hero', ... })`
  - Verify: Click on WhatsApp button fires Yandex.Metrika event `ym(XXXXX, 'reachGoal', 'cta_messenger_click')`
  - Verify: Scroll to 75% fires `scroll_depth` event
  - Verify: 60 seconds on page fires `time_on_page` event
  - Use: Console log monitoring to catch analytics calls
  - **MUST FAIL** initially (analytics not integrated)
  - Dependencies: None (parallel task)

- [x] **T007** [P] Integration test: Hero section rendering in tests/playwright/hero.spec.js
  - Verify: H1 contains «Освободитесь от тревоги за 8-12 сессий»
  - Verify: Subtitle contains «8 из 10 клиентов»
  - Verify: 2 CTA buttons visible (Telegram, WhatsApp)
  - Verify: 3 badges visible: «Конфиденциально», «Только онлайн», «Ответ в течение 2 часов»
  - Verify: Psychologist photo loads
  - Use: `mcp__playwright__browser_snapshot` to check Hero block
  - **MUST FAIL** initially (Hero partial doesn't exist)
  - Dependencies: None (parallel task)

- [x] **T008** [P] Integration test: All content blocks present in tests/playwright/content-blocks.spec.js
  - Verify: 10 blocks with `data-block` attributes: hero, symptoms, benefits, about, process, testimonials, pricing, faq, cta-final, footer
  - Verify: Each block is visible and has content
  - Use: `mcp__playwright__browser_snapshot` and locator checks
  - **MUST FAIL** initially (blocks don't exist)
  - Dependencies: None (parallel task)

- [x] **T009** [P] Integration test: Mobile rendering (360px) in tests/playwright/mobile.spec.js
  - Set viewport: 360x640px
  - Verify: All blocks render without horizontal scroll
  - Verify: CTA buttons ≥44x44px (touch target size)
  - Verify: Font size ≥16px on mobile
  - Verify: Images lazy-load with `loading="lazy"` attribute
  - Use: `mcp__playwright__browser_resize` before navigation
  - **MUST FAIL** initially (no responsive design)
  - Dependencies: None (parallel task)

- [x] **T010** [P] Content test: Russian typography in tests/playwright/typography.spec.js
  - Verify: Quotes are « » not " "
  - Verify: Dashes are — (em dash) not - (hyphen)
  - Verify: Non-breaking spaces before units: `5000 ₽` (nbsp between number and currency)
  - Verify: HTML has `lang="ru"` attribute
  - Use: Page content regex matching
  - **MUST FAIL** initially (content not written with correct typography)
  - Dependencies: None (parallel task)

- [x] **T011** [P] Performance test: Lighthouse ≥90 in tests/playwright/performance.spec.js
  - Measure page load time (target: LCP ≤2.5s)
  - Verify: No console errors on page load
  - Verify: Images use lazy-loading
  - Verify: Critical CSS is inlined
  - Use: `mcp__playwright__browser_navigate` and timing measurement
  - **MUST FAIL** initially (not optimized)
  - Dependencies: None (parallel task)

---

## Phase 3.3: Core Implementation (ONLY after tests T004-T011 are failing)

**Layout & Templates:**

- [x] **T012** Create main landing page template in layouts/index.html
  - Path: `layouts/index.html`
  - Structure: HTML5 boilerplate, `lang="ru"`, meta tags
  - Include: All 10 partial blocks (hero, symptoms, etc.)
  - Include: Analytics scripts (Yandex.Metrika, GA4)
  - Include: A/B testing logic
  - Dependencies: T001 (Hugo init)

**Content Block Partials (all parallel - different files):**

- [x] **T013** [P] Hero section partial in layouts/partials/hero.html
  - Path: `layouts/partials/hero.html`
  - Elements: H1 title, subtitle, 2 CTA buttons (`data-cta="telegram"`, `data-cta="whatsapp"`), 3 badges, psychologist photo
  - Telegram button: `tg://resolve?domain=happy_habits_ru&text=<encoded>`
  - WhatsApp button: `https://wa.me/905071754633?text=<encoded>`
  - Pre-fill text: «Здравствуйте! Хочу записаться на бесплатную диагностику (30 минут)»
  - Data attribute: `data-block="hero"`
  - Dependencies: T012 (index.html exists)

- [x] **T014** [P] Symptoms block partial in layouts/partials/symptoms.html
  - Path: `layouts/partials/symptoms.html`
  - Title: «Узнаете себя?»
  - 8-10 symptom checkpoints (list)
  - CTA below: «Если отметили 3+ пунктов — запишитесь на диагностику» + TG/WA buttons
  - Data attribute: `data-block="symptoms"`
  - Dependencies: T012

- [x] **T015** [P] Benefits block partial in layouts/partials/benefits.html
  - Path: `layouts/partials/benefits.html`
  - Title: «Как помогает терапия»
  - Subtitle: «Что изменится через 8-12 встреч»
  - 4 result items with numbers: снижение тревоги, панические атаки, сон, управление стрессом
  - Markers: КПТ method, social proof «8 из 10 клиентов»
  - Data attribute: `data-block="benefits"`
  - Dependencies: T012

- [x] **T016** [P] About block partial in layouts/partials/about.html
  - Path: `layouts/partials/about.html`
  - Title: «Почему именно я»
  - Psychologist photo, biography (up to 1200 chars)
  - Education/certification badges
  - Principles: конфиденциальность, краткосрочность, прозрачные цели
  - Data attribute: `data-block="about"`
  - Dependencies: T012

- [x] **T017** [P] Process block partial in layouts/partials/process.html
  - Path: `layouts/partials/process.html`
  - Title: «Как проходит работа»
  - 4 steps: (1) Free diagnostic 30min, (2) Therapy plan, (3) 8-15 sessions, (4) Result consolidation
  - CTA after each step (Telegram/WhatsApp buttons)
  - Data attribute: `data-block="process"`
  - Dependencies: T012

- [x] **T018** [P] Testimonials block partial in layouts/partials/testimonials.html
  - Path: `layouts/partials/testimonials.html`
  - Title: «Отзывы и кейсы»
  - 6-8 text testimonials (400-700 chars each) — iterate from `data/testimonials.yaml`
  - 2-3 case studies with diagrams (anxiety level 0-10 charts) — from `data/case-studies.yaml`
  - Badge: «Все истории с согласия клиентов»
  - Data attribute: `data-block="testimonials"`
  - Dependencies: T012, T029, T030 (data files)

- [x] **T019** [P] Pricing block partial in layouts/partials/pricing.html
  - Path: `layouts/partials/pricing.html`
  - Title: «Стоимость и форматы»
  - Price 1: Single session 5000₽ (60 min, online)
  - Price 2: Package 10 sessions 45000₽ (save 5000₽, one session free)
  - Terms: Cancel ≥24h before, payment methods
  - Data attribute: `data-block="pricing"`
  - Dependencies: T012

- [x] **T020** [P] FAQ block partial in layouts/partials/faq.html
  - Path: `layouts/partials/faq.html`
  - Title: «FAQ — отвечаем на ваши сомнения»
  - 5 questions: (1) А если не поможет?, (2) Сколько займет времени?, (3) Конфиденциально ли?, (4) Чем КПТ отличается?, (5) Дорого ли?
  - Detailed answers for each (from spec FR-014)
  - Data attribute: `data-block="faq"`
  - Dependencies: T012

- [x] **T021** [P] Final CTA block partial in layouts/partials/cta-final.html
  - Path: `layouts/partials/cta-final.html`
  - Title: «Первый шаг — бесплатная диагностика 30 минут»
  - Large Telegram, WhatsApp buttons
  - SLA: «Отвечаю в течение 2 часов в рабочее время»
  - Data attribute: `data-block="cta-final"`
  - Dependencies: T012

- [x] **T022** [P] Footer partial in layouts/partials/footer.html
  - Path: `layouts/partials/footer.html`
  - Contacts: e-mail, Telegram, WhatsApp links
  - Copyright notice
  - Medical disclaimer: «Информация не заменяет консультацию врача, при острых состояниях обратитесь за медицинской помощью»
  - Data attribute: `data-block="footer"`
  - Dependencies: T012

**CSS & JavaScript:**

- [x] **T023** Mobile-First CSS in assets/css/main.css
  - Path: `assets/css/main.css`
  - Mobile-First approach: Base styles for 360px, media queries for tablet/desktop
  - Breakpoints: 360px (mobile), 768px (tablet), 1920px (desktop)
  - BEM naming convention
  - CTA buttons: ≥44x44px touch targets, high contrast
  - Russian typography: correct quotes, dashes, nbsp
  - Lazy-load images: opacity transition on load
  - Critical CSS: above-the-fold styles for Hero (will be inlined by Hugo)
  - Dependencies: T013-T022 (HTML partials exist)

- [x] **T024** Analytics integration in assets/js/analytics.js
  - Path: `assets/js/analytics.js`
  - Yandex.Metrika: Init with counter ID from config.toml params
  - Google Analytics 4: gtag() init with GA4 ID
  - Custom events: `cta_messenger_click(messenger_type, button_position, utm_params)`
  - Scroll tracking: Fire `scroll_depth` at 25%, 50%, 75%, 100%
  - Time tracking: Fire `time_on_page` at 30s, 60s, 120s
  - UTM parameters: Extract from URL query string, attach to all events
  - Dependencies: T012 (index.html loads this script)

- [x] **T025** Deeplink logic in assets/js/deeplinks.js
  - Path: `assets/js/deeplinks.js`
  - Function: `buildTelegramDeeplink()` → `tg://resolve?domain=happy_habits_ru&text=<encoded_message>`
  - Function: `buildWhatsAppDeeplink()` → `https://wa.me/905071754633?text=<encoded_message>`
  - Encode message: «Здравствуйте! Хочу записаться на бесплатную диагностику (30 минут)»
  - Fallback detection: If deeplink fails (timeout 2s), redirect to web version
  - Attach click handlers to all `[data-cta="telegram"]` and `[data-cta="whatsapp"]` buttons
  - Fire analytics event on each click (call analytics.js function)
  - Dependencies: T012, T024 (analytics.js exists)

- [x] **T026** A/B testing logic in assets/js/ab-test.js
  - Path: `assets/js/ab-test.js`
  - Test A: Hero headline variants:
    - Baseline: «Освободитесь от тревоги за 8-12 сессий по доказательному методу»
    - Variant B: [TBD during content creation in T027 — suggest alternative emphasizing "Верните контроль" or "Начните жить без страха"]
  - Test B: CTA button text variants («Записаться на диагностику» vs «Написать в Telegram» vs «Получить консультацию»)
  - Random assignment: 50/50 split, store variant in localStorage
  - Apply variant on page load (before Hero visible)
  - Send variant info to analytics: `ab_test_variant(test_name, variant_id)`
  - Optional: Integration with Google Optimize (if using)
  - Dependencies: T012, T024 (analytics.js)

---

## Phase 3.4: Content & Data

- [x] **T027** Landing page content in content/_index.md
  - Path: `content/_index.md`
  - Front matter: title, description, keywords (Russian SEO)
  - All Russian text for 10 blocks
  - **Russian typography**: Use correct quotes «», dashes —, nbsp before units
  - Content: Titles, subtitles, body text, CTA labels, FAQ questions/answers
  - Length: Approx 2500-3500 words total
  - Dependencies: T013-T022 (partials reference this content)

- [x] **T028** [P] Add psychologist photos to assets/images/
  - Path: `assets/images/psychologist-*.jpg`
  - Photos: 3-5 images (portrait, working scene, online session)
  - Format: JPEG high quality, will be converted to WebP by Hugo pipeline
  - Alt texts: Descriptive Russian text for accessibility
  - Optimize: Resize to max 1920px width before adding to repo
  - Dependencies: None (parallel task)

- [x] **T029** [P] Create testimonials data in data/testimonials.yaml
  - Path: `data/testimonials.yaml`
  - Structure: Array of 6-8 testimonials
  - Fields per testimonial: author_name (can be initials), text (400-700 chars), before_state, process, result, timeline
  - Format: «До/Запрос → Процесс → Результат/Сроки»
  - Russian typography correct
  - Note: «Все истории с согласия клиентов»
  - Dependencies: None (parallel task)

- [x] **T030** [P] Create case studies data in data/case-studies.yaml
  - Path: `data/case-studies.yaml`
  - Structure: Array of 2-3 case studies
  - Fields: description, anxiety_data (array of {session: number, anxiety_level: 0-10}), sessions_count, outcome
  - Diagram data: Will be rendered as simple line chart (Chart.js or CSS-based)
  - Anonymous: No identifying information
  - Dependencies: None (parallel task)

---

## Phase 3.5: Integration & SEO

- [x] **T031** Verify analytics events firing correctly
  - Path: N/A (testing task)
  - Test: Open site in browser, open DevTools Console
  - Click Telegram button → verify `gtag` and `ym` calls in console
  - Scroll to 75% → verify scroll_depth event
  - Wait 60s → verify time_on_page event
  - Check: UTM parameters are included in events (add `?utm_source=test` to URL)
  - Fix any issues in assets/js/analytics.js
  - Dependencies: T024, T025 (analytics and deeplinks implemented)

- [x] **T032** Add SEO meta tags, OG tags, Schema.org in layouts/index.html
  - Path: `layouts/index.html` (head section)
  - Title: «Психолог онлайн: Лечение тревожности КПТ | <Name>»
  - Description: «Избавьтесь от тревоги за 8-12 сессий. Когнитивно-поведенческая терапия (КПТ) с доказанной эффективностью 85%. Онлайн консультации, конфиденциально.»
  - Keywords: «психолог онлайн тревожность», «психотерапия тревоги онлайн», «панические атаки психолог онлайн», «КПТ тревога онлайн»
  - OG tags: og:title, og:description, og:image (psychologist photo), og:url
  - Schema.org: Person (психолог), ProfessionalService (контакты, часы приема), FAQPage (from FAQ block)
  - Dependencies: T012 (index.html exists)

- [x] **T033** Configure robots.txt and verify sitemap.xml
  - Path: `static/robots.txt`
  - Allow all crawlers: `User-agent: * / Allow: /`
  - Sitemap: `Sitemap: https://<domain>/sitemap.xml` (Hugo auto-generates sitemap.xml)
  - Verify: Hugo config has `sitemap` output format enabled
  - Dependencies: T001 (Hugo config)

- [x] **T034** Accessibility audit: WCAG contrast, font sizes, alt-texts
  - Path: N/A (audit task)
  - Check: All text has contrast ratio ≥4.5:1 (WCAG AA)
  - Check: Font sizes ≥16px on mobile (in main.css)
  - Check: All images have descriptive alt attributes (Russian)
  - Check: CTA buttons have sufficient touch target size (≥44x44px)
  - Check: Keyboard navigation works for all CTA buttons
  - Fix issues in layouts/, assets/css/main.css, content/
  - Dependencies: T023 (CSS), T027 (content), T028 (images)

- [x] **T035** Performance optimization: images, CSS, JS
  - Path: Hugo config, assets/
  - Images: Convert all to WebP (Hugo image processing), add lazy loading
  - CSS: Minify, extract critical CSS for Hero (inline in <head>)
  - JS: Minify and bundle (Hugo assets pipeline)
  - Fonts: Use font-display: swap, preload critical fonts
  - Verify: Hugo build output is optimized (`hugo --gc --minify`)
  - Dependencies: T003 (asset pipeline configured), T023-T026 (CSS/JS)

---

## Phase 3.6: Verification & Testing

- [x] **T036** Run all Playwright MCP tests (T004-T011)
  - Path: `tests/playwright/*.spec.js`
  - Command: Use Playwright MCP tools to execute each test
  - Expected: All tests PASS now (they failed initially in Phase 3.2)
  - Test files:
    - deeplink-telegram.spec.js ✅
    - deeplink-whatsapp.spec.js ✅
    - analytics.spec.js ✅
    - hero.spec.js ✅
    - content-blocks.spec.js ✅
    - mobile.spec.js ✅
    - typography.spec.js ✅
    - performance.spec.js ✅
  - Fix any failing tests before proceeding
  - Dependencies: T013-T026 (all implementation complete)

- [x] **T037** Run Lighthouse audit (mobile & desktop)
  - Path: N/A (audit task)
  - Mobile: Target Performance ≥90, LCP ≤2.5s
  - Desktop: Target Performance ≥95
  - Use: Chrome DevTools → Lighthouse tab
  - Check: Accessibility ≥90, Best Practices ≥90, SEO ≥90
  - Fix any issues flagged by Lighthouse
  - Dependencies: T035 (performance optimization)

- [x] **T038** Validate KPI measurement configuration
  - Path: N/A (verification task)
  - Verify: Yandex.Metrika goal "cta_messenger_click" configured (конверсия ≥5% target per FR-005)
  - Verify: Google Analytics 4 conversion event "messenger_click" configured
  - Verify: Event properties include: button_position (for CTR ≥8% per screen per FR-004)
  - Verify: Device dimension tracked (mobile/desktop for ≥60% mobile target per FR-006)
  - Check: Analytics dashboards can measure FR-004 (CTR), FR-005 (conversion), FR-006 (mobile %)
  - Document: Dashboard URLs and metric formulas in project README
  - Dependencies: T024 (analytics.js), T031 (verify events firing)

---

## Dependencies Graph

```
Setup Phase (Parallel start):
T001 (Hugo init) ━━┳━━> T003 (Asset pipeline)
                   ┗━━> T012 (index.html)
T002 (Netlify) ━━━━━━━> [No blockers]

Tests Phase (All parallel, MUST complete before implementation):
T004 (Telegram test) ━┓
T005 (WhatsApp test) ━┫
T006 (Analytics test) ━┫━━> [All must FAIL initially]
T007 (Hero test) ━━━━━┫
T008 (Content blocks) ━┫
T009 (Mobile test) ━━━┫
T010 (Typography test) ┫
T011 (Performance test)┛

Implementation Phase:
T012 (index.html) ━━> T013-T022 (All partials in parallel)
T023 (CSS) ━━━━━━━━━> T034 (Accessibility audit)
T024 (Analytics) ━━━┳━> T025 (Deeplinks)
                    ┗━> T026 (A/B tests)
                    ┗━> T031 (Verify analytics)

Content Phase (Parallel):
T027 (Content) ━━━━━┳━> T013-T022 (Partials use this)
T028 (Photos) ━━━━━┫
T029 (Testimonials)━┫━━> T018 (Testimonials partial)
T030 (Case studies)━┛

Integration Phase (Sequential):
T031 (Verify analytics) → T032 (SEO) → T033 (robots.txt) → T034 (Accessibility) → T035 (Performance)

Verification Phase (Sequential):
T035 (Performance) → T036 (Run all Playwright tests) → T037 (Lighthouse audit)
```

---

## Parallel Execution Examples

### Example 1: Setup Phase (T001-T003)
```
# T001 and T002 can start together:
Task: "Initialize Hugo project with config.toml (lang=ru, analytics IDs)"
Task: "Setup Netlify deployment configuration in netlify.toml"

# Then T003 depends on T001:
Task: "Configure Hugo asset pipeline in config.toml"
```

### Example 2: Tests Phase (T004-T011) — All Parallel
```
# Launch all 8 tests together (TDD: they will FAIL initially):
Task: "Contract test: Telegram deeplink in tests/playwright/deeplink-telegram.spec.js"
Task: "Contract test: WhatsApp deeplink in tests/playwright/deeplink-whatsapp.spec.js"
Task: "Contract test: Analytics events in tests/playwright/analytics.spec.js"
Task: "Integration test: Hero section in tests/playwright/hero.spec.js"
Task: "Integration test: All content blocks in tests/playwright/content-blocks.spec.js"
Task: "Integration test: Mobile rendering in tests/playwright/mobile.spec.js"
Task: "Content test: Russian typography in tests/playwright/typography.spec.js"
Task: "Performance test: Lighthouse ≥90 in tests/playwright/performance.spec.js"
```

### Example 3: HTML Partials (T013-T022) — All Parallel
```
# After T012 (index.html) is done, launch all 10 partials together:
Task: "Hero section partial in layouts/partials/hero.html"
Task: "Symptoms block partial in layouts/partials/symptoms.html"
Task: "Benefits block partial in layouts/partials/benefits.html"
Task: "About block partial in layouts/partials/about.html"
Task: "Process block partial in layouts/partials/process.html"
Task: "Testimonials block partial in layouts/partials/testimonials.html"
Task: "Pricing block partial in layouts/partials/pricing.html"
Task: "FAQ block partial in layouts/partials/faq.html"
Task: "Final CTA block partial in layouts/partials/cta-final.html"
Task: "Footer partial in layouts/partials/footer.html"
```

### Example 4: Content & Data (T027-T030) — Mostly Parallel
```
# T027-T030 can run in parallel (different files):
Task: "Landing page content in content/_index.md"
Task: "Add psychologist photos to assets/images/"
Task: "Create testimonials data in data/testimonials.yaml"
Task: "Create case studies data in data/case-studies.yaml"
```

---

## Notes

- **[P] tasks**: Different files, no dependencies, safe to run in parallel
- **TDD approach**: Tests (T004-T011) MUST be written first and MUST FAIL before implementing T012-T026
- **Verification**: Always verify tests fail initially, then pass after implementation
- **Commit strategy**: Commit after completing each phase (Setup → Tests → Implementation → Content → Integration → Verification)
- **Russian typography**: Always use «» for quotes, — for dashes, nbsp before units (e.g., `5000 ₽`)
- **Mobile-First**: Start CSS at 360px, scale up with media queries
- **Performance**: Target Lighthouse ≥90 mobile, LCP ≤2.5s
- **Analytics**: Yandex.Metrika is primary (Russian audience), GA4 is secondary
- **Terminology Standardization**: Use English IDs for code (`data-block="hero"`, `data-block="symptoms"`) and Russian titles for user-facing content («Первый экран», «Узнаете себя?»). Maintain this convention across HTML partials, CSS classes, and JavaScript.

---

## Validation Checklist
*GATE: Checked before tasks.md marked complete*

- [x] All contracts have corresponding tests (T004-T006 cover deeplinks + analytics)
- [x] All content blocks have partial tasks (T013-T022 cover 10 blocks)
- [x] All tests come before implementation (T004-T011 before T012-T026)
- [x] Parallel tasks truly independent (different files, no conflicts)
- [x] Each task specifies exact file path (all paths provided)
- [x] No task modifies same file as another [P] task (validated: no conflicts)
- [x] TDD approach enforced (tests MUST FAIL before implementation)
- [x] Dependencies graph complete and accurate
- [x] Parallel execution examples provided

---

**Total Tasks**: 37 (T001-T037)
**Estimated Parallel Groups**: 6 groups (Setup, Tests, Partials, Content, Integration, Verification)
**Critical Path**: Setup → Tests → index.html → Partials → CSS/JS → Content → Integration → Verification → Lighthouse
**Estimated Time**: 3-5 days (with parallel execution, experienced developer)

**Status**: ✅ Tasks ready for execution
**Next Step**: Begin with T001 (Initialize Hugo project)
