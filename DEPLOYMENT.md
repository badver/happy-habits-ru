# Deployment Guide

## Overview

This Hugo site supports deployment to multiple environments with dynamic baseURL configuration. The site is designed to work correctly across different hostnames without hardcoded URLs.

## How It Works

The site uses Hugo's environment-specific configuration system:

- **Base config** ([config.toml](config.toml)): Uses `baseURL = "/"` as default
- **Production config** ([config/production/config.toml](config/production/config.toml)): Sets `baseURL = "https://happy-habits.ru/"`
- **Development config** ([config/development/config.toml](config/development/config.toml)): Sets `baseURL = "http://localhost:1313/"`
- **Build-time override**: Can be overridden with `-b` flag for custom deployments

## Deployment Targets

### 1. Netlify (Primary)

#### Production Deploy
- **Trigger**: Push to `main` branch
- **Domain**: happy-habits.ru
- **Environment**: production
- **Build command**: `hugo --gc --minify`
- **Config**: Uses [config/production/config.toml](config/production/config.toml)

#### Preview Deploys
- **Trigger**: Pull requests
- **Domain**: `deploy-preview-[PR-NUMBER]--[SITE-NAME].netlify.app`
- **Build command**: `hugo --gc --minify --buildFuture -b $DEPLOY_PRIME_URL`
- **Config**: Uses base config with dynamic baseURL override

#### Branch Deploys
- **Trigger**: Push to any branch
- **Domain**: `[BRANCH-NAME]--[SITE-NAME].netlify.app`
- **Build command**: `hugo --gc --minify -b $DEPLOY_PRIME_URL`
- **Config**: Uses base config with dynamic baseURL override

### 2. GitHub Pages

- **Domain**: Configured via CNAME file (production only)
- **Build**: GitHub Actions workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml))
- **Build command**: `hugo --minify --baseURL "${{ steps.pages.outputs.base_url }}/"`
- **Environment**: production

### 3. Custom Domain Deployment

To deploy to a different domain, you have three options:

#### Option 1: Update Production Config (Permanent Change)

Edit [config/production/config.toml](config/production/config.toml):

```toml
baseURL = "https://your-domain.com/"
```

Then build normally:
```bash
hugo --gc --minify --environment production
```

#### Option 2: Override at Build Time (Temporary)

```bash
hugo --gc --minify -b "https://your-domain.com/"
```

This works without modifying any config files.

#### Option 3: Environment Variable

Set the environment variable in your hosting platform (e.g., Netlify, Vercel):

```bash
HUGO_BASEURL="https://your-domain.com/"
```

Then modify [config/production/config.toml](config/production/config.toml):

```toml
baseURL = {{ getenv "HUGO_BASEURL" | default "https://happy-habits.ru/" }}
```

## Local Development

### Standard Development Server

```bash
hugo server
```

This uses the base config with `baseURL = "/"`. The site will be available at `http://localhost:1313/`.

### Test Production Configuration

```bash
hugo server --environment production
```

This uses [config/production/config.toml](config/production/config.toml) with `baseURL = "https://happy-habits.ru/"`.

### Test with Custom BaseURL

```bash
hugo server -b "http://localhost:1313/"
```

### Test Build Output

Build with a test domain and verify no hardcoded URLs remain:

```bash
hugo --minify -b "https://test-domain.com/"
grep -r "happy-habits.ru" public/ || echo "✅ No hardcoded URLs found"
```

Check generated files:

```bash
# Verify robots.txt has correct sitemap URL
cat public/robots.txt | grep Sitemap

# Verify canonical URL
grep 'rel="canonical"' public/index.html

# Verify favicon paths
grep 'apple-touch-icon' public/index.html
```

## Troubleshooting

### Assets Not Loading (404 Errors)

**Symptom**: CSS, JS, images, or favicons return 404 errors.

**Possible Causes**:
1. baseURL not set correctly at build time
2. Build command missing `-b` flag for preview deploys
3. Assets missing from `static/` or `assets/` directories

**Solutions**:
- Verify Netlify build settings use correct commands from [netlify.toml](netlify.toml)
- Check that `$DEPLOY_PRIME_URL` is available in preview environments
- Inspect `public/index.html` to see actual asset URLs generated

