import { useEffect, useMemo, useRef } from "react"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import { CanvasTexture, MathUtils, SRGBColorSpace, type Group } from "three"
import { doorway, shelf } from "../game/world.ts"
import { useShop } from "../game/store.ts"
import { sceneMotion } from "./motion.ts"

export function StoreRoom() {
  const sign = useMemo(() => drawSign("小卖部"), [])
  useEffect(() => () => sign.dispose(), [sign])

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.6]} receiveShadow raycast={() => null}>
        <planeGeometry args={[16, 18]} />
        <meshStandardMaterial color="#f6e6c8" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 14.2]} receiveShadow raycast={() => null}>
        <planeGeometry args={[24, 12]} />
        <meshStandardMaterial color="#e4ddd2" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 19.2]} receiveShadow raycast={() => null}>
        <planeGeometry args={[24, 4]} />
        <meshStandardMaterial color="#b7bcc4" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 19.2]} raycast={() => null}>
        <planeGeometry args={[0.18, 3.4]} />
        <meshStandardMaterial color="#f2c14e" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0.35]} receiveShadow>
        <circleGeometry args={[1.55, 24]} />
        <meshStandardMaterial color="#f3b7a6" roughness={0.85} />
      </mesh>

      <mesh position={[0, 2.2, -5.45]} receiveShadow>
        <boxGeometry args={[14.2, 4.4, 0.18]} />
        <meshStandardMaterial color="#b9e6d6" roughness={0.86} />
      </mesh>
      <mesh position={[0, 0.16, -5.32]} receiveShadow>
        <boxGeometry args={[14, 0.28, 0.08]} />
        <meshStandardMaterial color="#f6d7b8" />
      </mesh>
      <mesh position={[-6.95, 2.2, -1.1]} receiveShadow raycast={() => null}>
        <boxGeometry args={[0.18, 4.4, 8.6]} />
        <meshStandardMaterial color="#c7efe0" roughness={0.86} />
      </mesh>
      <mesh position={[6.95, 2.2, -1.1]} receiveShadow raycast={() => null}>
        <boxGeometry args={[0.18, 4.4, 8.6]} />
        <meshStandardMaterial color="#c7efe0" roughness={0.86} />
      </mesh>
      <mesh position={[-6.95, 2.2, 6.25]} receiveShadow raycast={() => null}>
        <boxGeometry args={[0.18, 4.4, 6.1]} />
        <meshStandardMaterial color="#f3efe6" roughness={0.86} />
      </mesh>
      <mesh position={[6.95, 2.2, 6.25]} receiveShadow raycast={() => null}>
        <boxGeometry args={[0.18, 4.4, 6.1]} />
        <meshStandardMaterial color="#f3efe6" roughness={0.86} />
      </mesh>
      <mesh position={[0, 4.42, 2]} raycast={() => null}>
        <boxGeometry args={[14.1, 0.16, 14.6]} />
        <meshStandardMaterial color="#f7f1e6" roughness={0.9} />
      </mesh>

      <mesh position={[-3.15, 2.55, -5.32]}>
        <boxGeometry args={[2.1, 1.35, 0.06]} />
        <meshStandardMaterial color="#d9f4ff" />
      </mesh>
      <mesh position={[-3.15, 2.55, -5.28]}>
        <boxGeometry args={[0.06, 1.35, 0.04]} />
        <meshStandardMaterial color="#fffaf3" />
      </mesh>
      <mesh position={[-3.15, 2.55, -5.28]}>
        <boxGeometry args={[2.1, 0.06, 0.04]} />
        <meshStandardMaterial color="#fffaf3" />
      </mesh>

      <mesh position={[0, 3.25, -5.3]}>
        <planeGeometry args={[2.6, 0.95]} />
        <meshBasicMaterial map={sign} toneMapped={false} />
      </mesh>

      <mesh position={[-5.15, 3.55, -0.6]}>
        <boxGeometry args={[0.08, 0.9, 0.08]} />
        <meshStandardMaterial color="#e7d3b0" />
      </mesh>
      <mesh position={[-5.15, 3.05, -0.6]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#fff4cc" emissive="#ffe08a" emissiveIntensity={0.55} />
      </mesh>

      <Plant position={[-5.7, 0, 1.8]} />
      <Plant position={[6.1, 0, -2.4]} />
      <Plant position={[5.4, 0, 3.2]} />

      <Doorway />
      <ShopDecor />
      <ShelfBack />
    </group>
  )
}

