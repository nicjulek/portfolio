import { useMemo } from 'react'
import * as THREE from 'three'
import easelArt from '../../assets/knockup/cidade.webp'
import { GEO } from './parts/geometries'
import { WOOD, WOOD_DARK } from './parts/palette'
import { GRAD } from '../core/env'
import { toon } from '../core/materials'
import { G, RB, tube } from '../core/primitives'

export function Atelie() {
  const legs = useMemo(() => [tube([[-0.35, 0, 0.1], [-0.22, 1, 0.02], [-0.12, 1.95, -0.05]], 0.03), tube([[0.35, 0, 0.1], [0.22, 1, 0.02], [0.12, 1.95, -0.05]], 0.03), tube([[0, 0, -0.6], [0, 1, -0.3], [0, 1.85, -0.08]], 0.03)], [])
  const art = useMemo(() => {
    const t = new THREE.TextureLoader().load(easelArt)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 4
    return new THREE.MeshToonMaterial({ map: t, gradientMap: GRAD, emissive: '#ffffff', emissiveMap: t, emissiveIntensity: 0.25 })
  }, [])
  return (
    <>
      {legs.map((g, i) => (
        <mesh key={i} geometry={g} material={toon(WOOD)} castShadow />
      ))}
      <group position={[0, 1.3, 0.05]} rotation={[-0.12, 0, 0]}>
        <RB a={[1.12, 0.92, 0.05]} c="#fbf3e2" rad={0.02} />
        <mesh position={[0, 0, 0.03]} material={art}>
          <planeGeometry args={[1.04, 0.78]} />
        </mesh>
      </group>
      <RB a={[0.9, 0.06, 0.1]} p={[0, 0.82, 0.08]} c={WOOD} rad={0.02} />
      <G geo={GEO.stool} p={[0, 0, 1]} c={WOOD} />
      <group position={[1.3, 0, 0.5]}>
        <RB a={[0.9, 0.08, 0.6]} p={[0, 0.7, 0]} c="#a77a55" rad={0.03} />
        {[-0.35, 0.35].map((x) => (
          <mesh key={x} position={[x, 0.35, 0]} material={toon(WOOD_DARK)} castShadow>
            <cylinderGeometry args={[0.03, 0.04, 0.7, 8]} />
          </mesh>
        ))}
        {['#c9563b', '#3f7fbf', '#e9c34a', '#5d9c46'].map((c, i) => (
          <G key={c} geo={GEO.jar} p={[-0.3 + i * 0.2, 0.74, 0.05]} c={c} />
        ))}
      </group>
      <group position={[-1.2, 0, 0.7]}>
        <mesh position={[0, 1.1, 0]} material={toon('#7b6a5a')} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 2.2, 8]} />
        </mesh>
        <mesh geometry={GEO.parasol} position={[0, 1.75, 0]} scale={1.2} material={toon('#e8b98a', { side: THREE.DoubleSide })} castShadow />
      </group>
    </>
  )
}