### Wrong Canonical URLs or Meta Tags

**Symptom**: Canonical URLs or Open Graph URLs point to wrong domain.

**Possible Causes**:
1. Build command not setting correct baseURL
2. Hugo environment not set correctly

**Solutions**:
- Production builds should set `HUGO_ENVIRONMENT=production`
- Preview builds should use `-b $DEPLOY_PRIME_URL` flag
- Check output HTML: `grep 'rel="canonical"' public/index.html`

### robots.txt Has Wrong Sitemap URL

**Symptom**: robots.txt points to incorrect sitemap URL.

**Possible Causes**:
1. robots.txt template not being used
2. baseURL incorrect at build time

**Solutions**:
- Verify [layouts/robots.txt](layouts/robots.txt) exists (not in static/)
- Check [config.toml](config.toml) includes robots output format
- Verify generated file: `cat public/robots.txt`

### Anchor Links Not Working

**Symptom**: Clicking `#cta-final` or `#faq` links doesn't scroll to section.

**Possible Causes**:
1. JavaScript errors preventing default behavior
2. CSS scroll-snap or smooth-scroll conflicts
3. Target element missing ID attribute

**Solutions**:
- Open browser console and check for JavaScript errors
- Verify target elements have correct IDs: `<section id="cta-final">`
- Test with JavaScript disabled to isolate CSS issues

### Mixed Content Warnings

**Symptom**: Browser shows mixed content warnings (HTTP/HTTPS).

**Possible Causes**:
1. baseURL uses `http://` instead of `https://`
2. External resources loaded over HTTP

**Solutions**:
- Ensure production baseURL uses `https://`
- Check for any hardcoded `http://` URLs in templates
- Verify all external resources use HTTPS

### CNAME File Issues (GitHub Pages)

**Symptom**: GitHub Pages not working with custom domain.

**Possible Causes**:
1. CNAME file not in build output
2. Wrong environment used for build

**Solutions**:
- Verify [static/CNAME](static/CNAME) exists with correct domain
- Ensure `CNAME` appears in `public/` after build
- For non-GitHub-Pages deployments, the CNAME file won't cause issues (it's just ignored)

## File Structure

```
.
├── config.toml                           # Base config (baseURL = "/")
├── config/
│   ├── production/
│   │   └── config.toml                   # Production baseURL override
│   └── development/
│       └── config.toml                   # Development baseURL override
├── layouts/
│   ├── index.html                        # Main template (uses .Permalink)
│   ├── robots.txt                        # Dynamic robots.txt template
│   └── partials/                         # Component templates
├── static/                               # Static assets (favicons, images)
│   └── CNAME                             # GitHub Pages custom domain (optional)
├── netlify.toml                          # Netlify build configuration
└── .github/workflows/deploy.yml          # GitHub Actions workflow
```

## Key Features

✅ **Dynamic baseURL**: Adapts to any deployment domain
✅ **Environment-specific configs**: Production, development, preview
✅ **Dynamic robots.txt**: Sitemap URL always matches deployed domain
✅ **Relative asset paths**: Favicons and resources use Hugo's `relURL`
✅ **Build-time overrides**: Can deploy to any domain with `-b` flag
✅ **No hardcoded URLs**: All URLs generated dynamically
✅ **Backwards compatible**: Existing workflows continue to work

## Testing Checklist

Before deploying to production:

- [ ] Local development server works: `hugo server`
- [ ] Production config works: `hugo server --environment production`
- [ ] Build completes without errors: `hugo --minify`
- [ ] No hardcoded URLs in output: `grep -r "happy-habits.ru" public/`
- [ ] robots.txt has correct sitemap URL
- [ ] Canonical URLs correct in `public/index.html`
- [ ] Favicons load correctly
- [ ] CSS and JS load correctly
- [ ] Anchor links work (`#cta-final`, `#faq`)
- [ ] No console errors in browser
- [ ] No mixed content warnings

## Support

For issues or questions about deployment:
1. Check this guide's troubleshooting section
2. Review build logs in Netlify or GitHub Actions
3. Test locally with `hugo server --environment production`
4. Verify configuration files match this guide
