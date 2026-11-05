import { useMemo } from 'react'
import * as THREE from 'three'
import { archShape, useArch } from './geometries'
import { WOOD } from './palette'
import { MAT, toon } from '../../core/materials'
import { RB } from '../../core/primitives'
import { Plant } from '../../nature/Plants'

export function Window({ p, r, w = 0.8, h = 1.1, flowers = true }) {
  const frame = useArch(w, h, 0.08, 0.07)
  const glass = useMemo(() => new THREE.ShapeGeometry(archShape(w, h, 0.07), 18), [w, h])
  return (
    <group position={p} rotation={r}>
      <mesh geometry={frame} material={toon('#f6efe0')} castShadow />
      <mesh geometry={glass} material={MAT.windowGlass} position={[0, 0, 0.02]} />
      <RB a={[0.04, h - 0.1, 0.04]} p={[0, h / 2, 0.05]} c="#f6efe0" rad={0.015} />
      <RB a={[w - 0.1, 0.04, 0.04]} p={[0, h * 0.45, 0.05]} c="#f6efe0" rad={0.015} />
      {flowers && (
        <>
          <RB a={[w + 0.15, 0.18, 0.24]} p={[0, -0.05, 0.14]} c={WOOD} rad={0.04} />
          {[-0.3, 0, 0.3].map((x, i) => (
            <Plant key={x} p={[x * w, 0.03, 0.15]} s={1.25} seed={Math.round((p[0] + p[2]) * 10) + i} color={['#f4a6b8', '#ffd76a', '#ffffff', '#c94f6b', '#b89cf0'][(i + Math.round(p[0] * 3) + 5) % 5]} />
          ))}
        </>
      )}
    </group>
  )
}
