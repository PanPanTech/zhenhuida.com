# Qinghai Zhenhuida — www.zhenhuida.com

Russian / English B2B website for Qinghai Zhenhuida International Trade Co., Ltd. (青海臻汇达国际贸易有限公司): industrial chemicals for Central Asia.

Static site built with Next.js (`output: "export"`) and hosted on GitHub Pages — the same publishing flow as the other PanPanTech sites.

## Publish

Push to `main`. GitHub Actions (`.github/workflows/deploy.yml`) builds the site and deploys it to GitHub Pages within a few minutes. Progress is under the repository's **Actions** tab.

## Local development

```bash
npm install
npm run dev        # http://localhost:3000/ru/
npm run build      # static site in out/
npm run start      # serve out/ locally
```

## Where things are

| What | File |
| --- | --- |
| Products, specifications, guides, navigation | `lib/catalog.ts` |
| Phone / WhatsApp / Telegram, public email, address | `lib/catalog.ts` → `messenger`, `contact` |
| Page layouts and text | `components/pages.tsx`, `components/detail-pages.tsx`, `components/site-shell.tsx` |
| Inquiry form | `components/inquiry-form.tsx` |
| Blog posts | `content/blog/*.json` |
| Search console verification codes | `lib/catalog.ts` → `siteVerification` |
| Expo photos | `public/images/expo/` |
| Languages | `lib/i18n.ts` |
| Canonical domain | `lib/catalog.ts` → `origin`; `public/CNAME` |

## Publishing a blog post

1. Copy `content/blog/_template.json` to `content/blog/<slug>.json` (the slug becomes the URL: `/ru/blog/<slug>/`).
2. Fill in `date`, `category`, `title`, `description` and `body` for `ru` and `en`. `products` links the post to product pages.
3. Body blocks: a plain string is a paragraph, `{"h2": "..."}` is a subheading, `{"ul": ["...", "..."]}` is a list.
4. Push. The post appears on the blog page, in the sitemap (with its date) and in `/llms.txt`, with `BlogPosting` structured data.

For an added language, add its key (e.g. `"kk"`) to each text field; posts without it show English.

## SEO / GEO

- `sitemap.xml` and `robots.txt` are generated from the page list and blog posts.
- Every page has canonical and hreflang tags; the home page has `Organization` structured data and posts have `BlogPosting`.
- `/llms.txt` is a plain-language summary of the company, products and posts for AI assistants.
- Google / Yandex ownership: paste the meta-tag codes into `siteVerification` in `lib/catalog.ts` and push.

## Inquiries

The form posts from the browser to the shared PanPanTech inquiry service (`https://inquiry.panpantechnology.com/api/inquiries`), which creates a Zoho CRM lead, a Feishu Bitable record and a Feishu group notification. Leads are tagged `lead_brand = Zhenhuida`. The site's domains must be listed in the service's `ALLOWED_ORIGINS`.

## Adding a language

Russian and English are written inline as `tx(lang, 'русский', 'English')`. Other languages use a dictionary keyed by the English text:

1. `npm run i18n:extract` — writes `locales/_template.json` (all English strings) and `locales/_reference-ru.json` (Russian for reference).
2. Copy the template to `locales/<code>.json` (e.g. `kk.json`) and fill in the translations. Empty entries fall back to English.
3. In `lib/i18n.ts`: `import kk from '@/locales/kk.json'`, add it to `dictionaries`, and add `{code: 'kk', label: 'KZ', name: 'Қазақша'}` to `languages`.
4. Push. All pages, the sitemap, hreflang tags and the language switcher pick up the new language.

Run `npm run i18n:extract` again after changing site text; it reports how many strings each language file is missing. Strings that contain variables (e.g. the inquiry confirmation with its reference number) are not extracted and stay in English for added languages.
