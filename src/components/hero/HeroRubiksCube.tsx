import {
  Component,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import {
  isHeroCubeSessionReady,
  markHeroCubeSessionReady,
  resetHeroCubeSessionReady,
} from '../../lib/heroCubeSession'

/**
 * Reverse-matched Resend home hero cube (geometry, motion, lighting, framing).
 * RoundedBoxGeometry keeps 6 face groups so each tile keeps its own material.
 */
const METRICS = {
  step: 1.002,
  size: 0.972,
  scale: 0.92,
  cornerRadius: 0.102,
  cornerSegments: 5,
  camera: { position: [6.1, 3.75, 6.2] as [number, number, number], fov: 34 },
  /** Cinematic pose: slow orbit + gentle drift (always visibly alive) */
  baseTilt: { x: 0.52, y: 0.78, z: 0.1 },
  orbitSpeed: 0.2,
  poseDrift: { ampX: 0.055, ampY: 0.038, ampZ: 0.028, freqX: 0.14, freqY: 0.1, freqZ: 0.11 },
  loopDurationSec: 10,
  envIntensity: 0.44,
  exposure: 1.02,
  roomEnvBlur: 0.04,
  shadowOpacity: 0.34,
  shadowBlur: 2.6,
}

type MaterialKind = 'piano' | 'gloss' | 'matte' | 'metal' | 'mesh' | 'grain'
type Axis = 'x' | 'y' | 'z'

type CubeletData = { id: number; x: number; y: number; z: number }

type LayerIndex = -1 | 0 | 1

type ChoreoPause = { type: 'pause'; duration: number }
type ChoreoTwist = {
  type: 'twist'
  axis: Axis
  layer: LayerIndex
  dir: 1 | -1
  duration: number
}
type ChoreoStep = ChoreoPause | ChoreoTwist

/** ~10s deterministic loop: outer layers, paired opposites, Resend-like pacing */
const CHOREO_LOOP: ChoreoStep[] = [
  { type: 'pause', duration: 0.38 },
  { type: 'twist', axis: 'y', layer: 1, dir: 1, duration: 0.58 },
  { type: 'pause', duration: 0.93 },
  { type: 'twist', axis: 'x', layer: 1, dir: -1, duration: 0.58 },
  { type: 'pause', duration: 0.85 },
  { type: 'twist', axis: 'z', layer: -1, dir: 1, duration: 0.58 },
  { type: 'pause', duration: 0.93 },
  { type: 'twist', axis: 'y', layer: -1, dir: -1, duration: 0.58 },
  { type: 'pause', duration: 0.85 },
  { type: 'twist', axis: 'x', layer: -1, dir: 1, duration: 0.58 },
  { type: 'pause', duration: 0.93 },
  { type: 'twist', axis: 'z', layer: 1, dir: -1, duration: 0.58 },
  { type: 'pause', duration: 1.04 },
]

type ActiveTwist = {
  axis: Axis
  layer: LayerIndex
  dir: 1 | -1
  target: number
  duration: number
  memberIds: number[]
}

type ChoreoRuntime = {
  stepIndex: number
  phase: 'pause' | 'twist'
  timer: number
  twistProgress: number
  twist: ActiveTwist | null
  loopCount: number
}

/** Quick acceleration, smooth settle (cinematic mechanical turn) */
function cinematicSliceEase(t: number) {
  const clamped = Math.min(1, Math.max(0, t))
  if (clamped < 0.22) {
    const u = clamped / 0.22
    return u * u * 0.28
  }
  const u = (clamped - 0.22) / 0.78
  return 0.28 + (1 - Math.pow(1 - u, 3.2)) * 0.72
}

const FACE_PX: MaterialKind[][] = [
  ['matte', 'mesh', 'gloss'],
  ['grain', 'piano', 'matte'],
  ['metal', 'matte', 'mesh'],
]
const FACE_NX: MaterialKind[][] = [
  ['mesh', 'matte', 'gloss'],
  ['grain', 'metal', 'matte'],
  ['matte', 'piano', 'mesh'],
]
const FACE_PY: MaterialKind[][] = [
  ['piano', 'mesh', 'gloss'],
  ['matte', 'grain', 'matte'],
  ['metal', 'gloss', 'piano'],
]
const FACE_NY: MaterialKind[][] = [
  ['matte', 'grain', 'mesh'],
  ['gloss', 'matte', 'metal'],
  ['mesh', 'piano', 'gloss'],
]
const FACE_PZ: MaterialKind[][] = [
  ['gloss', 'matte', 'piano'],
  ['mesh', 'grain', 'metal'],
  ['matte', 'metal', 'gloss'],
]
const FACE_NZ: MaterialKind[][] = [
  ['metal', 'matte', 'mesh'],
  ['piano', 'gloss', 'grain'],
  ['grain', 'mesh', 'matte'],
]

function createMeshTexture() {
  const s = 512
  const canvas = document.createElement('canvas')
  canvas.width = s
  canvas.height = s
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#141418'
  ctx.fillRect(0, 0, s, s)
  for (let x = 4; x < s; x += 8) {
    for (let y = 4; y < s; y += 8) {
      ctx.fillStyle = '#08080a'
      ctx.beginPath()
      ctx.arc(x, y, 1.25, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(6, 6)
  return tex
}

function createGrainTexture() {
  const s = 512
  const canvas = document.createElement('canvas')
  canvas.width = s
  canvas.height = s
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#18181c'
  ctx.fillRect(0, 0, s, s)
  const img = ctx.getImageData(0, 0, s, s)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 16
    const v = 28 + n
    img.data[i] = v
    img.data[i + 1] = v
    img.data[i + 2] = v + 1
    img.data[i + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(1.2, 1.2)
  return tex
}

let meshTexture: THREE.CanvasTexture | null = null
let grainTexture: THREE.CanvasTexture | null = null
const materialCache = new Map<MaterialKind, THREE.MeshPhysicalMaterial>()

function ensureTextures() {
  if (typeof document === 'undefined') return
  if (!meshTexture) meshTexture = createMeshTexture()
  if (!grainTexture) grainTexture = createGrainTexture()
}

function getMaterial(kind: MaterialKind): THREE.MeshPhysicalMaterial {
  ensureTextures()
  const cached = materialCache.get(kind)
  if (cached) return cached

  const env = METRICS.envIntensity
  let mat: THREE.MeshPhysicalMaterial

  switch (kind) {
    case 'piano':
      mat = new THREE.MeshPhysicalMaterial({
        color: '#08080a',
        metalness: 0.38,
        roughness: 0.26,
        clearcoat: 0.92,
        clearcoatRoughness: 0.09,
        envMapIntensity: env * 0.82,
      })
      break
    case 'gloss':
      mat = new THREE.MeshPhysicalMaterial({
        color: '#2a2a32',
        metalness: 0.12,
        roughness: 0.14,
        clearcoat: 0.88,
        clearcoatRoughness: 0.05,
        envMapIntensity: env * 0.95,
      })
      break
    case 'metal':
      mat = new THREE.MeshPhysicalMaterial({
        color: '#34343c',
        metalness: 0.78,
        roughness: 0.4,
        clearcoat: 0.18,
        clearcoatRoughness: 0.2,
        envMapIntensity: env * 0.72,
      })
      break
    case 'mesh':
      mat = new THREE.MeshPhysicalMaterial({
        color: '#16161a',
        metalness: 0,
        roughness: 0.86,
        clearcoat: 0,
        map: meshTexture ?? undefined,
        envMapIntensity: env * 0.28,
      })
      break
    case 'grain':
      mat = new THREE.MeshPhysicalMaterial({
        color: '#121216',
        metalness: 0.02,
        roughness: 0.78,
        clearcoat: 0.12,
        map: grainTexture ?? undefined,
        envMapIntensity: env * 0.35,
      })
      break
    default:
      mat = new THREE.MeshPhysicalMaterial({
        color: '#16161a',
        metalness: 0.05,
        roughness: 0.72,
        clearcoat: 0.2,
        envMapIntensity: env * 0.4,
      })
  }

  materialCache.set(kind, mat)
  return mat
}

function getInnerMaterial() {
  return getMaterial('matte')
}

function faceKind(face: MaterialKind[][], u: number, v: number): MaterialKind {
  return face[v]![u]!
}

function materialsForCubelet(x: number, y: number, z: number): THREE.Material[] {
  const inner = getInnerMaterial()
  return [
    x === 1 ? getMaterial(faceKind(FACE_PX, z + 1, y + 1)) : inner,
    x === -1 ? getMaterial(faceKind(FACE_NX, z + 1, y + 1)) : inner,
    y === 1 ? getMaterial(faceKind(FACE_PY, x + 1, z + 1)) : inner,
    y === -1 ? getMaterial(faceKind(FACE_NY, x + 1, z + 1)) : inner,
    z === 1 ? getMaterial(faceKind(FACE_PZ, x + 1, y + 1)) : inner,
    z === -1 ? getMaterial(faceKind(FACE_NZ, x + 1, y + 1)) : inner,
  ]
}

const roundedGeometryCache = new Map<string, RoundedBoxGeometry>()

function getRoundedGeometry(): RoundedBoxGeometry {
  const key = `${METRICS.size}-${METRICS.cornerRadius}-${METRICS.cornerSegments}`
  const cached = roundedGeometryCache.get(key)
  if (cached) return cached

  const geom = new RoundedBoxGeometry(
    METRICS.size,
    METRICS.size,
    METRICS.size,
    METRICS.cornerSegments,
    METRICS.cornerRadius,
  )
  roundedGeometryCache.set(key, geom)
  return geom
}

function CubeletMesh({ materials }: { materials: THREE.Material[] }) {
  const geometry = useMemo(() => getRoundedGeometry(), [])

  return <mesh geometry={geometry} material={materials} castShadow receiveShadow />
}

function LocalStudioEnvironment({ onReady }: { onReady: () => void }) {
  const { gl, scene } = useThree()
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    pmrem.compileEquirectangularShader()
    const room = new RoomEnvironment()
    const texture = pmrem.fromScene(room, METRICS.roomEnvBlur).texture
    scene.environment = texture
    scene.environmentIntensity = METRICS.envIntensity
    pmrem.dispose()
    onReadyRef.current()

    return () => {
      scene.environment = null
      texture.dispose()
    }
  }, [gl, scene])

  return null
}

function rotateCoords(
  x: number,
  y: number,
  z: number,
  axis: Axis,
  dir: 1 | -1,
): [number, number, number] {
  if (axis === 'x') return dir === 1 ? [x, z, -y] : [x, -z, y]
  if (axis === 'y') return dir === 1 ? [z, y, -x] : [-z, y, x]
  return dir === 1 ? [y, -x, z] : [-y, x, z]
}

function buildInitialCubelets(): CubeletData[] {
  const items: CubeletData[] = []
  let id = 0
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        items.push({ id: id++, x, y, z })
      }
    }
  }
  return items
}