function ShelfBack() {
  const top = shelf.y[1]
  return (
    <mesh position={[0, (top + 0.2) / 2, -3.48]} receiveShadow raycast={() => null}>
      <boxGeometry args={[8.7, top + 0.15, 0.08]} />
      <meshStandardMaterial color="#f8d7a4" roughness={0.8} />
    </mesh>
  )
}

function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.13, 0.28, 10]} />
        <meshStandardMaterial color="#e7a06a" />
      </mesh>
      <mesh position={[0, 0.48, 0]} castShadow>
        <sphereGeometry args={[0.28, 14, 14]} />
        <meshStandardMaterial color="#67b37a" roughness={0.75} />
      </mesh>
    </group>
  )
}

function drawSign(label: string) {
  const canvas = document.createElement("canvas")
  canvas.width = 640
  canvas.height = 240
  const context = canvas.getContext("2d")
  if (!context) throw new Error("无法绘制招牌")
  context.fillStyle = "#ff7a68"
  context.fillRect(0, 0, 640, 240)
  context.fillStyle = "#ffffff"
  context.font = "700 112px 'Microsoft YaHei', 'Noto Sans SC', sans-serif"
  context.textAlign = "center"
  context.textBaseline = "middle"
  context.fillText(label, 320, 126)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

function DoorHandle({ mirror = false }: { mirror?: boolean }) {
  const begin = useShop((state) => state.begin)
  const phase = useShop((state) => state.phase)
  const x = mirror ? -0.78 : 0.78

  function open(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation()
    if (event.button !== 0) return
    if (phase !== "intro") return
    begin()
  }

  function over(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation()
    if (phase !== "intro") return
    document.body.style.cursor = "pointer"
  }

  function out() {
    document.body.style.cursor = "default"
  }

  return (
    <group position={[x, 0, 0.08]} onClick={open} onPointerOver={over} onPointerOut={out}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.12, 10]} />
        <meshStandardMaterial color="#f2c14e" metalness={0.65} roughness={0.22} />
      </mesh>
      <mesh position={[mirror ? -0.1 : 0.1, 0, 0.04]} castShadow>
        <boxGeometry args={[0.2, 0.055, 0.045]} />
        <meshStandardMaterial color="#f2c14e" metalness={0.65} roughness={0.22} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.42, 0.28, 0.16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

function Doorway() {
  const sign = useMemo(() => drawSign("小卖部"), [])
  useEffect(() => () => sign.dispose(), [sign])
  const left = useRef<Group>(null)
  const right = useRef<Group>(null)

  useFrame((_, delta) => {
    const open = sceneMotion.door
    if (left.current) left.current.rotation.y = MathUtils.damp(left.current.rotation.y, -1.35 * open, 2.1, delta)
    if (right.current) right.current.rotation.y = MathUtils.damp(right.current.rotation.y, 1.35 * open, 2.1, delta)
  })

  return (
    <group position={[0, 0, doorway.z]}>
      <mesh position={[-3.95, 2.15, 0]} castShadow receiveShadow raycast={() => null}>
        <boxGeometry args={[6, 4.3, 0.28]} />
        <meshStandardMaterial color="#f4efe6" roughness={0.82} />
      </mesh>
      <mesh position={[3.95, 2.15, 0]} castShadow receiveShadow raycast={() => null}>
        <boxGeometry args={[6, 4.3, 0.28]} />
        <meshStandardMaterial color="#f4efe6" roughness={0.82} />
      </mesh>
      <mesh position={[0, 3.45, 0]} castShadow receiveShadow raycast={() => null}>
        <boxGeometry args={[2.05, 1.7, 0.28]} />
        <meshStandardMaterial color="#f4efe6" roughness={0.82} />
      </mesh>
      <mesh position={[-3.95, 0.28, 0.08]} raycast={() => null}>
        <boxGeometry args={[6, 0.55, 0.32]} />
        <meshStandardMaterial color="#d7a07a" roughness={0.78} />
      </mesh>
      <mesh position={[3.95, 0.28, 0.08]} raycast={() => null}>
        <boxGeometry args={[6, 0.55, 0.32]} />
        <meshStandardMaterial color="#d7a07a" roughness={0.78} />
      </mesh>
      <mesh position={[-2.55, 2.25, 0.2]} raycast={() => null}>
        <boxGeometry args={[1.62, 1.42, 0.06]} />
        <meshStandardMaterial color="#fffaf3" />
      </mesh>
      <mesh position={[-2.55, 2.25, 0.16]} raycast={() => null}>
        <boxGeometry args={[1.35, 1.15, 0.06]} />
        <meshStandardMaterial color="#d7eef8" roughness={0.15} />
      </mesh>
      <mesh position={[-2.55, 2.25, 0.2]} raycast={() => null}>
        <boxGeometry args={[1.5, 0.06, 0.05]} />
        <meshStandardMaterial color="#fffaf3" />
      </mesh>
      <mesh position={[0, 3.05, 0.7]} rotation={[0.42, 0, 0]} raycast={() => null}>
        <boxGeometry args={[3.6, 0.08, 1.25]} />
        <meshStandardMaterial color="#ff7a68" />
      </mesh>
      {[-1.2, -0.4, 0.4, 1.2].map((x) => (
        <mesh key={x} position={[x, 3.02, 0.72]} rotation={[0.42, 0, 0]} raycast={() => null}>
          <boxGeometry args={[0.28, 0.09, 1.28]} />
          <meshStandardMaterial color="#fff4ea" />
        </mesh>
      ))}
      <mesh position={[0, 3.72, 0.2]} raycast={() => null}>
        <planeGeometry args={[2.4, 0.78]} />
        <meshBasicMaterial map={sign} toneMapped={false} />
      </mesh>
      <mesh position={[0, 2.58, 0.22]} raycast={() => null}>
        <boxGeometry args={[2.15, 0.12, 0.1]} />
        <meshStandardMaterial color="#c9844a" />
      </mesh>
      <mesh position={[-1.04, 1.28, 0.22]} raycast={() => null}>
        <boxGeometry args={[0.1, 2.56, 0.1]} />
        <meshStandardMaterial color="#c9844a" />
      </mesh>
      <mesh position={[1.04, 1.28, 0.22]} raycast={() => null}>
        <boxGeometry args={[0.1, 2.56, 0.1]} />
        <meshStandardMaterial color="#c9844a" />
      </mesh>
      <group ref={left} position={[-0.92, 1.28, 0.12]}>
        <mesh position={[0.46, 0, 0]} castShadow raycast={() => null}>
          <boxGeometry args={[0.92, 2.5, 0.08]} />
          <meshStandardMaterial color="#f6d7b8" />
        </mesh>
        <mesh position={[0.46, 0.15, 0.05]} raycast={() => null}>
          <boxGeometry args={[0.42, 1.15, 0.02]} />
          <meshStandardMaterial color="#d7eef8" transparent opacity={0.85} />
        </mesh>
        <DoorHandle />
      </group>
      <group ref={right} position={[0.92, 1.28, 0.12]}>
        <mesh position={[-0.46, 0, 0]} castShadow raycast={() => null}>
          <boxGeometry args={[0.92, 2.5, 0.08]} />
          <meshStandardMaterial color="#f3e2c8" />
        </mesh>
        <mesh position={[-0.46, 0.15, 0.05]} raycast={() => null}>
          <boxGeometry args={[0.42, 1.15, 0.02]} />
          <meshStandardMaterial color="#d7eef8" transparent opacity={0.85} />
        </mesh>
        <DoorHandle mirror />
      </group>
      <mesh position={[0, 0.08, 0.7]} raycast={() => null}>
        <boxGeometry args={[2.2, 0.14, 0.7]} />
        <meshStandardMaterial color="#d9d3c7" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 1.35]} raycast={() => null}>
        <planeGeometry args={[1.8, 1]} />
        <meshStandardMaterial color="#c45c4a" />
      </mesh>
      <Plant position={[-1.7, 0, 1.15]} />
      <Plant position={[1.7, 0, 1.15]} />
    </group>
  )
}

