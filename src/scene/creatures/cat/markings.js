import * as THREE from 'three'
import { sstep } from './sdf'

export const BLACK = new THREE.Color('#18171c')

export const WHITE = new THREE.Color('#f7f5ef')

export const jitter = (x, y, z) => Math.sin(x * 310 + y * 170) * 0.004 + Math.sin(z * 260 - x * 90) * 0.003

export function bodyColor(x, y, z, nx, ny, nz, c) {
  const j = jitter(x, y, z)
  const bibW = 0.016 + (0.27 - y) * 0.095
  let w = sstep(bibW + 0.008, bibW - 0.004, Math.abs(x) + j) * sstep(-0.01, 0.015, z + j) * sstep(0.29, 0.26, y) * sstep(-0.2, 0.1, nz)
  w = Math.max(w, sstep(0.035, 0.06, z + j) * sstep(0.19, 0.16, y))
  w = Math.max(w, sstep(0.034, 0.022, y + j))
  w = Math.max(w, sstep(0.035, 0.022, Math.abs(x) + j) * sstep(0.08, 0.06, y) * sstep(0.0, 0.03, z))
  c.copy(BLACK).lerp(WHITE, w)
}

export function headColor(x, y, z, nx, ny, nz, c) {
  const j = jitter(x, y, z) * 0.6
  let w = sstep(-0.004, -0.013, y + j) * sstep(0.016, 0.028, z + j) * sstep(0.036, 0.024, Math.abs(x) + j)
  w = Math.max(w, sstep(-0.026, -0.036, y + j) * sstep(-0.01, 0.01, z))
  w *= 1 - sstep(0.035, 0.05, Math.abs(x) - z * 0.2) * 0.0
  const nose = sstep(0.0065, 0.0035, Math.hypot(x, (y + 0.006) * 1.3)) * sstep(0.05, 0.056, z)
  c.copy(BLACK).lerp(WHITE, w)
  if (nose > 0) c.lerp(new THREE.Color('#2a2023'), nose)
}
