import { useRef, useState } from "react"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import { Float, MeshTransmissionMaterial } from "@react-three/drei"
import * as THREE from "three"
import gsap from "gsap"
import { store } from "@/lib/store"
import { overDomControl } from "./Globe"

type ShapeKind = "ico" | "knot" | "capsule" | "torus"

const SHAPES: { kind: ShapeKind; pos: [number, number, number]; desk: [number, number, number]; scale: number; tint: string }[] = [
  { kind: "knot", pos: [-0.9, 1.15, 0], desk: [-2.6, 0.9, 0], scale: 0.55, tint: "#ffd7b8" },
  { kind: "ico", pos: [1.0, 0.55, 0.4], desk: [2.7, 1.1, -0.4], scale: 0.62, tint: "#bdefff" },
  { kind: "capsule", pos: [-0.7, -0.35, 0.6], desk: [-1.5, -1.2, 0.8], scale: 0.42, tint: "#ffffff" },
  { kind: "torus", pos: [0.85, -0.9, 0.2], desk: [1.9, -1.0, 0.5], scale: 0.5, tint: "#ffc29a" },
]

function Geometry({ kind }: { kind: ShapeKind }) {
  switch (kind) {
    case "knot":
      return <torusKnotGeometry args={[0.6, 0.2, 160, 24]} />
    case "ico":
      return <icosahedronGeometry args={[0.8, 0]} />
    case "capsule":
      return <capsuleGeometry args={[0.35, 0.7, 12, 24]} />
    case "torus":
      return <torusGeometry args={[0.55, 0.22, 32, 96]} />
  }
}

function Shape({ i, quality, portrait }: { i: number; quality: "low" | "high"; portrait: boolean }) {
  const s = SHAPES[i]
  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.Mesh>(null)
  const [hover, setHover] = useState(false)
  const visible = useRef(0)

  useFrame((state, dt) => {
    if (!group.current || !mesh.current) return
    const on = store.section === 2 ? 1 : 0
    visible.current = THREE.MathUtils.damp(visible.current, on, on ? 2.2 : 3.5, dt)
    const v = visible.current
    const base = portrait ? s.pos : s.desk
    // fly in from depth with a little stagger per shape
    const lag = THREE.MathUtils.clamp(v * 1.4 - i * 0.1, 0, 1)
    group.current.position.set(base[0] * (0.6 + 0.4 * lag), base[1], base[2] - (1 - lag) * 6)
    const target = s.scale * lag * (hover ? 1.15 : 1)
    const cur = THREE.MathUtils.damp(group.current.scale.x, target, 8, dt)
    group.current.scale.setScalar(Math.max(cur, 0.0001))
    group.current.visible = cur > 0.002
    mesh.current.rotation.x += dt * 0.25
    mesh.current.rotation.y += dt * 0.18
    // gentle look toward pointer
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, state.pointer.x * 0.5, 3, dt)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -state.pointer.y * 0.4, 3, dt)
  })

  const click = (e: ThreeEvent<MouseEvent>) => {
    if (overDomControl(e)) return
    e.stopPropagation()
    if (!mesh.current) return
    gsap.to(mesh.current.rotation, { y: `+=${Math.PI * 2}`, x: `+=${Math.PI}`, duration: 1.4, ease: "expo.out" })
  }

  return (
    <group ref={group} scale={0.0001}>
      <Float speed={1.6} rotationIntensity={0.6} floatIntensity={0.8}>
        <mesh
          ref={mesh}
          onClick={click}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHover(true)
            document.body.dataset.cursor = "pin"
          }}
          onPointerOut={() => {
            setHover(false)
            delete document.body.dataset.cursor
          }}
        >
          <Geometry kind={s.kind} />
          {quality === "high" ? (
            <MeshTransmissionMaterial
              samples={4}
              resolution={256}
              thickness={0.6}
              roughness={0.08}
              ior={1.35}
              chromaticAberration={0.25}
              anisotropicBlur={0.2}
              distortion={0.25}
              distortionScale={0.4}
              temporalDistortion={0.1}
              color={s.tint}
              backside={false}
            />
          ) : (
            // Cheaper look-alike on phones: no transmission render pass.
            <meshPhysicalMaterial
              color={s.tint}
              roughness={0.12}
              metalness={0.1}
              clearcoat={1}
              iridescence={1}
              iridescenceIOR={1.4}
              transparent
              opacity={0.78}
            />
          )}
        </mesh>
      </Float>
    </group>
  )
}

export function GlassObjects({ quality, portrait }: { quality: "low" | "high"; portrait: boolean }) {
  return (
    <>
      {SHAPES.map((_, i) => (
        <Shape key={i} i={i} quality={quality} portrait={portrait} />
      ))}
    </>
  )
}