/** Face materials are fixed per cubelet id (like physical stickers), not grid coords. */
let cubeletMaterialsById: THREE.Material[][] | null = null

function getCubeletMaterials(id: number): THREE.Material[] {
  if (!cubeletMaterialsById) {
    cubeletMaterialsById = buildInitialCubelets().map((c) =>
      materialsForCubelet(c.x, c.y, c.z),
    )
  }
  return cubeletMaterialsById[id]!
}

const AXIS_VEC: Record<Axis, THREE.Vector3> = {
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1),
}
const twistOrigin = new THREE.Vector3()
const twistRel = new THREE.Vector3()
const animPos = new THREE.Vector3()

function snapGridCoord(value: number, step: number) {
  const cell = Math.round(value / step)
  return cell * step
}

function setCubeletGridTransform(
  group: THREE.Group,
  cube: CubeletData,
  step: number,
) {
  group.position.set(
    snapGridCoord(cube.x * step, step),
    snapGridCoord(cube.y * step, step),
    snapGridCoord(cube.z * step, step),
  )
  group.quaternion.identity()
}

function applyTwistToVector(
  pos: THREE.Vector3,
  axis: Axis,
  layer: LayerIndex,
  angle: number,
  step: number,
) {
  const p = step * layer
  twistOrigin.set(axis === 'x' ? p : 0, axis === 'y' ? p : 0, axis === 'z' ? p : 0)
  twistRel.copy(pos).sub(twistOrigin)
  twistRel.applyAxisAngle(AXIS_VEC[axis], angle)
  twistRel.add(twistOrigin)
  pos.copy(twistRel)
}

