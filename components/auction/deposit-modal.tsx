'use client'

import { useEffect, useState } from 'react'
import { BadgeCheck, CheckCircle2, CreditCard, ShieldCheck, Wallet, X } from 'lucide-react'
import { formatPrice } from '@/lib/data/properties'

export interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  depositAmount: number
  onDepositSuccess: () => void
}

export function DepositModal({
  isOpen,
  onClose,
  depositAmount,
  onDepositSuccess,
}: DepositModalProps) {
  const [paymentProvider, setPaymentProvider] = useState<'payme' | 'click' | 'card' | 'uzum'>('payme')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPaid, setIsPaid] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handlePay() {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setIsPaid(true)
      onDepositSuccess()
      setTimeout(() => {
        setIsPaid(false)
        onClose()
      }, 1600)
    }, 1200)
  }

  const providers = [
    { id: 'payme', label: 'Payme', color: 'border-cyan-500/40 text-cyan-600 bg-cyan-500/5' },
    { id: 'click', label: 'Click Evolution', color: 'border-blue-500/40 text-blue-600 bg-blue-500/5' },
    { id: 'uzum', label: 'Uzum Pay', color: 'border-purple-500/40 text-purple-600 bg-purple-500/5' },
    { id: 'card', label: 'Uzcard / Humo', color: 'border-emerald-500/40 text-emerald-600 bg-emerald-500/5' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deposit-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Wallet className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="deposit-title" className="text-base font-bold text-card-foreground">
                Garov Depozitini To&apos;lash (5%)
              </h2>
              <p className="text-xs text-muted-foreground">E-Auktsionda ishtirok etish uchun</p>
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
          {isPaid ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center animate-in zoom-in-95">
              <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                <CheckCircle2 className="size-8" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Garov Depoziti Qabul Qilindi!</h3>
              <p className="text-xs text-muted-foreground">
                Auktsionda joriy stavkalarni berish huquqi faollashtirildi.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* KYC Status indicator */}
              <div className="flex items-center justify-between rounded-xl border border-accent/30 bg-accent/5 p-3 text-xs">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="size-4 text-accent" aria-hidden="true" />
                  <span className="font-semibold text-foreground">KYC Shaxsiyat Tasdiqlangan</span>
                </div>
                <span className="font-mono text-accent text-[11px]">STIR: 308942104</span>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground">Depozit miqdori:</span>
                <span className="text-lg font-bold text-primary">{formatPrice(depositAmount)}</span>
              </div>

              <div>
                <span className="text-xs font-semibold text-foreground">To&apos;lov tizimini tanlang:</span>
                <div className="grid grid-cols-2 gap-2.5 mt-2">
                  {providers.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentProvider(p.id as any)}
                      className={`flex items-center justify-center rounded-xl border p-3 text-xs font-bold transition-all ${
                        paymentProvider === p.id
                          ? `${p.color} border-2 shadow-sm`
                          : 'border-border bg-background text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="size-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <span>Auktsionda yutqazgan taqdiringizda garov depoziti 24 soat ichida kartangizga to&apos;liq qaytariladi.</span>
              </div>

              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full rounded-xl bg-accent py-3 text-xs font-bold text-accent-foreground shadow-md hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {isProcessing ? 'To\'lov amalga oshirilmoqda...' : `Depozit To'lash (${formatPrice(depositAmount)})`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
