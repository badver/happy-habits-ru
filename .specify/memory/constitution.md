<!--
SYNC IMPACT REPORT
==================
Version Change: 1.0.0 → 1.1.0
Rationale: Add technical architecture constraints (static site, Russian language, Playwright testing)

Modified Principles:
- UPDATED: II. Mobile-First Performance - Added static site generator requirement
- NEW: VI. Static Site Architecture - Hugo/11ty/Astro requirement, build-time optimization
- NEW: VII. Russian Language Only - No i18n, Cyrillic optimization, Russian SEO
- UPDATED: Quality Gates - Added Playwright MCP automated testing requirement

Added Sections:
- Technical Architecture Requirements (static site generators)
- Language & Localization Requirements
- Automated Testing Requirements (Playwright MCP)

Templates Status:
✅ plan-template.md - Constitution Check gate references updated
✅ spec-template.md - Requirements alignment verified
✅ tasks-template.md - Task categorization supports all principles
⚠️  Templates should validate static site architecture and Russian language compliance

Follow-up TODOs:
- Update plan-template.md to include static site generator selection in Technical Context
- Update tasks-template.md to include Playwright MCP test tasks

Last Updated: 2025-10-03
-->

# Psychologist Landing Page Constitution

## Core Principles

### I. Conversion-First Design
**Primary KPI Target: ≥5% conversion rate (traffic → contact) within 30 days of launch**

Every design, content, and technical decision MUST be evaluated against conversion impact:
- First screen CTA click-through rate (CTR) MUST achieve ≥8%
- Mobile traffic MUST account for ≥60% of conversions
- Response time SLA (≤2 hours) MUST be prominently displayed
- All conversion paths (Telegram, WhatsApp) MUST be instrumented with UTM tracking
- A/B testing framework MUST be implemented from day one

*Rationale*: This is a direct-response marketing asset, not a branding site. Every element exists to drive qualified leads to contact channels.

### II. Mobile-First Performance
**Performance Budget: Lighthouse Mobile Score ≥90, LCP ≤2.5s**

Mobile performance is NON-NEGOTIABLE:
- Design starts at 360px viewport, scales up to 1920px
- Three mandatory breakpoints: mobile, tablet, desktop
- All media MUST use lazy loading, WebP/AVIF formats
- Critical CSS MUST be inlined, scripts minimized
- Static site generation required (Hugo, 11ty, Astro, or similar)
- Build-time optimization over runtime processing
- Performance validation MUST pass before deployment

*Rationale*: 60%+ of target audience (anxious individuals seeking help) will access from mobile devices, often in moments of acute distress. Slow loading = lost conversions. Static sites provide inherent performance advantages.

### III. Evidence-Based Communication
**Tone: Доказательный, конкретный, измеримый**

All content claims MUST be:
- Specific and measurable (e.g., "8-12 sessions", "8 из 10 клиентов")
- Grounded in methodology (КПТ/CBT evidence base)
- Free of medical jargon and "cure" promises
- Transparent about process, timelines, costs
- Accompanied by social proof (testimonials, case anonymized data)

Forbidden patterns:
- Vague promises ("Вы почувствуете себя лучше")
- Medical overreach ("Мы вылечим депрессию")
- Pressure tactics without value ("Только сегодня!" without justification)
- **Medical terminology** — psychologist ≠ doctor. NEVER use: психотерапевт, психотерапия, диагноз, лечение, депрессия, невроз, расстройство, симптомы, панические атаки
- **Cure/guarantee language** — NEVER use: избавлю, избавление, вылечу, гарантирую результат
- Correct title: «Клинический психолог, КПТ-специалист» (NEVER «психотерапевт»)
- Use instead: «работа с тревожностью», «снижение тревоги», «психологическая помощь», «подавленное состояние» (not «депрессия»), «приступы тревоги» (not «панические атаки»)

*Rationale*: Target audience is skeptical and research-oriented. Trust is built through specificity and professional restraint.

### IV. Privacy & Trust
**Data Protection: GDPR-compliant, professional ethics standard**

User trust MUST be protected at every touchpoint:
- All forms MUST include explicit consent checkboxes
- Privacy Policy and Terms of Service MUST be accessible from every page
- No data collection without clear purpose disclosure
- Professional confidentiality badge prominently displayed
- Disclaimer about medical emergencies (when to seek immediate care)
- INN/OGRNIP displayed if applicable