function RubiksCubeModel({ onGridReady }: { onGridReady: () => void }) {
  const rootRef = useRef<THREE.Group>(null)
  const groupRefs = useRef<Map<number, THREE.Group>>(new Map())
  const [cubelets, setCubelets] = useState<CubeletData[]>(buildInitialCubelets)
  const cubeletsRef = useRef(cubelets)
  cubeletsRef.current = cubelets

  const choreoRef = useRef<ChoreoRuntime>({
    stepIndex: 0,
    phase: 'pause',
    timer: CHOREO_LOOP[0]?.type === 'pause' ? CHOREO_LOOP[0].duration : 0.38,
    twistProgress: 0,
    twist: null,
    loopCount: 0,
  })
  const isTwistingRef = useRef(false)
  const startCoordsRef = useRef<Map<number, { x: number; y: number; z: number }>>(new Map())
  const choreoReadyRef = useRef(false)
  const gridReadyFiredRef = useRef(false)
  const orbitAngleRef = useRef(0)

  const syncGridPositions = (data: CubeletData[]) => {
    const s = METRICS.step
    for (const c of data) {
      const g = groupRefs.current.get(c.id)
      if (g) setCubeletGridTransform(g, c, s)
    }
  }

  const beginChoreoTwist = (move: ChoreoTwist) => {
    const members = cubeletsRef.current.filter((c) => c[move.axis] === move.layer)
    if (members.length === 0) {
      advanceChoreo()
      return
    }

    const startCoords = new Map<number, { x: number; y: number; z: number }>()
    for (const m of members) {
      startCoords.set(m.id, { x: m.x, y: m.y, z: m.z })
    }
    startCoordsRef.current = startCoords

    isTwistingRef.current = true
    choreoRef.current.twist = {
      axis: move.axis,
      layer: move.layer,
      dir: move.dir,
      target: move.dir * (Math.PI / 2),
      duration: move.duration,
      memberIds: members.map((m) => m.id),
    }
    choreoRef.current.phase = 'twist'
    choreoRef.current.twistProgress = 0
    choreoRef.current.timer = move.duration
  }

  const finishChoreoTwist = () => {
    const twist = choreoRef.current.twist
    if (!twist) return

    const nextCubelets = cubeletsRef.current.map((c) => {
      if (!twist.memberIds.includes(c.id)) return c
      const [nx, ny, nz] = rotateCoords(c.x, c.y, c.z, twist.axis, twist.dir)
      return { ...c, x: nx, y: ny, z: nz }
    })

    isTwistingRef.current = false
    choreoRef.current.twist = null
    startCoordsRef.current.clear()
    cubeletsRef.current = nextCubelets
    setCubelets(nextCubelets)
    syncGridPositions(nextCubelets)
  }

  const enterPause = (duration: number) => {
    isTwistingRef.current = false
    choreoRef.current.twist = null
    choreoRef.current.phase = 'pause'
    choreoRef.current.timer = duration
    startCoordsRef.current.clear()
    syncGridPositions(cubeletsRef.current)
  }

  const runChoreoStep = (index: number) => {
    const step = CHOREO_LOOP[index]
    if (!step) return
    if (step.type === 'pause') enterPause(step.duration)
    else beginChoreoTwist(step)
  }

  const advanceChoreo = () => {
    let next = choreoRef.current.stepIndex + 1
    if (next >= CHOREO_LOOP.length) {
      next = 0
      choreoRef.current.loopCount += 1
      const reset = buildInitialCubelets()
      cubeletsRef.current = reset
      setCubelets(reset)
      syncGridPositions(reset)
    }
    choreoRef.current.stepIndex = next
    runChoreoStep(next)
  }

  useLayoutEffect(() => {
    if (!isTwistingRef.current) syncGridPositions(cubeletsRef.current)
  }, [cubelets])

  useFrame((state, delta) => {
    const root = rootRef.current
    if (!root) return

    if (!choreoReadyRef.current && groupRefs.current.size >= 27) {
      choreoReadyRef.current = true
      syncGridPositions(cubeletsRef.current)
      if (!gridReadyFiredRef.current) {
        gridReadyFiredRef.current = true
        onGridReady()
      }
      choreoRef.current.stepIndex = 0
      runChoreoStep(0)
    }

    const t = state.clock.elapsedTime
    const drift = METRICS.poseDrift
    const base = METRICS.baseTilt
    orbitAngleRef.current += delta * METRICS.orbitSpeed
    root.rotation.set(
      base.x + Math.sin(t * drift.freqX) * drift.ampX,
      base.y + orbitAngleRef.current + Math.sin(t * drift.freqY + 1.15) * drift.ampY,
      base.z + Math.sin(t * drift.freqZ + 0.55) * drift.ampZ,
    )

    const choreo = choreoRef.current
    const data = cubeletsRef.current
    const step = METRICS.step

    if (choreo.phase === 'pause') {
      syncGridPositions(data)
      if (choreoReadyRef.current) {
        choreo.timer -= delta
        if (choreo.timer <= 0) advanceChoreo()
      }
      return
    }

    const twist = choreo.twist
    if (!twist) {
      choreo.phase = 'pause'
      return
    }

    choreo.twistProgress += delta / twist.duration
    const progress = Math.min(1, choreo.twistProgress)
    const eased = progress >= 1 ? 1 : cinematicSliceEase(progress)
    const angle = twist.target * eased

    for (const c of data) {
      const g = groupRefs.current.get(c.id)
      if (!g) continue

      if (!twist.memberIds.includes(c.id)) {
        setCubeletGridTransform(g, c, step)
        continue
      }

      const start = startCoordsRef.current.get(c.id)
      if (!start) {
        setCubeletGridTransform(g, c, step)
        continue
      }

      animPos.set(start.x * step, start.y * step, start.z * step)
      applyTwistToVector(animPos, twist.axis, twist.layer, angle, step)
      g.position.copy(animPos)
      g.quaternion.setFromAxisAngle(AXIS_VEC[twist.axis], angle)
    }

    if (progress < 1) return
    finishChoreoTwist()
    advanceChoreo()
  })

  return (
    <group ref={rootRef} scale={METRICS.scale}>
      <group>
        {cubelets.map((c) => (
          <group
            key={c.id}
            ref={(node) => {
              if (node) groupRefs.current.set(c.id, node)
            }}
          >
            <CubeletMesh materials={getCubeletMaterials(c.id)} />
          </group>
        ))}
      </group>
    </group>
  )
}

