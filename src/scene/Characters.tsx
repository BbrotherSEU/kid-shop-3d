import { useRef } from "react"
import { Html, RoundedBox } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { MathUtils, type Group } from "three"
import { useShop } from "../game/store.ts"
import { actor } from "../game/world.ts"
import { sceneMotion } from "./motion.ts"
import { ProductArt } from "./ProductMesh.tsx"

export function Characters() {
  return (
    <>
      <Customer />
      <Cashier />
    </>
  )
}

function Customer() {
  const root = useRef<Group>(null)
  const body = useRef<Group>(null)
  const anchor = useShop((state) => state.customerAnchor)
  const yaw = useShop((state) => state.customerYaw)
  const celebrate = useShop((state) => state.phase === "success")
  const entering = useShop((state) => state.phase === "entering")
  const pace = useShop((state) => state.pace)
  const holding = useShop((state) => state.holding)
  const phase = useShop((state) => state.phase)

  useFrame((state, delta) => {
    const group = root.current
    const inner = body.current
    if (!group || !inner) return
    const rate = pace === "push" ? -1.7 : entering ? -1.35 : -4
    const blend = 1 - Math.exp(rate * delta)
    group.position.x = MathUtils.lerp(group.position.x, anchor[0], blend)
    group.position.z = MathUtils.lerp(group.position.z, anchor[1], blend)
    group.rotation.y = MathUtils.lerp(group.rotation.y, yaw, blend)
    sceneMotion.customerX = group.position.x
    sceneMotion.customerZ = group.position.z
    sceneMotion.customerYaw = group.rotation.y
    const moving = Math.hypot(group.position.x - anchor[0], group.position.z - anchor[1]) > 0.08
    if (phase === "shopping" && holding && !moving) useShop.getState().stow()
    const hop = celebrate ? Math.abs(Math.sin(state.clock.elapsedTime * 7)) * 0.16 : 0
    const bob = moving
      ? Math.abs(Math.sin(state.clock.elapsedTime * 10)) * 0.06
      : Math.sin(state.clock.elapsedTime * 2) * 0.012
    inner.position.y = hop + bob
  })

  return (
    <group
      ref={root}
      position={[actor.door.x, 0, actor.door.z]}
      rotation={[0, actor.door.yaw, 0]}
    >
      <Shadow />
      {holding ? (
        <group position={[0.2, 0.95, 0.5]} scale={0.48}>
          <ProductArt id={holding} />
        </group>
      ) : null}
      <group ref={body} scale={0.86}>
        <Person shirt="#7ec8ff" pants="#3d4a66" hair="#3a2a22" label="顾客" labelClass="bg-[#3d9cf0]" backpack />
      </group>
    </group>
  )
}

function Cashier() {
  const body = useRef<Group>(null)
  const celebrate = useShop((state) => state.phase === "success")
  const showLabel = useShop((state) => state.phase !== "intro" && state.phase !== "entering")

  useFrame((state) => {
    const inner = body.current
    if (!inner) return
    const hop = celebrate ? Math.abs(Math.sin(state.clock.elapsedTime * 7 + 0.4)) * 0.12 : 0
    inner.position.y = hop + Math.sin(state.clock.elapsedTime * 2 + 1) * 0.012
  })

  return (
    <group position={[actor.cashier.x, 0, actor.cashier.z]} rotation={[0, actor.cashier.yaw, 0]}>
      <Shadow />
      <group ref={body}>
        <Person shirt="#fffaf3" pants="#445066" hair="#5a3825" label="收银员" labelClass="bg-[#ff7a68]" apron cap showLabel={showLabel} />
      </group>
    </group>
  )
}

function Shadow() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
      <circleGeometry args={[0.32, 16]} />
      <meshBasicMaterial color="#000000" transparent opacity={0.12} />
    </mesh>
  )
}

