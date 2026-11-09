import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { store, emit } from "@/lib/store"
import { lockScroll } from "@/lib/scroll"
import { prefersReducedMotion } from "@/lib/device"

/** Intro curtain: counter → wipe-up reveal of the scene. */
export function Loader() {
  const root = useRef<HTMLDivElement>(null)
  const num = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      lockScroll(true)
      const finish = () => {
        lockScroll(false)
        store.ready = true
        document.documentElement.dataset.ready = "1"
        emit()
        window.dispatchEvent(new Event("app-ready"))
      }
      if (prefersReducedMotion()) {
        gsap.set(root.current, { autoAlpha: 0 })
        finish()
        return
      }
      const counter = { v: 0 }
      const tl = gsap.timeline()
      tl.to(counter, {
        v: 100,
        duration: 1.7,
        ease: "power3.inOut",
        onUpdate: () => {
          if (num.current) num.current.textContent = String(Math.round(counter.v)).padStart(3, "0")
        },
      })
        .to(".loader-bar", { scaleX: 1, duration: 1.7, ease: "power3.inOut" }, 0)
        .to(".loader-meta", { opacity: 0, y: -10, duration: 0.4, stagger: 0.05 })
        .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" }, "-=0.1")
        .add(finish, "-=0.75")
        .set(root.current, { display: "none" })
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[80] flex flex-col justify-between bg-[#0a0d14] p-5 sm:p-10"
      style={{ clipPath: "inset(0 0 0% 0)" }}
      aria-hidden
    >
      <div className="loader-meta flex justify-between eyebrow">
        <span>Travel / Orbit</span>
        <span>Calibrating route</span>
      </div>
      <div className="flex items-end justify-between gap-6">
        <span className="loader-meta font-serif text-3xl italic text-haze sm:text-5xl">to the unknown</span>
        <span ref={num} className="loader-meta font-display text-[22vw] font-extrabold leading-[0.8] tracking-tighter text-ink sm:text-[13vw]">
          000
        </span>
      </div>
      <div className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-ember loader-bar" />
    </div>
  )
}
