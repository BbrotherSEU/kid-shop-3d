import { RoundedBox } from "@react-three/drei"
import { shelf } from "../game/world.ts"

export function Shelf() {
  return (
    <group>
      {shelf.y.map((top) => (
        <RoundedBox
          key={top}
          args={[8.8, 0.12, 0.56]}
          radius={0.04}
          smoothness={2}
          position={[0, top - 0.06, -3.2]}
          castShadow
          receiveShadow
          raycast={() => null}
        >
          <meshStandardMaterial color="#e0a15c" roughness={0.72} />
        </RoundedBox>
      ))}
      {[-4.35, 4.35].map((x) => (
        <mesh key={x} position={[x, 1.25, -3.4]} castShadow raycast={() => null}>
          <boxGeometry args={[0.12, 2.7, 0.12]} />
          <meshStandardMaterial color="#c9844a" roughness={0.65} />
        </mesh>
      ))}
    </group>
  )
}
