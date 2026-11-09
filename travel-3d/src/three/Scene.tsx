import { Suspense, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { AdaptiveDpr, Environment, Lightformer, PerformanceMonitor, Sparkles, Stars } from "@react-three/drei"
import * as THREE from "three"
import { store } from "@/lib/store"
import { perfTier } from "@/lib/device"
import { Globe } from "./Globe"
import { GlassObjects } from "./GlassObjects"

type Key = { pos: [number, number, number]; scale: number; cam: [number, number, number] }

// Camera / globe keyframes per section: [landscape, portrait]
const KEYS: [Key, Key][] = [
  // hero
  [
    { pos: [1.55, -0.05, 0], scale: 1.3, cam: [0, 0, 6] },
    { pos: [0, 0.95, 0], scale: 0.92, cam: [0, 0, 6.4] },
  ],
  // destinations
  [
    { pos: [-1.55, 0, 0.4], scale: 1.5, cam: [0, 0, 5.4] },
    { pos: [0, 1.25, 0], scale: 1.0, cam: [0, 0, 6] },
  ],
  // experience: the planet sinks to become a horizon
  [
    { pos: [0, -3.1, -1.5], scale: 2.4, cam: [0, 0.2, 6.2] },
    { pos: [0, -2.8, -1.5], scale: 1.9, cam: [0, 0.1, 6.6] },
  ],
  // booking
  [
    { pos: [2.0, 0.1, -0.6], scale: 1.05, cam: [0, 0, 6] },
    { pos: [0, 1.55, -0.6], scale: 0.75, cam: [0, 0, 6.6] },
  ],
]

function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null)
  const look = useMemo(() => new THREE.Vector3(), [])
  const { size } = useThree()
  const portrait = size.width / size.height < 0.9

  useFrame((state, dt) => {
    dt = Math.min(dt, 0.05)
    const k = KEYS[store.section][portrait ? 1 : 0]
    const g = group.current
    if (g) {
      // slow damping = cinematic, eased transitions between sections
      g.position.x = THREE.MathUtils.damp(g.position.x, k.pos[0], 1.8, dt)
      g.position.y = THREE.MathUtils.damp(g.position.y, k.pos[1], 1.8, dt)
      g.position.z = THREE.MathUtils.damp(g.position.z, k.pos[2], 1.8, dt)
      const s = THREE.MathUtils.damp(g.scale.x, k.scale, 1.8, dt)
      g.scale.setScalar(s)
    }
    // mouse parallax on the camera
    const px = store.pointer.x * (portrait ? 0.15 : 0.45)
    const py = store.pointer.y * (portrait ? 0.1 : 0.28)
    const cam = state.camera
    cam.position.x = THREE.MathUtils.damp(cam.position.x, k.cam[0] + px, 2.5, dt)
    cam.position.y = THREE.MathUtils.damp(cam.position.y, k.cam[1] + py, 2.5, dt)
    cam.position.z = THREE.MathUtils.damp(cam.position.z, k.cam[2], 1.6, dt)
    look.set(0, k.cam[1] * 0.5, 0)
    cam.lookAt(look)
  })

  return <group ref={group}>{children}</group>
}

function Portrait({ children }: { children: (portrait: boolean) => React.ReactNode }) {
  const { size } = useThree()
  return <>{children(size.width / size.height < 0.9)}</>
}

export default function Scene() {
  const tier = useMemo(perfTier, [])
  const [dpr, setDpr] = useState(tier === "high" ? 1.75 : 1.25)

  return (
    <div className="pointer-events-none fixed inset-0 h-[100lvh] w-full" aria-hidden>
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 6], fov: 38, near: 0.1, far: 120 }}
      gl={{ antialias: tier === "high", powerPreference: "high-performance", alpha: false }}
      // Let pointer events reach the 3D scene even though DOM content overlays it.
      eventSource={document.getElementById("root")!}
      eventPrefix="client"
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
    >
      <color attach="background" args={["#05070c"]} />
      <fog attach="fog" args={["#05070c", 9, 40]} />

      <PerformanceMonitor
        flipflops={3}
        onIncline={() => setDpr((d) => Math.min(d + 0.25, tier === "high" ? 2 : 1.5))}
        onDecline={() => setDpr((d) => Math.max(d - 0.25, 0.75))}
      />
      <AdaptiveDpr pixelated={false} />

      {/* Realistic lighting: warm key "sun", cool rim, soft fill */}
      <ambientLight intensity={0.12} />
      <directionalLight position={[5, 3, 4]} intensity={2.4} color="#ffd9b8" />
      <pointLight position={[-6, -2, -4]} intensity={40} color="#4fb6ff" distance={20} />
      <pointLight position={[0, 4, -6]} intensity={18} color="#ff8a3d" distance={20} />

      <Suspense fallback={null}>
        {/* Procedural studio environment — no HDRI download, computed once. */}
        <Environment resolution={tier === "high" ? 256 : 128} frames={1}>
          <Lightformer form="rect" intensity={3} color="#ffd2ad" position={[4, 2, 3]} scale={[4, 2, 1]} />
          <Lightformer form="rect" intensity={2} color="#7fe3ff" position={[-5, 0, -2]} scale={[2, 5, 1]} />
          <Lightformer form="ring" intensity={1.5} color="#ffffff" position={[0, 5, -4]} scale={2} />
          <Lightformer form="circle" intensity={0.6} color="#ff8a3d" position={[0, -5, 2]} scale={6} />
        </Environment>

        <Rig>
          <Globe dotCount={tier === "high" ? 16000 : 8000} pixelRatio={dpr} />
        </Rig>

        <Portrait>{(portrait) => <GlassObjects quality={tier} portrait={portrait} />}</Portrait>

        <Stars radius={50} depth={40} count={tier === "high" ? 3500 : 1200} factor={3} saturation={0} fade speed={0.6} />
        <Sparkles count={tier === "high" ? 60 : 25} scale={[10, 6, 4]} size={2} speed={0.25} color="#ffcfa8" opacity={0.5} />
      </Suspense>
    </Canvas>
    </div>
  )
}
