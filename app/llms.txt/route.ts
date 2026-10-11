import {origin,products,legalName,messenger,tx,path} from '@/lib/catalog';
import {getPosts,pick} from '@/lib/blog';
// /llms.txt — plain-language site summary for AI assistants and answer engines (llmstxt.org format).
export const dynamic='force-static';
export function GET(){const lang='en';const url=(page='')=>origin+path(lang,page);const lines=[
'# Qinghai Zhenhuida',
'',
`> ${legalName} (Qinghai Zhenhuida International Trade Co., Ltd.) is a trading company in Qinghai, China, supplying industrial chemicals to buyers and distributors in Central Asia. Kazakhstan is the priority market; deliveries are planned via the Khorgos corridor. Website in Russian and English.`,
'',
'Specifications on this site are catalogue references; batch specifications, availability, price and delivery terms are confirmed per inquiry.',
'',
'## Products',
...products.map(p=>`- [${p.en} (${p.formula})](${url(`products/${p.id}`)}): ${tx(lang,...p.grade)}. ${tx(lang,...p.intro)}`),
'',
'## Buyer information',
`- [Delivery planning](${url('delivery')}): routes, Incoterms (FCA/DAP) and documents for Kazakhstan, Uzbekistan and Russia`,
`- [Technical resources](${url('resources')}): TDS, SDS and COA on request; downloadable reference sheets`,
`- [Distributor partnerships](${url('distributors')})`,
`- [Russian version](${origin}${path('ru')})`,
'',
'## Blog',
...getPosts().map(p=>`- [${pick(lang,p.title)}](${url(`blog/${p.slug}`)}): ${pick(lang,p.description)}`),
'',
'## Contact',
`- Supply inquiry form: ${url('contact')}`,
`- WhatsApp / Telegram / phone: ${messenger.phone}`,
''];return new Response(lines.join('\n'),{headers:{'Content-Type':'text/plain;charset=utf-8'}})}
