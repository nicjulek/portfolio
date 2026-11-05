import { useMemo } from 'react'
import * as THREE from 'three'
import { U } from '../core/env'
import { STREAM_Z } from '../../world/terrain'

export function Stream() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          uTime: U.uTime,
          uSkyTop: U.uSkyTop,
          uHorizon: U.uHorizon,
          uLightColor: U.uLightColor,
          uLightDir: U.uLightDir,
          uDay: U.uDay,
          uFogColor: U.uFogColor,
          uFogNear: U.uFogNear,
          uFogFar: U.uFogFar
        },
        vertexShader: `varying vec2 vUv; varying vec3 vW; varying float vFogDepth;
          void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; vec4 mv = viewMatrix * w; vFogDepth = -mv.z; gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `uniform float uTime; uniform vec3 uSkyTop; uniform vec3 uHorizon; uniform vec3 uLightColor; uniform vec3 uLightDir; uniform float uDay;
          uniform vec3 uFogColor; uniform float uFogNear; uniform float uFogFar;
          varying vec2 vUv; varying vec3 vW; varying float vFogDepth;
          void main(){
            vec3 deep = vec3(0.05, 0.16, 0.2) * (0.4 + uDay * 0.6);
            vec3 V = normalize(cameraPosition - vW);
            float fres = pow(1.0 - max(V.y, 0.0), 2.5);
            vec3 col = mix(deep, mix(uHorizon, uSkyTop, 0.35), 0.35 + fres * 0.55);
            float flow = sin(vW.x * 1.3 + uTime * 2.2 + sin(vW.z * 4.0 + uTime) * 1.5);
            float flow2 = sin(vW.x * 3.1 - uTime * 3.0 + vW.z * 2.0);
            float foam = smoothstep(0.92, 1.0, flow) * 0.5 + smoothstep(0.96, 1.0, flow2) * 0.35;
            float edge = smoothstep(0.38, 0.5, abs(vUv.y - 0.5));
            col += vec3(foam + edge * 0.35) * (0.4 + uDay * 0.6);
            vec3 R = reflect(-uLightDir, vec3(0.0, 1.0, 0.0));
            col += uLightColor * pow(max(dot(R, V), 0.0), 60.0) * 0.8;
            gl_FragColor = vec4(col, 0.92);
            gl_FragColor.rgb = mix(gl_FragColor.rgb, uFogColor, smoothstep(uFogNear, uFogFar, vFogDepth));
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`
      }),
    []
  )
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.42, STREAM_Z]} material={mat}>
      <planeGeometry args={[190, 2.9, 200, 4]} />
    </mesh>
  )
}
