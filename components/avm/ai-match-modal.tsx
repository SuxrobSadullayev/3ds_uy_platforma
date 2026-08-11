'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Sparkles,
  Star,
  X,
} from 'lucide-react'
import { formatPrice, properties, type Property } from '@/lib/data/properties'

export interface AiMatchModalProps {
  isOpen: boolean
  onClose: () => void
  estimatedPrice?: number
  region?: string
}

export function AiMatchModal({
  isOpen,
  onClose,
  estimatedPrice = 1_100_000_000,
  region = 'Toshkent shahri',
}: AiMatchModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const matches = properties.slice(0, 3).map((p, index) => ({
    property: p,
    score: 96 - index * 4, // 96%, 92%, 88%
    reasons: [
      `Baholangan narxingizga (${formatPrice(estimatedPrice)}) 95% mos tushadi`,
      `${p.district} hududida joylashgan va narxi barqaror o'smoqda`,
      `1 m² narxi (${formatPrice(p.pricePerM2 || Math.round(p.price / p.area))}) bozor o'rtachasidan 4% arzonroq`,
    ],
  }))

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-match-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="ai-match-title" className="text-base font-bold text-card-foreground">
                AI Match — Mos Keladigan Top Mulklar
              </h2>
              <p className="text-xs text-muted-foreground">
                AI Algoritmi bo&apos;yicha baholangan mezonlarga eng mos 3 ta taklif
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Yopish"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 flex flex-col gap-4">
          {matches.map(({ property, score, reasons }) => (
            <div
              key={property.id}
              className="flex flex-col sm:flex-row gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[16/10] sm:w-44 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={property.image || '/placeholder.svg'}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground shadow">
                  <Star className="size-3 fill-primary-foreground" aria-hidden="true" />
                  {score}% AI Match
                </span>
              </div>

              <div className="flex flex-col justify-between flex-1 gap-2">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-card-foreground line-clamp-1">
                      {property.title}
                    </h3>
                    <span className="text-sm font-bold text-primary shrink-0 ml-2">
                      {formatPrice(property.price)}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="size-3 text-primary" aria-hidden="true" />
                    {property.district}, {property.region}
                  </p>
                </div>

                {/* AI Explanation Box */}
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-2.5 text-[11px] flex flex-col gap-1">
                  <span className="font-bold text-primary flex items-center gap-1">
                    <Sparkles className="size-3" aria-hidden="true" />
                    Nega aynan bu mulk?
                  </span>
                  <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                    {reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end">
                  <Link
                    href={`/mulklar/${property.id}`}
                    onClick={onClose}
                    className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    <span>Batafsil ko&apos;rish</span>
                    <ExternalLink className="size-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
