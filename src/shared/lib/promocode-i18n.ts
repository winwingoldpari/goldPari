const PROMOCODE_LABELS: Record<string, string> = {
  english: 'PROMOCODE:',
  en: 'PROMOCODE:',
  russian: 'ПРОМОКОД:',
  русский: 'ПРОМОКОД:',
  ru: 'ПРОМОКОД:',
  spanish: 'CÓDIGO PROMO:',
  español: 'CÓDIGO PROMO:',
  espanol: 'CÓDIGO PROMO:',
  es: 'CÓDIGO PROMO:',
  french: 'CODE PROMO:',
  français: 'CODE PROMO:',
  francais: 'CODE PROMO:',
  fr: 'CODE PROMO:',
  german: 'PROMOCODE:',
  deutsch: 'PROMOCODE:',
  de: 'PROMOCODE:',
  portuguese: 'CÓDIGO PROMO:',
  português: 'CÓDIGO PROMO:',
  portugues: 'CÓDIGO PROMO:',
  pt: 'CÓDIGO PROMO:',
  italian: 'CODICE PROMO:',
  italiano: 'CODICE PROMO:',
  it: 'CODICE PROMO:',
  polish: 'KOD PROMO:',
  polski: 'KOD PROMO:',
  pl: 'KOD PROMO:',
  turkish: 'PROMO KODU:',
  türkçe: 'PROMO KODU:',
  turkce: 'PROMO KODU:',
  tr: 'PROMO KODU:',
  ukrainian: 'ПРОМОКОД:',
  українська: 'ПРОМОКОД:',
  ukrainska: 'ПРОМОКОД:',
  uk: 'ПРОМОКОД:',
};

export const getPromocodeLabel = (language?: string | null): string => {
  if (!language) return 'PROMOCODE:';
  const key = language.trim().toLowerCase();
  return PROMOCODE_LABELS[key] ?? 'PROMOCODE:';
};
