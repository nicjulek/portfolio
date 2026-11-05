import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { U, rng } from '../core/env'
import { B } from './common'
import { STREAM_Z, height, pathX } from '../../world/terrain'

export function Rabbit({ home, seed }) {
  const ref = useRef()
  const r = useMemo(() => rng(seed), [seed])
  const st = useRef({ from: new THREE.Vector3(...home), to: new THREE.Vector3(...home), k: 1, wait: 1 + seed % 3 })
  const color = seed % 3 === 0 ? '#f2ece0' : seed % 3 === 1 ? '#a9876a' : '#8c7a6b'
  const tmp = useMemo(() => new THREE.Vector3(), [])
  useFrame((_, dt) => {
    const s = st.current
    if (s.k >= 1) {
      s.wait -= dt
      if (s.wait < 0) {
        s.from.copy(s.to)
        const a = r() * Math.PI * 2
        s.to.set(home[0] + Math.cos(a) * 2.2 * r(), 0, home[2] + Math.sin(a) * 2.2 * r())
        s.k = 0
        s.wait = 1 + r() * 4
      }
    } else s.k = Math.min(1, s.k + dt * 0.9)
    const hops = 3
    const e = s.k
    tmp.lerpVectors(s.from, s.to, e)
    const hop = Math.abs(Math.sin(e * Math.PI * hops)) * 0.14 * (e < 1 ? 1 : 0)
    ref.current.position.set(tmp.x, height(tmp.x, tmp.z) + hop, tmp.z)
    if (e < 1) ref.current.rotation.y = Math.atan2(s.to.x - s.from.x, s.to.z - s.from.z)
    ref.current.children[0].rotation.x = e < 1 ? -Math.sin(e * Math.PI * hops) * 0.3 : Math.sin(U.uTime.value * 9 + seed) * 0.03
  })
  return (
    <group ref={ref} scale={0.9}>
      <group>
        <B p={[0, 0.11, -0.03]} s={[0.09, 0.09, 0.13]} c={color} />
        <B p={[0, 0.2, 0.09]} s={[0.065, 0.065, 0.07]} c={color} />
        <B p={[-0.025, 0.31, 0.07]} s={[0.018, 0.07, 0.03]} r={[-0.3, 0, -0.15]} c={color} />
        <B p={[0.025, 0.31, 0.07]} s={[0.018, 0.07, 0.03]} r={[-0.3, 0, 0.15]} c={color} />
        <B p={[0, 0.13, -0.16]} s={0.035} c="#ffffff" />
        <B p={[-0.035, 0.215, 0.14]} s={0.011} c="#1a1715" shadow={false} />
        <B p={[0.035, 0.215, 0.14]} s={0.011} c="#1a1715" shadow={false} />
        <B p={[0, 0.195, 0.158]} s={0.009} c="#e9a3a8" shadow={false} />
      </group>
    </group>
  )
}

export function Rabbits({ avoid }) {
  const homes = useMemo(() => {
    const g = rng(61)
    const out = []
    let guard = 0
    while (out.length < 7 && guard++ < 500) {
      const z = -50 + g() * 85
      const x = pathX(z) + (g() < 0.5 ? -1 : 1) * (3.5 + g() * 9)
      if (Math.abs(z - STREAM_Z) < 4 || avoid(x, z, 2)) continue
      out.push([x, 0, z])
    }
    return out
  }, [avoid])
  return homes.map((h, i) => <Rabbit key={i} home={h} seed={i + 3} />)
}
