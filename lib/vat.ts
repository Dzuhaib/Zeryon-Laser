export const VAT_RATE = 0.2;

export function calculateVat(subtotal: number) {
  return Math.round(subtotal * VAT_RATE * 100) / 100;
}

export function calculateTotalWithVat(subtotal: number) {
  return Math.round((subtotal + calculateVat(subtotal)) * 100) / 100;
}
