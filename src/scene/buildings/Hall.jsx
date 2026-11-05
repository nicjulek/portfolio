import { Clock } from './parts/Clock'
import { House } from './parts/House'
import { Lantern } from './parts/Lantern'
import { TowerCap } from './parts/TowerCap'
import { GEO } from './parts/geometries'
import { WOOD, WOOD_DARK } from './parts/palette'
import { groundY } from '../core/ground'
import { toon } from '../core/materials'
import { G, RB } from '../core/primitives'
import { Plant } from '../nature/Plants'

export function Hall() {
  return (
    <>
      <House
        w={5.8}
        d={4}
        wallH={3}
        roofH={1.8}
        wall="#ecdcbf"
        roof="#3f5469"
        door={0}
        windows={[
          { p: [-1.8, 0.8, 2.01], w: 0.9, h: 1.4 },
          { p: [1.8, 0.8, 2.01], w: 0.9, h: 1.4 },
          { p: [2.91, 0.8, 0], r: [0, Math.PI / 2, 0], w: 0.9, h: 1.4 },
          { p: [-2.91, 0.8, 0], r: [0, -Math.PI / 2, 0], w: 0.9, h: 1.4 }
        ]}
      >
        <group position={[0, 3.6, 0.6]}>
          <RB a={[1.5, 2, 1.5]} p={[0, 1, 0]} c="#ecdcbf" rad={0.06} />
          {[
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1]
          ].map(([a, b]) => (
            <RB key={`${a}${b}`} a={[0.14, 2.02, 0.14]} p={[a * 0.75, 1, b * 0.75]} c={WOOD} rad={0.04} />
          ))}
          <RB a={[1.75, 0.14, 1.75]} p={[0, 2.05, 0]} c={WOOD} rad={0.05} />
          <Clock p={[0, 1.05, 0.77]} />
          <TowerCap p={[0, 2.1, 0]} />
        </group>
      </House>
      {[-1.2, 1.2].map((x) => (
        <group key={x} position={[x, 0, 3.5]}>
          <mesh position={[0, 0.8, 0]} castShadow material={toon(WOOD_DARK)}>
            <cylinderGeometry args={[0.05, 0.07, 1.6, 8]} />
          </mesh>
          <Lantern p={[0, 1.75, 0]} />
        </group>
      ))}
      {[-2.4, 2.4].map((x) => (
        <group key={x} position={[x, Math.max(0, groundY('prefeitura', x, 2.6)), 2.6]}>
          <G geo={GEO.pot} s={1.4} c="#b5653f" />
          <Plant p={[0, 0.42, 0]} s={2.1} kind="bush" seed={x > 0 ? 3 : 4} color="#f4a6b8" />
        </group>
      ))}
    </>
  )
}
