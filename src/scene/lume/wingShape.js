import * as THREE from 'three'

export function wingShape(w, h) {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.bezierCurveTo(w * 0.2, h * 0.9, w * 0.95, h * 1.05, w, h * 0.35)
  s.bezierCurveTo(w * 1.02, -h * 0.15, w * 0.45, -h * 0.25, 0, 0)
  const g = new THREE.ShapeGeometry(s, 16)
  g.computeBoundingBox()
  const b = g.boundingBox
  const uv = g.attributes.uv
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) - b.min.x) / (b.max.x - b.min.x), (p.getY(i) - b.min.y) / (b.max.y - b.min.y))
  return g
}
