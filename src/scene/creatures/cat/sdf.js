export const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

export const sstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

export function ell(px, py, pz, c, r, pitch = 0) {
  let x = px - c[0]
  let y = py - c[1]
  let z = pz - c[2]
  if (pitch) {
    const cs = Math.cos(pitch)
    const sn = Math.sin(pitch)
    const y2 = y * cs - z * sn
    z = y * sn + z * cs
    y = y2
  }
  const ax = x / r[0], ay = y / r[1], az = z / r[2]
  const k0 = Math.sqrt(ax * ax + ay * ay + az * az)
  const bx = ax / r[0], by = ay / r[1], bz = az / r[2]
  const k1 = Math.sqrt(bx * bx + by * by + bz * bz)
  return (k0 * (k0 - 1)) / k1
}

export function cap(px, py, pz, a, b, ra, rb) {
  const pax = px - a[0]
  const pay = py - a[1]
  const paz = pz - a[2]
  const bax = b[0] - a[0]
  const bay = b[1] - a[1]
  const baz = b[2] - a[2]
  const h = clamp((pax * bax + pay * bay + paz * baz) / (bax * bax + bay * bay + baz * baz), 0, 1)
  const qx = pax - bax * h, qy = pay - bay * h, qz = paz - baz * h
  return Math.sqrt(qx * qx + qy * qy + qz * qz) - (ra + (rb - ra) * h)
}

export function smin(a, b, k) {
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.min(a, b) - h * h * k * 0.25
}

export function bodySdf(x, y, z) {
  let d = ell(x, y, z, [0, 0.112, -0.045], [0.074, 0.098, 0.104])
  d = smin(d, ell(x, y, z, [0, 0.185, 0.026], [0.056, 0.086, 0.055], -0.25), 0.04)
  d = smin(d, ell(x, y, z, [0, 0.212, -0.02], [0.052, 0.058, 0.066]), 0.04)
  d = smin(d, ell(x, y, z, [0, 0.05, 0.0], [0.06, 0.05, 0.07]), 0.03)
  for (const s of [-1, 1]) {
    d = smin(d, ell(x, y, z, [s * 0.05, 0.07, -0.07], [0.049, 0.066, 0.088]), 0.035)
    d = smin(d, cap(x, y, z, [s * 0.031, 0.17, 0.042], [s * 0.032, 0.028, 0.084], 0.024, 0.0185), 0.022)
    d = smin(d, ell(x, y, z, [s * 0.032, 0.015, 0.097], [0.0215, 0.0155, 0.029]), 0.014)
    d = smin(d, ell(x, y, z, [s * 0.064, 0.014, -0.004], [0.019, 0.014, 0.045]), 0.02)
  }
  d = smin(d, cap(x, y, z, [0, 0.222, 0.018], [0, 0.276, 0.046], 0.046, 0.04), 0.03)
  return Math.max(d, -y + 0.001)
}

export const bodyRough = (x, y, z) => {
  const dx = Math.abs(x) - 0.14
  const dy = Math.abs(y - 0.15) - 0.15
  const dz = Math.abs(z + 0.03) - 0.155
  return Math.max(dx, dy, dz)
}

export const EYE = 0.0105

export const EYE_POS = [0.0215, 0.006, 0.043]

export function headSdf(x, y, z) {
  let d = ell(x, y, z, [0, 0.008, -0.008], [0.05, 0.043, 0.047])
  d = smin(d, ell(x, y, z, [0, -0.008, -0.03], [0.042, 0.04, 0.035]), 0.02)
  for (const s of [-1, 1]) {
    d = smin(d, ell(x, y, z, [s * 0.024, -0.014, 0.012], [0.033, 0.028, 0.03]), 0.016)
    d = smin(d, ell(x, y, z, [s * 0.0105, -0.021, 0.047], [0.0145, 0.0125, 0.0125]), 0.008)
  }
  d = smin(d, ell(x, y, z, [0, -0.019, 0.04], [0.022, 0.017, 0.019]), 0.012)
  d = smin(d, ell(x, y, z, [0, -0.035, 0.033], [0.0135, 0.0095, 0.013]), 0.01)
  d = smin(d, ell(x, y, z, [0, 0.001, 0.04], [0.0135, 0.014, 0.016]), 0.012)
  for (const s of [-1, 1]) {
    const e = Math.hypot(x - s * EYE_POS[0], y - EYE_POS[1], z - EYE_POS[2]) - EYE * 1.02
    d = Math.max(d, -e)
  }
  return d
}
