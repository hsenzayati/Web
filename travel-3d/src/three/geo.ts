import * as THREE from "three"

/** Convert latitude / longitude (degrees) to a point on a sphere of radius r. */
export const latLonToVec3 = (lat: number, lon: number, r = 1) => {
  const phi = THREE.MathUtils.degToRad(90 - lat)
  const theta = THREE.MathUtils.degToRad(lon + 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  )
}

/**
 * Rotation (outer X tilt, inner Y spin) that brings a lat/lon to face +Z,
 * i.e. towards the camera.
 */
export const facingRotation = (lat: number, lon: number) => {
  const v = latLonToVec3(lat, lon)
  return { x: THREE.MathUtils.degToRad(lat), y: -Math.atan2(v.x, v.z) }
}

/** Shortest equivalent of `target` relative to `current` (radians). */
export const nearestAngle = (current: number, target: number) => {
  const TAU = Math.PI * 2
  let d = (target - current) % TAU
  if (d > Math.PI) d -= TAU
  if (d < -Math.PI) d += TAU
  return current + d
}

/** Great-circle-ish flight arc lifted above the surface. */
export const arcPoints = (a: THREE.Vector3, b: THREE.Vector3, segments = 48) => {
  const mid = a.clone().add(b).multiplyScalar(0.5)
  const dist = a.distanceTo(b)
  mid.normalize().multiplyScalar(1 + dist * 0.35)
  const curve = new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone())
  return curve.getPoints(segments)
}
