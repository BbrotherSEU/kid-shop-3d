/** Amounts are whole jiao so 1 yuan = 10 jiao, with no decimal rounding. */

export type CoinId = "yuan1" | "jiao5" | "jiao1"

export const coinCatalog: Record<CoinId, { label: string; value: number; className: string }> = {
  yuan1: { label: "1元", value: 10, className: "bg-[#f2c14e] text-[#6d5010]" },
  jiao5: { label: "5角", value: 5, className: "bg-[#e4ebf2] text-[#3c4d5e]" },
  jiao1: { label: "1角", value: 1, className: "bg-[#f0b48a] text-[#6a3e22]" },
}

export interface PlacedCoin {
  id: number
  kind: CoinId
}

export type Mistake = "carry" | "retry"

export function formatMoney(jiao: number): string {
  const amount = Math.max(0, Math.round(jiao))
  const yuan = Math.floor(amount / 10)
  const rest = amount % 10
  if (yuan === 0 && rest === 0) return "0元"
  if (yuan === 0) return `${rest}角`
  if (rest === 0) return `${yuan}元`
  return `${yuan}元${rest}角`
}

export function sumCoins(list: PlacedCoin[]): number {
  return list.reduce((total, coin) => total + coinCatalog[coin.kind].value, 0)
}

export function totalHint(inputJiao: number, prices: readonly number[]): "ok" | Mistake {
  const correct = prices.reduce((sum, price) => sum + price, 0)
  if (inputJiao === correct) return "ok"
  const jiaoParts = prices.reduce((sum, price) => sum + (price % 10), 0)
  const yuanParts = prices.reduce((sum, price) => sum + Math.floor(price / 10), 0)
  if (jiaoParts >= 10 && inputJiao === yuanParts * 10 + (jiaoParts % 10)) return "carry"
  return "retry"
}

/** Customer pays the next whole 5 yuan, so change stays easy to count. */
export function tenderJiao(totalJiao: number): number {
  const step = 50
  if (totalJiao <= 0) return step
  return Math.ceil(totalJiao / step) * step
}

export function changeHint(givenJiao: number, dueJiao: number, usedYuan: boolean): "ok" | Mistake {
  if (givenJiao === dueJiao) return "ok"
  if (dueJiao > 0 && dueJiao < 10 && usedYuan) return "carry"
  return "retry"
}

export function mistakeCopy(kind: Mistake, step: "total" | "change"): string {
  if (kind === "carry") return "1元等于10角"
  return step === "total" ? "再看一看价签" : "再算一算要找的钱"
}
