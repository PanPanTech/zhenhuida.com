import fs from 'node:fs';
import nodePath from 'node:path';
import {TrendingUp, TrendingDown, MoveRight} from 'lucide-react';
import {tx, path, type Lang} from '@/lib/catalog';
import {getFx} from '@/lib/fx';
import {getPost} from '@/lib/blog';
import {PageIntro, Cta} from './pages';
import {LandedCost} from './landed-cost';

// Price & market hub. Weekly reviews live in content/market/reviews.json (newest first is not required — sorted here).
// Exchange quotes are not republished: reviews describe the trend in our own words and link to the sources.
type Side = {headline: string; level: string; points: string[]; buyer: string};
type Review = {date: string; pvc: {trend: string; ru: Side; en: Side}; soda: {trend: string; ru: Side; en: Side}; sources: {title: string; url: string}[]};
const GUIDE_SLUG = 'birzhevaya-tsena-pvh-i-sody-v-tsenu-importa';

function reviews(): Review[] {
  const file = nodePath.join(process.cwd(), 'content', 'market', 'reviews.json');
  return (JSON.parse(fs.readFileSync(file, 'utf8')) as Review[]).sort((a, b) => b.date.localeCompare(a.date));
}
const dateText = (lang: Lang, d: string) => new Date(d + 'T00:00:00Z').toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-GB', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'});

function Trend({trend, lang}: {trend: string; lang: Lang}) {
  const t = trend === 'up' ? {I: TrendingUp, ru: 'рост', en: 'rising', c: 'up'} : trend === 'down' ? {I: TrendingDown, ru: 'снижение', en: 'easing', c: 'down'} : {I: MoveRight, ru: 'боковик', en: 'sideways', c: 'flat'};
  return <span className={`trend trend-${t.c}`}><t.I size={16}/>{tx(lang, t.ru, t.en)}</span>;
}

function Card({lang, title, code, item}: {lang: Lang; title: string; code: string; item: Review['pvc']}) {
  const s = lang === 'ru' ? item.ru : item.en;
  return <div className="market-card">
    <div className="market-card-head"><div><p className="eyebrow">{code}</p><h3>{title}</h3></div><Trend trend={item.trend} lang={lang}/></div>
    <p className="market-headline">{s.headline}</p>
    <p>{s.level}</p>
    <ul className="article-list">{s.points.map(p => <li key={p}>{p}</li>)}</ul>
    <div className="market-buyer"><strong>{tx(lang, 'Что это значит для покупателя', 'What it means for buyers')}</strong><p>{s.buyer}</p></div>
  </div>;
}

