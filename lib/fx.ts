// Official exchange rates of the National Bank of Kazakhstan (tenge per unit), fetched once at build time.
// The daily scheduled deploy refreshes them. If the feed is unavailable the calculator asks for a manual rate.
export type Fx = {date: string; source: string; kzt: Record<string, number>};

const FEED = 'https://nationalbank.kz/rss/rates_all.xml';
let cached: Promise<Fx | null> | null = null;

async function load(): Promise<Fx | null> {
  try {
    const res = await fetch(FEED, {signal: AbortSignal.timeout(10000)});
    if (!res.ok) return null;
    const xml = await res.text();
    const kzt: Record<string, number> = {};
    let date = '';
    for (const item of xml.match(/<item>[\s\S]*?<\/item>/g) || []) {
      const get = (tag: string) => item.match(new RegExp(`<${tag}>([^<]*)</${tag}>`))?.[1]?.trim() || '';
      const code = get('title'), rate = parseFloat(get('description')), quant = parseFloat(get('quant')) || 1;
      if (/^[A-Z]{3}$/.test(code) && rate > 0) kzt[code] = rate / quant;
      date ||= get('pubDate');
    }
    return kzt.USD ? {date, source: 'Национальный банк Республики Казахстан', kzt} : null;
  } catch {
    return null;
  }
}

export function getFx(): Promise<Fx | null> {
  return (cached ??= load());
}
