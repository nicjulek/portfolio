import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js'
import * as THREE from 'three'

export function surface(sdf, center, half, res, colorFn, rough = () => -1) {
  const band = (half * 4) / res
  const mc = new MarchingCubes(res, new THREE.MeshBasicMaterial(), false, false, 200000)
  const f = mc.field
  const n = mc.size
  const scale = 1200 / half
  for (let k = 0; k < n; k++) {
    const pz = center[2] + ((k - n / 2) / (n / 2)) * half
    for (let j = 0; j < n; j++) {
      const py = center[1] + ((j - n / 2) / (n / 2)) * half
      for (let i = 0; i < n; i++) {
        const px = center[0] + ((i - n / 2) / (n / 2)) * half
        f[i + j * n + k * n * n] = rough(px, py, pz) > band ? mc.isolation - band * scale : mc.isolation - sdf(px, py, pz) * scale
      }
    }
  }
  mc.update()
  const count = mc.count
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    pos[i * 3] = center[0] + mc.positionArray[i * 3] * half
    pos[i * 3 + 1] = center[1] + mc.positionArray[i * 3 + 1] * half
    pos[i * 3 + 2] = center[2] + mc.positionArray[i * 3 + 2] * half
  }
  let g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g = mergeVertices(g, 1e-6)
  const p = g.attributes.position
  const nor = new Float32Array(p.count * 3)
  const col = new Float32Array(p.count * 3)
  const e = 0.0008
  const c = new THREE.Color()
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i)
    const y = p.getY(i)
    const z = p.getZ(i)
    let nx = sdf(x + e, y, z) - sdf(x - e, y, z)
    let ny = sdf(x, y + e, z) - sdf(x, y - e, z)
    let nz = sdf(x, y, z + e) - sdf(x, y, z - e)
    const l = Math.hypot(nx, ny, nz) || 1
    nx /= l
    ny /= l
    nz /= l
    nor.set([nx, ny, nz], i * 3)
    colorFn(x, y, z, nx, ny, nz, c)
    c.toArray(col, i * 3)
  }
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3))
  g.setAttribute('color', new THREE.BufferAttribute(col, 3))
  g.computeBoundingSphere()
  mc.geometry.dispose()
  return g
}
