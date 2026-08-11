'use client'

import React, { useEffect, useState } from 'react'
import { Bell, Calendar as CalendarIcon, CheckCircle2, Clock, Mail, Phone, User, X } from 'lucide-react'
import { properties } from '@/lib/data/properties'

export interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  initialClientName?: string
}

export function AppointmentModal({
  isOpen,
  onClose,
  initialClientName = '',
}: AppointmentModalProps) {
  const [clientName, setClientName] = useState(initialClientName)
  const [phone, setPhone] = useState('')
  const [propertyId, setPropertyId] = useState(properties[0]?.id || '')
  const [date, setDate] = useState('2026-08-15')
  const [time, setTime] = useState('14:30')
  const [sendSms, setSendSms] = useState(true)
  const [sendEmail, setSendEmail] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (initialClientName) {
      setClientName(initialClientName)
    }
  }, [initialClientName])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Uchrashuv Belgilash</h3>
            <p className="text-xs text-muted-foreground">Mijoz bilan mulk namoyishini rejalashtiring</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="my-8 flex flex-col items-center justify-center py-6 text-center animate-in zoom-in-95">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h4 className="text-xl font-bold text-foreground">Uchrashuv Belgilandi!</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Mijozga SMS va Email taklifnoma yuborildi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">Mijoz Ismi va Familiyasi</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Masalan: Sardor Rahimov"
                  className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">Telefon Raqami</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">Koʻrsatiladigan Mulk</label>
              <select
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} — {p.district}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">Sana</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-foreground">Vaqt</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-accent/40 p-3 space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendSms}
                  onChange={(e) => setSendSms(e.target.checked)}
                  className="rounded border-input text-primary focus:ring-primary"
                />
                <Bell className="h-3.5 w-3.5 text-primary" />
                Mijozga avtomatik SMS eslatma yuborish
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="rounded border-input text-primary focus:ring-primary"
                />
                <Mail className="h-3.5 w-3.5 text-primary" />
                Google Calendar / Email taklifnoma yuborish
              </label>
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
                className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
              >
                Uchrashuvni Tasdiqlash
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
