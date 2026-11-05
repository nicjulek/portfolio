import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { meow } from '../../audio/sfx'
import { toon } from '../core/materials'
import { RealCat } from './cat/RealCat'
import { Bubble, Hearts, SPH, useHover } from './common'
import { CAT_SPOT, height } from '../../world/terrain'

export const CAT_LINES = ['miau!', 'mrrrp?', 'prrrr…', 'miau miau', '*pisca devagar*']

export function CatOnRock({ muted, lines = CAT_LINES }) {
  const [pops, setPops] = useState(0)
  const [say, setSay] = useState(null)
  const [, hoverProps] = useHover()
  const happy = useRef(0)
  const timer = useRef()
  useFrame((_, dt) => {
    happy.current = Math.max(0, happy.current - dt * 0.45)
  })
  const pet = (e) => {
    e.stopPropagation()
    setPops((p) => p + 1)
    happy.current = 2.2
    setSay(lines[pops % lines.length])
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setSay(null), 2400)
    if (!muted) meow()
  }
  const rockGeo = useMemo(() => {
    const g = new THREE.DodecahedronGeometry(0.42, 2)
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      let y = p.getY(i)
      if (y > 0.12) y = 0.12 + (y - 0.12) * 0.15
      const n = Math.sin(p.getX(i) * 13) * Math.cos(p.getZ(i) * 11) * 0.025
      p.setXYZ(i, p.getX(i) * (1 + n), y, p.getZ(i) * (1 + n))
    }
    g.computeVertexNormals()
    return g
  }, [])
  const x = CAT_SPOT.x
  const z = CAT_SPOT.z
  const y = height(x, z)
  return (
    <group position={[x, y, z]}>
      <mesh geometry={rockGeo} position={[0, 0.06, 0]} scale={[1.1, 1, 0.9]} material={toon('#9a978a')} castShadow receiveShadow />
      <mesh position={[0.18, 0.2, -0.12]} scale={[0.22, 0.04, 0.16]} geometry={SPH} material={toon('#6f9a4a')} />
      <group position={[0, 0.195, 0]} rotation={[0, -0.75, 0]} scale={1.2} {...hoverProps}>
        <RealCat onPet={pet} happy={happy} />
        <Hearts trigger={pops} y={0.42} />
        <Bubble text={say} y={0.62} />
      </group>
    </group>
  )
}
