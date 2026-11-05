import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { Sky } from './sky/Sky'
import { Nature } from './nature/Nature'
import { Buildings } from './buildings/Buildings'
import { Creatures } from './creatures/Creatures'
import { Lume } from './lume/Lume'
import { CameraWalker } from './CameraWalker'
import { Effects } from './Effects'

const isLowEnd = () => typeof window !== 'undefined' && (window.innerWidth < 760 || matchMedia('(pointer: coarse)').matches)

export function Scene({ progress, rain, hour, stop, muted, lang, onStop, onMove }) {
  const low = useMemo(isLowEnd, [])
  return (
    <Canvas
      shadows={{ type: THREE.PCFSoftShadowMap }}
      dpr={low ? [1, 1.4] : [1, 1.8]}
      camera={{ fov: 55, near: 0.1, far: 400 }}
      gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
    >
      <Sky hour={hour} rain={rain} low={low} />
      <Nature rain={rain} low={low} />
      <Buildings />
      <Creatures muted={muted} lang={lang} />
      <Lume stop={stop} hour={hour} lang={lang} />
      <CameraWalker progress={progress} onStop={onStop} onMove={onMove} />
      <Effects low={low} />
    </Canvas>
  )
}
