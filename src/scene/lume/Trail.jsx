import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { U } from '../core/env'

export function Trail({ source }) {
  const N = 48
  const data = useMemo(() => ({ pos: new Float32Array(N * 3), age: new Float32Array(N).fill(1), head: 0, acc: 0 }), [])
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(data.pos, 3))
    g.setAttribute('aAge', new THREE.BufferAttribute(data.age, 1))
    return g
  }, [data])
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uGlow: U.uGlow },
        vertexShader: `attribute float aAge; varying float vA; void main(){ vA = 1.0 - aAge; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = (6.0 + 10.0 * vA) * (6.0 / -mv.z); gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `uniform float uGlow; varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d) * vA * vA; gl_FragColor = vec4(vec3(1.0, 0.85, 0.45) * (1.2 + uGlow) * a, a); }`
      }),
    []
  )
  useFrame((_, dt) => {
    for (let i = 0; i < N; i++) data.age[i] = Math.min(1, data.age[i] + dt * 1.1)
    data.acc += dt
    if (data.acc > 0.03 && source.current) {
      data.acc = 0
      const p = source.current
      data.head = (data.head + 1) % N
      data.pos.set([p.x + (Math.random() - 0.5) * 0.12, p.y + (Math.random() - 0.5) * 0.12 - 0.05, p.z + (Math.random() - 0.5) * 0.12], data.head * 3)
      data.age[data.head] = 0
    }
    geo.attributes.position.needsUpdate = true
    geo.attributes.aAge.needsUpdate = true
  })
  return <points geometry={geo} material={mat} frustumCulled={false} />
}
