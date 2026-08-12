'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Gavel, ShieldAlert, X } from 'lucide-react'
import { formatPrice } from '@/lib/data/properties'

export interface BiddingModalProps {
  isOpen: boolean
  onClose: () => void
  propertyTitle: string
  currentBid: number
  bidAmount: number
  bidIncrement: number
  onConfirmBid: (amount: number) => Promise<{ success: boolean; error?: string } | void> | void
}

export function BiddingModal({
  isOpen,
  onClose,
  propertyTitle,
  currentBid,
  bidAmount,
  bidIncrement,
  onConfirmBid,
}: BiddingModalProps) {
  const minRequiredBid = currentBid + bidIncrement
  const [customBid, setCustomBid] = useState<number>(Math.max(bidAmount, minRequiredBid))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const activeBid = Math.max(customBid, minRequiredBid)
  const commissionFee = Math.round(activeBid * 0.015) // 1.5% auktsion komissiyasi
  const totalCost = activeBid + commissionFee

  useEffect(() => {
    setCustomBid(Math.max(bidAmount, currentBid + bidIncrement))
    setErrorMessage(null)
  }, [bidAmount, currentBid, bidIncrement, isOpen])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  async function handleConfirm() {
    if (customBid < minRequiredBid) {
      setErrorMessage(`Stavka miqdori kamida ${formatPrice(minRequiredBid)} bo'lishi kerak`)
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const res = await onConfirmBid(customBid)
      if (res && typeof res === 'object' && res.success === false) {
        setErrorMessage(res.error || 'Stavka yuborishda xatolik yuz berdi')
        setIsSubmitting(false)
        return
      }

      setIsSubmitting(false)
      setIsConfirmed(true)
      setTimeout(() => {
        setIsConfirmed(false)
        onClose()
      }, 1500)
    } catch (err: any) {
      setErrorMessage(err?.message || 'Serverda xatolik yuz berdi. Qayta urinib ko\'ring.')
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bidding-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <Gavel className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="bidding-title" className="text-base font-bold text-card-foreground">
                Auktsion Stavkasi Tasdig&apos;i
              </h2>
              <p className="text-xs text-muted-foreground truncate max-w-[220px]">{propertyTitle}</p>
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
          {isConfirmed ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center animate-in zoom-in-95">
              <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                <CheckCircle2 className="size-8" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Stavka Muvaffaqiyatli Berildi!</h3>
              <p className="text-xs text-muted-foreground">
                Yangi stavkangiz: <span className="font-bold text-primary">{formatPrice(customBid)}</span>
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {errorMessage && (
                <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs font-semibold text-destructive animate-in fade-in">
                  <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="rounded-xl border border-border bg-muted/20 p-4 flex flex-col gap-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Joriy eng yuqori taklif:</span>
                  <span className="font-semibold text-foreground">{formatPrice(currentBid)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Min stavka qadami:</span>
                  <span className="font-semibold text-foreground">+{formatPrice(bidIncrement)}</span>
                </div>

                <div className="border-t border-border pt-2.5 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="custom-bid-input" className="text-xs font-bold text-foreground">
                      Berilayotgan stavka (so&apos;m):
                    </label>
                    <span className="text-xs font-bold text-primary">{formatPrice(customBid)}</span>
                  </div>
                  <input
                    id="custom-bid-input"
                    type="number"
                    step={bidIncrement}
                    min={minRequiredBid}
                    value={customBid}
                    onChange={(e) => setCustomBid(Number(e.target.value))}
                    className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-3.5 flex flex-col gap-1 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Platforma komissiyasi (1.5%):</span>
                  <span className="font-medium text-foreground">{formatPrice(commissionFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-foreground pt-1 border-t border-border">
                  <span>Yutib olinganda jami to&apos;lov:</span>
                  <span className="text-accent">{formatPrice(totalCost)}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-[11px] text-destructive">
                <ShieldAlert className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Stavka berilgandan so&apos;ng qaytarib olinmaydi. Garov depozitingiz ushlanib qolishi mumkin.</span>
              </div>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting || customBid < minRequiredBid}
                className="w-full rounded-xl bg-destructive py-3 text-xs font-bold text-white shadow-md hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {isSubmitting ? 'Stavka yuborilmoqda...' : `Stavkani Tasdiqlash (${formatPrice(customBid)})`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