export async function Prices({lang}: {lang: Lang}) {
  const all = reviews(), latest = all[0], fx = await getFx();
  const guide = getPost(GUIDE_SLUG);
  const faq: [string, string, string, string][] = [
    ['Почему цена на бирже в Китае не равна цене поставки в Казахстан?', 'Биржевая цена — внутренняя цена Китая в юанях с НДС 13% и поставкой на складе в Китае. Для импорта из неё вычитают НДС, добавляют упаковку, доставку до границы, затем пошлину, НДС страны ввоза и доставку по стране.', 'Why is the Chinese exchange price not the delivered price in Kazakhstan?', 'The exchange price is a domestic Chinese price in yuan including 13% VAT, for delivery at a warehouse in China. For import you remove that VAT, add packaging and transport to the border, then the destination duty, VAT and inland delivery.'],
    ['Как часто обновляется обзор?', 'Обзор рынка публикуется еженедельно; курсы валют обновляются ежедневно по данным Национального банка Казахстана.', 'How often is the review updated?', 'The market review is published weekly; exchange rates update daily from the National Bank of Kazakhstan.'],
    ['Можно ли считать расчёт калькулятора ценой предложения?', 'Нет. Калькулятор помогает сравнить предложения и оценить стоимость на складе. Цена, условия и платежи фиксируются в коммерческом предложении и таможенной декларации.', 'Is the calculator result a quotation?', 'No. It helps you compare offers and estimate landed cost. Price, terms and payments are fixed in the commercial offer and customs declaration.'],
    ['Где посмотреть официальные биржевые котировки?', 'На сайтах Чжэнчжоуской (сода, контракт SA) и Даляньской (ПВХ, контракт V) товарных бирж, а также у лицензированных поставщиков рыночных данных.', 'Where can I see official exchange quotes?', 'On the Zhengzhou (soda ash, SA contract) and Dalian (PVC, V contract) commodity exchange websites, and from licensed market-data vendors.'],
  ];
  const faqLd = {'@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(f => ({'@type': 'Question', name: tx(lang, f[0], f[2]), acceptedAnswer: {'@type': 'Answer', text: tx(lang, f[1], f[3])}}))};
  const refs: [string, string, string, string, string, string][] = [
    ['Чжэнчжоуская товарная биржа (CZCE)', 'Zhengzhou Commodity Exchange (CZCE)', 'фьючерс на соду SA, 20 т в лоте; юани с НДС, поставка в Китае', 'soda ash futures SA, 20 t per lot; yuan incl. VAT, delivery in China', 'бесплатно на сайте биржи', 'https://www.czce.com.cn/'],
    ['Даляньская товарная биржа (DCE)', 'Dalian Commodity Exchange (DCE)', 'фьючерс на ПВХ V, 5 т в лоте; юани с НДС, поставка в Китае', 'PVC futures V, 5 t per lot; yuan incl. VAT, delivery in China', 'бесплатно на сайте биржи', 'https://www.dce.com.cn/'],
    ['ICIS', 'ICIS', 'еженедельные оценки ПВХ: FOB Китай, CFR Юго-Восточная Азия и др.', 'weekly PVC assessments: FOB China, CFR SE Asia and more', 'платная подписка', 'https://www.icis.com/'],
    ['Argus, S&P Global (Platts)', 'Argus, S&P Global (Platts)', 'оценки цен на нефтехимию и полимеры', 'petrochemical and polymer price assessments', 'платная подписка', 'https://www.argusmedia.com/'],
    ['Plastinfo (Россия)', 'Plastinfo (Russia)', 'индексы цен на ПВХ на российском рынке', 'PVC price indices for the Russian market', 'частично платно', 'https://plastinfo.ru/'],
    ['Таможенная статистика', 'Customs statistics', 'средние цены импорта по странам и кодам ТН ВЭД', 'average import prices by country and tariff code', 'открытые данные / аналитика', 'https://www.indexbox.io/'],
  ];

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqLd)}}/>
    <PageIntro lang={lang} kicker={tx(lang, 'ЦЕНЫ И РЫНОК', 'PRICES & MARKET')} title={tx(lang, 'Цены на ПВХ и кальцинированную соду: рынок Китая и стоимость поставки', 'PVC and soda ash prices: the Chinese market and delivered cost')} intro={tx(lang, 'Еженедельный обзор рынка Китая — крупнейшего производителя обоих продуктов — и калькулятор стоимости поставки в Казахстан и другие страны региона.', 'A weekly review of the Chinese market — the largest producer of both products — and a delivered-cost calculator for Kazakhstan and other countries in the region.')}/>
    <section className="container content-section">
      <p className="notice">{tx(lang, 'Информация носит справочный характер и не является коммерческим предложением или инвестиционной рекомендацией. Биржевые котировки не воспроизводятся: в обзоре описаны тенденции со ссылками на источники.', 'For reference only — not a commercial offer or investment advice. Exchange quotes are not reproduced: the review describes trends with links to sources.')}</p>
      <div className="section-heading" style={{marginTop: 40}}><div><p className="eyebrow">{tx(lang, 'ОБЗОР РЫНКА', 'MARKET REVIEW')}</p><h2>{tx(lang, `Неделя от ${dateText(lang, latest.date)}`, `Week of ${dateText(lang, latest.date)}`)}</h2></div>{fx && <p className="fx-box">{tx(lang, 'Курс НБ РК', 'NBK rate')} {fx.date}: <strong>1 USD = {fx.kzt.USD.toLocaleString('ru-RU')} ₸</strong>{fx.kzt.CNY && <> · <strong>1 CNY = {fx.kzt.CNY.toLocaleString('ru-RU')} ₸</strong></>}</p>}</div>
      <div className="market-grid">
        <Card lang={lang} title={tx(lang, 'Смола ПВХ', 'PVC resin')} code="DCE · V" item={latest.pvc}/>
        <Card lang={lang} title={tx(lang, 'Кальцинированная сода', 'Soda ash')} code="CZCE · SA" item={latest.soda}/>
      </div>
      <p className="muted market-sources">{tx(lang, 'Источники: ', 'Sources: ')}{latest.sources.map((s, i) => <span key={s.url}>{i > 0 && ' · '}<a href={s.url} target="_blank" rel="noopener nofollow">{s.title}</a></span>)}</p>

      <h2 className="article-subheading" id="calculator">{tx(lang, 'Калькулятор стоимости поставки', 'Delivered cost calculator')}</h2>
      <p className="muted">{tx(lang, 'Введите цену из предложения, доставку, ставки пошлины и НДС вашей страны — калькулятор покажет стоимость тонны на вашем складе. Ставки можно подставить из справочной таблицы под калькулятором.', 'Enter the offer price, transport and your country’s duty and VAT rates to see the cost per tonne at your warehouse. Rates can be filled from the reference table below the calculator.')}</p>
      <LandedCost lang={lang} fxKzt={fx?.kzt ?? null} fxDate={fx?.date ?? ''}/>

      <h2 className="article-subheading">{tx(lang, 'Как читать биржевую цену', 'How to read the exchange price')}</h2>
      <ul className="article-list">
        <li>{tx(lang, 'Цена фьючерса на бирже Китая — в юанях за тонну, включает НДС 13% и относится к поставке на складе биржи в Китае.', 'Chinese futures prices are in yuan per tonne, include 13% VAT and refer to delivery at an exchange warehouse in China.')}</li>
        <li>{tx(lang, 'Спотовая цена может отличаться от фьючерсной (базис); у ПВХ различаются цены карбидной и этиленовой смолы.', 'Spot can differ from futures (basis); carbide and ethylene PVC are priced differently.')}</li>
        <li>{tx(lang, 'Экспортная цена складывается из внутренней цены без НДС, упаковки, доставки до границы или порта и наценки экспортёра.', 'The export price is built from the domestic price ex-VAT, packaging, transport to border or port and the exporter’s margin.')}</li>
      </ul>
      {guide && <p><a className="text-link" href={path(lang, `blog/${GUIDE_SLUG}`)}>{tx(lang, 'Подробно: как перевести биржевую цену в цену импорта', 'In detail: converting the exchange price into an import price')}</a></p>}

      <h2 className="article-subheading">{tx(lang, 'Где следить за ценами', 'Where to follow prices')}</h2>
      <p className="muted">{tx(lang, 'Международных бирж с контрактами на соду и ПВХ, кроме китайских, нет; в остальном мире ориентиром служат оценки ценовых агентств.', 'Outside China there are no exchange contracts for soda ash or PVC; elsewhere, price-reporting agency assessments are the benchmark.')}</p>
      <div className="article-table-wrap"><table className="article-table"><thead><tr><th>{tx(lang, 'Источник', 'Source')}</th><th>{tx(lang, 'Что показывает', 'What it shows')}</th><th>{tx(lang, 'Доступ', 'Access')}</th></tr></thead><tbody>{refs.map(r => <tr key={r[1]}><th scope="row"><a href={r[5]} target="_blank" rel="noopener nofollow">{tx(lang, r[0], r[1])}</a></th><td>{tx(lang, r[2], r[3])}</td><td>{tx(lang, r[4], r[4] === 'бесплатно на сайте биржи' ? 'free on the exchange website' : r[4] === 'платная подписка' ? 'paid subscription' : r[4] === 'частично платно' ? 'partly paid' : 'open data / analytics')}</td></tr>)}</tbody></table></div>

      {all.length > 1 && <><h2 className="article-subheading">{tx(lang, 'Предыдущие обзоры', 'Previous reviews')}</h2>{all.slice(1).map(rv => <details key={rv.date} className="market-archive"><summary>{tx(lang, `Неделя от ${dateText(lang, rv.date)}`, `Week of ${dateText(lang, rv.date)}`)}</summary><div className="market-grid"><Card lang={lang} title={tx(lang, 'Смола ПВХ', 'PVC resin')} code="DCE · V" item={rv.pvc}/><Card lang={lang} title={tx(lang, 'Кальцинированная сода', 'Soda ash')} code="CZCE · SA" item={rv.soda}/></div></details>)}</>}

      <section className="article-faq"><h2 className="article-subheading">{tx(lang, 'Частые вопросы', 'Frequently asked questions')}</h2>{faq.map(f => <details key={f[0]} open><summary>{tx(lang, f[0], f[2])}</summary><p>{tx(lang, f[1], f[3])}</p></details>)}</section>
    </section>
    <Cta lang={lang}/>
  </>;
}
