import { GEO, useArch } from './geometries'
import { STONE, WOOD_DARK } from './palette'
import { toon } from '../../core/materials'
import { G, RB } from '../../core/primitives'

export function Door({ p, r, w = 0.9, h = 1.7, color = WOOD_DARK }) {
  const door = useArch(w, h, 0.07)
  const frame = useArch(w + 0.18, h + 0.1, 0.05, 0.09)
  return (
    <group position={p} rotation={r}>
      <mesh geometry={frame} material={toon('#f6efe0')} castShadow />
      <mesh geometry={door} material={toon(color)} castShadow />
      {[-0.22, 0, 0.22].map((x) => (
        <RB key={x} a={[0.02, h - w / 2 - 0.1, 0.02]} p={[x * w, (h - w / 2) / 2, 0.075]} c="#3d2618" rad={0.008} />
      ))}
      <G geo={GEO.knob} p={[w * 0.32, h * 0.45, 0.1]} c="#d9b45a" />
      <RB a={[w + 0.5, 0.14, 0.55]} p={[0, -0.07, 0.25]} c={STONE} rad={0.05} />
    </group>
  )
}
