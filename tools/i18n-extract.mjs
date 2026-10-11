// Collects every translatable English string from the source and writes locales/_template.json.
// Russian/English pairs are found in: tx(lang, 'ru', 'en') calls, [ru, en] neighbours in string arrays,
// {ru, en} object properties, and parallel ruBody/enBody or [[ru...],[en...]] arrays in lib/catalog.ts.
// It also reports how complete each existing locales/<lang>.json is.
// Usage: npm run i18n:extract
import ts from 'typescript';
import {readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const cyr = /[Ѐ-ӿ]/;
const pairs = new Map(); // english -> russian

const literal = n => ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) ? n.text : null;
const add = (ru, en) => { if (ru && en && cyr.test(ru) && !cyr.test(en)) pairs.set(en, ru); };
const strings = arr => arr.elements.map(literal);

function visit(node) {
  if (ts.isCallExpression(node) && node.expression.getText() === 'tx' && node.arguments.length === 3) {
    add(literal(node.arguments[1]), literal(node.arguments[2]));
  }
  if (ts.isArrayLiteralExpression(node)) {
    const s = strings(node);
    for (let i = 0; i + 1 < s.length; i++) add(s[i], s[i + 1]);
    // [[ru, ru, ...], [en, en, ...]]
    const [a, b] = node.elements;
    if (node.elements.length === 2 && a && b && ts.isArrayLiteralExpression(a) && ts.isArrayLiteralExpression(b)) {
      const ra = strings(a), ea = strings(b);
      ra.forEach((r, i) => add(r, ea[i]));
    }
  }
  if (ts.isObjectLiteralExpression(node)) {
    const prop = name => node.properties.find(p => ts.isPropertyAssignment(p) && p.name.getText() === name)?.initializer;
    for (const [r, e] of [['ru', 'en'], ['rd', 'ed']]) {
      const ri = prop(r), ei = prop(e);
      if (ri && ei) add(literal(ri), literal(ei));
    }
    const rb = prop('ruBody'), eb = prop('enBody');
    if (rb && eb && ts.isArrayLiteralExpression(rb) && ts.isArrayLiteralExpression(eb)) {
      const ra = strings(rb), ea = strings(eb);
      ra.forEach((r, i) => add(r, ea[i]));
    }
  }
  ts.forEachChild(node, visit);
}

const sources = ['components', 'lib', 'app'].flatMap(function walk(dir) {
  const full = join(root, dir);
  return readdirSync(full, {withFileTypes: true}).flatMap(d =>
    d.isDirectory() ? (d.name === 'ui' ? [] : walk(join(dir, d.name))) : /\.(ts|tsx)$/.test(d.name) ? [join(dir, d.name)] : []);
});
for (const file of sources) {
  const text = readFileSync(join(root, file), 'utf8');
  visit(ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS));
}

const keys = [...pairs.keys()].sort();
const localeDir = join(root, 'locales');
if (!existsSync(localeDir)) mkdirSync(localeDir);
writeFileSync(join(localeDir, '_template.json'), JSON.stringify(Object.fromEntries(keys.map(k => [k, ''])), null, 2) + '\n');
console.log(`${keys.length} strings -> locales/_template.json`);
console.log('Russian reference for translators: locales/_reference-ru.json');
writeFileSync(join(localeDir, '_reference-ru.json'), JSON.stringify(Object.fromEntries(keys.map(k => [k, pairs.get(k)])), null, 2) + '\n');

for (const f of readdirSync(localeDir).filter(f => /^[a-z]{2,3}\.json$/.test(f))) {
  const dict = JSON.parse(readFileSync(join(localeDir, f), 'utf8'));
  const missing = keys.filter(k => !dict[k]);
  console.log(`${f}: ${keys.length - missing.length}/${keys.length} translated${missing.length ? `, ${missing.length} missing (shown in English)` : ''}`);
}
