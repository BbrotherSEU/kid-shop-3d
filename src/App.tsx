import { CashierPanel } from "./ui/CashierPanel.tsx"
import { Hud } from "./ui/Hud.tsx"
import { ShopScene } from "./scene/ShopScene.tsx"
import { useShop } from "./game/store.ts"

export default function App() {
  const phase = useShop((state) => state.phase)
  const checkout = phase === "total" || phase === "change"

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#d7f3e6]">
      <div className="relative min-h-0 flex-1">
        <ShopScene />
        <Hud />
      </div>
      {checkout ? <CashierPanel /> : null}
    </div>
  )
}