function CameraRig() {
  const { camera } = useThree()

  useEffect(() => {
    const [x, y, z] = METRICS.camera.position
    camera.position.set(x, y, z)
    if ('fov' in camera) {
      ;(camera as THREE.PerspectiveCamera).fov = METRICS.camera.fov
    }
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera])

  return null
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.26} />
      <hemisphereLight args={['#c8d0dc', '#060608', 0.42]} />
      <directionalLight
        position={[5.5, 9, 4.5]}
        intensity={1.75}
        color="#eef1f8"
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <directionalLight position={[-4.5, 3.5, -4]} intensity={0.32} color="#7a8494" />
      <pointLight position={[2.8, 1.5, 3.8]} intensity={0.35} color="#dce2ee" distance={11} />
    </>
  )
}

type SceneReadyCallbacks = {
  onEnvReady: () => void
  onGridReady: () => void
  onContextReset: () => void
}

function CubeCanvas({ onEnvReady, onGridReady, onContextReset }: SceneReadyCallbacks) {
  const canvasKey = useRef(0)
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    const onLost = () => {
      onContextReset()
      setMounted(false)
      window.setTimeout(() => {
        canvasKey.current += 1
        setMounted(true)
      }, 100)
    }
    window.addEventListener('webglcontextlost', onLost, false)
    return () => window.removeEventListener('webglcontextlost', onLost, false)
  }, [onContextReset])

  if (!mounted) {
    return <div className="hero-cube-fallback h-full w-full min-h-[240px] sm:min-h-[280px]" aria-hidden />
  }

  return (
    <Canvas
      key={canvasKey.current}
      camera={METRICS.camera}
      gl={{
        alpha: false,
        antialias: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 1.5]}
      frameloop="always"
      shadows
      style={{ background: '#000000' }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0x000000, 1)
        scene.background = new THREE.Color(0x000000)
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = METRICS.exposure
        gl.shadowMap.enabled = true
        gl.shadowMap.type = THREE.PCFShadowMap
        gl.domElement.addEventListener(
          'webglcontextlost',
          (e) => {
            e.preventDefault()
          },
          false,
        )
      }}
    >
      <Suspense fallback={null}>
        <CameraRig />
        <LocalStudioEnvironment onReady={onEnvReady} />
        <SceneLights />
        <RubiksCubeModel onGridReady={onGridReady} />
      </Suspense>
    </Canvas>
  )
}

