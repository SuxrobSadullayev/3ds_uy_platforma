'use client'

import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import {
  ArrowRight,
  Camera,
  Compass,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import type { Property } from '@/lib/data/properties'

export interface TourHotspot {
  id: string
  title: string
  targetRoomId: string
  position: [number, number, number] // 3D coordinates inside sphere
}

export interface TourRoom {
  id: string
  name: string
  image: string
  hotspots: TourHotspot[]
}

interface VirtualTourViewerProps {
  property?: Property
  customRooms?: TourRoom[]
}

const DEFAULT_ROOMS: TourRoom[] = [
  {
    id: 'mehmonxona',
    name: 'Mehmonxona (24 m²)',
    image: '/images/hero-city.png',
    hotspots: [
      {
        id: 'hs-1',
        title: "Oshxonaga o'tish ➔",
        targetRoomId: 'oshxona',
        position: [8, 0, -5],
      },
      {
        id: 'hs-2',
        title: "Yotoqxonaga o'tish ➔",
        targetRoomId: 'yotoqxona',
        position: [-8, 0, -4],
      },
    ],
  },
  {
    id: 'oshxona',
    name: 'Oshxona (14 m²)',
    image: '/images/property-1.png',
    hotspots: [
      {
        id: 'hs-3',
        title: "Mehmonxonaga qaytish ➔",
        targetRoomId: 'mehmonxona',
        position: [-8, 0, 5],
      },
      {
        id: 'hs-4',
        title: "Balkonga chiqish ➔",
        targetRoomId: 'balkon',
        position: [7, 0, -6],
      },
    ],
  },
  {
    id: 'yotoqxona',
    name: 'Yotoqxona (18 m²)',
    image: '/images/property-6.png',
    hotspots: [
      {
        id: 'hs-5',
        title: "Mehmonxonaga qaytish ➔",
        targetRoomId: 'mehmonxona',
        position: [8, 0, 4],
      },
    ],
  },
  {
    id: 'balkon',
    name: 'Panoramali Balkon (8 m²)',
    image: '/images/property-3.png',
    hotspots: [
      {
        id: 'hs-6',
        title: "Oshxonaga kirish ➔",
        targetRoomId: 'oshxona',
        position: [-7, 0, 6],
      },
    ],
  },
]

/**
 * Renders a 360° equirectangular sphere with internal texture and hotspot pins.
 */
function PanoramaSphere({
  imageUrl,
  hotspots,
  onNavigate,
}: {
  imageUrl: string
  hotspots: TourHotspot[]
  onNavigate: (targetId: string) => void
}) {
  const texture = useLoader(THREE.TextureLoader, imageUrl)
  texture.mapping = THREE.EquirectangularReflectionMapping
  texture.colorSpace = THREE.SRGBColorSpace

  return (
    <group>
      {/* 360 Panorama Inverted Sphere */}
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[50, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>

      {/* 360° Hotspot Pins */}
      {hotspots.map((hs) => (
        <Html key={hs.id} position={hs.position} center distanceFactor={15}>
          <button
            type="button"
            onClick={() => onNavigate(hs.targetRoomId)}
            className="group flex items-center gap-2 rounded-full border border-primary/40 bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:border-primary hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label={hs.title}
          >
            <span className="flex size-2 rounded-full bg-primary group-hover:bg-primary-foreground animate-ping" />
            <span>{hs.title}</span>
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </Html>
      ))}
    </group>
  )
}

function TourLoader() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/40 text-muted-foreground">
      <Sparkles className="size-6 animate-spin text-primary" aria-hidden="true" />
      <span className="text-xs font-medium">360° panorama yuklanmoqda...</span>
    </div>
  )
}

export function VirtualTourViewer({ property, customRooms }: VirtualTourViewerProps) {
  const rooms = customRooms && customRooms.length > 0 ? customRooms : DEFAULT_ROOMS
  const [activeRoomId, setActiveRoomId] = useState<string>(rooms[0].id)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<OrbitControlsImpl>(null)

  const activeRoom = useMemo(
    () => rooms.find((r) => r.id === activeRoomId) || rooms[0],
    [rooms, activeRoomId],
  )

  function toggleFullscreen() {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }

  function handleZoom(delta: number) {
    if (!controlsRef.current) return
    const camera = controlsRef.current.object as THREE.PerspectiveCamera
    camera.fov = Math.max(25, Math.min(85, camera.fov + delta))
    camera.updateProjectionMatrix()
  }

  function resetView() {
    if (!controlsRef.current) return
    controlsRef.current.reset()
    const camera = controlsRef.current.object as THREE.PerspectiveCamera
    camera.fov = 60
    camera.updateProjectionMatrix()
  }

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden bg-black ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'rounded-xl'
      }`}
      aria-label="360 darajali virtual tur"
    >
      <Canvas camera={{ position: [0, 0, 0.1], fov: 60 }}>
        <Suspense fallback={null}>
          <PanoramaSphere
            imageUrl={activeRoom.image}
            hotspots={activeRoom.hotspots}
            onNavigate={(id) => setActiveRoomId(id)}
          />
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          enableZoom={false}
          enablePan={false}
          rotateSpeed={-0.45}
        />
      </Canvas>

      {/* Top Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-white/20 bg-black/60 p-1.5 backdrop-blur-md">
          <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-white">
            <Camera className="size-4 text-primary" aria-hidden="true" />
            <span>360° Tur</span>
          </div>

          <span className="h-4 w-px bg-white/20" aria-hidden="true" />

          {/* Xonalar selektori */}
          <select
            value={activeRoomId}
            onChange={(e) => setActiveRoomId(e.target.value)}
            aria-label="Xonalarni tanlash"
            className="h-8 rounded-lg border border-white/20 bg-white/10 px-2.5 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {rooms.map((r) => (
              <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="pointer-events-auto flex size-9 items-center justify-center rounded-xl border border-white/20 bg-black/60 text-white shadow-md backdrop-blur-md transition-colors hover:bg-white/20"
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

      {/* Bottom Floating Control Panel */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/70 p-1.5 text-white shadow-xl backdrop-blur-md">
        <button
          type="button"
          onClick={() => handleZoom(-8)}
          className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-white/20"
          title="Yaqinlashtirish"
          aria-label="Zoom in"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => handleZoom(8)}
          className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-white/20"
          title="Uzoqlashtirish"
          aria-label="Zoom out"
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>

        <span className="h-4 w-px bg-white/20" aria-hidden="true" />

        <button
          type="button"
          onClick={resetView}
          className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors hover:bg-white/20"
          title="Ko'rinishni qaytarish"
          aria-label="Reset view"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          <span>Reset</span>
        </button>

        <span className="h-4 w-px bg-white/20" aria-hidden="true" />

        <div className="flex items-center gap-1 px-2 text-[11px] text-white/80">
          <Compass className="size-3.5 text-primary" aria-hidden="true" />
          <span>360° Aylantiring</span>
        </div>
      </div>
    </div>
  )
}
