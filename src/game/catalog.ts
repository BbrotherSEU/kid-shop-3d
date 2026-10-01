export type ProductId =
  | "pencil"
  | "eraser"
  | "notebook"
  | "soap"
  | "apple"
  | "bread"
  | "milk"
  | "water"

export interface Product {
  id: ProductId
  name: string
  priceJiao: number
  slot: 0 | 1 | 2 | 3
  row: 0 | 1
}

export interface Round {
  items: [ProductId, ProductId]
  paidJiao: number
}

export const productList: Product[] = [
  { id: "pencil", name: "铅笔", priceJiao: 5, slot: 0, row: 1 },
  { id: "eraser", name: "橡皮", priceJiao: 8, slot: 1, row: 1 },
  { id: "notebook", name: "练习本", priceJiao: 15, slot: 2, row: 1 },
  { id: "soap", name: "香皂", priceJiao: 6, slot: 3, row: 1 },
  { id: "apple", name: "苹果", priceJiao: 20, slot: 0, row: 0 },
  { id: "bread", name: "面包", priceJiao: 28, slot: 1, row: 0 },
  { id: "milk", name: "牛奶", priceJiao: 35, slot: 2, row: 0 },
  { id: "water", name: "矿泉水", priceJiao: 10, slot: 3, row: 0 },
]

export const products: Record<ProductId, Product> = Object.fromEntries(
  productList.map((product) => [product.id, product]),
) as Record<ProductId, Product>

export const rounds: Round[] = [
  { items: ["pencil", "eraser"], paidJiao: 50 },
  { items: ["notebook", "soap"], paidJiao: 50 },
  { items: ["apple", "bread"], paidJiao: 50 },
  { items: ["milk", "water"], paidJiao: 100 },
]

export function roundPrices(round: Round): [number, number] {
  return [products[round.items[0]].priceJiao, products[round.items[1]].priceJiao]
}

export function roundTotal(round: Round): number {
  const [first, second] = roundPrices(round)
  return first + second
}

export function roundChange(round: Round): number {
  return round.paidJiao - roundTotal(round)
}

export const MAX_BASKET = 4

export function basketPrices(ids: readonly ProductId[]): number[] {
  return ids.map((id) => products[id].priceJiao)
}

export function basketTotal(ids: readonly ProductId[]): number {
  return basketPrices(ids).reduce((sum, price) => sum + price, 0)
}
