'use client'

import React, { useState } from 'react'
import { Building2, Check, CheckCircle2, ChevronLeft, ChevronRight, FileCode, HardDrive, Image as ImageIcon, Layers, Upload, X } from 'lucide-react'

export interface PropertyWizardModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PropertyWizardModal({ isOpen, onClose }: PropertyWizardModalProps) {
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('kvartira')
  const [area, setArea] = useState('75')
  const [rooms, setRooms] = useState('3')
  const [price, setPrice] = useState('1200000000')
  const [rentToOwn, setRentToOwn] = useState(false)
  const [monthlyRent, setMonthlyRent] = useState('8000000')
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const handleNext = () => setStep((s) => Math.min(s + 1, 4))
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      setStep(1)
      onClose()
    }, 1800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border/80 bg-background p-6 shadow-2xl">
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
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Yangi Mulk Qoʻshish Wizard</h3>
            <p className="text-xs text-muted-foreground">3D va Rent-to-Own taklifi bilan e'lon joylashtirish</p>
          </div>
        </div>

        {/* Steps Progress Header */}
        <div className="my-4 flex items-center justify-between px-2">
          {[
            { n: 1, label: 'Asosiy' },
            { n: 2, label: 'Media & 3D' },
            { n: 3, label: 'Narx & Shartlar' },
            { n: 4, label: 'Tasdiqlash' },
          ].map((s) => (
            <div key={s.n} className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  step >= s.n ? 'bg-primary text-primary-foreground' : 'bg-accent text-muted-foreground'
                }`}
              >
                {s.n}
              </div>
              <span className={`text-xs hidden sm:inline ${step === s.n ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
              {s.n < 4 && <div className="h-0.5 w-6 sm:w-10 bg-border/80" />}
            </div>
          ))}
        </div>

        {isSuccess ? (
          <div className="my-8 flex flex-col items-center justify-center py-8 text-center animate-in zoom-in-95">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h4 className="text-xl font-bold text-foreground">Mulk Muvaffaqiyatli E'lon Qilindi!</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              3D model va e'lon parametrlari moderatsiyaga yuborildi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <div className="space-y-3 animate-in fade-in-50">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-foreground">Mulk Sarlavhasi</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masalan: Tashkent City Gardens 3-xonali Kvartira"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">Mulk Turi</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="kvartira">Kvartira</option>
                      <option value="uy">Hovli Uy</option>
                      <option value="ofis">Tijorat / Ofis</option>
                      <option value="dokon">Doʻkon</option>
                      <option value="ombor">Ombor</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">Maydoni (m²)</label>
                    <input
                      type="number"
                      required
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">Xonalar Soni</label>
                    <input
                      type="number"
                      required
                      value={rooms}
                      onChange={(e) => setRooms(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-foreground">Joylashuv (Tuman)</label>
                    <input
                      type="text"
                      defaultValue="Shayxontohur tumani"
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in-50">
                <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-primary" />
                  <p className="mt-2 text-xs font-semibold text-foreground">Rasmlarni shu yerga tashlang</p>
                  <p className="text-[11px] text-muted-foreground">JPG, PNG formatida maks 20MB</p>
                </div>

                <div className="rounded-xl border border-border/80 bg-accent/30 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <FileCode className="h-4 w-4 text-purple-500" />
                    3D Model Yuklash (.GLB / .GLTF)
                  </div>
                  <input
                    type="file"
                    accept=".glb,.gltf"
                    className="block w-full text-xs text-muted-foreground file:mr-4 file:rounded-xl file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  <p className="text-[10px] text-muted-foreground">Brauzerda 3D render boʻlishi uchun max 200MB .glb fayl yuklang</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in-50">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-foreground">Toʻliq Narx (soʻmda)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    1 m² narxi: {Math.round(Number(price) / (Number(area) || 1)).toLocaleString()} soʻm
                  </p>
                </div>

                <div className="rounded-xl border border-border/80 p-4 space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-bold text-foreground">Rent-to-Own Rejimi (Ijara va sotib olish)</span>
                    <input
                      type="checkbox"
                      checked={rentToOwn}
                      onChange={(e) => setRentToOwn(e.target.checked)}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                    />
                  </label>

                  {rentToOwn && (
                    <div className="space-y-2 pt-2 border-t border-border/60 animate-in fade-in">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-foreground">Oylik Ijara Toʻlovi (soʻm)</label>
                        <input
                          type="number"
                          value={monthlyRent}
                          onChange={(e) => setMonthlyRent(e.target.value)}
                          className="w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs text-foreground"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground">✓ Price-lock: 2 yillik boshlang'ich kelishilgan narx o'zgarmaydi.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3 animate-in fade-in-50 rounded-xl border border-border/80 bg-accent/20 p-4">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">E'lon Ma'lumotlari Xulosasi</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted-foreground">Sarlavha:</span> <strong>{title || 'Yangi Mulk'}</strong></div>
                  <div><span className="text-muted-foreground">Turi:</span> <strong>{type}</strong></div>
                  <div><span className="text-muted-foreground">Maydoni:</span> <strong>{area} m²</strong></div>
                  <div><span className="text-muted-foreground">Xonalar:</span> <strong>{rooms} xona</strong></div>
                  <div><span className="text-muted-foreground">To'liq Narxi:</span> <strong className="text-emerald-500">{Number(price).toLocaleString()} so'm</strong></div>
                  <div><span className="text-muted-foreground">Rent-to-Own:</span> <strong>{rentToOwn ? 'Mavjud' : 'Yo\'q'}</strong></div>
                </div>
              </div>
            )}

            {/* Wizard Navigation Footer */}
            <div className="mt-6 flex justify-between border-t border-border/60 pt-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-1 rounded-xl border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent"
                >
                  <ChevronLeft className="h-4 w-4" /> Orqaga
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
                >
                  Keyingisi <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-1 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700"
                >
                  E'lonni Joylashtirish <Check className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
