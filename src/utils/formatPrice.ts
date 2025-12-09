export function formatMoney(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatUnitPrice(price: number, unit = "each"): string {
  return `${formatMoney(price)} / ${unit}`;
}
