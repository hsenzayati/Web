import { useEffect, useRef } from "react"
import gsap from "gsap"
import { isTouch } from "@/lib/device"

/** Trailing ring cursor that swells over links, buttons and 3D pins. */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isTouch() || !ring.current) return
    const x = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" })
    const y = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" })
    const move = (e: PointerEvent) => {
      x(e.clientX)
      y(e.clientY)
      const link = (e.target as HTMLElement)?.closest?.("a,button,[role=combobox]")
      if (link) document.body.dataset.cursorLink = "1"
      else delete document.body.dataset.cursorLink
    }
    window.addEventListener("pointermove", move)
    return () => window.removeEventListener("pointermove", move)
  }, [])

  return <div ref={ring} className="cursor-ring" aria-hidden />
}
