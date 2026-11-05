import { STOPS } from '../data/stops'

export const Z_START = 40

export const Z_END = -60

export const pathX = (z) => 5 * Math.sin(z * 0.055) + 2 * Math.sin(z * 0.13)

export function baseHeight(x, z) {
  const d = Math.abs(x - pathX(z))
  const k = Math.min(1, Math.max(0, (d - 2.5) / 9))
  const hills = 0.9 * Math.sin(x * 0.21 + z * 0.09) + 0.7 * Math.cos(z * 0.16 - x * 0.11) + 0.4 * Math.sin(x * 0.5)
  return hills * k + Math.max(0, d - 13) * 0.35 + 0.15 * Math.sin(z * 0.3)
}

export const STREAM_Z = -21

export const height = (x, z) => baseHeight(x, z) - 1.1 * Math.max(0, 1 - Math.abs(z - STREAM_Z) / 2.4)

export const CAT_SPOT = { x: pathX(29.6) + 2.5, z: 29.6 }

export const stopObject = (s) => {
  const x = pathX(s.z) + s.side * s.dist
  return [x, height(x, s.z), s.z]
}

export const tOfZ = (z) => (Z_START - z) / (Z_START - Z_END)

export const zOfT = (t) => Z_START - t * (Z_START - Z_END)

export const stopT = (s) => tOfZ(s.z + s.dist * 0.75)

export const OBJ = STOPS.map(stopObject)
