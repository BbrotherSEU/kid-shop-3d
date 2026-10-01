import { useEffect } from "react"
import { basketTotal, products } from "../game/catalog.ts"
import { formatMoney, tenderJiao } from "../game/money.ts"
import { useShop } from "../game/store.ts"
import { primaryButton } from "./classes.ts"
import { CartBar } from "./ShoppingList.tsx"

export function Hud() {
  const phase = useShop((state) => state.phase)

  useEffect(() => {
    document.body.style.cursor = "default"
  }, [phase])

  const showTop = phase === "entering" || phase === "shopping" || phase === "total" || phase === "change" || phase === "success"

  return (
    <div className="pointer-events-none absolute inset-0">
      {showTop ? (
        <div className="absolute inset-x-0 top-3 z-10 flex flex-col items-center gap-2 px-3">
          <RolePill />
          {phase === "entering" || phase === "shopping" ? <ShopNote /> : null}
        </div>
      ) : null}
      {phase === "shopping" ? <CartBar /> : null}
      {phase === "intro" ? <IntroCard /> : null}
      {phase === "success" ? <SuccessCard /> : null}
    </div>
  )
}

function RolePill() {
  const phase = useShop((state) => state.phase)
  const visit = useShop((state) => state.visit)
  const cashier = phase === "total" || phase === "change" || phase === "success"
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-full bg-white/95 px-4 py-2 text-base font-black text-[#3f8f6b] shadow">
        第 {visit} 次
      </span>
      <span
        className={`rounded-full px-5 py-2 text-xl font-black text-white shadow ${
          cashier ? "bg-[#ff7a68]" : "bg-[#3d9cf0]"
        }`}
      >
        你现在是{cashier ? "收银员" : "顾客"}
      </span>
    </div>
  )
}

function ShopNote() {
  const message = useShop((state) => state.message)
  const hint = useShop((state) => state.hint)
  if (hint) {
    return (
      <p key={hint} role="status" className="nudge rounded-full bg-white px-5 py-2 text-lg font-black text-[#d3543c] shadow">
        {hint}
      </p>
    )
  }
  if (!message) return null
  return <p className="rounded-full bg-white/95 px-5 py-2 text-lg font-bold text-[#2c6b52] shadow">{message}</p>
}

function IntroCard() {
  const visit = useShop((state) => state.visit)

  return (
    <div className="absolute inset-x-0 top-4 z-10 flex justify-center px-3">
      <section className="rounded-full bg-white/95 px-6 py-3 text-center shadow-xl">
        <p className="text-lg font-black text-[#24312c]">第 {visit} 次 · 点一下门上的金色把手</p>
        <p className="text-sm font-bold text-[#3d5248]">门会打开，再推着购物车进去。1元 = 10角</p>
      </section>
    </div>
  )
}

function SuccessCard() {
  const basket = useShop((state) => state.basket)
  const replay = useShop((state) => state.replay)
  const total = basketTotal(basket)
  const paid = tenderJiao(total)
  const change = paid - total

  return (
    <>
      <div className="absolute inset-0 bg-[#1d3b32]/20" />
      <section className="pointer-events-auto absolute left-1/2 top-1/2 w-[min(92vw,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-white p-6 text-center shadow-2xl">
        <h2 className="text-4xl font-black text-[#e36a55]">找对了</h2>
        <ul className="mt-3 space-y-1 text-left">
          {basket.map((id, index) => (
            <li key={`${id}-${index}`} className="flex items-center justify-between text-lg font-bold">
              <span>{products[id].name}</span>
              <span className="num text-[#e36a55]">{formatMoney(products[id].priceJiao)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-lg font-bold">
          一共 {formatMoney(total)}，付 {formatMoney(paid)}，找回 {formatMoney(change)}
        </p>
        <button type="button" className={`${primaryButton} mt-5 w-full`} onClick={replay}>
          再买一次
        </button>
      </section>
    </>
  )
}
