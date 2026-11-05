import { House } from './parts/House'
import { StringLights } from './parts/StringLights'
import { GEO } from './parts/geometries'
import { WOOD, WOOD_DARK } from './parts/palette'
import { MAT } from '../core/materials'
import { G, RB } from '../core/primitives'

export function Shed() {
  return (
    <>
      <House w={3.6} d={3} wallH={2.2} roofH={1.2} wall="#b07b52" roof="#6f5a4a" trim={WOOD_DARK} door={-0.4} windows={[{ p: [1.81, 0.7, 0], r: [0, Math.PI / 2, 0], w: 0.7, h: 1, flowers: false }]} />
      <group position={[0.3, 0, 2.6]}>
        <RB a={[2, 0.1, 0.8]} p={[0, 0.9, 0]} c={WOOD} rad={0.04} />
        {[-0.85, 0.85].map((x) => (
          <RB key={x} a={[0.1, 0.9, 0.7]} p={[x, 0.45, 0]} c={WOOD_DARK} rad={0.04} />
        ))}
        <group position={[-0.35, 0.96, 0]}>
          <RB a={[0.7, 0.03, 0.45]} c="#3b3f46" rad={0.012} />
          <group position={[0, 0.02, -0.22]} rotation={[-0.25, 0, 0]}>
            <RB a={[0.7, 0.45, 0.03]} p={[0, 0.23, 0]} c="#3b3f46" rad={0.012} />
            <mesh position={[0, 0.23, 0.02]} material={MAT.screen}>
              <planeGeometry args={[0.62, 0.37]} />
            </mesh>
          </group>
        </group>
        <G geo={GEO.jar} p={[0.25, 0.95, 0.15]} s={1.3} c="#f6efe0" />
        <RB a={[0.4, 0.22, 0.25]} p={[0.65, 1.06, 0]} c="#c94f2b" rad={0.04} />
      </group>
      <StringLights a={[-1.9, 2.65, 1.75]} b={[1.9, 2.65, 1.75]} sag={0.35} />
    </>
  )
}
