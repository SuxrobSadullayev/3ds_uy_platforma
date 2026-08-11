'use client'

import { useEffect, useState } from 'react'
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
    if (initialClientName) setClientName(initialClientName)
  }, [initialClientName])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      onClose()
    }, 1800)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="appointment-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarIcon className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="appointment-title" className="text-base font-bold text-card-foreground">
                Demo Ko&apos;rsatuv Uchrashuvini Belgilash
              </h2>
              <p className="text-xs text-muted-foreground">Mulkni mijozga joyida ko&apos;rsatish grafigi</p>
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
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="size-8" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Uchrashuv muvaffaqiyatli belgilandi!
              </h3>
              <p className="max-w-xs text-xs text-muted-foreground">
                Sana: {date} soat {time} da. SMS va Email xabarnomalar mijozga yuborildi.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-foreground">Mijoz Ismi va Familiyasi</span>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Javohir Ergashev"
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-foreground">Telefon Raqami</span>
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
                <span className="text-xs font-semibold text-foreground">Ko&apos;rsatiladigan Mulk</span>
                <select
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-foreground">Sana</span>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-foreground">Vaql (Soat)</span>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </label>
              </div>

              {/* Notification Toggles */}
              <div className="rounded-xl border border-border bg-muted/20 p-3 flex flex-col gap-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <Bell className="size-3.5 text-primary" aria-hidden="true" />
                    Mijozga SMS eslatma yuborish (1 soat oldin)
                  </span>
                  <input
                    type="checkbox"
                    checked={sendSms}
                    onChange={(e) => setSendSms(e.target.checked)}
                    className="size-4 accent-primary"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <Mail className="size-3.5 text-accent" aria-hidden="true" />
                    Google Calendar / Email taklifnoma
                  </span>
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="size-4 accent-primary"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:opacity-90 transition-opacity"
              >
                Uchrashuvni Kalendarga Qo&apos;shish
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
