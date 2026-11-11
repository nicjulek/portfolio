import { createContext, useContext } from 'react'

// 0 = leve, 1 = media, 2 = alta
const KEY = 'portfolio-qualidade'

export const QualityContext = createContext(2)

export const useTier = () => useContext(QualityContext)

// quanto do pelo em camadas cada nivel desenha (1 = todas as camadas)
export const FUR = [0.4, 0.7, 1]

// arvores: quantidade, detalhe da copa e se projetam sombra
export const TREES = [
  { count: 70, detail: 1, shadow: false },
  { count: 100, detail: 1, shadow: true },
  { count: 120, detail: 2, shadow: true }
]

export const DPR = [
  [0.75, 1],
  [1, 1.25],
  [1, 1.8]
]

export const GRASS = [12000, 26000, 62000]

export function detectTier() {
  if (typeof window === 'undefined') return 2
  const forced = new URLSearchParams(window.location.search).get('qualidade')
  if (forced === 'baixa') return 0
  if (forced === 'media') return 1
  if (forced === 'alta') return 2

  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 4
  const small = window.innerWidth < 760 || matchMedia('(pointer: coarse)').matches

  let tier = 2
  if (cores <= 2 || memory <= 2) tier = 0
  else if (small || cores <= 4 || memory <= 4) tier = 1

  const saved = readSaved()
  return saved === null ? tier : Math.min(tier, saved)
}

function readSaved() {
  try {
    const v = sessionStorage.getItem(KEY)
    return v === null ? null : Number(v)
  } catch {
    return null
  }
}

export function rememberTier(tier) {
  try {
    sessionStorage.setItem(KEY, String(tier))
  } catch {
    // sem storage (aba anonima), so nao guarda
  }
}
