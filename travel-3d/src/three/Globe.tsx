import { useMemo, useRef } from "react"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import { Html, Line } from "@react-three/drei"
import * as THREE from "three"
import { destinations } from "@/lib/data"
import { store } from "@/lib/store"
import { useStore } from "@/lib/useStore"
import { arcPoints, facingRotation, latLonToVec3, nearestAngle } from "./geo"
import { fbm3 } from "./noise"

const WARM = new THREE.Color("#ff8a3d")
const COOL = new THREE.Color("#7fe3ff")

/* ------------------------------------------------------------------ dots */

const dotVertex = /* glsl */ `
  attribute float aLand;
  attribute float aRand;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vLand;
  varying float vFacing;
  varying float vTwinkle;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * normalize(position));
    vFacing = n.z;
    vLand = aLand;
    vTwinkle = 0.65 + 0.35 * sin(uTime * (0.8 + aRand * 2.2) + aRand * 40.0);
    float size = uSize * mix(0.55, 1.0, aLand) * (0.85 + aRand * 0.3);
    gl_PointSize = size * uPixelRatio * (8.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`

const dotFragment = /* glsl */ `
  uniform vec3 uWarm;
  uniform vec3 uCool;
  varying float vLand;
  varying float vFacing;
  varying float vTwinkle;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float disc = smoothstep(0.5, 0.15, d);
    // Fade toward the limb so the sphere reads as volumetric.
    float limb = smoothstep(-0.15, 0.55, vFacing);
    vec3 col = mix(uCool * 0.55, mix(uWarm, vec3(1.0, 0.93, 0.85), 0.35), vLand);
    float alpha = disc * limb * mix(0.35, 1.0, vLand) * vTwinkle;
    gl_FragColor = vec4(col, alpha);
  }
`

