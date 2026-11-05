import { useMemo } from 'react'
import * as THREE from 'three'
import { GRAD } from '../core/env'
import { STREAM_Z, height, pathX } from '../../world/terrain'

export function Terrain() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(190, 190, 190, 190)
    g.rotateX(-Math.PI / 2)
    const pos = g.attributes.position
    const col = new Float32Array(pos.count * 3)
    const dirt = new THREE.Color('#b8925f')
    const dirtEdge = new THREE.Color('#8f8a4c')
    const g1 = new THREE.Color('#5f8f3c')
    const g2 = new THREE.Color('#4a7a33')
    const bank = new THREE.Color('#6d7a45')
    const tmp = new THREE.Color()
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      pos.setY(i, height(x, z))
      const d = Math.abs(x - pathX(z))
      tmp.lerpColors(g1, g2, 0.5 + 0.5 * Math.sin(x * 0.27) * Math.cos(z * 0.21))
      if (Math.abs(z - STREAM_Z) < 2.8) tmp.lerp(bank, 0.7)
      const ruts = 0.5 + 0.5 * Math.sin((x - pathX(z)) * 7)
      if (d < 1.15) tmp.copy(dirt).lerp(dirtEdge, ruts * 0.18)
      else if (d < 1.8) tmp.lerp(dirtEdge, 1 - (d - 1.15) / 0.65)
      tmp.toArray(col, i * 3)
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    g.computeVertexNormals()
    return g
  }, [])
  return (
    <mesh geometry={geo} receiveShadow>
      <meshToonMaterial vertexColors gradientMap={GRAD} />
    </mesh>
  )
}
