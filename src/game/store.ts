import { create } from "zustand"
import { basketPrices, basketTotal, MAX_BASKET, products, type ProductId } from "./catalog.ts"
import {
  changeHint,
  mistakeCopy,
  sumCoins,
  tenderJiao,
  totalHint,
  type CoinId,
  type PlacedCoin,
} from "./money.ts"
import { actor, shelfPosition } from "./world.ts"

export type Phase = "intro" | "entering" | "shopping" | "total" | "change" | "success"

type PaySource = "coins" | "typed"
type Pace = "walk" | "push"

interface PlayFields {
  basket: ProductId[]
  holding: ProductId | null
  pace: Pace
  cartBump: number
  yuanAdded: number
  jiaoAdded: number
  coins: PlacedCoin[]
  changeYuan: number
  changeJiao: number
  changeSource: PaySource
  hint: string | null
  message: string | null
  customerAnchor: [number, number]
  customerYaw: number
}

interface ShopState extends PlayFields {
  visit: number
  phase: Phase
  begin: () => void
  pick: (id: ProductId) => void
  stow: () => void
  removeAt: (index: number) => void
  checkout: () => void
  addYuan: () => void
  addJiao: () => void
  subYuan: () => void
  subJiao: () => void
  setYuan: (value: number) => void
  setJiao: (value: number) => void
  clearTotal: () => void
  submitTotal: () => void
  addCoin: (kind: CoinId) => void
  removeCoin: (id: number) => void
  clearCoins: () => void
  setChangeYuan: (value: number) => void
  setChangeJiao: (value: number) => void
  submitChange: () => void
  replay: () => void
}

const MAX_YUAN = 20
const MAX_JIAO = 40
const MAX_SAME = 2
const MAX_COINS = 12

let coinSeq = 1
let stepTimer = 0

function emptyPlay(): PlayFields {
  return {
    basket: [],
    holding: null,
    pace: "walk",
    cartBump: 0,
    yuanAdded: 0,
    jiaoAdded: 0,
    coins: [],
    changeYuan: 0,
    changeJiao: 0,
    changeSource: "coins",
    hint: null,
    message: null,
    customerAnchor: [actor.door.x, actor.door.z],
    customerYaw: actor.door.yaw,
  }
}

function clearStepTimer() {
  window.clearTimeout(stepTimer)
}

function clampCount(value: number, max: number) {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(max, Math.floor(value)))
}

