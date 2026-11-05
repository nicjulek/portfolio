import { toon } from '../../core/materials'
import { RB } from '../../core/primitives'

export function Dish() {
  return (
    <group>
      <mesh position={[0, 0.35, 0]} castShadow material={toon('#c8ced6')}>
        <cylinderGeometry args={[0.035, 0.05, 0.7, 10]} />
      </mesh>
      <group position={[0, 0.75, 0]} rotation={[-0.55, 0.4, 0]}>
        <RB a={[0.95, 0.06, 0.62]} c="#f4f6f8" rad={0.03} />
        <RB a={[0.85, 0.02, 0.52]} p={[0, 0.035, 0]} c="#dfe5ec" rad={0.01} />
      </group>
    </group>
  )
}
