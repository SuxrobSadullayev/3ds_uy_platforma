'use client'

import { Component, ReactNode, Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, Html, OrbitControls, useGLTF } from '@react-three/drei'
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

interface ErrorBoundaryProps {
  fallback: ReactNode
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ModelErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.warn('3D GLTF Model loading failed, falling back to procedural 3D layout:', error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

function GltfModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={1} position={[0, 0, 0]} />
}

function buildRooms(property: Property): Room[] {
  const totalArea = property.area || 65
  const count = Math.min(Math.max(property.rooms, 1), 4)

  const livingSize = Math.round(totalArea * 0.38)
  const bedSize = Math.round(totalArea * 0.28)
  const kitchenSize = Math.round(totalArea * 0.20)
  const kidsSize = Math.max(10, Math.round(totalArea - (livingSize + bedSize + kitchenSize)))

  const base: Room[] = [
    { name: 'Mehmonxona', size: `${livingSize} m²`, x: -1.6, z: -1.2, w: 3, d: 2.4, color: '#dbe7f0' },
    { name: 'Yotoqxona', size: `${bedSize} m²`, x: 1.8, z: -1.2, w: 2.6, d: 2.4, color: '#e4ede6' },
    { name: 'Oshxona', size: `${kitchenSize} m²`, x: -1.8, z: 1.5, w: 2.6, d: 2.2, color: '#f0e9dc' },
    { name: 'Bolalar xonasi', size: `${kidsSize} m²`, x: 1.7, z: 1.5, w: 2.4, d: 2.2, color: '#e9e2ef' },
  ]
  return base.slice(0, count)
}

function ProceduralApartmentModel({ property }: { property: Property }) {
  const rooms = useMemo(() => buildRooms(property), [property])

  return (
    <group>
      {/* Pol poydevori */}
      <mesh receiveShadow position={[0, -0.05, 0]}>
        <boxGeometry args={[7.6, 0.1, 5.6]} />
        <meshStandardMaterial color="#bfae99" roughness={0.4} />
      </mesh>

      {/* Tashqi devorlar */}
      {[
        { pos: [0, 0.75, -2.75] as const, size: [7.6, 1.5, 0.15] as const },
        { pos: [0, 0.75, 2.75] as const, size: [7.6, 1.5, 0.15] as const },
        { pos: [-3.8, 0.75, 0] as const, size: [0.15, 1.5, 5.6] as const },
        { pos: [3.8, 0.75, 0] as const, size: [0.15, 1.5, 5.6] as const },
      ].map((wall, i) => (
        <mesh key={i} castShadow receiveShadow position={[...wall.pos]}>
          <boxGeometry args={[...wall.size]} />
          <meshStandardMaterial color="#f0ece1" roughness={0.6} />
        </mesh>
      ))}

      {/* Ichki devorlar va eshik o'rinlari */}
      <mesh castShadow receiveShadow position={[0.15, 0.6, 0]}>
        <boxGeometry args={[0.12, 1.2, 5.4]} />
        <meshStandardMaterial color="#e8e4d8" roughness={0.6} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.6, 0.15]}>
        <boxGeometry args={[7.4, 1.2, 0.12]} />
        <meshStandardMaterial color="#e8e4d8" roughness={0.6} />
      </mesh>

      {/* Deraza ramalari va oyna simulyatsiyasi */}
      <mesh position={[0, 0.9, -2.68]}>
        <boxGeometry args={[2.2, 0.8, 0.05]} />
        <meshStandardMaterial color="#a0c4e2" opacity={0.6} transparent roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.9, 2.68]}>
        <boxGeometry args={[2.2, 0.8, 0.05]} />
        <meshStandardMaterial color="#a0c4e2" opacity={0.6} transparent roughness={0.1} />
      </mesh>

      {/* Xonalar (pol qoplamasi + annotatsiyalar) */}
      {rooms.map((room) => (
        <group key={room.name}>
          <mesh position={[room.x, 0.02, room.z]}>
            <boxGeometry args={[room.w, 0.04, room.d]} />
            <meshStandardMaterial color={room.color} roughness={0.3} />
          </mesh>
          <Html position={[room.x, 0.8, room.z]} center distanceFactor={9} occlude={false}>
            <div className="pointer-events-none rounded-md bg-foreground/90 px-2 py-1 text-center text-[10px] leading-tight text-background shadow-md whitespace-nowrap">
              <div className="font-semibold">{room.name}</div>
              <div>{room.size}</div>
            </div>
          </Html>
        </group>
      ))}

      {/* 3D Mebellar: Divan, Yotoq va Oshxona garnituri */}
      {/* Mehmonxona divani */}
      <group position={[-1.6, 0.25, -1.6]}>
        <mesh castShadow>
          <boxGeometry args={[1.8, 0.4, 0.8]} />
          <meshStandardMaterial color="#4a6572" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0, 0.3, -0.3]}>
          <boxGeometry args={[1.8, 0.4, 0.2]} />
          <meshStandardMaterial color="#344955" roughness={0.7} />
        </mesh>
      </group>

      {/* Yotoqxona kravati */}
      <group position={[1.8, 0.25, -1.4]}>
        <mesh castShadow>
          <boxGeometry args={[1.6, 0.4, 1.8]} />
          <meshStandardMaterial color="#e0e0e0" roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0, 0.25, -0.7]}>
          <boxGeometry args={[1.6, 0.2, 0.4]} />
          <meshStandardMaterial color="#a5d6a7" roughness={0.5} />
        </mesh>
      </group>

      {/* Oshxona stoli va mebeli */}
      <group position={[-1.8, 0.35, 1.8]}>
        <mesh castShadow>
          <boxGeometry args={[2.2, 0.7, 0.7]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.4} />
        </mesh>
      </group>
    </group>
  )
}

export function Property3DViewer({ property }: { property: Property }) {
  const hasExternalModel = Boolean(property.modelUrl && property.modelUrl.endsWith('.glb'))

  return (
    <div className="relative h-full w-full bg-slate-900/5 rounded-xl overflow-hidden touch-none" aria-label="3D kvartira modeli">
      <Canvas shadows camera={{ position: [7, 6, 7], fov: 42 }}>
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[6, 10, 4]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <Suspense
          fallback={
            <Html center>
              <div className="text-xs text-muted-foreground bg-background/80 px-3 py-1.5 rounded-md shadow">
                3D Model yuklanmoqda...
              </div>
            </Html>
          }
        >
          {hasExternalModel && property.modelUrl ? (
            <ModelErrorBoundary fallback={<ProceduralApartmentModel property={property} />}>
              <GltfModel url={property.modelUrl} />
            </ModelErrorBoundary>
          ) : (
            <ProceduralApartmentModel property={property} />
          )}
          <ContactShadows position={[0, -0.11, 0]} opacity={0.4} blur={2.5} scale={15} />
          <Environment preset="apartment" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={18}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground/75 px-3 py-1 text-xs text-background shadow">
        {hasExternalModel ? '3D GLTF Model | Drag = Aylantirish' : 'Interaktiv 3D Xona Rejasi | Drag = Aylantirish'}
      </div>
    </div>
  )
}
