import { useEffect, useRef, useState } from 'react'
import { STOPS } from '../data/stops'
import { stopT } from '../world/terrain'

export const STOP_TS = STOPS.map(stopT)
const clamp = (v) => Math.min(1, Math.max(0, v))

export function useTrailControls() {
  const progress = useRef(0)
  const [moved, setMoved] = useState(false)

  const goTo = (i) => {
    progress.current = STOP_TS[i]
    setMoved(true)
  }

  const jump = (dir) => {
    const p = progress.current
    const i = dir > 0 ? STOP_TS.findIndex((t) => t > p + 0.01) : STOP_TS.findLastIndex((t) => t < p - 0.01)
    if (i >= 0) goTo(i)
    else progress.current = dir > 0 ? 1 : 0
    setMoved(true)
  }

  const jumpRef = useRef(jump)
  jumpRef.current = jump

  useEffect(() => {
    const go = (d) => {
      progress.current = clamp(progress.current + d)
      if (progress.current > 0.01) setMoved(true)
    }
    const wheel = (e) => {
      if (e.target.closest('.card, .lightbox')) return
      go(e.deltaY * 0.00022)
    }
    let ty = null
    const touchStart = (e) => {
      if (e.target.closest('.card, button, label, .lightbox')) return
      ty = e.touches[0].clientY
    }
    const touchMove = (e) => {
      if (ty === null) return
      const y = e.touches[0].clientY
      go((ty - y) * 0.0009)
      ty = y
    }
    const touchEnd = () => (ty = null)
    const key = (e) => {
      if (document.querySelector('.lightbox')) return
      if (e.target.closest && e.target.closest('button, select')) return
      if (['ArrowDown', 'ArrowRight', ' ', 'PageDown'].includes(e.key)) jumpRef.current(1)
      if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) jumpRef.current(-1)
    }
    const listeners = [
      ['wheel', wheel, { passive: true }],
      ['touchstart', touchStart, { passive: true }],
      ['touchmove', touchMove, { passive: true }],
      ['touchend', touchEnd],
      ['keydown', key]
    ]
    listeners.forEach(([e, fn, o]) => window.addEventListener(e, fn, o))
    return () => listeners.forEach(([e, fn]) => window.removeEventListener(e, fn))
  }, [])

  return { progress, moved, goTo, jump }
}
