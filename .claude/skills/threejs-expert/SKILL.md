---
name: threejs-expert
description: Expertise for building premium, cinematic, interactive 3D websites with Three.js, React Three Fiber, Drei and GSAP — realistic lighting and shadows, camera animation, GLTF/GLB models, scroll-triggered animation, mouse parallax, responsive 3D and performance tuning. Use when creating or improving any 3D scene, WebGL hero section, product viewer, or scroll-driven 3D experience.
---

# Three.js Expert

Build 3D web experiences that look premium and stay fast on phones.

## 1. Setup

Detect the framework first (`package.json`).

**React (Vite recommended):**
```bash
npm create vite@latest my-3d-site -- --template react-ts
cd my-3d-site
npm i three @react-three/fiber @react-three/drei gsap @gsap/react
npm i -D @types/three
```
Version pairing: React 19 → `@react-three/fiber@9` + `@react-three/drei@10`. React 18 → fiber 8 + drei 9.
Optional: `@react-three/postprocessing` (bloom, DOF), `lenis` (smooth scroll), `maath` (easing helpers).

**Vanilla:** `npm i three gsap` and import addons from `three/addons/...` (e.g. `three/addons/loaders/GLTFLoader.js`).

Always check current APIs with official docs: https://threejs.org/docs, https://r3f.docs.pmnd.rs, https://drei.docs.pmnd.rs, https://gsap.com/docs.

## 2. Scene architecture (R3F)

- One fixed full-screen `<Canvas>` behind the DOM content: wrap it in `position: fixed; inset: 0; pointer-events: none`, and pass `eventSource={document.getElementById("root")}` with `eventPrefix="client"` so 3D objects still receive pointer events.
- Never put per-frame values in React state. Keep them in a plain mutable store (or refs) written by GSAP/ScrollTrigger and read inside `useFrame`.
- Animate with frame-rate-independent damping: `THREE.MathUtils.damp(current, target, lambda, delta)`. Clamp `delta` (`Math.min(dt, 0.05)`) so you don't get jumps after a tab switch.
- Wrap anything that loads in `<Suspense>`. Use `useProgress` from drei for a real loader.

```tsx
<Canvas dpr={[1, 1.75]} camera={{ fov: 38, position: [0, 0, 6] }} shadows
  gl={{ antialias: true, powerPreference: "high-performance" }}>
  <Suspense fallback={null}><Experience /></Suspense>
</Canvas>
```

## 3. Realistic lighting and shadows

- Image-based lighting is the biggest realism win: `<Environment preset="city" />`, or a procedural studio made of `<Lightformer>` children (no HDRI download; set `frames={1}` to bake it once).
- Use a key/rim/fill setup: a warm `directionalLight` key, a cool rim light behind the subject, and a low `ambientLight`.
- Tone mapping: R3F defaults to ACESFilmic. Tune `gl.toneMappingExposure` and keep `outputColorSpace` sRGB (the default).
- Shadows: put `shadows` on Canvas, `castShadow` on the light and meshes, and `receiveShadow` on the ground. Keep `shadow-mapSize` at 1024–2048 and fit the shadow camera tightly (`shadow-camera-left/right/top/bottom`).
- Cheaper alternatives: `<ContactShadows>` or `<AccumulativeShadows>` + `<RandomizedLight>` (baked, soft), or `<SoftShadows>`.
- Materials: `meshPhysicalMaterial` (clearcoat, sheen, iridescence, transmission) for hero objects. Use drei `MeshTransmissionMaterial` for glass on desktop only.

## 4. GLTF / GLB models

- Load with `const { scene, nodes, materials, animations } = useGLTF("/model.glb")` and call `useGLTF.preload("/model.glb")` at the bottom of the module.
- Generate typed JSX components with `npx gltfjsx model.glb --transform --types`. `--transform` applies Draco/Meshopt compression, texture resizing and WebP.
- Compress offline: `npx @gltf-transform/cli optimize in.glb out.glb --texture-compress webp`.
- For skeletal animation use `useAnimations(animations, ref)`, then `actions.Idle?.reset().fadeIn(0.5).play()`.
- Put models in `public/` and keep them under ~3–5 MB. Center and normalize them with drei `<Center>` or `<Bounds fit>`.

## 5. Cinematic camera

