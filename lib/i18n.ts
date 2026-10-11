// Site languages. Russian and English text is written inline in the components as tx(lang, ru, en).
// To add a language (e.g. Kazakh):
//   1. npm run i18n:extract  -> writes locales/_template.json (every English string as a key)
//   2. copy it to locales/kk.json and fill in the translations (empty values fall back to English)
//   3. import it below and add {code:'kk', ...} to `languages`
// Pages, sitemap, hreflang and the language switcher are generated from this list.
export const languages = [
  {code: 'ru', label: 'RU', name: 'Русский'},
  {code: 'en', label: 'EN', name: 'English'},
] as const;

export type Lang = string;
export const defaultLang = 'ru';
export const langCodes: string[] = languages.map(l => l.code);

const dictionaries: Record<string, Record<string, string>> = {
  // kk: kk,
};

export function tx(lang: Lang, ru: string, en: string): string {
  if (lang === 'ru') return ru;
  if (lang === 'en') return en;
  return dictionaries[lang]?.[en] || en;
}

// Internal page URL with the trailing slash GitHub Pages serves directly: path('ru','contact?product=x') -> /ru/contact/?product=x
export function path(lang: Lang, page = ''): string {
  const [p, query] = page.split('?');
  const clean = p.replace(/^\/|\/$/g, '');
  return `/${lang}/${clean ? clean + '/' : ''}${query ? '?' + query : ''}`;
}
