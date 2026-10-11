import {origin,products,guides,pageNames} from '@/lib/catalog';
import {langCodes} from '@/lib/i18n';
export const dynamic='force-static';
export default function sitemap(){const pages=['',...Object.keys(pageNames),...products.map(p=>'products/'+p.id),...guides.map(g=>'guides/'+g.id)];const url=(lang:string,path:string)=>`${origin}/${lang}/${path?path+'/':''}`;return langCodes.flatMap(lang=>pages.map(path=>({url:url(lang,path),alternates:{languages:Object.fromEntries(langCodes.map(l=>[l,url(l,path)]))}})))}
