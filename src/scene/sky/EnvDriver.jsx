import { useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { U, applyTime } from '../core/env'
import { updateGlows } from '../core/materials'

export function EnvDriver({ hour, rain }) {
  const { scene } = useThree()
  const h = useRef(hour)
  const r = useRef(rain ? 1 : 0)
  useLayoutEffect(() => {
    scene.fog = new THREE.Fog('#fff', 30, 120)
  }, [scene])
  useFrame((_, dt) => {
    let d = hour - h.current
    if (d > 12) d -= 24
    if (d < -12) d += 24
    h.current = (h.current + d * (1 - Math.exp(-dt * 2.2)) + 24) % 24
    r.current += ((rain ? 1 : 0) - r.current) * (1 - Math.exp(-dt * 1.2))
    U.uTime.value += dt
    applyTime(h.current, r.current)
    scene.fog.color.copy(U.uFogColor.value)
    scene.fog.near = U.uFogNear.value
    scene.fog.far = U.uFogFar.value
    updateGlows()
  })
  return null
}
