import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { U } from '../core/env'

export function Birds() {
  const ref = useRef()
  const wing = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.12, 0, 0, -0.12, 0.7, 0.05, 0], 3))
    g.computeVertexNormals()
    return g
  }, [])
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#2b2f3a', side: THREE.DoubleSide, transparent: true }), [])
  const birds = useMemo(() => Array.from({ length: 7 }, (_, i) => ({ off: [Math.cos(i * 2.1) * 3, Math.sin(i * 1.3) * 1.5, Math.sin(i * 2.1) * 3], ph: i * 0.9 })), [])
  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime
    const g = ref.current
    const vis = U.uDay.value * (1 - U.uRain.value)
    g.visible = vis > 0.05
    mat.opacity = vis
    const a = t * 0.07
    g.position.set(camera.position.x + Math.cos(a) * 30, 22 + Math.sin(t * 0.3) * 2, camera.position.z - 25 + Math.sin(a) * 20)
    g.rotation.y = -a - Math.PI / 2
    g.children.forEach((b, i) => {
      const f = Math.sin(t * 7 + birds[i].ph)
      b.children[0].rotation.x = f * 0.7
      b.children[1].rotation.x = -f * 0.7
      b.position.y = birds[i].off[1] + Math.sin(t * 0.8 + i) * 0.4
    })
  })
  return (
    <group ref={ref}>
      {birds.map((b, i) => (
        <group key={i} position={b.off}>
          <mesh geometry={wing} material={mat} rotation={[0, Math.PI / 2, 0]} />
          <mesh geometry={wing} material={mat} rotation={[0, -Math.PI / 2, 0]} />
        </group>
      ))}
    </group>
  )
}
