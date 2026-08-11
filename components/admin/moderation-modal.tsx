'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  AlertTriangle,
  BadgeCheck,
  Check,
  CheckCircle2,
  FileCheck,
  Layers,
  MapPin,
  Save,
  ShieldAlert,
  Sliders,
  X,
  XCircle,
} from 'lucide-react'
import { formatPrice, type Property } from '@/lib/data/properties'

export interface ModerationModalProps {
  isOpen: boolean
  onClose: () => void
  property?: Property | null
  onApprove?: (id: string) => void
  onReject?: (id: string, reason: string) => void
}

export interface PlatformSystemSettings {
  commissionRate: number // foizda (masalan 2.5%)
  minAuctionDepositRate: number // foizda (masalan 10%)
  autoAiModeration: boolean
  requireSellerKyc: boolean
  strict3DCheck: boolean
}

export function ModerationModal({
  isOpen,
  onClose,
  property,
  onApprove,
  onReject,
}: ModerationModalProps) {
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [statusAction, setStatusAction] = useState<'approved' | 'rejected' | null>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !property) return null

  function handleApprove() {
    if (onApprove) onApprove(property.id)
    setStatusAction('approved')
    setTimeout(() => {
      setStatusAction(null)
      onClose()
    }, 1500)
  }

  function handleRejectSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rejectReason.trim()) return
    if (onReject) onReject(property.id, rejectReason)
    setStatusAction('rejected')
    setTimeout(() => {
      setStatusAction(null)
      setShowRejectInput(false)
      setRejectReason('')
      onClose()
    }, 1500)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="moderation-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileCheck className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="moderation-title" className="text-base font-bold text-card-foreground">
                E&apos;lon Moderatsiya Tekshiruvi
              </h2>
              <p className="text-xs text-muted-foreground">ID: {property.id}</p>
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
        <div className="overflow-y-auto p-6">
          {statusAction ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center animate-in zoom-in-95">
              {statusAction === 'approved' ? (
                <>
                  <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <CheckCircle2 className="size-8" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">E&apos;lon tasdiqlandi va katalogda chop etildi!</h3>
                </>
              ) : (
                <>
                  <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <XCircle className="size-8" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">E&apos;lon rad etildi</h3>
                  <p className="text-xs text-muted-foreground">Sabab muallifga yuborildi</p>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted">
                <Image
                  src={property.image || '/placeholder.svg'}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-card-foreground">{property.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="size-3.5 text-primary" aria-hidden="true" />
                  {property.address}, {property.district}, {property.region}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-border bg-muted/20 p-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Narxi:</span>
                  <p className="font-bold text-primary">{formatPrice(property.price)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Maydon:</span>
                  <p className="font-semibold text-foreground">{property.area} m²</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Xonalar:</span>
                  <p className="font-semibold text-foreground">{property.rooms} xona</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Sotuvchi:</span>
                  <p className="font-semibold text-foreground flex items-center gap-0.5">
                    {property.seller.name}
                    {property.seller.verified && (
                      <BadgeCheck className="size-3 text-accent" aria-hidden="true" />
                    )}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-muted-foreground">Tavsif:</span>
                <p className="mt-1 text-xs leading-relaxed text-foreground rounded-lg border border-border bg-card p-3">
                  {property.description}
                </p>
              </div>

              {showRejectInput && (
                <form onSubmit={handleRejectSubmit} className="flex flex-col gap-2 rounded-xl border border-destructive/40 bg-destructive/5 p-4 animate-in fade-in">
                  <span className="text-xs font-bold text-destructive flex items-center gap-1">
                    <ShieldAlert className="size-4" aria-hidden="true" />
                    Rad etish sababini kiriting:
                  </span>
                  <textarea
                    rows={2}
                    required
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Masalan: Rasmlar sifati past yoki kadastr ma'lumotlari mos emas..."
                    className="rounded-lg border border-destructive/30 bg-background p-2.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-destructive"
                  />
                  <div className="flex justify-end gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setShowRejectInput(false)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-destructive px-4 py-1.5 text-xs font-bold text-white shadow hover:opacity-90"
                    >
                      Tasdiqlab Rad Etish
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!statusAction && !showRejectInput && (
          <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-card">
            <button
              type="button"
              onClick={() => setShowRejectInput(true)}
              className="flex items-center gap-1.5 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2 text-xs font-bold text-destructive hover:bg-destructive/20 transition-colors"
            >
              <XCircle className="size-4" aria-hidden="true" />
              <span>Rad etish</span>
            </button>

            <button
              type="button"
              onClick={handleApprove}
              className="flex items-center gap-1.5 rounded-xl bg-accent px-6 py-2 text-xs font-bold text-accent-foreground shadow-md hover:opacity-90 transition-opacity"
            >
              <Check className="size-4" aria-hidden="true" />
              <span>Tasdiqlash & Chop etish</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Super Admin System Settings Form Component
 */
export function SystemSettingsForm() {
  const [settings, setSettings] = useState<PlatformSystemSettings>({
    commissionRate: 2.5,
    minAuctionDepositRate: 10,
    autoAiModeration: true,
    requireSellerKyc: true,
    strict3DCheck: false,
  })
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sliders className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-bold text-card-foreground">Platforma Tizim Sozlamalari</h3>
            <p className="text-xs text-muted-foreground">Komissiyalar, moderatsiya qoidalari va xavfsizlik paramertlari</p>
          </div>
        </div>

        {saved && (
          <span className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent animate-in fade-in">
            <Check className="size-3.5" aria-hidden="true" /> Sozlamalar saqlandi
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-foreground">Platforma Komissiyasi (%)</span>
          <input
            type="number"
            step={0.1}
            value={settings.commissionRate}
            onChange={(e) => setSettings((s) => ({ ...s, commissionRate: Number(e.target.value) }))}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-foreground">Auktsion Min Garov Depoziti (%)</span>
          <input
            type="number"
            step={1}
            value={settings.minAuctionDepositRate}
            onChange={(e) => setSettings((s) => ({ ...s, minAuctionDepositRate: Number(e.target.value) }))}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-4">
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-xs font-bold text-foreground">Sun&apos;iy Intellekt (AI) Avto-moderatsiya</p>
            <p className="text-[11px] text-muted-foreground">E&apos;lon rasmlari va matnlarini avtomatik spamlardan tozalash</p>
          </div>
          <input
            type="checkbox"
            checked={settings.autoAiModeration}
            onChange={(e) => setSettings((s) => ({ ...s, autoAiModeration: e.target.checked }))}
            className="size-4 accent-primary"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-xs font-bold text-foreground">Sotuvchilar KYC Tasdiqlashi Majburiyligi</p>
            <p className="text-[11px] text-muted-foreground">Faqat pasport/STIR tasdiqlaganlar e&apos;lon bera oladi</p>
          </div>
          <input
            type="checkbox"
            checked={settings.requireSellerKyc}
            onChange={(e) => setSettings((s) => ({ ...s, requireSellerKyc: e.target.checked }))}
            className="size-4 accent-primary"
          />
        </label>
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow hover:opacity-90 transition-opacity"
      >
        <Save className="size-4" aria-hidden="true" />
        <span>Sozlamalarni Saqlash</span>
      </button>
    </form>
  )
}
