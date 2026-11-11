import * as THREE from 'three'

// aneis ao longo da cauda e vertices por anel
export const TAIL_N = 32
export const TAIL_R = 10

// comprimento aproximado da curva, usado so para as coordenadas de repouso do pelo
const REST_LEN = 0.47
const UP = new THREE.Vector3(0, 1, 0)

// A raiz fica enterrada dentro do corpo (assim nunca aparece a boca do tubo),
// a cauda sai rente a anca, contorna o lado direito e a ponta repousa perto das patas.
// So os dois ultimos pontos se mexem: e a ponta que balanca.
function setTailPoints(pts, phase, amp) {
  pts[0].set(0, 0.075, -0.095)
  pts[1].set(0.03, 0.04, -0.152)
  pts[2].set(0.088, 0.02, -0.168)
  pts[3].set(0.132, 0.019, -0.095)
  pts[4].set(0.139, 0.019, 0.0)
  pts[5].set(0.106, 0.022 + amp * 0.02, 0.083 + Math.sin(phase) * 0.012 * amp)
  // o balanco para dentro e limitado para a ponta nao entrar na pata da frente
  const sw = Math.sin(phase)
  pts[6].set(0.068 + sw * (sw < 0 ? 0.014 : 0.03) * amp, 0.034 + amp * 0.04, 0.114 + Math.cos(phase * 0.8) * 0.018 * amp)
}

// raio: afina ao longo da cauda e arredonda na ponta
export function tailRadius(u) {
  const tip = u > 0.92 ? Math.sqrt(1 - (u - 0.92) / 0.08) * 0.9 + 0.1 : 1
  return 0.021 * (1 - u * 0.45) * tip
}

export function createTailGeometry(color) {
  const g = new THREE.BufferGeometry()
  const verts = (TAIL_N + 1) * TAIL_R + 1
  const tip = verts - 1
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts * 3), 3).setUsage(THREE.DynamicDrawUsage))
  g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(verts * 3), 3).setUsage(THREE.DynamicDrawUsage))
  const col = new Float32Array(verts * 3)
  for (let i = 0; i < verts; i++) color.toArray(col, i * 3)
  g.setAttribute('color', new THREE.BufferAttribute(col, 3))

  // posicao de repouso (cauda esticada): o pelo e sorteado a partir dela,
  // entao os fios acompanham a cauda em vez de deslizar quando ela mexe
  const rest = new Float32Array(verts * 3)
  for (let i = 0; i <= TAIL_N; i++) {
    const u = i / TAIL_N
    const r = tailRadius(u)
    for (let j = 0; j < TAIL_R; j++) {
      const a = (j / TAIL_R) * Math.PI * 2
      rest.set([Math.cos(a) * r, Math.sin(a) * r, u * REST_LEN], (i * TAIL_R + j) * 3)
    }
  }
  rest.set([0, 0, REST_LEN + 0.004], tip * 3)
  g.setAttribute('aRest', new THREE.BufferAttribute(rest, 3))

  // a ordem (a, b, c) deixa as faces viradas para fora
  const idx = []
  for (let i = 0; i < TAIL_N; i++)
    for (let j = 0; j < TAIL_R; j++) {
      const a = i * TAIL_R + j
      const b = i * TAIL_R + ((j + 1) % TAIL_R)
      const c = a + TAIL_R
      const d = b + TAIL_R
      idx.push(a, b, c, b, d, c)
    }
  const last = TAIL_N * TAIL_R
  for (let j = 0; j < TAIL_R; j++) idx.push(last + j, last + ((j + 1) % TAIL_R), tip)
  g.setIndex(idx)
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0.07, 0.04, -0.02), 0.22)
  return g
}

// tudo preparado uma vez so: nada e alocado a cada quadro
export function createTailRig() {
  const pts = Array.from({ length: 7 }, () => new THREE.Vector3())
  return {
    phase: 0,
    pts,
    curve: new THREE.CatmullRomCurve3(pts, false, 'centripetal'),
    p: Array.from({ length: TAIL_N + 1 }, () => new THREE.Vector3()),
    t: Array.from({ length: TAIL_N + 1 }, () => new THREE.Vector3()),
    n: new THREE.Vector3(),
    b: new THREE.Vector3(),
    v: new THREE.Vector3()
  }
}

export function poseTail(geo, s, dt, wag) {
  const amp = 0.4 + wag * 0.9
  // a fase e acumulada: se fosse tempo * velocidade, mudar a velocidade ao fazer
  // carinho faria a fase saltar proporcionalmente ao tempo de pagina aberta
  // e a cauda chicoteava descontrolada
  s.phase = (s.phase + Math.min(dt, 0.1) * (1.6 + wag * 3)) % (Math.PI * 20)
  setTailPoints(s.pts, s.phase, amp)
  s.curve.updateArcLengths()

  for (let i = 0; i <= TAIL_N; i++) s.curve.getPointAt(i / TAIL_N, s.p[i])
  for (let i = 0; i <= TAIL_N; i++) {
    const a = s.p[Math.max(0, i - 1)]
    const b = s.p[Math.min(TAIL_N, i + 1)]
    s.t[i].subVectors(b, a).normalize()
  }

  // referencial por transporte paralelo partindo do "para cima":
  // nao vira de repente como os quadros de Frenet quando a curva quase endireita
  const n = s.n.copy(UP).addScaledVector(s.t[0], -s.t[0].dot(UP)).normalize()
  const pos = geo.attributes.position
  const nor = geo.attributes.normal
  for (let i = 0; i <= TAIL_N; i++) {
    const t = s.t[i]
    n.addScaledVector(t, -t.dot(n)).normalize()
    s.b.crossVectors(t, n)
    const p = s.p[i]
    const r = tailRadius(i / TAIL_N)
    for (let j = 0; j < TAIL_R; j++) {
      const a = (j / TAIL_R) * Math.PI * 2
      const v = s.v.copy(n).multiplyScalar(Math.cos(a)).addScaledVector(s.b, Math.sin(a))
      const k = i * TAIL_R + j
      nor.setXYZ(k, v.x, v.y, v.z)
      pos.setXYZ(k, p.x + v.x * r, p.y + v.y * r, p.z + v.z * r)
    }
  }
  const end = s.p[TAIL_N]
  const dir = s.t[TAIL_N]
  const tip = (TAIL_N + 1) * TAIL_R
  pos.setXYZ(tip, end.x + dir.x * 0.004, end.y + dir.y * 0.004, end.z + dir.z * 0.004)
  nor.setXYZ(tip, dir.x, dir.y, dir.z)
  pos.needsUpdate = true
  nor.needsUpdate = true
}