function ShopDecor() {
  const board = useMemo(() => drawBoard(), [])
  useEffect(() => () => board.dispose(), [board])

  return (
    <group>
      {[-2.2, -1.1, 0, 1.1, 2.2].map((x) => (
        <mesh key={x} position={[x, 4.15, -5.2]} rotation={[0, 0, x * 0.08]} raycast={() => null}>
          <coneGeometry args={[0.16, 0.28, 3]} />
          <meshStandardMaterial color={x % 2 === 0 ? "#ff7a68" : "#f2c14e"} />
        </mesh>
      ))}
      <mesh position={[2.35, 3.15, -5.28]} raycast={() => null}>
        <cylinderGeometry args={[0.28, 0.28, 0.08, 20]} />
        <meshStandardMaterial color="#fffaf3" />
      </mesh>
      <mesh position={[2.35, 3.15, -5.22]} raycast={() => null}>
        <boxGeometry args={[0.02, 0.18, 0.02]} />
        <meshStandardMaterial color="#24312c" />
      </mesh>
      <mesh position={[-5.2, 2.45, -5.28]} raycast={() => null}>
        <planeGeometry args={[1.15, 1.35]} />
        <meshBasicMaterial map={board} toneMapped={false} />
      </mesh>
      <mesh position={[-5.35, 0.28, 0.2]} castShadow raycast={() => null}>
        <boxGeometry args={[0.55, 0.42, 0.55]} />
        <meshStandardMaterial color="#d89a5c" />
      </mesh>
      <mesh position={[-5.15, 0.62, 0.45]} castShadow raycast={() => null}>
        <boxGeometry args={[0.42, 0.28, 0.42]} />
        <meshStandardMaterial color="#c9844a" />
      </mesh>
      <mesh position={[-3.15, 1.72, -5.2]} raycast={() => null}>
        <boxGeometry args={[2.2, 0.12, 0.16]} />
        <meshStandardMaterial color="#67b37a" />
      </mesh>
      {[-3.7, -2.6].map((x) => (
        <mesh key={x} position={[x, 1.95, -5.12]} raycast={() => null}>
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshStandardMaterial color="#ef4d4d" />
        </mesh>
      ))}
      <mesh position={[5.15, 3.15, 1.4]} raycast={() => null}>
        <sphereGeometry args={[0.22, 14, 14]} />
        <meshStandardMaterial color="#ffd7c2" emissive="#ffd7c2" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[4.2, 0.22, 2.55]} rotation={[-Math.PI / 2, 0, 0.2]} raycast={() => null}>
        <circleGeometry args={[0.7, 16]} />
        <meshStandardMaterial color="#b9e6d6" />
      </mesh>
    </group>
  )
}

function drawBoard() {
  const canvas = document.createElement("canvas")
  canvas.width = 480
  canvas.height = 560
  const context = canvas.getContext("2d")
  if (!context) throw new Error("无法绘制价目板")
  context.fillStyle = "#3f6f5b"
  context.fillRect(0, 0, 480, 560)
  context.fillStyle = "#e7f6ee"
  context.fillRect(24, 24, 432, 512)
  context.fillStyle = "#24312c"
  context.font = "700 72px 'Microsoft YaHei', 'Noto Sans SC', sans-serif"
  context.textAlign = "center"
  context.fillText("今日新鲜", 240, 120)
  context.font = "700 48px 'Microsoft YaHei', 'Noto Sans SC', sans-serif"
  context.fillText("苹果  2元", 240, 250)
  context.fillText("牛奶  3元5角", 240, 340)
  context.fillText("面包  2元8角", 240, 430)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true
  return texture
}
