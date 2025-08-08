// utils/getDiscount.ts
export function getDiscount(price: number, discount: number = 0): number {
  if (discount === 0) return price;
  return price - (price * discount) / 100;
}
