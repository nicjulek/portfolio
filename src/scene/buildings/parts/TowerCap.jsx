import { useMemo } from 'react'
import { GEO } from './geometries'
import { toon } from '../../core/materials'
import { lathe } from '../../core/primitives'

export function TowerCap({ p }) {
  const geo = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 12; i++) {
      const k = i / 12
      pts.push([1.15 * Math.pow(1 - k, 1.7), k * 1.3])
    }
    const g = lathe([[0, -0.02], ...pts.map(([r, y], i) => [i === 12 ? 0.0001 : r, y])], 4)
    g.rotateY(Math.PI / 4)
    return g
  }, [])
  return (
    <group position={p}>
      <mesh geometry={geo} material={toon('#3f5469')} castShadow />
      <mesh geometry={GEO.sphere} scale={0.1} position={[0, 1.35, 0]} material={toon('#d9b45a')} />
    </group>
  )
}
