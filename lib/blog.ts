import fs from 'node:fs';
import nodePath from 'node:path';
import type {Lang} from './i18n';

// Blog posts live in content/blog/<slug>.json (see content/blog/_template.json).
// Each text field holds one entry per language; a missing language falls back to English.
// Body blocks: a plain string is a paragraph, {"h2": "..."} a subheading, {"ul": ["...", "..."]} a bullet list.
export type Block = string | {h2: string} | {ul: string[]};
export type Localized<T> = Record<string, T>;
export type Post = {
  slug: string;
  date: string;
  updated?: string;
  category: Localized<string>;
  title: Localized<string>;
  description: Localized<string>;
  products?: string[];
  body: Localized<Block[]>;
};

const dir = nodePath.join(process.cwd(), 'content', 'blog');

export function getPosts(): Post[] {
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json') && !f.startsWith('_'))
    .map(f => JSON.parse(fs.readFileSync(nodePath.join(dir, f), 'utf8')) as Post)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find(p => p.slug === slug);
}

export function pick<T>(lang: Lang, value: Localized<T>): T {
  return value[lang] ?? value.en;
}