export const useShop = create<ShopState>((set, get) => ({
  visit: 1,
  phase: "intro",
  ...emptyPlay(),

  begin: () => {
    clearStepTimer()
    set({
      ...emptyPlay(),
      phase: "entering",
      message: "把门打开，走进去",
      customerAnchor: [0, actor.door.z - 1.7],
      customerYaw: Math.PI,
      pace: "walk",
    })
    stepTimer = window.setTimeout(() => {
      if (get().phase !== "entering") return
      set({
        customerAnchor: [actor.customerStart.x, actor.customerStart.z],
        customerYaw: actor.customerStart.yaw,
        message: "推着购物车走进小卖部",
        pace: "push",
      })
      stepTimer = window.setTimeout(() => {
        if (get().phase !== "entering") return
        set({
          phase: "shopping",
          hint: null,
          pace: "walk",
          message: "点货架上的商品，放进购物车",
        })
      }, 2600)
    }, 1600)
  },

  pick: (id) => {
    const state = get()
    if (state.phase !== "shopping") return
    if (state.holding) {
      set({ hint: "先把手里的放进购物车" })
      return
    }
    if (state.basket.length >= MAX_BASKET) {
      set({ hint: "购物车满了，去结账吧" })
      return
    }
    const same = state.basket.filter((item) => item === id).length
    if (same >= MAX_SAME) {
      set({ hint: "同样的先买两件吧" })
      return
    }

    const product = products[id]
    const from = shelfPosition(product.slot, product.row)
    const stand = actor.standInFront(from[0])
    set({
      holding: id,
      hint: null,
      pace: "push",
      message: "推着购物车过去，放进车里",
      customerAnchor: [stand.x, stand.z],
      customerYaw: stand.yaw,
    })
  },

  stow: () => {
    const state = get()
    if (state.phase !== "shopping" || !state.holding) return
    set({
      basket: [...state.basket, state.holding],
      holding: null,
      cartBump: state.cartBump + 1,
      pace: "walk",
      hint: null,
      message: "放进购物车了。还可以再选，或去结账",
    })
  },

  removeAt: (index) => {
    const state = get()
    if (state.phase !== "shopping") return
    if (index < 0 || index >= state.basket.length) return
    const basket = state.basket.filter((_, itemIndex) => itemIndex !== index)
    set({
      basket,
      hint: null,
      message: basket.length === 0 ? "点货架上的商品，放进购物车" : "还可以再选，或去结账",
    })
  },

  checkout: () => {
    const state = get()
    if (state.phase !== "shopping") return
    if (state.holding) {
      set({ hint: "先把手里的放进购物车" })
      return
    }
    if (state.basket.length === 0) {
      set({ hint: "先选一件商品" })
      return
    }
    clearStepTimer()
    set({
      hint: null,
      pace: "push",
      message: "推着购物车去收银台",
      customerAnchor: [actor.checkout.x, actor.checkout.z],
      customerYaw: actor.checkout.yaw,
    })
    const visit = state.visit
    stepTimer = window.setTimeout(() => {
      const latest = get()
      if (latest.phase !== "shopping" || latest.visit !== visit) return
      set({
        phase: "total",
        hint: null,
        message: "现在你是收银员，请算出总价",
        yuanAdded: 0,
        jiaoAdded: 0,
        coins: [],
        changeYuan: 0,
        changeJiao: 0,
        changeSource: "coins",
      })
    }, 2400)
  },

  addYuan: () => set((state) => ({ yuanAdded: Math.min(MAX_YUAN, state.yuanAdded + 1), hint: null })),
  addJiao: () => set((state) => ({ jiaoAdded: Math.min(MAX_JIAO, state.jiaoAdded + 1), hint: null })),
  subYuan: () => set((state) => ({ yuanAdded: Math.max(0, state.yuanAdded - 1), hint: null })),
  subJiao: () => set((state) => ({ jiaoAdded: Math.max(0, state.jiaoAdded - 1), hint: null })),
  setYuan: (value) => set({ yuanAdded: clampCount(value, MAX_YUAN), hint: null }),
  setJiao: (value) => set({ jiaoAdded: clampCount(value, MAX_JIAO), hint: null }),
  clearTotal: () => set({ yuanAdded: 0, jiaoAdded: 0, hint: null }),

  submitTotal: () => {
    const state = get()
    if (state.phase !== "total") return
    const prices = basketPrices(state.basket)
    const result = totalHint(state.yuanAdded * 10 + state.jiaoAdded, prices)
    if (result === "ok") {
      const due = tenderJiao(basketTotal(state.basket)) - basketTotal(state.basket)
      set({
        phase: "change",
        hint: null,
        coins: [],
        changeYuan: 0,
        changeJiao: 0,
        changeSource: "coins",
        message: due === 0 ? "刚好付好，不用找零" : "请用 1元、5角、1角 找零，或直接写元和角",
      })
      return
    }
    set({ hint: mistakeCopy(result, "total") })
  },

  addCoin: (kind) => {
    const state = get()
    if (state.phase !== "change") return
    if (state.changeSource === "typed") {
      set({ coins: [], changeYuan: 0, changeJiao: 0, changeSource: "coins" })
    }
    const latest = get()
    if (latest.coins.length >= MAX_COINS) {
      set({ hint: "钱放得太多了，先拿掉一点" })
      return
    }
    set({
      coins: [...latest.coins, { id: coinSeq++, kind }],
      changeSource: "coins",
      hint: null,
    })
  },
  removeCoin: (id) =>
    set((state) => ({
      coins: state.coins.filter((coin) => coin.id !== id),
      changeSource: "coins",
      hint: null,
    })),
  clearCoins: () => set({ coins: [], changeYuan: 0, changeJiao: 0, changeSource: "coins", hint: null }),
  setChangeYuan: (value) =>
    set({
      changeYuan: clampCount(value, MAX_YUAN),
      coins: [],
      changeSource: "typed",
      hint: null,
    }),
  setChangeJiao: (value) =>
    set({
      changeJiao: clampCount(value, MAX_JIAO),
      coins: [],
      changeSource: "typed",
      hint: null,
    }),

  submitChange: () => {
    const state = get()
    if (state.phase !== "change") return
    const total = basketTotal(state.basket)
    const due = tenderJiao(total) - total
    const given =
      state.changeSource === "typed" ? state.changeYuan * 10 + state.changeJiao : sumCoins(state.coins)
    const usedYuan = state.changeSource === "typed" ? state.changeYuan > 0 : state.coins.some((coin) => coin.kind === "yuan1")
    const result = changeHint(given, due, usedYuan)
    if (result === "ok") {
      set({ phase: "success", hint: null, message: null })
      return
    }
    set({ hint: mistakeCopy(result, "change") })
  },

  replay: () => {
    clearStepTimer()
    set({
      visit: get().visit + 1,
      phase: "intro",
      ...emptyPlay(),
    })
  },
}))
