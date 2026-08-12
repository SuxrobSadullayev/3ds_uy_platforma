'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  BadgeCheck,
  Box,
  Building2,
  Camera,
  Check,
  ExternalLink,
  Layers,
  MapPin,
  MessageSquare,
  Minus,
  Trash2,
  X,
} from 'lucide-react'
import {
  formatPrice,
  PROPERTY_STATUS_LABELS,
  PROPERTY_TYPE_LABELS,
  type Property,
} from '@/lib/data/properties'

export interface CompareModalProps {
  isOpen: boolean
  onClose: () => void
  properties: Property[]
  onRemove: (id: string) => void
  onClearAll?: () => void
}

export function CompareModal({
  isOpen,
  onClose,
  properties,
  onRemove,
  onClearAll,
}: CompareModalProps) {
  // Close on Escape keypress
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const items = properties.slice(0, 3)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Layers className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="compare-modal-title" className="text-lg font-bold text-card-foreground">
                Mulk solishtirish
              </h2>
              <p className="text-xs text-muted-foreground">
                Tanlangan mulklarning texnik ko&apos;rsatkichlarini yonma-yon solishtiring ({items.length}/3)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onClearAll && items.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
                <span>Tozalash</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Yopish"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Layers className="size-6" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                Solishtirish uchun kamida 2 ta mulk tanlang
              </h3>
              <p className="max-w-sm text-xs text-muted-foreground">
                Mulk kartochkalaridagi solishtirish tugmasini bosib, 3 tagacha e&apos;lonni qo&apos;shishingiz mumkin.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
              >
                Katalogga qaytish
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th scope="col" className="w-48 p-3 text-xs font-semibold text-muted-foreground border-b border-border">
                      Mulk parametrlari
                    </th>
                    {items.map((p) => (
                      <th scope="col" key={p.id} className="min-w-[200px] p-3 border-b border-border">
                        <div className="flex flex-col gap-2">
                          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                            <Image
                              src={p.image || '/placeholder.svg'}
                              alt={p.title}
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => onRemove(p.id)}
                              className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-background/80 text-foreground shadow hover:bg-destructive hover:text-destructive-foreground transition-colors"
                              title="O'chirish"
                              aria-label={`${p.title} ni solishtirishdan o'chirish`}
                            >
                              <X className="size-3.5" aria-hidden="true" />
                            </button>
                          </div>
                          <Link
                            href={`/mulklar/${p.id}`}
                            onClick={onClose}
                            className="font-semibold text-card-foreground hover:text-primary line-clamp-2 text-xs leading-snug"
                          >
                            {p.title}
                          </Link>
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Building2 className="size-3" aria-hidden="true" />
                            <span>{PROPERTY_TYPE_LABELS[p.type]}</span>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {/* Narxi */}
                  <tr>
                    <td className="p-3 font-medium text-xs text-muted-foreground">Umumiy narx</td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3 font-bold text-primary">
                        {formatPrice(p.price)}
                      </td>
                    ))}
                  </tr>

                  {/* 1 m² narxi */}
                  <tr>
                    <td className="p-3 font-medium text-xs text-muted-foreground">1 m² narxi</td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3 text-xs text-card-foreground font-semibold">
                        {p.pricePerM2 ? `${p.pricePerM2.toLocaleString('uz-UZ')} so'm` : 'Ko\'rsatilmadi'}
                      </td>
                    ))}
                  </tr>

                  {/* Maydoni */}
                  <tr>
                    <td className="p-3 font-medium text-xs text-muted-foreground">Maydoni</td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3 text-xs text-card-foreground">
                        <span className="font-semibold">{p.area}</span> m²
                      </td>
                    ))}
                  </tr>

                  {/* Xonalar soni */}
                  <tr>
                    <td className="p-3 font-medium text-xs text-muted-foreground">Xonalar soni</td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3 text-xs text-card-foreground">
                        <span className="font-semibold">{p.rooms}</span> xona
                      </td>
                    ))}
                  </tr>

                  {/* Qavat */}
                  <tr>
                    <td className="p-3 font-medium text-xs text-muted-foreground">Qavati</td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3 text-xs text-card-foreground">
                        {p.floor ? `${p.floor}/${p.totalFloors || '-'}-qavat` : 'Noma\'lum'}
                      </td>
                    ))}
                  </tr>

                  {/* Joylashuv */}
                  <tr>
                    <td className="p-3 font-medium text-xs text-muted-foreground">Joylashuvi</td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3 text-xs text-card-foreground">
                        <div className="flex items-start gap-1">
                          <MapPin className="size-3.5 shrink-0 text-muted-foreground mt-0.5" aria-hidden="true" />
                          <span>{p.district}, {p.region}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* 3D va Virtual tur */}
                  <tr>
                    <td className="p-3 font-medium text-xs text-muted-foreground">3D & 360° Tur</td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3 text-xs">
                        <div className="flex flex-wrap gap-1">
                          {p.has3D && (
                            <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                              <Box className="size-3" aria-hidden="true" /> 3D
                            </span>
                          )}
                          {p.hasVirtualTour && (
                            <span className="inline-flex items-center gap-1 rounded bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
                              <Camera className="size-3" aria-hidden="true" /> 360°
                            </span>
                          )}
                          {!p.has3D && !p.hasVirtualTour && (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Rent to Own */}
                  <tr>
                    <td className="p-3 font-medium text-xs text-muted-foreground">Rent-to-Own</td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3 text-xs">
                        {p.rentToOwn ? (
                          <span className="inline-flex items-center gap-1 text-accent font-semibold">
                            <Check className="size-4" aria-hidden="true" /> Mavjud
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <Minus className="size-4" aria-hidden="true" /> Yo&apos;q
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Sotuvchi */}
                  <tr>
                    <td className="p-3 font-medium text-xs text-muted-foreground">Sotuvchi</td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3 text-xs text-card-foreground">
                        <div className="flex items-center gap-1">
                          <span>{p.seller.name}</span>
                          {p.seller.verified && (
                            <span title="Tasdiqlangan">
                              <BadgeCheck className="size-3.5 text-accent shrink-0" aria-hidden="true" />
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Harakatlar (Action buttons) */}
                  <tr>
                    <td className="p-3 font-medium text-xs text-muted-foreground">Amallar</td>
                    {items.map((p) => (
                      <td key={p.id} className="p-3">
                        <div className="flex flex-col gap-2">
                          <Link
                            href={`/mulklar/${p.id}`}
                            onClick={onClose}
                            className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                          >
                            <ExternalLink className="size-3.5" aria-hidden="true" />
                            <span>Batafsil ko&apos;rish</span>
                          </Link>
                          <Link
                            href={`/mulklar/${p.id}?chat=true`}
                            onClick={onClose}
                            className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-muted transition-colors"
                          >
                            <MessageSquare className="size-3.5" aria-hidden="true" />
                            <span>Chat</span>
                          </Link>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
