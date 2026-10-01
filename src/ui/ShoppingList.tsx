import { MAX_BASKET, products, type ProductId } from "../game/catalog.ts"
import { formatMoney } from "../game/money.ts"
import { useShop } from "../game/store.ts"
import { primaryButton } from "./classes.ts"

const swatch: Record<ProductId, string> = {
  pencil: "#f2c94c",
  eraser: "#f3a0c0",
  notebook: "#4c8dff",
  soap: "#9ad9cb",
  apple: "#ef4d4d",
  bread: "#e7b15a",
  milk: "#f4f1ea",
  water: "#79d2f2",
}

export function CartBar() {
  const basket = useShop((state) => state.basket)
  const cartBump = useShop((state) => state.cartBump)
  const removeAt = useShop((state) => state.removeAt)
  const checkout = useShop((state) => state.checkout)

  return (
    <section className="pointer-events-auto absolute inset-x-3 bottom-3 z-20">
      <div
        key={cartBump}
        className="cart-pop mx-auto flex max-w-5xl items-stretch gap-3 rounded-[28px] border-4 border-[#e7b56a] bg-[#fffaf3]/95 p-3 shadow-2xl"
      >
        <div className="flex w-28 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#ff7a68] text-white">
          <CartMark />
          <p className="text-lg font-black">购物车</p>
          <p className="num text-sm font-extrabold">
            {basket.length}/{MAX_BASKET}
          </p>
        </div>
        <div className="flex min-h-28 flex-1 items-center gap-2 overflow-x-auto">
          {basket.length === 0 ? (
            <p className="px-2 text-lg font-bold text-[#8a6a4a]">购物车还是空的。点货架上的商品，放进身边的购物车。</p>
          ) : (
            basket.map((id, index) => (
              <CartChip key={`${id}-${index}`} id={id} onRemove={() => removeAt(index)} />
            ))
          )}
        </div>
        <button type="button" className={`${primaryButton} w-32 shrink-0`} onClick={checkout} disabled={basket.length === 0}>
          去结账
        </button>
      </div>
      <p className="mt-1 text-center text-sm font-bold text-[#3d5248]">镜头跟着人走。右键拖动转向，滚轮调整远近</p>
    </section>
  )
}

function CartChip({ id, onRemove }: { id: ProductId; onRemove: () => void }) {
  const product = products[id]
  return (
    <button
      type="button"
      onClick={onRemove}
      className="flex h-28 w-36 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl bg-white shadow ring-2 ring-[#f3d7cc]"
    >
      <span className="h-8 w-8 rounded-full border-2 border-white shadow" style={{ background: swatch[id] }} />
      <span className="text-lg font-black leading-none">{product.name}</span>
      <span className="num text-base font-extrabold text-[#e36a55]">{formatMoney(product.priceJiao)}</span>
      <span className="text-xs font-bold text-[#8a6a4a]">拿出</span>
    </button>
  )
}

function CartMark() {
  return (
    <svg viewBox="0 0 64 48" className="h-10 w-12" aria-hidden="true">
      <path d="M6 8h8l6 22h28l6-14H22" fill="none" stroke="white" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="26" cy="40" r="4" fill="white" />
      <circle cx="44" cy="40" r="4" fill="white" />
    </svg>
  )
}
