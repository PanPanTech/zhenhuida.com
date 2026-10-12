import fs from 'node:fs';
import nodePath from 'node:path';
import type {Lang} from './i18n';

// Blog posts live in content/blog/<slug>.json (see content/blog/_template.json).
// Each text field holds one entry per language; a missing language falls back to English.
// Body blocks (per language):
//   "text"                                  paragraph
//   {"h2": "..."}                           section heading (listed in the table of contents)
//   {"ul": ["...", "..."]}                  bullet list
//   {"summary": ["...", "..."]}             "key points" box
//   {"note": "..."}                         highlighted remark
//   {"img": "/images/...", "alt": "...", "caption": "...", "credit": "...", "creditUrl": "https://...", "narrow": true}
//   {"chem": "Na₂CO₃", "name": "...", "structure": "carbonate", "facts": [["label", "value"], ...]}
//   {"table": {"head": ["", "..."], "rows": [["...", "..."], ...]}}
//   {"apps": [{"icon": "glass", "title": "...", "text": "..."}, ...]}   icons: glass, chemistry, detergent, metal, water, battery, paper
// Optional "faq": [{"q": {...}, "a": {...}}] renders a Q&A section with FAQPage structured data.
// "draft": true keeps a post off the site; build with SHOW_DRAFTS=1 to preview drafts locally.
export type Block =
  | string
  | {h2: string}
  | {ul: string[]}
  | {summary: string[]}
  | {note: string}
  | {img: string; alt: string; caption?: string; credit?: string; creditUrl?: string; narrow?: boolean}
  | {chem: string; name: string; structure?: string; facts: [string, string][]}
  | {table: {head: string[]; rows: string[][]}}
  | {apps: {icon: string; title: string; text: string}[]};
export type Localized<T> = Record<string, T>;
export type Post = {
  slug: string;
  date: string;
  updated?: string;
  draft?: boolean;
  image?: string;
  category: Localized<string>;
  title: Localized<string>;
  description: Localized<string>;
  products?: string[];
  body: Localized<Block[]>;
  faq?: {q: Localized<string>; a: Localized<string>}[];
};

const dir = nodePath.join(process.cwd(), 'content', 'blog');
const showDrafts = process.env.SHOW_DRAFTS === '1';

export function getPosts(): Post[] {
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json') && !f.startsWith('_'))
    .map(f => JSON.parse(fs.readFileSync(nodePath.join(dir, f), 'utf8')) as Post)
    .filter(p => showDrafts || !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find(p => p.slug === slug);
}

export function pick<T>(lang: Lang, value: Localized<T>): T {
  return value[lang] ?? value.en;
}

// Heading anchor: transliterated, lowercase, hyphenated ("Что такое сода" -> "chto-takoe-soda").
const translit: Record<string, string> = {а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya'};
export function anchor(text: string): string {
  return text.toLowerCase().split('').map(c => translit[c] ?? c).join('')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}
