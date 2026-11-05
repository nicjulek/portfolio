import { useMemo } from 'react'
import { STOPS } from '../../data/stops'
import { GlowPool } from './parts/GlowPool'
import { Lantern } from './parts/Lantern'
import { STONE, WOOD_DARK } from './parts/palette'
import { toon } from '../core/materials'
import { RB, tube } from '../core/primitives'
import { STREAM_Z, height, pathX } from '../../world/terrain'

export function PathLamps() {
  const lamps = useMemo(() => {
    const cams = STOPS.map((st) => ({ z: st.z + st.dist * 0.75, side: st.side }))
    const out = []
    let side = 1
    for (let z0 = 36; z0 > -52; z0 -= 10.5) {
      let z = z0
      let sd = side
      const near = cams.find((c) => Math.abs(z - c.z) < 4.5)
      if (near) {
        z = near.z - 6.5
        sd = near.side
      }
      side *= -1
      if (Math.abs(z - STREAM_Z) < 4) continue
      if (out.some((l) => Math.abs(l.z - z) < 4)) continue
      const x = pathX(z) + sd * 2.4
      out.push({ x, z, y: height(x, z), side: sd })
    }
    return out
  }, [])
  const post = useMemo(() => tube([[0, 0, 0], [0, 1.6, 0], [0.05, 2.25, 0], [0.35, 2.55, 0], [0.62, 2.5, 0]], 0.05, 24), [])
  return lamps.map((l, i) => (
    <group key={i} position={[l.x, l.y, l.z]}>
      <group rotation={[0, l.side > 0 ? Math.PI : 0, 0]}>
        <mesh geometry={post} material={toon(WOOD_DARK)} castShadow />
        <RB a={[0.3, 0.2, 0.3]} p={[0, 0.1, 0]} c={STONE} rad={0.05} />
        <Lantern p={[0.62, 2.18, 0]} s={0.9} />
      </group>
      <GlowPool p={[l.side > 0 ? -0.62 : 0.62, 0.08, 0]} r={2.2} />
    </group>
  ))
}
