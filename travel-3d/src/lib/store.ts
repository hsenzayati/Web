/**
 * A tiny mutable store shared between the DOM (GSAP / ScrollTrigger) and the
 * WebGL scene. It is intentionally NOT React state: the 3D scene reads it every
 * frame inside useFrame, so writing to it never triggers React re-renders.
 */
export type SectionId = "hero" | "destinations" | "experience" | "booking"

export const SECTIONS: SectionId[] = ["hero", "destinations", "experience", "booking"]

type Listener = () => void

export const store = {
  /** Index into SECTIONS of the section currently driving the camera. */
  section: 0,
  /** 0..1 progress through the pinned destinations sequence. */
  destProgress: 0,
  /** Active destination index (derived from destProgress). */
  destIndex: 0,
  /** Normalised pointer, -1..1 on both axes. */
  pointer: { x: 0, y: 0 },
  /** Which pin the user is hovering in 3D (-1 = none). */
  hoverPin: -1,
  /** Set once the intro loader finished. */
  ready: false,
}

const listeners = new Set<Listener>()

export const subscribe = (fn: Listener) => {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export const emit = () => listeners.forEach((fn) => fn())

export const setDestIndex = (i: number) => {
  if (store.destIndex === i) return
  store.destIndex = i
  emit()
}

export const setSection = (i: number) => {
  if (store.section === i) return
  store.section = i
  emit()
}
