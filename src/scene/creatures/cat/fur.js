import * as THREE from 'three'

export const furVert = `
float s = 0.0;
#ifdef USE_INSTANCING
  s = float(gl_InstanceID + 1) / uShells;
#endif
vShell = s;
vBase = position;
transformed += objectNormal * s * uLen;
transformed.y -= s * s * uLen * 0.45;
transformed.z -= s * s * uLen * 0.25;
`

export const furFrag = `
if (vShell > 0.0) {
  vec3 q = vBase * uDensity;
  vec3 cell = floor(q);
  float h = fract(sin(dot(cell, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
  h = 0.35 + h * 0.65;
  vec3 f = fract(q) - 0.5;
  float r = length(f);
  if (vShell > h || r > 0.62 * (1.0 - vShell / h) + 0.08) discard;
}
diffuseColor.rgb *= mix(0.62, 1.1, vShell);
`

export function furMaterial({ len = 0.007, density = 700, shells = 12 } = {}) {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0 })
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uLen = { value: len }
    sh.uniforms.uDensity = { value: density }
    sh.uniforms.uShells = { value: shells }
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uLen; uniform float uShells; varying float vShell; varying vec3 vBase;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n' + furVert)
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uDensity; varying float vShell; varying vec3 vBase;')
      .replace('#include <color_fragment>', '#include <color_fragment>\n' + furFrag)
  }
  m.customProgramCacheKey = () => `fur-${len}-${density}-${shells}`
  return m
}
