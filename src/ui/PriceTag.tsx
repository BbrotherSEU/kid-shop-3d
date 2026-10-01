import { formatMoney } from "../game/money.ts"

export function PriceTag({
  name,
  priceJiao,
  count,
}: {
  name: string
  priceJiao: number
  count: number
}) {
  return (
    <div className="whitespace-nowrap rounded-xl border-2 border-white bg-[#ff7a68] px-2.5 py-1 text-center shadow-md">
      <div className="text-[13px] font-black leading-tight text-white">{name}</div>
      <div className="num text-sm font-extrabold leading-tight text-white">{formatMoney(priceJiao)}</div>
      {count > 0 ? <div className="text-[11px] font-bold leading-tight text-white">×{count}</div> : null}
    </div>
  )
}
