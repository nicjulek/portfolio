import { STOPS } from '../../data/stops'
import { height, stopObject } from '../../world/terrain'

export function groundY(id, lx, lz) {
  const i = STOPS.findIndex((st) => st.id === id)
  const st = STOPS[i]
  const [ox, oy, oz] = stopObject(st)
  const ry = st.side > 0 ? -Math.PI / 2 : Math.PI / 2
  const wx = ox + lx * Math.cos(ry) + lz * Math.sin(ry)
  const wz = oz - lx * Math.sin(ry) + lz * Math.cos(ry)
  let h = -1e9
  for (const [dx, dz] of [[0, 0], [0.4, 0.4], [-0.4, 0.4], [0.4, -0.4], [-0.4, -0.4], [0, 0.9], [0, -0.9]]) h = Math.max(h, height(wx + dx, wz + dz))
  return h - (oy - 0.06)
}
