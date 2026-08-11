'use client'

import React, { useState } from 'react'
import { CheckCircle2, DollarSign, PieChart, ShieldCheck, X } from 'lucide-react'

export interface FractionalOwnershipModalProps {
  isOpen: boolean
  onClose: () => void
  propertyTitle?: string
  totalPrice?: number
}

export function FractionalOwnershipModal({
  isOpen,
  onClose,
  propertyTitle = 'Tashkent City Premium Lot',
  totalPrice = 1500000000,
}: FractionalOwnershipModalProps) {
  const [sharePercent, setSharePercent] = useState(5)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const shareCost = Math.round((totalPrice * sharePercent) / 100)
  const monthlyDividend = Math.round((shareCost * 0.12) / 12)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      onClose()
    }, 1800)
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
            <PieChart className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Fraksional (Ulushli) Mulk Investitsiyasi</h3>
            <p className="text-xs text-muted-foreground">{propertyTitle}</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="my-8 flex flex-col items-center justify-center py-6 text-center animate-in zoom-in-95">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h4 className="text-xl font-bold text-foreground">Ulush Arizi Qabul Qilindi!</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Investitsiya menejeri 15 daqiqa ichida siz bilan bog'lanadi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="rounded-xl border border-border/80 bg-accent/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Sotib Olinadigan Ulush Foizi:</span>
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{sharePercent}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                value={sharePercent}
                onChange={(e) => setSharePercent(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-accent accent-purple-500 cursor-pointer"
              />

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60 text-xs">
                <div>
                  <span className="text-muted-foreground block">Ulush Qiymati:</span>
                  <span className="font-bold text-foreground text-sm">{shareCost.toLocaleString()} so'm</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Taxminiy Oylik Dividend:</span>
                  <span className="font-bold text-emerald-500 text-sm">{monthlyDividend.toLocaleString()} so'm</span>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">Investor Ismi va Familiyasi</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masalan: Bekzodbek Sadullayev"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">Telefon Raqami</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-purple-500/10 p-3 text-xs text-purple-600 dark:text-purple-300">
              <ShieldCheck className="h-5 w-5 shrink-0" />
              <span>Smart-contract kafolati va avtomatik oylik dividend to'lovi.</span>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-border/60 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-purple-700"
              >
                Ulush Sotib Olish Arizasi
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
