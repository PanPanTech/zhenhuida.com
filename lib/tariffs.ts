// Reference import rates for the landed cost calculator (checked 2026-10-14). Shown as guidance only:
// users enter their own rates, and duty depends on the exact 10-digit tariff code and any preferences.
// Sources: EAEU Common Customs Tariff (2836 20 000 0 soda ash 5%; 3904 10 000 9 suspension PVC 6.5%);
// national VAT: KZ 16% and RU 22% from 1 Jan 2026; TJ 14% applies to non-cash settlements.
export const tariffsChecked = '14.10.2026';

export type TariffRow = {
  country: [string, string];
  vat: number;
  sodaDuty: number | null; // null = national tariff, check locally
  pvcDuty: number | null;
  note?: [string, string];
};

export const tariffs: TariffRow[] = [
  {country: ['Казахстан', 'Kazakhstan'], vat: 16, sodaDuty: 5, pvcDuty: 6.5, note: ['ЕТТ ЕАЭС; по ряду товаров Казахстан применяет ставки, отличные от ЕТТ, — проверьте код', 'EAEU CCT; Kazakhstan applies non-CCT rates to some goods — check the code']},
  {country: ['Россия', 'Russia'], vat: 22, sodaDuty: 5, pvcDuty: 6.5, note: ['ЕТТ ЕАЭС', 'EAEU CCT']},
  {country: ['Беларусь', 'Belarus'], vat: 20, sodaDuty: 5, pvcDuty: 6.5, note: ['ЕТТ ЕАЭС', 'EAEU CCT']},
  {country: ['Кыргызстан', 'Kyrgyzstan'], vat: 12, sodaDuty: 5, pvcDuty: 6.5, note: ['ЕТТ ЕАЭС', 'EAEU CCT']},
  {country: ['Армения', 'Armenia'], vat: 20, sodaDuty: 5, pvcDuty: 6.5, note: ['ЕТТ ЕАЭС', 'EAEU CCT']},
  {country: ['Узбекистан', 'Uzbekistan'], vat: 12, sodaDuty: null, pvcDuty: null, note: ['национальный таможенный тариф', 'national customs tariff']},
  {country: ['Таджикистан', 'Tajikistan'], vat: 14, sodaDuty: null, pvcDuty: null, note: ['НДС 14% — при безналичных расчётах; национальный тариф', '14% VAT for non-cash settlements; national tariff']},
  {country: ['Азербайджан', 'Azerbaijan'], vat: 18, sodaDuty: null, pvcDuty: null, note: ['национальный таможенный тариф', 'national customs tariff']},
];
