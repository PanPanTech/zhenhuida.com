import {origin} from '@/lib/catalog';
export const dynamic='force-static';
export default function robots(){return{rules:{userAgent:'*',allow:'/'},sitemap:`${origin}/sitemap.xml`}}
