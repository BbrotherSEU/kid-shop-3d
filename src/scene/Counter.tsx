import { RoundedBox } from "@react-three/drei"
import { counter } from "../game/world.ts"

export function Counter() {
  return (
    <group position={[counter.x, 0, counter.z]}>
      <RoundedBox args={[1.85, 0.92, 0.86]} radius={0.06} smoothness={2} position={[0, 0.46, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#d89a5c" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[1.96, 0.1, 0.96]} radius={0.04} smoothness={2} position={[0, 0.97, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f0c48a" roughness={0.55} />
      </RoundedBox>
      <group position={[0.42, 1.16, 0.18]}>
        <RoundedBox args={[0.48, 0.28, 0.32]} radius={0.04} smoothness={2} castShadow>
          <meshStandardMaterial color="#5c6b66" roughness={0.45} />
        </RoundedBox>
        <mesh position={[0, 0.08, 0.17]}>
          <planeGeometry args={[0.28, 0.12]} />
          <meshStandardMaterial color="#8ee0b2" emissive="#8ee0b2" emissiveIntensity={0.35} />
        </mesh>
      </group>
      <mesh position={[-0.55, 1.1, -0.05]} castShadow>
        <cylinderGeometry args={[0.28, 0.22, 0.16, 16]} />
        <meshStandardMaterial color="#c9844a" roughness={0.65} />
      </mesh>
      <mesh position={[0.15, 1.08, -0.28]} castShadow>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#f2c14e" metalness={0.2} roughness={0.35} />
      </mesh>
    </group>
  )
}
