import { useStore } from "@/lib/useStore"
import { SECTIONS } from "@/lib/store"
import { scrollToEl } from "@/lib/scroll"
import { cn } from "@/lib/utils"

const LINKS: { id: (typeof SECTIONS)[number]; label: string }[] = [
  { id: "destinations", label: "Destinations" },
  { id: "experience", label: "Experience" },
  { id: "booking", label: "Book" },
]

export function Nav() {
  const section = useStore((s) => s.section)
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 sm:px-8 sm:py-6">
      <a href="#top" onClick={(e) => (e.preventDefault(), scrollToEl("#top"))} className="group flex items-center gap-2.5">
        <span className="relative grid h-7 w-7 place-items-center">
          <span className="absolute inset-0 rounded-full border border-ember" />
          <span className="absolute h-[2px] w-9 -rotate-[20deg] rounded-full bg-frost/80 transition-transform duration-500 group-hover:rotate-[160deg]" />
        </span>
        <span className="font-display text-lg font-bold tracking-tight">
          travel<span className="text-ember">/</span>orbit
        </span>
      </a>
      <nav className="hidden items-center gap-1 rounded-full glass px-1.5 py-1.5 md:flex">
        {LINKS.map((l) => {
          const active = SECTIONS[section] === l.id
          return (
            <button
              key={l.id}
              onClick={() => scrollToEl(`#${l.id}`)}
              className={cn(
                "rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors",
                active ? "bg-ink text-void" : "text-ink/70 hover:text-ink",
              )}
            >
              {l.label}
            </button>
          )
        })}
      </nav>
      <a
        href="../index.html"
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/70 underline-offset-4 transition-colors hover:text-ember hover:underline"
      >
        Classic site ↗
      </a>
    </header>
  )
}
