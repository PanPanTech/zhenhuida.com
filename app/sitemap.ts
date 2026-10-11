import {origin,products,pageNames} from '@/lib/catalog';
import {getPosts} from '@/lib/blog';
import {langCodes} from '@/lib/i18n';
export const dynamic='force-static';
export default function sitemap(){const posts=getPosts();const pages=['',...Object.keys(pageNames),...products.map(p=>'products/'+p.id),...posts.map(g=>'blog/'+g.slug)];const lastmod=(path:string)=>{const p=posts.find(x=>'blog/'+x.slug===path);return p?{lastModified:p.updated||p.date}:{}};const url=(lang:string,path:string)=>`${origin}/${lang}/${path?path+'/':''}`;return langCodes.flatMap(lang=>pages.map(path=>({url:url(lang,path),...lastmod(path),alternates:{languages:Object.fromEntries(langCodes.map(l=>[l,url(l,path)]))}})))}
