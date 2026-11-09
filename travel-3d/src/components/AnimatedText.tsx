import { useRef, type ElementType } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { prefersReducedMotion } from "@/lib/device"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Props = {
  text: string
  as?: ElementType
  className?: string
  /** "ready" waits for the intro loader, "scroll" plays when scrolled into view. */
  trigger?: "ready" | "scroll" | "none"
  delay?: number
  stagger?: number
}

/**
 * Splits text into words → characters (keeping words unbroken) and reveals them
 * with a staggered masked rise. Screen readers get the plain string.
 */
export function AnimatedText({ text, as: Tag = "span", className, trigger = "scroll", delay = 0, stagger = 0.022 }: Props) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const chars = root.current?.querySelectorAll<HTMLElement>(".split-char")
      if (!chars?.length || trigger === "none") return
      if (prefersReducedMotion()) return

      gsap.set(chars, { yPercent: 115, rotate: 6, opacity: 0 })
      const play = () =>
        gsap.to(chars, {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          duration: 1.1,
          ease: "expo.out",
          stagger,
          delay,
        })

      if (trigger === "ready") {
        if (document.documentElement.dataset.ready) play()
        else window.addEventListener("app-ready", play, { once: true })
        return () => window.removeEventListener("app-ready", play)
      }
      ScrollTrigger.create({ trigger: root.current, start: "top 85%", once: true, onEnter: play })
    },
    { scope: root, dependencies: [text] },
  )

  const words = text.split(" ")
  return (
    <Tag ref={root} className={cn("inline", className)} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} className="split-line" aria-hidden>
          {Array.from(w).map((c, ci) => (
            <span key={ci} className="split-char">
              {c}
            </span>
          ))}
          {wi < words.length - 1 && <span className="split-char">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  )
}
