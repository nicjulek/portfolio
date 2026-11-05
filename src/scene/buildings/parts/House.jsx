import { Door } from './Door'
import { GlowPool } from './GlowPool'
import { Lantern } from './Lantern'
import { Smoke } from './Smoke'
import { WarmLight } from './WarmLight'
import { Window } from './Window'
import { GEO, useRoof } from './geometries'
import { STONE, WOOD } from './palette'
import { toon } from '../../core/materials'
import { RB } from '../../core/primitives'

export function House({ w, d, wallH, roofH, wall = '#f1e6cf', roof = '#4f6f7f', trim = WOOD, chimney, door = 0, windows = [], children, sideOver = 0.35 }) {
  const base = 0.38
  const R = useRoof({ w, d, wallH, h: roofH, over: 0.55, side: sideOver, t: 0.16 })
  return (
    <group>
      <RB a={[w + 0.3, base, d + 0.3]} p={[0, base / 2, 0]} c={STONE} rad={0.08} />
      <group position={[0, base, 0]}>
        <RB a={[w, wallH, d]} p={[0, wallH / 2, 0]} c={wall} rad={0.05} />
        <mesh geometry={R.gable} material={toon(wall)} castShadow receiveShadow />
        {[
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1]
        ].map(([sx, sz]) => (
          <RB key={`${sx}${sz}`} a={[0.16, wallH + 0.02, 0.16]} p={[(sx * w) / 2, wallH / 2, (sz * d) / 2]} c={trim} rad={0.04} />
        ))}
        <RB a={[w + 0.1, 0.14, 0.12]} p={[0, wallH - 0.05, d / 2 + 0.01]} c={trim} rad={0.04} />
        <RB a={[w + 0.1, 0.14, 0.12]} p={[0, wallH - 0.05, -d / 2 - 0.01]} c={trim} rad={0.04} />
        <RB a={[w + 0.1, 0.1, 0.1]} p={[0, 0.06, d / 2 + 0.01]} c={trim} rad={0.03} />
        <mesh geometry={R.roof} material={toon(roof)} castShadow receiveShadow />
        <mesh position={[0, R.ridge + 0.04, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={toon(roof)}>
          <cylinderGeometry args={[0.12, 0.12, R.depth + 0.1, 12]} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[(s * (R.depth + 0.1)) / 2, R.ridge + 0.04, 0]} geometry={GEO.sphere} scale={0.16} material={toon(roof)} />
        ))}
        {chimney && (
          <group position={chimney}>
            <RB a={[0.45, 1.4, 0.45]} p={[0, 0.7, 0]} c="#9a5a46" rad={0.06} />
            <RB a={[0.6, 0.12, 0.6]} p={[0, 1.45, 0]} c="#6b3e30" rad={0.04} />
            <Smoke p={[0, 1.55, 0]} />
          </group>
        )}
        <Door p={[door, 0, d / 2 + 0.01]} />
        <Lantern p={[door + 0.75, 1.75, d / 2 + 0.22]} s={0.75} />
        <WarmLight p={[door, 2.1, d / 2 + 1.4]} />
        {windows.map((wi, i) => (
          <Window key={i} p={wi.p} r={wi.r} w={wi.w} h={wi.h} flowers={wi.flowers !== false} />
        ))}
        {children}
      </group>
      <GlowPool p={[door, 0.06, d / 2 + 1.6]} r={3} />
    </group>
  )
}
