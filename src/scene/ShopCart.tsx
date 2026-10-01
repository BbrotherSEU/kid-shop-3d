import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { MathUtils, type Group } from "three"
import type { ProductId } from "../game/catalog.ts"
import { useShop } from "../game/store.ts"
import { actor, cartTarget } from "../game/world.ts"
import { sceneMotion } from "./motion.ts"
import { ProductArt } from "./ProductMesh.tsx"

const slots = [
  [-0.16, 0.12],
  [0.14, 0.12],
  [-0.16, -0.08],
  [0.14, -0.08],
] as const

const parked = cartTarget(actor.door.x, actor.door.z, actor.door.yaw, false)

export function ShopCart() {
  const root = useRef<Group>(null)
  const basket = useShop((state) => state.basket)
  const phase = useShop((state) => state.phase)
  const freshIndex = useRef(-1)
  const seen = useRef(0)
  if (basket.length > seen.current) {
    freshIndex.current = basket.length - 1
    seen.current = basket.length
  } else if (basket.length < seen.current) {
    freshIndex.current = -1
    seen.current = basket.length
  }

  useFrame((_, delta) => {
    const group = root.current
    if (!group) return
    const pushing = phase !== "intro"
    const target = cartTarget(sceneMotion.customerX, sceneMotion.customerZ, sceneMotion.customerYaw, pushing)
    const blend = 1 - Math.exp(-8 * delta)
    group.position.x = MathUtils.lerp(group.position.x, target.x, blend)
    group.position.z = MathUtils.lerp(group.position.z, target.z, blend)
    group.rotation.y = MathUtils.lerp(group.rotation.y, target.yaw, blend)
  })

  return (
    <group ref={root} position={[parked.x, 0, parked.z]} rotation={[0, parked.yaw, 0]}>
      <mesh position={[0, 0.16, 0]} castShadow>
        <boxGeometry args={[0.62, 0.08, 0.48]} />
        <meshStandardMaterial color="#c9844a" />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.68, 0.42, 0.52]} />
        <meshStandardMaterial color="#f2c14e" transparent opacity={0.35} roughness={0.35} />
      </mesh>
      {[
        [-0.24, 0.1, 0.18],
        [0.24, 0.1, 0.18],
        [-0.24, 0.1, -0.18],
        [0.24, 0.1, -0.18],
      ].map((position) => (
        <mesh key={position.join(",")} position={position as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.07, 0.02, 8, 14]} />
          <meshStandardMaterial color="#445066" />
        </mesh>
      ))}
      <mesh position={[0, 0.58, -0.32]} rotation={[0.55, 0, 0]} castShadow>
        <boxGeometry args={[0.04, 0.46, 0.04]} />
        <meshStandardMaterial color="#d7a07a" />
      </mesh>
      <mesh position={[0, 0.78, -0.48]} castShadow>
        <boxGeometry args={[0.36, 0.045, 0.06]} />
        <meshStandardMaterial color="#d7a07a" />
      </mesh>
      {basket.map((id, index) => (
        <CartItem key={`${id}-${index}`} id={id} index={index} drop={index === freshIndex.current} />
      ))}
    </group>
  )
}

function CartItem({ id, index, drop }: { id: ProductId; index: number; drop: boolean }) {
  const ref = useRef<Group>(null)
  const slot = slots[index] ?? slots[0]
  const born = useRef<number | null>(null)

  useFrame((state) => {
    const group = ref.current
    if (!group) return
    if (!drop) {
      group.position.y = 0.46
      return
    }
    if (born.current === null) born.current = state.clock.elapsedTime
    const t = Math.min(1, (state.clock.elapsedTime - born.current) / 0.38)
    const ease = 1 - (1 - t) ** 3
    group.position.y = 0.95 + (0.46 - 0.95) * ease
  })

  return (
    <group ref={ref} position={[slot[0], drop ? 0.95 : 0.46, slot[1]]} scale={0.42}>
      <ProductArt id={id} />
    </group>
  )
}