- Define keyframes per section (position, lookAt target, fov) and damp the camera toward the active keyframe each frame. Slow lambdas (1.5–2.5) feel cinematic.
- For authored moves, build a GSAP timeline on `camera.position` / a target vector and call `camera.lookAt(target)` in `onUpdate` or in `useFrame`.
- Spline paths: `new THREE.CatmullRomCurve3(points)`, then `curve.getPointAt(progress)` driven by scroll.
- drei `<CameraControls>` gives programmatic `setLookAt(..., true)` transitions. Don't let OrbitControls fight scroll-driven cameras.

## 6. GSAP and scroll-triggered animation

```ts
import gsap from "gsap"; import { ScrollTrigger } from "gsap/ScrollTrigger"; import { useGSAP } from "@gsap/react"
gsap.registerPlugin(ScrollTrigger, useGSAP)
```
- Since GSAP 3.13, all plugins (ScrollTrigger, SplitText, ScrambleText, ScrollSmoother, MorphSVG…) are free and ship in the `gsap` package.
- Always animate inside `useGSAP(() => {...}, { scope })` so it reverts automatically on unmount and in StrictMode.
- Scrubbed 3D: `ScrollTrigger.create({ trigger, start: "top top", end: "+=300%", pin: true, scrub: 1, onUpdate: s => (store.progress = s.progress) })`, then read `store.progress` in `useFrame`.
- Smooth scroll with Lenis: `lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0)`.
- Typography: `SplitText` (or a manual split into chars inside `overflow:hidden` wrappers), then `gsap.from(chars, { yPercent: 110, stagger: 0.02, ease: "expo.out" })`.
- Create pinned triggers before the triggers that come after them, and call `ScrollTrigger.refresh()` after fonts or images load.

## 7. Mouse interaction and parallax

- `state.pointer` (−1..1) is available in `useFrame`. Offset camera x/y by `pointer * 0.3` with damping. On the DOM side, use `gsap.quickTo(el, "x")` per depth layer.
- Raycast events: `onPointerOver/Out/Click` on meshes. Call `e.stopPropagation()` and set a cursor state. Skip 3D handling when `e.nativeEvent.target` is a DOM control.
- Drag to rotate with inertia: store velocity on pointer move and damp it to 0. Disable dragging on touch so native scrolling keeps working.
- Also available: drei `<Float>`, `<PresentationControls>` and `<Html>` (labels anchored to 3D points).

## 8. Responsive 3D

- Read `useThree(s => s.size)` / `s.viewport`. Switch keyframes for portrait (`width/height < 0.9`): center the object and move it up so the copy can sit below.
- Scale the scene, not the font: keep the subject's size relative to `viewport.width`.
- Use `100lvh` for the fixed canvas on mobile so it doesn't jump when the browser toolbar shows or hides.

## 9. Performance (mobile first)

- Cap DPR: `dpr={[1, 1.5]}` on mobile, up to 2 on desktop. Use `<PerformanceMonitor onDecline>` to lower DPR, and `<AdaptiveDpr>`.
- Detect a quality tier (`pointer: coarse`, width < 768, `hardwareConcurrency <= 4`). For low tiers, reduce particle counts, drop transmission/postprocessing and use smaller shadow maps.
- Use `<Instances>`/`InstancedMesh` for repeated objects, and `Points` with a custom shader for particles. Merge static geometry.
- Reuse geometries and materials (`useMemo`). Never allocate `new Vector3()` inside `useFrame`.
- Use `frameloop="demand"` with `invalidate()` for static viewers. Pause work when an object is off screen.
- Textures: KTX2/WebP at power-of-two sizes. Models: Draco/Meshopt via gltfjsx `--transform`.
- Check `gl.info.render.calls` (aim for < 100 draw calls), and profile with `r3f-perf` or Spector.js.
- Respect `prefers-reduced-motion`: disable smooth scroll, auto-rotation and large camera moves.

## 10. Design quality checklist

- One strong hero object, a restrained palette (one warm accent plus one cool rim), and generous negative space.
- Avoid generic AI looks: purple gradients, everything centered, Inter everywhere. Pair a characterful display face with a mono for labels.
- Use a loader or intro that masks shader compilation (`gl.compile(scene, camera)` during the loader).
- Before shipping, test on a real phone: 60 fps scroll, no layout shift, readable text over the 3D.

## Verify

Run `npm run dev`, then `npm run build` (it must type-check). Open the page in a headless browser (Playwright) and check the console for WebGL or shader errors.
