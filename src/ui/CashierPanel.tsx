import { basketTotal, products } from "../game/catalog.ts"
import { coinCatalog, formatMoney, sumCoins, tenderJiao, type CoinId } from "../game/money.ts"
import { useShop } from "../game/store.ts"
import { primaryButton, quietButton } from "./classes.ts"

const coinOrder: CoinId[] = ["yuan1", "jiao5", "jiao1"]

export function CashierPanel() {
  const phase = useShop((state) => state.phase)
  const basket = useShop((state) => state.basket)
  const yuanAdded = useShop((state) => state.yuanAdded)
  const jiaoAdded = useShop((state) => state.jiaoAdded)
  const coins = useShop((state) => state.coins)
  const changeYuan = useShop((state) => state.changeYuan)
  const changeJiao = useShop((state) => state.changeJiao)
  const changeSource = useShop((state) => state.changeSource)
  const hint = useShop((state) => state.hint)
  const addYuan = useShop((state) => state.addYuan)
  const addJiao = useShop((state) => state.addJiao)
  const subYuan = useShop((state) => state.subYuan)
  const subJiao = useShop((state) => state.subJiao)
  const setYuan = useShop((state) => state.setYuan)
  const setJiao = useShop((state) => state.setJiao)
  const clearTotal = useShop((state) => state.clearTotal)
  const submitTotal = useShop((state) => state.submitTotal)
  const addCoin = useShop((state) => state.addCoin)
  const removeCoin = useShop((state) => state.removeCoin)
  const clearCoins = useShop((state) => state.clearCoins)
  const setChangeYuan = useShop((state) => state.setChangeYuan)
  const setChangeJiao = useShop((state) => state.setChangeJiao)
  const submitChange = useShop((state) => state.submitChange)

  const total = basketTotal(basket)
  const built = yuanAdded * 10 + jiaoAdded
  const paid = tenderJiao(total)
  const typedChange = changeYuan * 10 + changeJiao
  const shownChange = changeSource === "typed" ? typedChange : sumCoins(coins)

  return (
    <footer className="max-h-[46vh] shrink-0 overflow-auto border-t-4 border-[#e7b56a] bg-[#fffaf3] shadow-[0_-10px_30px_rgba(80,50,20,0.08)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3">
        {hint ? (
          <p
            key={hint}
            role="status"
            className="nudge rounded-full bg-[#fff1ee] px-4 py-2 text-center text-lg font-black text-[#d3543c]"
          >
            {hint}
          </p>
        ) : null}
        {phase === "total" ? (
          <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_24rem]">
            <div>
              <h2 className="text-lg font-black text-[#3f8f6b]">算出总价</h2>
              {basket.map((id, index) => (
                <PriceLine
                  key={`${id}-${index}`}
                  name={products[id].name}
                  amount={formatMoney(products[id].priceJiao)}
                />
              ))}
              <div className="mt-1 flex items-end justify-between border-t-2 border-dashed border-[#f0d3c4] pt-2">
                <span className="text-xl font-black">总价</span>
                <span className="num text-4xl font-extrabold text-[#e36a55]">{formatMoney(built)}</span>
              </div>
              <p className="mt-1 text-sm font-bold text-[#5d8f78]">
                {yuanAdded} 个1元，{jiaoAdded} 个1角
                {jiaoAdded >= 10 ? "。10角就是1元" : ""}
              </p>
              <AmountInputs yuan={yuanAdded} jiao={jiaoAdded} onYuan={setYuan} onJiao={setJiao} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className={quietButton} onClick={addYuan}>
                加1元
              </button>
              <button type="button" className={quietButton} onClick={addJiao}>
                加1角
              </button>
              <button type="button" className={quietButton} onClick={subYuan} disabled={yuanAdded === 0}>
                减1元
              </button>
              <button type="button" className={quietButton} onClick={subJiao} disabled={jiaoAdded === 0}>
                减1角
              </button>
              <button type="button" className={quietButton} onClick={clearTotal}>
                清空
              </button>
              <button type="button" className={primaryButton} onClick={submitTotal}>
                确定
              </button>
            </div>
          </div>
        ) : (
          <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_24rem]">
            <div>
              <h2 className="text-lg font-black text-[#c45c4a]">找回零钱</h2>
              <PriceLine name="顾客付了" amount={formatMoney(paid)} />
              <PriceLine name="减去总价" amount={formatMoney(total)} />
              <div className="mt-1 flex items-end justify-between border-t-2 border-dashed border-[#f0d3c4] pt-2">
                <span className="text-xl font-black">找回</span>
                <span className="num text-4xl font-extrabold text-[#e36a55]">{formatMoney(shownChange)}</span>
              </div>
              <AmountInputs yuan={changeYuan} jiao={changeJiao} onYuan={setChangeYuan} onJiao={setChangeJiao} />
              <div className="mt-2 flex min-h-16 flex-wrap gap-2">
                {coins.length === 0 ? (
                  <p className="text-sm font-bold text-[#5d8f78]">写元和角，或点钱币放入</p>
                ) : (
                  coins.map((coin) => (
                    <button
                      key={coin.id}
                      type="button"
                      className={`num min-h-16 min-w-16 rounded-full px-3 text-lg font-black shadow ${coinCatalog[coin.kind].className}`}
                      onClick={() => removeCoin(coin.id)}
                    >
                      {coinCatalog[coin.kind].label}
                    </button>
                  ))
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {coinOrder.map((kind) => (
                <button
                  key={kind}
                  type="button"
                  className={`num min-h-16 rounded-full text-xl font-black shadow ${coinCatalog[kind].className}`}
                  onClick={() => addCoin(kind)}
                >
                  {coinCatalog[kind].label}
                </button>
              ))}
              <button type="button" className={quietButton} onClick={clearCoins}>
                清空
              </button>
              <button type="button" className={primaryButton} onClick={submitChange}>
                确定找零
              </button>
            </div>
          </div>
        )}
        <p className="text-center text-sm font-bold text-[#8a6a4a]">1元 = 10角</p>
      </div>
    </footer>
  )
}

function AmountInputs({
  yuan,
  jiao,
  onYuan,
  onJiao,
}: {
  yuan: number
  jiao: number
  onYuan: (value: number) => void
  onJiao: (value: number) => void
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <span className="text-sm font-bold text-[#8a6a4a]">直接写</span>
      <CountField label="元" value={yuan} max={20} onChange={onYuan} />
      <CountField label="角" value={jiao} max={40} onChange={onJiao} />
    </div>
  )
}

function CountField({
  label,
  value,
  max,
  onChange,
}: {
  label: string
  value: number
  max: number
  onChange: (value: number) => void
}) {
  return (
    <label className="flex items-center gap-1 text-lg font-black">
      <input
        inputMode="numeric"
        aria-label={label}
        className="num h-16 w-20 rounded-2xl border-2 border-[#f3d7cc] bg-white text-center text-3xl font-extrabold text-[#24312c]"
        value={value}
        onChange={(event) => {
          const digits = event.target.value.replace(/\D/g, "").slice(0, 2)
          onChange(digits === "" ? 0 : Math.min(max, Number(digits)))
        }}
      />
      {label}
    </label>
  )
}

function PriceLine({ name, amount }: { name: string; amount: string }) {
  return (
    <div className="flex items-center justify-between py-0.5 text-xl font-black">
      <span>{name}</span>
      <span className="num">{amount}</span>
    </div>
  )
}