function Person({
  shirt,
  pants,
  hair,
  label,
  labelClass,
  apron = false,
  cap = false,
  backpack = false,
  showLabel = true,
}: {
  shirt: string
  pants: string
  hair: string
  label: string
  labelClass: string
  apron?: boolean
  cap?: boolean
  backpack?: boolean
  showLabel?: boolean
}) {
  return (
    <group>
      <mesh position={[-0.11, 0.24, 0]} castShadow>
        <capsuleGeometry args={[0.07, 0.2, 4, 8]} />
        <meshStandardMaterial color={pants} />
      </mesh>
      <mesh position={[0.11, 0.24, 0]} castShadow>
        <capsuleGeometry args={[0.07, 0.2, 4, 8]} />
        <meshStandardMaterial color={pants} />
      </mesh>
      <mesh position={[-0.11, 0.05, 0.04]} castShadow>
        <boxGeometry args={[0.12, 0.08, 0.18]} />
        <meshStandardMaterial color="#2c3344" />
      </mesh>
      <mesh position={[0.11, 0.05, 0.04]} castShadow>
        <boxGeometry args={[0.12, 0.08, 0.18]} />
        <meshStandardMaterial color="#2c3344" />
      </mesh>
      <RoundedBox args={[0.5, 0.56, 0.32]} radius={0.1} position={[0, 0.78, 0]} smoothness={2} castShadow>
        <meshStandardMaterial color={shirt} roughness={0.6} />
      </RoundedBox>
      {apron ? (
        <mesh position={[0, 0.74, 0.17]} castShadow>
          <boxGeometry args={[0.38, 0.4, 0.04]} />
          <meshStandardMaterial color="#ff7a68" />
        </mesh>
      ) : null}
      {backpack ? (
        <mesh position={[0, 0.82, -0.2]} castShadow>
          <boxGeometry args={[0.28, 0.28, 0.12]} />
          <meshStandardMaterial color="#f2c14e" />
        </mesh>
      ) : null}
      <mesh position={[-0.32, 0.78, 0]} rotation={[0, 0, 0.35]} castShadow>
        <capsuleGeometry args={[0.055, 0.22, 4, 8]} />
        <meshStandardMaterial color="#ffd7c2" />
      </mesh>
      <mesh position={[0.32, 0.78, 0]} rotation={[0, 0, -0.35]} castShadow>
        <capsuleGeometry args={[0.055, 0.22, 4, 8]} />
        <meshStandardMaterial color="#ffd7c2" />
      </mesh>
      <mesh position={[0, 1.22, 0]} castShadow>
        <sphereGeometry args={[0.2, 20, 20]} />
        <meshStandardMaterial color="#ffd7c2" roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.36, -0.02]} scale={[1.05, 0.62, 1.02]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={hair} roughness={0.7} />
      </mesh>
      {cap ? (
        <mesh position={[0, 1.4, 0.02]} castShadow>
          <cylinderGeometry args={[0.21, 0.21, 0.08, 14]} />
          <meshStandardMaterial color="#ff7a68" />
        </mesh>
      ) : null}
      <mesh position={[-0.07, 1.26, 0.17]}>
        <sphereGeometry args={[0.028, 10, 10]} />
        <meshStandardMaterial color="#24312c" />
      </mesh>
      <mesh position={[0.07, 1.26, 0.17]}>
        <sphereGeometry args={[0.028, 10, 10]} />
        <meshStandardMaterial color="#24312c" />
      </mesh>
      <mesh position={[-0.12, 1.18, 0.16]} scale={[1, 0.6, 0.4]}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <meshStandardMaterial color="#ffb3a7" />
      </mesh>
      <mesh position={[0.12, 1.18, 0.16]} scale={[1, 0.6, 0.4]}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <meshStandardMaterial color="#ffb3a7" />
      </mesh>
      {showLabel ? (
        <Html occlude position={[0, 1.78, 0]} center distanceFactor={6} zIndexRange={[20, 0]} pointerEvents="none">
          <div className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-black text-white shadow ${labelClass}`}>{label}</div>
        </Html>
      ) : null}
    </group>
  )
}