*Rationale*: Mental health services require higher trust threshold than standard commercial services. One privacy misstep destroys credibility.

### V. Measurement & Iteration
**Analytics Framework: GA4 + Yandex.Metrika + Conversion Tracking**

Data-driven optimization is mandatory:
- All CTA buttons MUST fire conversion events
- Scroll depth and time-on-page MUST be tracked
- Video engagement MUST be measured
- Form submissions MUST route to CRM/Sheets/Telegram bot
- Exit-intent triggers MUST be A/B tested
- Monthly performance review cycle established

Post-launch testing pipeline (2-4 weeks):
- Hero variants (free diagnostic vs. discount offer)
- CTA copy ("Записаться" vs. "Написать в Telegram")
- Block ordering (results-first vs. expertise-first)
- Urgency messaging (scarcity vs. value-focused)

*Rationale*: First version is a hypothesis. Continuous improvement requires rigorous measurement and willingness to invalidate assumptions.

### VI. Static Site Architecture
**Tech Stack: Static Site Generator (Hugo/11ty/Astro) + Git-based deployment**

Site MUST be fully static with no server-side runtime:
- Static site generator selection based on: build speed, Russian language support, template flexibility
- All pages generated at build time (no SSR, no client-side routing)
- Forms submit to external services (Formspree, Google Forms, or custom webhook)
- Analytics injected via script tags (client-side only)
- Deployment via Git push (Netlify, Vercel, GitHub Pages, or similar)
- Preview environments for every branch

Prohibited patterns:
- Server-side rendering (SSR)
- Database connections
- Backend API dependencies (except analytics/forms)
- WordPress, Tilda, or CMS platforms requiring runtime

*Rationale*: Static sites provide maximum performance, security, and reliability for a single-page landing. No server maintenance, instant global CDN, perfect for paid traffic campaigns.

### VII. Russian Language Only
**Content Language: 100% Russian (ru-RU), no internationalization**

Site MUST serve exclusively Russian-speaking audience:
- All content, UI labels, error messages in Russian
- No i18n libraries or language switchers
- HTML lang="ru", proper Cyrillic encoding (UTF-8)
- Russian-optimized typography (correct quotes «», dashes —, non-breaking spaces)
- Yandex.Metrika prioritized over Google Analytics (Russian audience behavior)
- SEO keywords in Russian (see Section 3.4 of TZ)
- Meta tags, OG tags, Schema.org markup in Russian

Typography requirements:
- Correct Russian typography: « » for quotes, not " "
- Em dash (—) for sentence breaks, not hyphen (-)
- Non-breaking spaces (nbsp) before: units, short words, prepositions
- Proper capitalization (lowercase after colon in lists)

*Rationale*: Target audience is exclusively Russian-speaking (Russia, CIS countries). Internationalization adds complexity with zero business value. Russian typography signals professionalism to local audience.

## Quality Gates & Acceptance Criteria

### Pre-Launch Gates (All MUST pass)
- [ ] Lighthouse Mobile Performance ≥90
- [ ] All CTA deeplinks (TG/WA) functional with UTM parameters
- [ ] Forms submit correctly to designated endpoints (CRM/Sheets/bot)
- [ ] Analytics events fire for all critical interactions
- [ ] Playwright MCP automated tests pass (see Automated Testing Requirements)
- [ ] Cross-browser testing complete (Chrome, Safari, Firefox, Edge)
- [ ] Mobile device testing on iOS and Android
- [ ] Privacy Policy and Terms accessible and compliant
- [ ] All images have descriptive alt text
- [ ] Fonts ≥16px on mobile, contrast ratios WCAG AA compliant
- [ ] Russian typography validated (correct quotes, dashes, nbsp)
- [ ] HTML lang="ru" attribute set
- [ ] Static build completes without errors

### Content Quality Gates
- [ ] No unexplained medical claims
- [ ] No banned terminology (see Forbidden patterns in Section III) — run grep check before deploy
- [ ] All statistics cited (e.g., "8 из 10") have methodology note
- [ ] Testimonials include consent disclosure
- [ ] Pricing clearly stated with payment/cancellation terms
- [ ] FAQ addresses all major objections identified in brief
- [ ] Disclaimers present (not medical advice, seek emergency care when needed)

