import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { LIVE, U } from '../core/env'

export function Lights({ quality }) {
  const sun = useRef()
  const hemi = useRef()
  const fill = useRef()
  const target = useMemo(() => new THREE.Object3D(), [])
  const fwd = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ camera }) => {
    camera.getWorldDirection(fwd)
    fwd.y = 0
    fwd.normalize()
    target.position.copy(camera.position).addScaledVector(fwd, 14)
    target.position.y = 0
    target.updateMatrixWorld()
    sun.current.position.copy(target.position).addScaledVector(U.uLightDir.value, 60)
    sun.current.color.copy(U.uLightColor.value)
    sun.current.intensity = LIVE.lightIntensity
    hemi.current.color.copy(U.uHemiSky.value)
    hemi.current.groundColor.copy(U.uHemiGround.value)
    hemi.current.intensity = LIVE.hemiIntensity
    fill.current.color.copy(U.uHorizon.value)
    fill.current.intensity = 0.25 + U.uDay.value * 0.2
  })
  const size = quality === 'low' ? 1024 : 2048
  return (
    <>
      <primitive object={target} />
      <directionalLight
        ref={sun}
        target={target}
        castShadow
        shadow-mapSize={[size, size]}
        shadow-camera-left={-34}
        shadow-camera-right={34}
        shadow-camera-top={34}
        shadow-camera-bottom={-34}
        shadow-camera-near={1}
        shadow-camera-far={140}
        shadow-bias={-0.0004}
        shadow-normalBias={0.05}
        shadow-radius={4}
      />
      <hemisphereLight ref={hemi} />
      <directionalLight ref={fill} position={[-30, 12, 40]} />
    </>
  )
}
