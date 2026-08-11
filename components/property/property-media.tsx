'use client'

import { useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Box, Camera, ImageIcon, Loader2 } from 'lucide-react'
import type { Property } from '@/lib/data/properties'

const Property3DViewer = dynamic(
  () => import('@/components/property/property-3d-viewer').then((m) => m.Property3DViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        3D model yuklanmoqda...
      </div>
    ),
  },
)

const VirtualTourViewer = dynamic(
  () => import('@/components/property/virtual-tour-viewer').then((m) => m.VirtualTourViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        360° virtual tur yuklanmoqda...
      </div>
    ),
  },
)

type MediaTab = 'photos' | '3d' | 'tour'

export function PropertyMedia({ property }: { property: Property }) {
  const tabs: { key: MediaTab; label: string; icon: typeof ImageIcon; available: boolean }[] = [
    { key: 'photos', label: 'Rasmlar', icon: ImageIcon, available: true },
    { key: '3d', label: "3D ko'rish", icon: Box, available: property.has3D },
    { key: 'tour', label: '360° tur', icon: Camera, available: property.hasVirtualTour },
  ]
  const [tab, setTab] = useState<MediaTab>('photos')

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-muted">
        {tab === 'photos' && (
          <Image
            src={property.image || '/placeholder.svg'}
            alt={property.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        )}
        {tab === '3d' && <Property3DViewer property={property} />}
        {tab === 'tour' && <VirtualTourViewer property={property} />}
      </div>

      <div className="flex gap-2" role="tablist" aria-label="Media turlari">
        {tabs
          .filter((t) => t.available)
          .map((t) => {
            const Icon = t.icon
            const active = tab === t.key
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-muted'
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {t.label}
              </button>
            )
          })}
      </div>
    </div>
  )
}
