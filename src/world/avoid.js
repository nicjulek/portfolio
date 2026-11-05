import { STOPS } from '../data/stops'
import { CAT_SPOT, OBJ, STREAM_Z, pathX } from './terrain'

const RADIUS = { ponto: 2.8, antena: 4.6, prefeitura: 5, galpao: 4, atelie: 3, varal: 3, arvore: 7.5 }

export function avoid(x, z, extra = 0) {
  if ((x - CAT_SPOT.x) ** 2 + (z - CAT_SPOT.z) ** 2 < (0.75 + extra) ** 2) return true
  for (let i = 0; i < OBJ.length; i++) {
    const r = RADIUS[STOPS[i].id] + extra
    const [ox, , oz] = OBJ[i]
    if ((ox - x) ** 2 + (oz - z) ** 2 < r * r) return true
  }
  return Math.abs(z - STREAM_Z) < 3.2 && Math.abs(x - pathX(STREAM_Z)) < 1.6
}
