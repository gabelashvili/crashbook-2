export function formatCurrency(amount: number, currency = 'GEL', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
