'use client'

import { Component, type ReactNode, Suspense, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, Html, OrbitControls, useGLTF } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import {
  Box,
  Eye,
  Info,
  Layers,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Sun,
} from 'lucide-react'
import type { Property } from '@/lib/data/properties'

export type EnvironmentPreset = 'apartment' | 'city' | 'sunset' | 'studio'

interface Property3DViewerProps {
  property: Property
  modelUrl?: string
}

interface RoomAnnotation {
  name: string
  size: string
  x: number
  z: number
  w: number
  d: number
  color: string
}

// Simple ErrorBoundary for Canvas/GLTF loading
class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.warn('3D Model rendering fallback triggered:', error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

/**
 * Loads a real .glb / .gltf model dynamically if modelUrl is provided.
 */
function GLTFModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={1.5} position={[0, 0, 0]} />
}

/**
 * Procedural 3D apartment model fallback.
 */
function buildRooms(property: Property): RoomAnnotation[] {
  const count = Math.min(property.rooms, 4)
  const base: RoomAnnotation[] = [
    { name: 'Mehmonxona', size: '24 m²', x: -1.6, z: -1.2, w: 3, d: 2.4, color: '#dbe7f0' },
    { name: 'Yotoqxona', size: '18 m²', x: 1.8, z: -1.2, w: 2.6, d: 2.4, color: '#e4ede6' },
    { name: 'Oshxona', size: '14 m²', x: -1.8, z: 1.5, w: 2.6, d: 2.2, color: '#f0e9dc' },
    { name: 'Bolalar xonasi', size: '15 m²', x: 1.7, z: 1.5, w: 2.4, d: 2.2, color: '#e9e2ef' },
  ]
  return base.slice(0, Math.max(count, 2))
}

function ProceduralApartmentModel({ property }: { property: Property }) {
  const rooms = useMemo(() => buildRooms(property), [property])

  return (
    <group>
      {/* Pol */}
      <mesh receiveShadow position={[0, -0.05, 0]}>
        <boxGeometry args={[7.4, 0.1, 5.4]} />
        <meshStandardMaterial color="#c9bda8" roughness={0.4} />
      </mesh>

      {/* Tashqi devorlar */}
      {[
        { pos: [0, 0.6, -2.7] as const, size: [7.4, 1.2, 0.12] as const },
        { pos: [0, 0.6, 2.7] as const, size: [7.4, 1.2, 0.12] as const },
        { pos: [-3.7, 0.6, 0] as const, size: [0.12, 1.2, 5.4] as const },
        { pos: [3.7, 0.6, 0] as const, size: [0.12, 1.2, 5.4] as const },
      ].map((wall, i) => (
        <mesh key={i} castShadow position={[...wall.pos]}>
          <boxGeometry args={[...wall.size]} />
          <meshStandardMaterial color="#f5f2ec" roughness={0.7} />
        </mesh>
      ))}

      {/* Ichki devorlar */}
      <mesh castShadow position={[0.15, 0.5, 0]}>
        <boxGeometry args={[0.1, 1, 5.4]} />
        <meshStandardMaterial color="#efece5" />
      </mesh>
      <mesh castShadow position={[0, 0.5, 0.15]}>
        <boxGeometry args={[7.4, 1, 0.1]} />
        <meshStandardMaterial color="#efece5" />
      </mesh>

      {/* Xonalar (pol qoplamasi + Html 3D Annotatsiyalar) */}
      {rooms.map((room) => (
        <group key={room.name}>
          <mesh position={[room.x, 0.02, room.z]}>
            <boxGeometry args={[room.w, 0.04, room.d]} />
            <meshStandardMaterial color={room.color} roughness={0.3} />
          </mesh>
          <Html position={[room.x, 0.8, room.z]} center distanceFactor={10} occlude={false}>
            <div className="pointer-events-none flex items-center gap-1.5 rounded-full border border-border/80 bg-background/90 px-2.5 py-1 shadow-md backdrop-blur-sm">
              <span className="size-2 rounded-full bg-primary" />
              <div className="text-left text-[11px] leading-tight text-foreground whitespace-nowrap">
                <span className="font-semibold">{room.name}</span>
                <span className="ml-1 text-muted-foreground">({room.size})</span>
              </div>
            </div>
          </Html>
        </group>
      ))}

      {/* Mebel namunalari */}
      <mesh castShadow position={[-1.6, 0.2, -1.6]}>
        <boxGeometry args={[1.8, 0.4, 0.8]} />
        <meshStandardMaterial color="#7d93a8" />
      </mesh>
      <mesh castShadow position={[1.8, 0.25, -1.4]}>
        <boxGeometry args={[1.6, 0.5, 1.1]} />
        <meshStandardMaterial color="#a8b8a0" />
      </mesh>
      <mesh castShadow position={[-1.8, 0.45, 1.9]}>
        <boxGeometry args={[2, 0.9, 0.6]} />
        <meshStandardMaterial color="#b9a88f" />
      </mesh>
    </group>
  )
}

function LoaderFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/30 text-muted-foreground">
      <Sparkles className="size-6 animate-pulse text-primary" aria-hidden="true" />
      <span className="text-xs font-medium">3D Canvas yuklanmoqda...</span>
    </div>
  )
}

export function Property3DViewer({ property, modelUrl }: Property3DViewerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [envPreset, setEnvPreset] = useState<EnvironmentPreset>('apartment')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewMode, setViewMode] = useState<'3d' | 'top'>('3d')

  function resetCamera() {
    if (!controlsRef.current) return
    controlsRef.current.reset()
    setViewMode('3d')
  }

  function toggleTopDownView() {
    if (!controlsRef.current) return
    if (viewMode === '3d') {
      controlsRef.current.object.position.set(0, 11, 0.01)
      controlsRef.current.target.set(0, 0, 0)
      controlsRef.current.update()
      setViewMode('top')
    } else {
      resetCamera()
    }
  }

  function toggleFullscreen() {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }

  const presets: { id: EnvironmentPreset; label: string }[] = [
    { id: 'apartment', label: 'Xonadon' },
    { id: 'city', label: 'Shahar' },
    { id: 'sunset', label: 'Quyosh' },
    { id: 'studio', label: 'Studiya' },
  ]

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden bg-gradient-to-b from-muted/20 to-muted/60 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-background' : 'rounded-xl'
      }`}
      aria-label="3D kvartira interaktiv modeli"
    >
      <Canvas shadows camera={{ position: [7, 6, 7], fov: 42 }}>
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[6, 10, 4]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <Suspense fallback={null}>
          <WebGLErrorBoundary fallback={<ProceduralApartmentModel property={property} />}>
            {modelUrl ? (
              <GLTFModel url={modelUrl} />
            ) : (
              <ProceduralApartmentModel property={property} />
            )}
          </WebGLErrorBoundary>
          <ContactShadows position={[0, -0.11, 0]} opacity={0.35} blur={2.2} scale={14} />
          <Environment preset={envPreset} />
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          minDistance={3}
          maxDistance={18}
          maxPolarAngle={viewMode === 'top' ? Math.PI / 2 : Math.PI / 2.1}
        />
      </Canvas>

      {/* Yuqori boshqaruv paneli (Glassmorphism) */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1 rounded-lg border border-border/60 bg-background/80 p-1 shadow-sm backdrop-blur-md">
          <span className="flex items-center gap-1 px-2 text-xs font-semibold text-foreground">
            <Box className="size-3.5 text-primary" aria-hidden="true" />
            3D Viewer
          </span>
          <span className="h-4 w-px bg-border" aria-hidden="true" />
          <button
            type="button"
            onClick={resetCamera}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Kamerani asl holatiga qaytarish"
            aria-label="Kamerani qaytarish"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={toggleTopDownView}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
              viewMode === 'top'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title="Tepadan ko'rish (Floor plan)"
            aria-label="Tepadan ko'rish"
          >
            <Layers className="size-3.5" aria-hidden="true" />
            <span>Tepadan</span>
          </button>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5">
          {/* Yoritish muhiti */}
          <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-background/80 p-1 shadow-sm backdrop-blur-md">
            <Sun className="size-3.5 ml-1 text-muted-foreground" aria-hidden="true" />
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setEnvPreset(p.id)}
                className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                  envPreset === p.id
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="pointer-events-auto flex size-8 items-center justify-center rounded-lg border border-border/60 bg-background/80 text-muted-foreground shadow-sm backdrop-blur-md hover:bg-muted hover:text-foreground transition-colors"
            title="To'liq ekranda ko'rish"
            aria-label="To'liq ekran"
          >
            {isFullscreen ? (
              <Minimize2 className="size-4" aria-hidden="true" />
            ) : (
              <Maximize2 className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Pastki yordamchi matn */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-border/60 bg-background/85 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur-md">
        <Info className="size-3.5 text-primary" aria-hidden="true" />
        <span>Sichqoncha bilan 360° aylantiring va zoom qiling</span>
      </div>
    </div>
  )
}
