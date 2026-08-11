'use client'

import React, { useState } from 'react'
import { AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck, X } from 'lucide-react'

export interface ModerationModalProps {
  isOpen: boolean
  onClose: () => void
  propertyTitle?: string
  sellerName?: string
}

export function ModerationModal({
  isOpen,
  onClose,
  propertyTitle = 'Yangi Mirzo Ulugbek 3-Xonali Kvartira',
  sellerName = 'Tashkent City Builders LLC',
}: ModerationModalProps) {
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [statusAction, setStatusAction] = useState<'approved' | 'rejected' | null>(null)

  if (!isOpen) return null

  const handleApprove = () => {
    setStatusAction('approved')
    setTimeout(() => {
      setStatusAction(null)
      onClose()
    }, 1500)
  }

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatusAction('rejected')
    setTimeout(() => {
      setStatusAction(null)
      setShowRejectInput(false)
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border/80 bg-background p-6 shadow-2xl">
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Yopish"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-border/60 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Super Admin Moderatsiyasi</h3>
            <p className="text-xs text-muted-foreground">E'lon haqiqiyligini tekshirish va qaror qabul qilish</p>
          </div>
        </div>

        {statusAction === 'approved' ? (
          <div className="my-8 flex flex-col items-center justify-center py-6 text-center animate-in zoom-in-95">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h4 className="text-xl font-bold text-foreground">E'lon Tasdiqlandi va Chop Etildi!</h4>
            <p className="mt-1 text-sm text-muted-foreground">E'lon platformada faol ko'rinishga o'tdi.</p>
          </div>
        ) : statusAction === 'rejected' ? (
          <div className="my-8 flex flex-col items-center justify-center py-6 text-center animate-in zoom-in-95">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <h4 className="text-xl font-bold text-foreground">E'lon Rad Etildi!</h4>
            <p className="mt-1 text-sm text-muted-foreground">Sotuvchiga rad etish sababi yuborildi.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-border/80 bg-accent/20 p-4 space-y-2 text-xs">
              <div><span className="text-muted-foreground">Mulk Sarlavhasi:</span> <strong className="text-foreground">{propertyTitle}</strong></div>
              <div><span className="text-muted-foreground">Sotuvchi Tashkilot:</span> <strong className="text-foreground">{sellerName}</strong></div>
              <div><span className="text-muted-foreground">3D Model Statusi:</span> <strong className="text-emerald-500">GLB Model Yuklangan (14.2 MB)</strong></div>
              <div><span className="text-muted-foreground">Kadastr va Hujjatlar:</span> <strong className="text-blue-500">Tekshirilgan ✓</strong></div>
            </div>

            {showRejectInput ? (
              <form onSubmit={handleRejectSubmit} className="space-y-3 animate-in fade-in">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-foreground">Rad Etish Sababi (Sotuvchiga yuboriladi)</label>
                  <textarea
                    required
                    rows={3}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Masalan: 3D modelda xonalar chegarasi mos emas yoki kadastr raqami xato kiritilgan..."
                    className="w-full rounded-xl border border-input bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRejectInput(false)}
                    className="rounded-xl border border-input px-3 py-1.5 text-xs text-foreground hover:bg-accent"
                  >
                    Orqaga
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white shadow hover:bg-rose-700"
                  >
                    Rad Etishni Tasdiqlash
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 flex justify-between gap-3 border-t border-border/60 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRejectInput(true)}
                  className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                >
                  Rad Etish
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700"
                >
                  <ShieldCheck className="h-4 w-4" />
                  E'lonni Tasdiqlash
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
