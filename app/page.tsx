import {languages,defaultLang} from '@/lib/i18n';
import {origin} from '@/lib/catalog';
// Static root page: forwards to the visitor's language (Russian by default), with plain links as a fallback.
export const metadata={title:'Qinghai Zhenhuida',alternates:{canonical:`${origin}/${defaultLang}/`},robots:{index:false,follow:true}};
const codes=JSON.stringify(languages.map(l=>l.code));
export default function Index(){return <main style={{padding:40,fontFamily:'Arial, sans-serif'}}><script dangerouslySetInnerHTML={{__html:`(function(){var c=${codes},l=(navigator.language||'').slice(0,2).toLowerCase();location.replace('/'+(c.indexOf(l)>-1?l:'${defaultLang}')+'/')})()`}}/><p>Qinghai Zhenhuida</p>{languages.map(l=><p key={l.code}><a href={`/${l.code}/`}>{l.name}</a></p>)}</main>}
