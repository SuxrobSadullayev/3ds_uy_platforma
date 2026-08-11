'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, DollarSign, Layers, PieChart, ShieldCheck, X } from 'lucide-react'
import { formatPrice } from '@/lib/data/properties'

export interface FractionalOwnershipModalProps {
  isOpen: boolean
  onClose: () => void
  propertyTitle?: string
  totalPriceUzxs?: number
  estimatedMonthlyRentUzxs?: number
}

export function FractionalOwnershipModal({
  isOpen,
  onClose,
  propertyTitle = 'Tashkent City Business Penthouse',
  totalPriceUzxs = 2_400_000_000,
  estimatedMonthlyRentUzxs = 24_000_000,
}: FractionalOwnershipModalProps) {
  const [sharePercent, setSharePercent] = useState<number>(5) // 5% default
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'card' | 'crypto'>('bank')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sharePriceUzxs = Math.round(totalPriceUzxs * (sharePercent / 100))
  const monthlyDividendUzxs = Math.round(estimatedMonthlyRentUzxs * (sharePercent / 100))
  const annualDividendUzxs = monthlyDividendUzxs * 12

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      onClose()
    }, 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fractional-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <PieChart className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="fractional-title" className="text-base font-bold text-card-foreground">
                Ulushli (Fraksional) Mulk Sotib Olish
              </h2>
              <p className="text-xs text-muted-foreground">{propertyTitle}</p>
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
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center animate-in zoom-in-95">
              <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                <CheckCircle2 className="size-8" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Ulush sotib olish arizasi qabul qilindi!
              </h3>
              <p className="max-w-xs text-xs text-muted-foreground">
                Menejerimiz siz ko&apos;rsatgan telefon raqami orqali bog&apos;lanadi va shartnomani rasmiylashtiradi.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Share Slider */}
              <div className="rounded-xl border border-border bg-muted/20 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-foreground">Tanlangan ulush miqdori:</span>
                  <span className="text-base font-bold text-accent">{sharePercent}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  step={1}
                  value={sharePercent}
                  onChange={(e) => setSharePercent(Number(e.target.value))}
                  className="w-full h-2 rounded-lg accent-accent bg-muted cursor-pointer"
                />

                <div className="grid grid-cols-2 gap-2 border-t border-border pt-3">
                  <div>
                    <span className="text-[11px] text-muted-foreground">Ulush qiymati:</span>
                    <p className="text-sm font-bold text-primary">{formatPrice(sharePriceUzxs)}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Oylik dividend:</span>
                    <p className="text-sm font-bold text-accent">+{formatPrice(monthlyDividendUzxs)} /oy</p>
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="flex flex-col gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-foreground">Ism va Familiya</span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alisher Navoiy"
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-foreground">Telefon raqami</span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-foreground">E-pochta</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="investor@example.uz"
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-foreground">To&apos;lov usuli</span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'bank', label: 'Bank o\'tkazmasi' },
                      { id: 'card', label: 'Uzcard / Humo' },
                      { id: 'crypto', label: 'USDT / Crypto' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`rounded-lg border p-2 text-center font-medium transition-colors ${
                          paymentMethod === m.id
                            ? 'border-accent bg-accent/10 text-accent font-bold'
                            : 'border-border bg-background text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-muted p-2.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="size-4 text-accent shrink-0" aria-hidden="true" />
                <span>Barcha ulushlar Davlat kadastri va smart-kontrakt orqali rasmiylashtiriladi.</span>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-accent py-2.5 text-xs font-bold text-accent-foreground shadow-md hover:opacity-90 transition-opacity"
              >
                {sharePercent}% Ulush Sotib Olish Arizasini Yuborish ({formatPrice(sharePriceUzxs)})
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
