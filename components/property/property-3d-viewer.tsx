'use client'

import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, Html, OrbitControls } from '@react-three/drei'
import type { Property } from '@/lib/data/properties'

interface Room {
  name: string
  size: string
  x: number
  z: number
  w: number
  d: number
  color: string
}

/**
 * Demo 3D kvartira modeli — real .glb model yuklanmaguncha
 * mulk parametrlari asosida protsedural xona rejasi chiziladi.
 */
function buildRooms(property: Property): Room[] {
  const count = Math.min(property.rooms, 4)
  const base: Room[] = [
    { name: 'Mehmonxona', size: '24 m²', x: -1.6, z: -1.2, w: 3, d: 2.4, color: '#dbe7f0' },
    { name: 'Yotoqxona', size: '18 m²', x: 1.8, z: -1.2, w: 2.6, d: 2.4, color: '#e4ede6' },
    { name: 'Oshxona', size: '14 m²', x: -1.8, z: 1.5, w: 2.6, d: 2.2, color: '#f0e9dc' },
    { name: 'Bolalar xonasi', size: '15 m²', x: 1.7, z: 1.5, w: 2.4, d: 2.2, color: '#e9e2ef' },
  ]
  return base.slice(0, Math.max(count, 2))
}

function ApartmentModel({ property }: { property: Property }) {
  const rooms = useMemo(() => buildRooms(property), [property])

  return (
    <group>
      {/* Pol */}
      <mesh receiveShadow position={[0, -0.05, 0]}>
        <boxGeometry args={[7.4, 0.1, 5.4]} />
        <meshStandardMaterial color="#c9bda8" />
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
          <meshStandardMaterial color="#f5f2ec" />
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

      {/* Xonalar (pol qoplamasi + annotatsiya) */}
      {rooms.map((room) => (
        <group key={room.name}>
          <mesh position={[room.x, 0.02, room.z]}>
            <boxGeometry args={[room.w, 0.04, room.d]} />
            <meshStandardMaterial color={room.color} />
          </mesh>
          <Html
            position={[room.x, 0.7, room.z]}
            center
            distanceFactor={9}
            occlude={false}
          >
            <div className="pointer-events-none rounded-md bg-foreground/85 px-2 py-1 text-center text-[10px] leading-tight text-background whitespace-nowrap">
              <div className="font-semibold">{room.name}</div>
              <div>{room.size}</div>
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

export function Property3DViewer({ property }: { property: Property }) {
  return (
    <div className="relative h-full w-full" aria-label="3D kvartira modeli">
      <Canvas shadows camera={{ position: [7, 6, 7], fov: 42 }}>
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[6, 10, 4]}
          intensity={1.1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <Suspense fallback={null}>
          <ApartmentModel property={property} />
          <ContactShadows position={[0, -0.11, 0]} opacity={0.35} blur={2.2} scale={14} />
          <Environment preset="apartment" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={16}
          maxPolarAngle={Math.PI / 2.15}
        />
      </Canvas>
      <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground/70 px-3 py-1 text-xs text-background">
        Aylantirish uchun sudrang, zoom uchun scroll
      </p>
    </div>
  )
}
