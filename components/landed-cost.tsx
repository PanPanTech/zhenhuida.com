'use client';
import {useMemo, useState} from 'react';
import {tx, path, type Lang} from '@/lib/catalog';
import {tariffs, tariffsChecked, type TariffRow} from '@/lib/tariffs';

// Landed cost calculator: the user enters every price, rate and tariff; nothing is preset as a quote.
// Customs value = goods price + transport/insurance to the customs border; import VAT base = customs value + duty.
type Props = {lang: Lang; fxKzt: Record<string, number> | null; fxDate: string};
type Currency = {code: string; label: string; perUsd: number | null};

const num = (v: string) => { const n = parseFloat(v.replace(',', '.').replace(/\s/g, '')); return Number.isFinite(n) ? n : 0; };
const fmt = (n: number, d = 0) => n.toLocaleString('ru-RU', {minimumFractionDigits: d, maximumFractionDigits: d});

export function LandedCost({lang, fxKzt, fxDate}: Props) {
  const usdKzt = fxKzt?.USD ?? null;
  const cross = (code: string) => (usdKzt && fxKzt?.[code] ? usdKzt / fxKzt[code] : null);
  const currencies: Currency[] = [
    {code: 'KZT', label: tx(lang, 'тенге (KZT)', 'tenge (KZT)'), perUsd: usdKzt},
    {code: 'RUB', label: tx(lang, 'рубли (RUB)', 'roubles (RUB)'), perUsd: cross('RUB')},
    {code: 'KGS', label: tx(lang, 'сомы (KGS)', 'som (KGS)'), perUsd: cross('KGS')},
    {code: 'UZS', label: tx(lang, 'сумы (UZS)', 'sum (UZS)'), perUsd: cross('UZS')},
    {code: 'CNY', label: tx(lang, 'юани (CNY)', 'yuan (CNY)'), perUsd: cross('CNY')},
    {code: 'USD', label: tx(lang, 'только доллары', 'US dollars only'), perUsd: 1},
  ];
  const [v, setV] = useState({product: 'pvc', qty: '26', price: '', freight: '', duty: '', vat: '', inland: '', other: '', currency: 'KZT', rate: usdKzt ? String(Math.round(usdKzt * 100) / 100) : ''});
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setV(x => ({...x, [k]: e.target.value}));
  const pickCurrency = (code: string) => {
    const c = currencies.find(x => x.code === code)!;
    setV(x => ({...x, currency: code, rate: c.perUsd ? String(Math.round(c.perUsd * 100) / 100) : ''}));
  };

  const applyRates = (t: TariffRow) => {
    const duty = v.product === 'soda' ? t.sodaDuty : v.product === 'pvc' ? t.pvcDuty : null;
    setV(x => ({...x, vat: String(t.vat), duty: duty === null ? x.duty : String(duty)}));
  };
  const pct = (n: number | null) => (n === null ? tx(lang, 'уточняйте', 'check locally') : `${String(n).replace('.', ',')}%`);

  const r = useMemo(() => {
    const qty = Math.max(num(v.qty), 0), price = num(v.price), freight = num(v.freight), dutyPct = num(v.duty), vatPct = num(v.vat), inland = num(v.inland), other = num(v.other);
    const cv = price + freight, duty = cv * dutyPct / 100, vat = (cv + duty) * vatPct / 100, otherPerT = qty ? other / qty : 0;
    const total = cv + duty + vat + inland + otherPerT;
    return {qty, cv, duty, vat, inland, otherPerT, total, totalNoVat: total - vat, ready: price > 0 && qty > 0};
  }, [v]);
  const rate = v.currency === 'USD' ? 1 : num(v.rate);
  const local = (usd: number) => (rate > 0 && v.currency !== 'USD' ? `${fmt(usd * rate)} ${v.currency}` : '');
  const rows: [string, number][] = [
    [tx(lang, 'Таможенная стоимость (товар + доставка до границы)', 'Customs value (goods + transport to border)'), r.cv],
    [tx(lang, 'Ввозная пошлина', 'Import duty'), r.duty],
    [tx(lang, 'НДС при импорте', 'Import VAT'), r.vat],
    [tx(lang, 'Доставка от границы до склада', 'Delivery from border to warehouse'), r.inland],
    [tx(lang, 'Прочие расходы (на тонну)', 'Other costs (per tonne)'), r.otherPerT],
  ];
  const field = (k: keyof typeof v, label: string, hint: string, suffix: string) => (
    <div className="calc-field"><label htmlFor={`calc-${k}`}>{label}</label><div className="calc-input"><input id={`calc-${k}`} inputMode="decimal" value={v[k]} onChange={set(k)} placeholder="0"/><span>{suffix}</span></div><small>{hint}</small></div>
  );

  return <><div className="calc">
    <div className="calc-form">
      <div className="calc-field"><label htmlFor="calc-product">{tx(lang, 'Продукт', 'Product')}</label><select id="calc-product" value={v.product} onChange={set('product')}><option value="pvc">{tx(lang, 'Смола ПВХ', 'PVC resin')}</option><option value="soda">{tx(lang, 'Кальцинированная сода', 'Soda ash')}</option><option value="other">{tx(lang, 'Другой продукт', 'Other product')}</option></select></div>
      {field('qty', tx(lang, 'Количество', 'Quantity'), tx(lang, 'Например, 26 т ПВХ в 40-футовом контейнере', 'E.g. 26 t of PVC in a 40-ft container'), tx(lang, 'т', 't'))}
      {field('price', tx(lang, 'Цена товара', 'Goods price'), tx(lang, 'Цена из предложения, например FCA Китай', 'Price from the offer, e.g. FCA China'), 'USD/т')}
      {field('freight', tx(lang, 'Доставка до границы и страхование', 'Transport to border and insurance'), tx(lang, 'Входит в таможенную стоимость', 'Included in the customs value'), 'USD/т')}
      {field('duty', tx(lang, 'Ставка ввозной пошлины', 'Import duty rate'), tx(lang, 'Проверьте по коду ТН ВЭД вашей страны — см. справку ниже', 'Check by your country’s tariff code — see reference below'), '%')}
      {field('vat', tx(lang, 'Ставка НДС при импорте', 'Import VAT rate'), tx(lang, 'Базой служит таможенная стоимость плюс пошлина', 'Base is customs value plus duty'), '%')}
      {field('inland', tx(lang, 'Доставка от границы до склада', 'Delivery from border to warehouse'), tx(lang, 'Не входит в базу для пошлины и НДС', 'Not part of the duty or VAT base'), 'USD/т')}
      {field('other', tx(lang, 'Прочие расходы на партию', 'Other costs per lot'), tx(lang, 'Брокер, таможенные сборы, склад временного хранения, банк', 'Broker, customs fees, temporary storage, bank'), 'USD')}
      <div className="calc-field"><label htmlFor="calc-currency">{tx(lang, 'Показать в валюте', 'Show in currency')}</label><div className="calc-currency"><select id="calc-currency" value={v.currency} onChange={e => pickCurrency(e.target.value)}>{currencies.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}</select>{v.currency !== 'USD' && <div className="calc-input"><span>1 USD =</span><input aria-label={tx(lang, 'Курс', 'Rate')} inputMode="decimal" value={v.rate} onChange={set('rate')} placeholder={tx(lang, 'курс', 'rate')}/><span>{v.currency}</span></div>}</div><small>{fxDate ? tx(lang, `Курс подставлен по данным Национального банка РК на ${fxDate} (для других валют — кросс-курс); можно изменить.`, `Rate prefilled from the National Bank of Kazakhstan for ${fxDate} (cross rate for other currencies); editable.`) : tx(lang, 'Введите курс вручную.', 'Enter the rate manually.')}</small></div>
    </div>
    <div className="calc-result" aria-live="polite">
      <p className="eyebrow">{tx(lang, 'Расчёт на 1 тонну', 'Per tonne')}</p>
      <table><tbody>{rows.map(([label, usd]) => <tr key={label}><th scope="row">{label}</th><td>{fmt(usd, 2)} USD<small>{local(usd)}</small></td></tr>)}</tbody></table>
      <div className="calc-total"><span>{tx(lang, 'Стоимость на складе, с НДС', 'Landed cost incl. VAT')}</span><strong>{fmt(r.total, 2)} USD/т</strong><small>{local(r.total)}</small></div>
      <div className="calc-total calc-total-sub"><span>{tx(lang, 'Без НДС (если НДС принимается к зачёту)', 'Excl. VAT (if VAT is recoverable)')}</span><strong>{fmt(r.totalNoVat, 2)} USD/т</strong><small>{local(r.totalNoVat)}</small></div>
      <div className="calc-total calc-total-sub"><span>{tx(lang, `Вся партия (${fmt(r.qty)} т), с НДС`, `Whole lot (${fmt(r.qty)} t), incl. VAT`)}</span><strong>{fmt(r.total * r.qty, 0)} USD</strong><small>{local(r.total * r.qty)}</small></div>
      <p className="calc-note">{tx(lang, 'Оценка для сравнения предложений, а не коммерческое предложение и не таможенный расчёт. Точные платежи определяются по декларации.', 'An estimate for comparing offers — not a quotation or a customs calculation. Exact payments are set by the declaration.')}</p>
      <a className={`button${r.ready ? '' : ' button-light'}`} href={path(lang, `contact?product=${v.product === 'soda' ? 'soda-ash' : v.product === 'pvc' ? 'pvc-resin' : ''}`)}>{tx(lang, 'Запросить цену с доставкой', 'Request a delivered price')}</a>
    </div>
  </div>
  <div className="calc-ref">
    <h3>{tx(lang, 'Справочные ставки для стран русскоязычного региона', 'Reference rates for Russian-speaking countries')}</h3>
    <p className="muted">{tx(lang, `Проверено ${tariffsChecked}. Ставки меняются, а пошлина зависит от точного 10-значного кода и преференций — сверяйте с таможенным брокером. Кнопка «Подставить» заполнит НДС и пошлину для выбранного продукта.`, `Checked ${tariffsChecked}. Rates change, and duty depends on the exact 10-digit code and preferences — verify with a customs broker. "Apply" fills VAT and duty for the selected product.`)}</p>
    <div className="article-table-wrap"><table className="article-table"><thead><tr><th>{tx(lang, 'Страна', 'Country')}</th><th>{tx(lang, 'НДС при импорте', 'Import VAT')}</th><th>{tx(lang, 'Пошлина: сода (2836 20)', 'Duty: soda ash (2836 20)')}</th><th>{tx(lang, 'Пошлина: ПВХ (3904 10)', 'Duty: PVC (3904 10)')}</th><th>{tx(lang, 'Примечание', 'Note')}</th><th></th></tr></thead><tbody>{tariffs.map(t => <tr key={t.country[1]}><th scope="row">{tx(lang, ...t.country)}</th><td>{pct(t.vat)}</td><td>{pct(t.sodaDuty)}</td><td>{pct(t.pvcDuty)}</td><td>{t.note ? tx(lang, ...t.note) : ''}</td><td><button type="button" className="calc-apply" onClick={() => applyRates(t)}>{tx(lang, 'Подставить', 'Apply')}</button></td></tr>)}</tbody></table></div>
    <p className="muted" style={{fontSize: '.82rem'}}>{tx(lang, 'ЕТТ ЕАЭС — единый таможенный тариф Евразийского экономического союза (Казахстан, Россия, Беларусь, Кыргызстан, Армения). Для ПВХ указана ставка для суспензионной смолы (3904 10 000 9); для пастообразующих эмульсионных смол (3904 10 000 1) — 0%.', 'EAEU CCT is the common customs tariff of the Eurasian Economic Union (Kazakhstan, Russia, Belarus, Kyrgyzstan, Armenia). The PVC rate is for suspension resin (3904 10 000 9); paste-forming emulsion resins (3904 10 000 1) are 0%.')}</p>
  </div></>;
}
