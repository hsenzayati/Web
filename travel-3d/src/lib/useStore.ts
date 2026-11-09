import { useSyncExternalStore } from "react"
import { store, subscribe } from "./store"

/** Subscribe a React component to a slice of the shared store. */
export function useStore<T>(select: (s: typeof store) => T): T {
  return useSyncExternalStore(subscribe, () => select(store), () => select(store))
}