### Post-Launch Monitoring (First 30 days)
- Weekly conversion rate review
- CTA CTR analysis (first screen target ≥8%)
- Mobile vs. desktop conversion comparison (mobile ≥60%)
- Response time SLA adherence tracking
- User feedback collection from initial conversions

## Analytics & Testing Requirements

### Required Tracking Setup
1. **GA4 Configuration**:
   - Custom events: `cta_click`, `form_submit`, `messenger_open`, `video_play`, `scroll_75`, `time_60s`
   - E-commerce tracking for package purchases (if applicable)
   - User ID tracking (with consent)

2. **Yandex.Metrika**:
   - Session recording (sample rate 10%)
   - Heatmaps on hero and pricing sections
   - Form analytics with field-level drop-off

3. **Advertising Platform Goals**:
   - Google Ads conversion import
   - Yandex.Direct goal configuration
   - Meta pixel events (if running Meta ads)

### A/B Testing Framework
Implement variant testing infrastructure supporting:
- Header/subheader copy rotation
- CTA button text and color variations
- Offer positioning (free diagnostic vs. discount)
- Block order permutations
- Exit-intent popup messaging

### Automated Testing Requirements (Playwright MCP)
**MANDATORY: All user flows MUST have Playwright MCP automated tests**

Use `mcp__playwright__*` tools for automated testing:
1. **Critical Path Tests** (MUST pass before deployment):
   - Hero section loads and displays correctly
   - All CTA buttons clickable (Telegram, WhatsApp, form)
   - Telegram/WhatsApp deeplinks open correct apps
   - Contact form submission (validation + success state)
   - Mobile viewport rendering (360px, 768px, 1920px)

2. **Content Verification Tests**:
   - Russian typography correct (quotes «», dashes —)
   - All required sections present (симптом-чек, отзывы, FAQ, etc.)
   - Privacy Policy and Terms links functional
   - Analytics scripts loaded (GA4, Yandex.Metrika)

3. **Performance Tests**:
   - Page load time within budget
   - Images lazy-load correctly
   - No console errors on page load

4. **Regression Tests** (run on every build):
   - All links functional (no 404s)
   - Forms validate inputs correctly
   - Exit-intent popup triggers

**Test Execution**:
- Run via MCP Playwright tools: `mcp__playwright__browser_navigate`, `mcp__playwright__browser_click`, `mcp__playwright__browser_snapshot`
- Tests MUST be executable from command line (CI/CD integration)
- Test failures MUST block deployment
- Screenshot on failure for debugging

**Example Test Structure**:
```
Test: Hero CTA Click
1. mcp__playwright__browser_navigate to homepage
2. mcp__playwright__browser_snapshot to verify hero section
3. mcp__playwright__browser_click on "Бесплатная диагностика"
4. Verify Telegram deeplink opened
```

## Governance

### Amendment Process
1. **Proposal**: Document proposed change with business justification
2. **Impact Analysis**: Assess effect on conversion metrics and user trust
3. **Stakeholder Review**: Client (психолог) approval required
4. **Implementation**: Update constitution, increment version, sync templates
5. **Validation**: Confirm no regression in key metrics post-change

### Version Control
- **MAJOR** (X.0.0): Fundamental principle redefinition (e.g., abandoning conversion focus)
- **MINOR** (1.X.0): New principle added or significant expansion (e.g., adding accessibility requirements)
- **PATCH** (1.0.X): Clarifications, wording refinements, threshold adjustments

### Compliance Verification
All feature work MUST include Constitution Check gate in planning:
- Does this feature maintain/improve conversion paths?
- Does it meet mobile performance budget?
- Is communication evidence-based and transparent?
- Does it protect user privacy appropriately?
- Can we measure its effectiveness?
- Is static site architecture preserved (no SSR/database)?
- Is all content in Russian with correct typography?
- Are Playwright MCP tests written for new user flows?

Violations require explicit justification in Complexity Tracking section of plan.md.

### Project-Specific Guidance
- See `/specs/[feature]/plan.md` for feature-level architectural decisions
- See `.specify/templates/` for template structure and requirements
- All agents (Claude, Copilot, etc.) MUST reference this constitution via agent-file updates

**Version**: 1.1.0 | **Ratified**: 2025-10-03 | **Last Amended**: 2025-10-03