type BoundaryProps = { children: ReactNode }

type BoundaryState = { hasError: boolean }

class CubeErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false }

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('[HeroRubiksCube]', error)
  }

  render() {
    if (this.state.hasError) {
      return <div className="hero-cube-fallback h-full w-full min-h-[240px] sm:min-h-[280px]" role="presentation" />
    }
    return this.props.children
  }
}

type Props = { className?: string }

export function HeroRubiksCube({ className = '' }: Props) {
  const warmSession = isHeroCubeSessionReady()
  const [visible, setVisible] = useState(false)
  const envReadyRef = useRef(warmSession)
  const gridReadyRef = useRef(false)
  const revealedRef = useRef(false)

  const resetReadyGate = () => {
    resetHeroCubeSessionReady()
    envReadyRef.current = false
    gridReadyRef.current = false
    revealedRef.current = false
    setVisible(false)
  }

  const tryReveal = () => {
    if (revealedRef.current || !envReadyRef.current || !gridReadyRef.current) return
    revealedRef.current = true
    markHeroCubeSessionReady()
    if (warmSession) {
      setVisible(true)
      return
    }
    requestAnimationFrame(() => setVisible(true))
  }

  const onEnvReady = () => {
    envReadyRef.current = true
    tryReveal()
  }

  const onGridReady = () => {
    gridReadyRef.current = true
    tryReveal()
  }

  return (
    <div className={`hero-cube-stage bg-black ${className}`} aria-hidden>
      <div
        className={`hero-cube-canvas bg-black ${visible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          transition: warmSession ? 'none' : visible ? 'opacity 120ms ease-out' : 'none',
        }}
      >
        <CubeErrorBoundary>
          <CubeCanvas
            onEnvReady={onEnvReady}
            onGridReady={onGridReady}
            onContextReset={resetReadyGate}
          />
        </CubeErrorBoundary>
      </div>
    </div>
  )
}
