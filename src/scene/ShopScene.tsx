import { useEffect, useLayoutEffect, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import { Vector3 } from "three"
import { cameraPresets } from "../game/world.ts"
import { useShop } from "../game/store.ts"
import { sceneMotion } from "./motion.ts"
import { Characters } from "./Characters.tsx"
import { Counter } from "./Counter.tsx"
import { ShelfProducts } from "./ProductMesh.tsx"
import { Shelf } from "./Shelf.tsx"
import { ShopCart } from "./ShopCart.tsx"
import { StoreRoom } from "./StoreRoom.tsx"

const tempPos = new Vector3()
const tempLook = new Vector3()
const tempOffset = new Vector3()
const tempDesired = new Vector3()

export function ShopScene() {
  useEffect(() => {
    const kick = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 50)
    return () => window.clearTimeout(kick)
  }, [])

  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: cameraPresets.entrance.pos, fov: 42, near: 0.1, far: 80 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#c5e6f7"]} />
        <group position={[0, -8, 0]}>
          <Html>
            <span className="sr-only">店</span>
          </Html>
        </group>
        <CameraRig />
        <hemisphereLight args={["#fff8ee", "#b7d7c6", 0.9]} />
        <ambientLight intensity={0.28} />
        <directionalLight
          castShadow
          position={[4.5, 8.5, 5]}
          intensity={1.35}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={1}
          shadow-camera-far={24}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
          shadow-bias={-0.0006}
        />
        <StoreRoom />
        <Shelf />
        <ShelfProducts />
        <ShopCart />
        <Counter />
        <Characters />
      </Canvas>
    </div>
  )
}

function CameraRig() {
  const phase = useShop((state) => state.phase)
  const lookAt = useRef(new Vector3(...cameraPresets.entrance.look))
  const yaw = useRef(0)
  const pitch = useRef(0)
  const zoom = useRef(1)
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const { camera, gl } = useThree()

  useLayoutEffect(() => {
    camera.position.set(...cameraPresets.entrance.pos)
    lookAt.current.set(...cameraPresets.entrance.look)
    camera.lookAt(lookAt.current)
  }, [camera])

  useEffect(() => {
    const el = gl.domElement
    const down = (event: PointerEvent) => {
      if (event.button !== 2) return
      dragging.current = true
      last.current = { x: event.clientX, y: event.clientY }
    }
    const move = (event: PointerEvent) => {
      if (!dragging.current) return
      yaw.current += (event.clientX - last.current.x) * 0.005
      pitch.current = Math.max(-0.32, Math.min(0.5, pitch.current + (event.clientY - last.current.y) * 0.0035))
      last.current = { x: event.clientX, y: event.clientY }
    }
    const up = (event: PointerEvent) => {
      if (event.button !== 2) return
      dragging.current = false
    }
    const wheel = (event: WheelEvent) => {
      event.preventDefault()
      const direction = event.deltaY > 0 ? 1 : -1
      zoom.current = Math.max(0.42, Math.min(1.85, zoom.current + direction * 0.12))
    }
    const menu = (event: Event) => event.preventDefault()
    el.addEventListener("pointerdown", down)
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
    window.addEventListener("wheel", wheel, { passive: false })
    el.addEventListener("contextmenu", menu)
    return () => {
      el.removeEventListener("pointerdown", down)
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
      window.removeEventListener("wheel", wheel)
      el.removeEventListener("contextmenu", menu)
    }
  }, [gl])

  useFrame((_, delta) => {
    sceneMotion.door = phase === "intro" ? 0 : 1
    const follow = phase !== "intro"
    if (follow) {
      const ahead = 0.85
      const face = sceneMotion.customerYaw
      tempLook.set(
        sceneMotion.customerX + Math.sin(face) * ahead,
        1.2,
        sceneMotion.customerZ + Math.cos(face) * ahead,
      )
      const elev = 0.46 + pitch.current
      const dist = 6.3 * zoom.current
      const horiz = Math.cos(elev) * dist
      const behind = face + Math.PI + yaw.current
      tempDesired.set(
        sceneMotion.customerX + Math.sin(behind) * horiz,
        1.15 + Math.sin(elev) * dist,
        sceneMotion.customerZ + Math.cos(behind) * horiz,
      )
      containCamera(tempDesired, tempLook, sceneMotion.customerZ < 9)
      const blend = 1 - Math.exp((dragging.current ? -12 : -3.4) * delta)
      camera.position.lerp(tempPos.copy(tempDesired), blend)
      lookAt.current.lerp(tempLook, blend)
      camera.lookAt(lookAt.current)
      return
    }

    const entranceLook = cameraPresets.entrance.look
    const entrancePos = cameraPresets.entrance.pos
    tempLook.set(entranceLook[0], entranceLook[1], entranceLook[2])
    tempOffset.set(entrancePos[0] - entranceLook[0], entrancePos[1] - entranceLook[1], entrancePos[2] - entranceLook[2])
    tempOffset.multiplyScalar(zoom.current)
    tempDesired.copy(tempLook).add(tempOffset)
    const blend = 1 - Math.exp(-2.8 * delta)
    camera.position.lerp(tempPos.copy(tempDesired), blend)
    lookAt.current.lerp(tempLook, blend)
    camera.lookAt(lookAt.current)
  })

  return null
}

function containCamera(pos: Vector3, focus: Vector3, indoors: boolean) {
  const minX = indoors ? -5.4 : -8
  const maxX = indoors ? 5.4 : 8
  const minY = 0.85
  const maxY = indoors ? 3.7 : 6.2
  const minZ = indoors ? -0.55 : 9.2
  const maxZ = indoors ? 8.2 : 20
  const inside = () =>
    pos.x >= minX && pos.x <= maxX && pos.y >= minY && pos.y <= maxY && pos.z >= minZ && pos.z <= maxZ
  for (let step = 0; step < 16 && !inside(); step += 1) pos.lerp(focus, 0.22)
  pos.x = Math.min(maxX, Math.max(minX, pos.x))
  pos.y = Math.min(maxY, Math.max(minY, pos.y))
  pos.z = Math.min(maxZ, Math.max(minZ, pos.z))
}
