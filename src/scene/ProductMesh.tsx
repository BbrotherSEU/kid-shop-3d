import { useEffect, useState } from "react"
import { Html } from "@react-three/drei"
import { type ThreeEvent } from "@react-three/fiber"
import { productList, type ProductId } from "../game/catalog.ts"
import { useShop } from "../game/store.ts"
import { shelfPosition } from "../game/world.ts"
import { PriceTag } from "../ui/PriceTag.tsx"

export function ShelfProducts() {
  return (
    <group>
      {productList.map((product) => (
        <ShelfProduct key={product.id} id={product.id} />
      ))}
    </group>
  )
}

function ShelfProduct({ id }: { id: ProductId }) {
  const product = productList.find((item) => item.id === id)
  const phase = useShop((state) => state.phase)
  const showTag = phase === "shopping" || phase === "total" || phase === "change" || phase === "success"
  const basket = useShop((state) => state.basket)
  const pick = useShop((state) => state.pick)
  const [hovered, setHovered] = useState(false)
  const interactive = phase === "shopping"
  const count = basket.filter((item) => item === id).length

  useEffect(() => {
    if (!interactive) setHovered(false)
  }, [interactive])

  if (!product) return null
  const position = shelfPosition(product.slot, product.row)

  function onClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation()
    if (event.button !== 0) return
    pick(id)
  }

  function onOver(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation()
    if (!interactive) return
    setHovered(true)
    document.body.style.cursor = "pointer"
  }

  function onOut() {
    setHovered(false)
    document.body.style.cursor = "default"
  }

  return (
    <group position={position} scale={hovered ? 1.08 : 1}>
      <ProductArt id={id} />
      <mesh position={[0, 0.42, 0.08]} onClick={onClick} onPointerOver={onOver} onPointerOut={onOut}>
        <boxGeometry args={[1.15, 1.15, 0.7]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {showTag ? (
        <Html key={phase} position={[0, 0.62, 0]} center distanceFactor={8} zIndexRange={[20, 0]} pointerEvents="none">
          <PriceTag name={product.name} priceJiao={product.priceJiao} count={count} />
        </Html>
      ) : null}
    </group>
  )
}

export function ProductArt({ id }: { id: ProductId }) {
  switch (id) {
    case "pencil":
      return <Pencil />
    case "eraser":
      return <Eraser />
    case "notebook":
      return <Notebook />
    case "soap":
      return <Soap />
    case "apple":
      return <Apple />
    case "bread":
      return <Bread />
    case "milk":
      return <Milk />
    case "water":
      return <Water />
  }
}

function Pencil() {
  return (
    <group rotation={[0, 0, 0.08]}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.48, 8]} />
        <meshStandardMaterial color="#f2c94c" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.58, 0]} castShadow>
        <coneGeometry args={[0.07, 0.16, 8]} />
        <meshStandardMaterial color="#f29b86" />
      </mesh>
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.072, 0.072, 0.1, 8]} />
        <meshStandardMaterial color="#f3a6c8" />
      </mesh>
    </group>
  )
}

function Eraser() {
  return (
    <group position={[0, 0.08, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.34, 0.14, 0.18]} />
        <meshStandardMaterial color="#f3a0c0" roughness={0.6} />
      </mesh>
      <mesh position={[0.05, 0, 0]}>
        <boxGeometry args={[0.07, 0.15, 0.19]} />
        <meshStandardMaterial color="#6aa7e8" />
      </mesh>
    </group>
  )
}

function Notebook() {
  return (
    <group position={[0, 0.05, 0]} rotation={[0, 0.25, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.36, 0.07, 0.46]} />
        <meshStandardMaterial color="#4c8dff" roughness={0.55} />
      </mesh>
      <mesh position={[0.02, 0.045, 0]}>
        <boxGeometry args={[0.3, 0.02, 0.4]} />
        <meshStandardMaterial color="#f7f4ea" />
      </mesh>
    </group>
  )
}

function Soap() {
  return (
    <group position={[0, 0.07, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.32, 0.12, 0.2]} />
        <meshStandardMaterial color="#d7f3ea" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.16, 0.06, 0.08]} />
        <meshStandardMaterial color="#7dcec0" />
      </mesh>
    </group>
  )
}

function Apple() {
  return (
    <group>
      <mesh position={[0, 0.18, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#ef4d4d" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.1, 6]} />
        <meshStandardMaterial color="#6b4a2b" />
      </mesh>
      <mesh position={[0.07, 0.36, 0]} rotation={[0, 0, -0.8]} scale={[1, 0.45, 0.7]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshStandardMaterial color="#3fa36a" />
      </mesh>
    </group>
  )
}

function Bread() {
  return (
    <group>
      <mesh position={[0, 0.14, 0]} scale={[1.2, 0.75, 0.85]} castShadow>
        <sphereGeometry args={[0.18, 16, 12]} />
        <meshStandardMaterial color="#e7b15a" roughness={0.7} />
      </mesh>
      {[-0.06, 0, 0.06].map((x) => (
        <mesh key={x} position={[x, 0.24, 0.08]} rotation={[0.4, 0, 0.4]}>
          <boxGeometry args={[0.012, 0.08, 0.02]} />
          <meshStandardMaterial color="#c4843a" />
        </mesh>
      ))}
    </group>
  )
}

function Milk() {
  return (
    <group>
      <mesh position={[0, 0.16, 0]} castShadow>
        <boxGeometry args={[0.24, 0.3, 0.24]} />
        <meshStandardMaterial color="#f7f7f4" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.34, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.13, 0.14, 4]} />
        <meshStandardMaterial color="#7eb6f0" />
      </mesh>
      <mesh position={[0, 0.16, 0.122]}>
        <planeGeometry args={[0.12, 0.12]} />
        <meshStandardMaterial color="#7eb6f0" />
      </mesh>
    </group>
  )
}

function Water() {
  return (
    <group>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.1, 0.36, 12]} />
        <meshStandardMaterial color="#79d2f2" transparent opacity={0.82} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.05, 0.08, 10]} />
        <meshStandardMaterial color="#f4f7f8" />
      </mesh>
    </group>
  )
}
