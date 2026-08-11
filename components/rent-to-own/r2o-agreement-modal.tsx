'use client'

import { useEffect, useState } from 'react'
import {
  BadgeCheck,
  CheckCircle2,
  FileCheck,
  FileSignature,
  Lock,
  ShieldCheck,
  X,
} from 'lucide-react'
import { formatPrice } from '@/lib/data/properties'

export interface R2oAgreementModalProps {
  isOpen: boolean
  onClose: () => void
  propertyTitle?: string
  agreedPrice?: number
  monthlyPayment?: number
  durationMonths?: number
}

export function R2oAgreementModal({
  isOpen,
  onClose,
  propertyTitle = "Yangi 3 xonali kvartira — Mirzo Ulug'bek",
  agreedPrice = 1_150_000_000,
  monthlyPayment = 12_500_000,
  durationMonths = 36,
}: R2oAgreementModalProps) {
  const [selectedKey, setSelectedKey] = useState('eri-849204')
  const [pinCode, setPinCode] = useState('')
  const [isSigning, setIsSigning] = useState(false)
  const [isSigned, setIsSigned] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleSign(e: React.FormEvent) {
    e.preventDefault()
    if (!pinCode) return
    setIsSigning(true)
    setTimeout(() => {
      setIsSigning(false)
      setIsSigned(true)
      setTimeout(() => {
        setIsSigned(false)
        onClose()
      }, 2000)
    }, 1500)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="r2o-agreement-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <FileSignature className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="r2o-agreement-title" className="text-base font-bold text-card-foreground">
                Price-Lock Rent-to-Own E-Imzo Shartnomasi
              </h2>
              <p className="text-xs text-muted-foreground">Raqamli elektron imzo (E-IMZO / ERI)</p>
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
          {isSigned ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center animate-in zoom-in-95">
              <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                <CheckCircle2 className="size-8" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Shartnoma E-IMZO orqali tasdiqlandi!
              </h3>
              <p className="max-w-xs text-xs text-muted-foreground">
                Shartnoma raqamli kalit shtampi bilan tasdiqlandi va kadastr bazasiga yuborildi.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* Contract Preview Card */}
              <div className="rounded-xl border border-border bg-muted/20 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-xs font-bold text-foreground">SHARTNOMA № R2O-2026-889</span>
                  <span className="inline-flex items-center gap-1 rounded bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
                    <Lock className="size-3" aria-hidden="true" /> Price-Lock Aktiv
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-foreground font-mono bg-card p-3 rounded-lg border border-border">
                  Ushbu shartnoma sotuvchi va xaridor o&apos;rtasida tuzilib, {propertyTitle} mulkining
                  boshlang&apos;ich narxini ({formatPrice(agreedPrice)}) {durationMonths} oy muddatga muhrlaydi
                  (Price-Lock). Oylik to&apos;lov: {formatPrice(monthlyPayment)}.
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Mulk narxi:</span>{' '}
                    <span className="font-bold text-primary">{formatPrice(agreedPrice)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Muddat:</span>{' '}
                    <span className="font-semibold text-foreground">{durationMonths} oy</span>
                  </div>
                </div>
              </div>

              {/* E-IMZO Simulation Block */}
              <form onSubmit={handleSign} className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <FileCheck className="size-4" aria-hidden="true" />
                  E-IMZO (Elektron Raqamli Imzo) Bilan Imzolash
                </span>

                <label className="flex flex-col gap-1 text-xs">
                  <span className="font-medium text-foreground">ERI Kalit sertifikatini tanlang:</span>
                  <select
                    value={selectedKey}
                    onChange={(e) => setSelectedKey(e.target.value)}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
                  >
                    <option value="eri-849204">ERI-KEY #849204 (Suxrob Sadullayev)</option>
                    <option value="eri-104928">ERI-KEY #104928 (Murad Buildings MCHJ)</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1 text-xs">
                  <span className="font-medium text-foreground">ERI Kalit PIN paroli:</span>
                  <input
                    type="password"
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="****"
                    className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSigning}
                  className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow hover:opacity-90 disabled:opacity-50 transition-opacity mt-1"
                >
                  {isSigning ? 'E-IMZO Tasdiqlanmoqda...' : 'Shartnomani E-IMZO Bilan Imzolash'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
