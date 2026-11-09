const mq = (q: string) => typeof window !== "undefined" && window.matchMedia(q).matches

export const isTouch = () => mq("(pointer: coarse)")
export const prefersReducedMotion = () => mq("(prefers-reduced-motion: reduce)")

/** Rough performance tier used to scale particle counts and material quality. */
export const perfTier = (): "low" | "high" => {
  if (typeof window === "undefined") return "high"
  const small = window.innerWidth < 768
  const cores = navigator.hardwareConcurrency ?? 4
  return isTouch() || small || cores <= 4 ? "low" : "high"
}