function Dots({ count, pixelRatio }: { count: number; pixelRatio: number }) {
  const material = useRef<THREE.ShaderMaterial>(null)

  const geometry = useMemo(() => {
    const pins = destinations.map((d) => latLonToVec3(d.lat, d.lon))
    const pos: number[] = []
    const land: number[] = []
    const rand: number[] = []
    const golden = Math.PI * (3 - Math.sqrt(5))
    const p = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const t = golden * i
      p.set(Math.cos(t) * r, y, Math.sin(t) * r)
      let n = fbm3(p.x * 1.7 + 3.1, p.y * 1.7 + 1.3, p.z * 1.7 + 7.7)
      // Make sure every destination sits on land.
      for (const pin of pins) {
        const a = p.angleTo(pin)
        if (a < 0.2) n = Math.max(n, 0.6 - a)
      }
      const isLand = n > 0.53 ? 1 : 0
      // Keep the ocean as a sparse grid so continents stand out.
      if (!isLand && Math.random() > 0.32) continue
      pos.push(p.x * 1.002, p.y * 1.002, p.z * 1.002)
      land.push(isLand)
      rand.push(Math.random())
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute("aLand", new THREE.Float32BufferAttribute(land, 1))
    g.setAttribute("aRand", new THREE.Float32BufferAttribute(rand, 1))
    return g
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 2.1 },
      uPixelRatio: { value: pixelRatio },
      uWarm: { value: WARM },
      uCool: { value: COOL },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame((state) => {
    if (!material.current) return
    material.current.uniforms.uTime.value = state.clock.elapsedTime
    material.current.uniforms.uPixelRatio.value = state.gl.getPixelRatio()
  })

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={material}
        vertexShader={dotVertex}
        fragmentShader={dotFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ------------------------------------------------------------ atmosphere */

const atmoVertex = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const atmoFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  varying vec3 vNormal;
  void main() {
    float i = pow(max(0.0, 0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0))), uPower);
    gl_FragColor = vec4(uColor, 1.0) * i * 1.6;
  }
`

function Atmosphere() {
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color("#ffb37a") }, uPower: { value: 3.2 } }),
    [],
  )
  return (
    <mesh scale={1.2}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        vertexShader={atmoVertex}
        fragmentShader={atmoFragment}
        uniforms={uniforms}
        side={THREE.BackSide}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

/* ------------------------------------------------------------------ pins */

const UP = new THREE.Vector3(0, 1, 0)

/** True when the pointer is actually over a DOM control layered above the canvas. */
export const overDomControl = (e: { nativeEvent: Event }) => {
  const t = e.nativeEvent.target as HTMLElement | null
  return !!t?.closest?.("a,button,input,select,textarea,label,[role=combobox],[role=dialog],[data-no3d]")
}

function Pin({ index }: { index: number }) {
  const d = destinations[index]
  const active = useStore((s) => s.destIndex === index && s.section === 1)
  const ring = useRef<THREE.Mesh>(null)
  const head = useRef<THREE.Mesh>(null)
  const hovered = useRef(false)

  const { pos, quat } = useMemo(() => {
    const p = latLonToVec3(d.lat, d.lon, 1.0)
    const q = new THREE.Quaternion().setFromUnitVectors(UP, p.clone().normalize())
    return { pos: p, quat: q }
  }, [d])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const on = active || hovered.current
    if (ring.current) {
      const k = (t * 0.8 + index * 0.13) % 1
      ring.current.scale.setScalar(0.4 + k * (on ? 2.4 : 1.3))
      ;(ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - k) * (on ? 0.9 : 0.45)
    }
    if (head.current) {
      const s = THREE.MathUtils.damp(head.current.scale.x, on ? 1.8 : 1, 8, dt)
      head.current.scale.setScalar(s)
    }
  })

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    hovered.current = true
    store.hoverPin = index
    document.body.dataset.cursor = "pin"
  }
  const out = () => {
    hovered.current = false
    if (store.hoverPin === index) store.hoverPin = -1
    delete document.body.dataset.cursor
  }
  const click = (e: ThreeEvent<MouseEvent>) => {
    if (overDomControl(e)) return
    e.stopPropagation()
    window.dispatchEvent(new CustomEvent("goto-destination", { detail: index }))
  }

  return (
    <group position={pos} quaternion={quat}>
      {/* stem */}
      <mesh position={[0, 0.045, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.09, 6]} />
        <meshBasicMaterial color={active ? "#ffffff" : "#ffcfa8"} toneMapped={false} />
      </mesh>
      {/* head — also the hit target */}
      <mesh ref={head} position={[0, 0.095, 0]} onPointerOver={over} onPointerOut={out} onClick={click}>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshBasicMaterial color={active ? "#ffffff" : "#ff8a3d"} toneMapped={false} />
      </mesh>
      {/* pulse */}
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[0.03, 0.036, 40]} />
        <meshBasicMaterial color="#ff8a3d" transparent depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      {active && (
        <Html position={[0, 0.16, 0]} center distanceFactor={6} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <div className="pin-label">
            <span className="pin-label__dot" />
            {d.city}
          </div>
        </Html>
      )}
    </group>
  )
}

/* ------------------------------------------------------------------ arcs */

function Arcs() {
  const lines = useRef<(THREE.Object3D | null)[]>([])
  const routes = useMemo(() => {
    const v = destinations.map((d) => latLonToVec3(d.lat, d.lon, 1.0))
    return v.slice(0, -1).map((a, i) => arcPoints(a, v[i + 1]))
  }, [])

  useFrame((_, dt) => {
    lines.current.forEach((l, i) => {
      if (!l) return
      const m = (l as unknown as { material: { dashOffset: number; opacity: number } }).material
      m.dashOffset -= dt * 0.25
      const lit = store.section === 1 && (store.destIndex === i || store.destIndex === i + 1)
      m.opacity = THREE.MathUtils.damp(m.opacity, lit ? 0.95 : 0.28, 6, dt)
    })
  })

  return (
    <>
      {routes.map((pts, i) => (
        <Line
          key={i}
          ref={(el) => {
            lines.current[i] = el as unknown as THREE.Object3D
          }}
          points={pts}
          color="#ffd2ad"
          lineWidth={1.4}
          dashed
          dashSize={0.04}
          gapSize={0.03}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      ))}
    </>
  )
}

/* ----------------------------------------------------------------- orbit */

function Orbit() {
  const sat = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!sat.current) return
    const t = state.clock.elapsedTime * 0.35
    sat.current.position.set(Math.cos(t) * 1.55, 0, Math.sin(t) * 1.55)
    sat.current.rotation.y = -t
  })
  return (
    <group rotation={[0.35, 0, -0.42]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.55, 0.0025, 8, 200]} />
        <meshBasicMaterial color="#7fe3ff" transparent opacity={0.35} toneMapped={false} />
      </mesh>
      <group ref={sat}>
        <mesh>
          <boxGeometry args={[0.05, 0.035, 0.035]} />
          <meshStandardMaterial color="#d9dde6" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.075]}>
          <boxGeometry args={[0.004, 0.03, 0.09]} />
          <meshStandardMaterial color="#2a4f8a" metalness={0.6} roughness={0.3} emissive="#0d2a55" />
        </mesh>
        <mesh position={[0, 0, -0.075]}>
          <boxGeometry args={[0.004, 0.03, 0.09]} />
          <meshStandardMaterial color="#2a4f8a" metalness={0.6} roughness={0.3} emissive="#0d2a55" />
        </mesh>
      </group>
    </group>
  )
}

/* ----------------------------------------------------------------- globe */

export function Globe({ dotCount, pixelRatio }: { dotCount: number; pixelRatio: number }) {
  const tilt = useRef<THREE.Group>(null)
  const spin = useRef<THREE.Group>(null)
  const drag = useRef({ active: false, x: 0, y: 0, vx: 0, vy: 0, offX: 0 })
  const angle = useRef({ x: 0.3, y: 0 })

  const facing = useMemo(() => destinations.map((d) => facingRotation(d.lat, d.lon)), [])

  useFrame((state, dt) => {
    if (!tilt.current || !spin.current) return
    dt = Math.min(dt, 0.05)
    const a = angle.current
    const g = drag.current
    const inDest = store.section === 1

    if (!g.active) {
      // inertia from a drag
      a.y += g.vx * dt
      g.offX = THREE.MathUtils.damp(g.offX + g.vy * dt, 0, 1.6, dt)
      g.vx = THREE.MathUtils.damp(g.vx, 0, 2.2, dt)
      g.vy = THREE.MathUtils.damp(g.vy, 0, 2.2, dt)
    }

    if (inDest && !g.active) {
      const f = facing[store.destIndex]
      // offset slightly so the pin sits off-centre toward the copy
      const ty = nearestAngle(a.y, f.y - 0.18)
      a.y = THREE.MathUtils.damp(a.y, ty, 2.6, dt)
      a.x = THREE.MathUtils.damp(a.x, f.x * 0.85, 2.6, dt)
    } else {
      a.y += dt * (store.section === 2 ? 0.05 : 0.11)
      a.x = THREE.MathUtils.damp(a.x, 0.32, 1.5, dt)
    }

    tilt.current.rotation.x = a.x + g.offX + state.pointer.y * 0.05
    spin.current.rotation.y = a.y
  })

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    if (e.pointerType === "touch" || overDomControl(e)) return // keep native scroll on touch
    e.stopPropagation()
    drag.current.active = true
    drag.current.x = e.clientX
    drag.current.y = e.clientY
    document.body.dataset.cursor = "grab"
    const up = () => {
      drag.current.active = false
      delete document.body.dataset.cursor
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
    }
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - drag.current.x
      const dy = ev.clientY - drag.current.y
      drag.current.x = ev.clientX
      drag.current.y = ev.clientY
      angle.current.y += dx * 0.006
      drag.current.offX = THREE.MathUtils.clamp(drag.current.offX + dy * 0.004, -0.6, 0.6)
      drag.current.vx = dx * 0.6
      drag.current.vy = dy * 0.15
    }
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
  }

  return (
    <group ref={tilt}>
      <group ref={spin}>
        {/* Physical core — picks up the studio Lightformers for realistic sheen */}
        <mesh onPointerDown={onDown}>
          <sphereGeometry args={[0.985, 96, 96]} />
          <meshPhysicalMaterial
            color="#0a1424"
            roughness={0.42}
            metalness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.18}
            sheen={1}
            sheenColor="#ff9a5a"
            sheenRoughness={0.6}
          />
        </mesh>
        <Dots count={dotCount} pixelRatio={pixelRatio} />
        <Arcs />
        {destinations.map((d, i) => (
          <Pin key={d.id} index={i} />
        ))}
      </group>
      <Atmosphere />
      <Orbit />
    </group>
  )
}
