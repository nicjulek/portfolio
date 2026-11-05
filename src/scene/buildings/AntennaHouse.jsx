import { useMemo } from 'react'
import { Dish } from './parts/Dish'
import { House } from './parts/House'
import { GEO } from './parts/geometries'
import { WOOD_DARK } from './parts/palette'
import { groundY } from '../core/ground'
import { toon } from '../core/materials'
import { G, RB, tube } from '../core/primitives'
import { Plant } from '../nature/Plants'

export function AntennaHouse() {
  const cable = useMemo(() => tube([[1.2, 3.95, 0.35], [1.6, 3.6, 1.2], [2.0, 3.0, 1.9], [2.25, 2.2, 1.95]], 0.018), [])
  return (
    <>
      <House
        w={4.4}
        d={3.4}
        wallH={2.3}
        roofH={1.6}
        roof="#4f6f7f"
        chimney={[-1.2, 2.7, -0.6]}
        door={0.8}
        windows={[
          { p: [-1.1, 0.75, 1.71], w: 0.85, h: 1.15 },
          { p: [2.21, 0.75, 0], r: [0, Math.PI / 2, 0], w: 0.8, h: 1.1 },
          { p: [-2.21, 0.75, 0.2], r: [0, -Math.PI / 2, 0], w: 0.8, h: 1.1 }
        ]}
      >
        <group position={[1.2, 3.45, 0.2]}>
          <Dish />
        </group>
      </House>
      <mesh geometry={cable} material={toon('#2d2d2d')} />
      <G geo={GEO.barrel} p={[2.5, groundY('antena', 2.5, 1.2), 1.2]} c="#6b4a33" />
      {[-1, 0, 1].map((i) => (
        <group key={i} position={[-0.6 + i * 0.8, groundY('antena', -0.6 + i * 0.8, 3.4), 3.4]}>
          {[-0.8, 0.8].map((z) =>
            [-0.2, 0.2].map((x) => <RB key={`${x}${z}`} a={[0.07, 0.4, 0.07]} p={[x, 0.2, z]} c={WOOD_DARK} rad={0.02} />)
          )}
          <RB a={[0.56, 0.26, 1.86]} p={[0, 0.42, 0]} c="#8b5a3c" rad={0.05} />
          <RB a={[0.46, 0.04, 1.76]} p={[0, 0.56, 0]} c="#5a3d2a" rad={0.02} />
          {[-0.6, 0, 0.6].map((z) => (
            <Plant key={z} p={[0, 0.57, z]} s={1.6} kind="herb" seed={Math.round(z * 10) + i * 7 + 20} />
          ))}
        </group>
      ))}
    </>
  )
}
