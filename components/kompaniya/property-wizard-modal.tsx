'use client'

import { useEffect, useState } from 'react'
import {
  AlertCircle,
  Box,
  Building,
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Layers,
  MapPin,
  UploadCloud,
  X,
} from 'lucide-react'
import {
  PROPERTY_TYPE_LABELS,
  REGIONS,
  formatPrice,
  type PropertyType,
} from '@/lib/data/properties'

export interface PropertyWizardModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: WizardFormData) => void
}

export interface WizardFormData {
  title: string
  type: PropertyType
  area: number
  rooms: number
  floor: number
  totalFloors: number
  region: string
  district: string
  address: string
  price: number
  pricePerM2: number
  rentToOwn: boolean
  monthlyPayment: number
  minPeriodMonths: number
  priceLockYear: number
  mortgageOffer: boolean
  virtualTourUrl: string
  has3DModel: boolean
  modelFileName?: string
  images: string[]
  description: string
}

const INITIAL_DATA: WizardFormData = {
  title: '',
  type: 'kvartira',
  area: 75,
  rooms: 2,
  floor: 4,
  totalFloors: 10,
  region: 'Toshkent shahri',
  district: 'Yunusobod tumani',
  address: '',
  price: 850_000_000,
  pricePerM2: 11_333_333,
  rentToOwn: false,
  monthlyPayment: 12_500_000,
  minPeriodMonths: 24,
  priceLockYear: 2028,
  mortgageOffer: true,
  virtualTourUrl: '',
  has3DModel: false,
  modelFileName: '',
  images: ['/images/property-1.png'],
  description: '',
}

export function PropertyWizardModal({ isOpen, onClose, onSubmit }: PropertyWizardModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [formData, setFormData] = useState<WizardFormData>(INITIAL_DATA)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function updateField<K extends keyof WizardFormData>(key: K, value: WizardFormData[K]) {
    setFormData((prev) => {
      const updated = { ...prev, [key]: value }
      if (key === 'price' || key === 'area') {
        const p = key === 'price' ? (value as number) : prev.price
        const a = key === 'area' ? (value as number) : prev.area
        updated.pricePerM2 = a > 0 ? Math.round(p / a) : 0
      }
      return updated
    })
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: '' }))
    }
  }

  function validateStep(currentStep: number): boolean {
    const errs: Record<string, string> = {}
    if (currentStep === 1) {
      if (!formData.title.trim()) errs.title = "Mulk sarlavhasini kiritish majburiy"
      if (!formData.address.trim()) errs.address = "Manzilni kiritish majburiy"
      if (formData.area <= 0) errs.area = "Maydon 0 dan katta bo'lishi kerak"
    } else if (currentStep === 3) {
      if (formData.price <= 0) errs.price = "Narx 0 dan katta bo'lishi kerak"
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function nextStep() {
    if (validateStep(step)) {
      if (step < 4) setStep((s) => (s + 1) as 1 | 2 | 3 | 4)
    }
  }

  function prevStep() {
    if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3 | 4)
  }

  function handleSubmit() {
    if (!validateStep(step)) return
    if (onSubmit) onSubmit(formData)
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      setStep(1)
      setFormData(INITIAL_DATA)
      onClose()
    }, 1800)
  }

  const stepsList = [
    { num: 1, title: 'Asosiy parametrlar' },
    { num: 2, title: 'Media & 3D Model' },
    { num: 3, title: 'Narxlash & Shartlar' },
    { num: 4, title: 'Tasdiqlash' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wizard-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="wizard-title" className="text-lg font-bold text-card-foreground">
                Yangi mulk e&apos;lonini yaratish
              </h2>
              <p className="text-xs text-muted-foreground">
                Bosqichma-bosqich 3D va 360° tur bilan boyitilgan e&apos;lon berish
              </p>
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

        {/* Progress Bar Header */}
        <div className="border-b border-border bg-muted/30 px-6 py-3">
          <div className="flex items-center justify-between gap-2">
            {stepsList.map((s) => {
              const active = step === s.num
              const completed = step > s.num
              return (
                <div key={s.num} className="flex flex-1 items-center gap-2">
                  <div
                    className={`flex size-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      completed
                        ? 'bg-accent text-accent-foreground'
                        : active
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {completed ? <Check className="size-3.5" aria-hidden="true" /> : s.num}
                  </div>
                  <span
                    className={`hidden text-xs font-semibold sm:inline ${
                      active ? 'text-foreground font-bold' : 'text-muted-foreground'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-6 flex-1">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center animate-in zoom-in-95">
              <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                <CheckCircle2 className="size-8" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                E&apos;lon muvaffaqiyatli yuborildi!
              </h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                E&apos;loningiz moderatsiyaga yuborildi. Admin tasdiqlagach, katalogda va 3D ko&apos;rishda e&apos;lon qilinadi.
              </p>
            </div>
          ) : (
            <>
              {/* STEP 1 */}
              {step === 1 && (
                <div className="flex flex-col gap-4 animate-in fade-in">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-foreground">
                      Mulk sarlavhasi <span className="text-destructive">*</span>
                    </span>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="Masalan: Mirzo Ulug'bek tumanida 3 xonali yangi kvartira"
                      className={`w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-ring ${
                        errors.title ? 'border-destructive' : 'border-border'
                      }`}
                    />
                    {errors.title && (
                      <span className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="size-3" aria-hidden="true" />
                        {errors.title}
                      </span>
                    )}
                  </label>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-foreground">Mulk turi</span>
                      <select
                        value={formData.type}
                        onChange={(e) => updateField('type', e.target.value as PropertyType)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring"
                      >
                        {Object.entries(PROPERTY_TYPE_LABELS).map(([k, label]) => (
                          <option key={k} value={k}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-foreground">
                        Maydoni (m²) <span className="text-destructive">*</span>
                      </span>
                      <input
                        type="number"
                        min={1}
                        value={formData.area}
                        onChange={(e) => updateField('area', Number(e.target.value))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-foreground">Xonalar</span>
                      <input
                        type="number"
                        min={1}
                        value={formData.rooms}
                        onChange={(e) => updateField('rooms', Number(e.target.value))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-foreground">Qavat</span>
                      <input
                        type="number"
                        min={1}
                        value={formData.floor}
                        onChange={(e) => updateField('floor', Number(e.target.value))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-foreground">Jami qavatlar</span>
                      <input
                        type="number"
                        min={1}
                        value={formData.totalFloors}
                        onChange={(e) => updateField('totalFloors', Number(e.target.value))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-foreground">Viloyat / Shahar</span>
                      <select
                        value={formData.region}
                        onChange={(e) => updateField('region', e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      >
                        {REGIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-foreground">Tuman</span>
                      <input
                        type="text"
                        value={formData.district}
                        onChange={(e) => updateField('district', e.target.value)}
                        placeholder="Masalan: Yunusobod tumani"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      />
                    </label>
                  </div>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-foreground">
                      Aniq manzil <span className="text-destructive">*</span>
                    </span>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      placeholder="Amir Temur shoh ko'chasi, 45-uy"
                      className={`w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground ${
                        errors.address ? 'border-destructive' : 'border-border'
                      }`}
                    />
                    {errors.address && (
                      <span className="text-xs text-destructive">{errors.address}</span>
                    )}
                  </label>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="flex flex-col gap-5 animate-in fade-in">
                  <div>
                    <span className="text-xs font-semibold text-foreground">
                      Mulk rasmlari yuklash
                    </span>
                    <div className="mt-2 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center hover:bg-muted/40 transition-colors cursor-pointer">
                      <UploadCloud className="size-8 text-primary" aria-hidden="true" />
                      <p className="text-xs font-semibold text-foreground">
                        Rasmlarni bu yerga tashlang yoki faylni tanlang
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        PNG, JPG, WebP formatlar (Maks: 10 MB)
                      </p>
                    </div>
                  </div>

                  <label className="flex flex-col gap-1.5">
                    <span className="flex items-center gap-1 text-xs font-semibold text-foreground">
                      <Camera className="size-3.5 text-accent" aria-hidden="true" />
                      360° Virtual Tur havolasi (ixtiyoriy)
                    </span>
                    <input
                      type="url"
                      value={formData.virtualTourUrl}
                      onChange={(e) => updateField('virtualTourUrl', e.target.value)}
                      placeholder="https://matterport.com/show/?m=demo"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                    />
                  </label>

                  <div className="rounded-xl border border-border bg-card p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.has3DModel}
                        onChange={(e) => {
                          updateField('has3DModel', e.target.checked)
                          if (e.target.checked) updateField('modelFileName', 'apartment-3d-model.glb')
                        }}
                        className="size-4 accent-primary"
                      />
                      <div>
                        <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Box className="size-4 text-primary" aria-hidden="true" />
                          Haqiqiy 3D (.glb / .gltf) model biriktirish
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          3D CAD bino modelini katalog interaktiv viewerida render qilish
                        </p>
                      </div>
                    </label>

                    {formData.has3DModel && (
                      <div className="mt-3 flex items-center justify-between rounded-lg bg-muted p-2.5 text-xs text-foreground">
                        <span className="truncate font-mono">{formData.modelFileName}</span>
                        <span className="rounded bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
                          Birlashtirildi (2.4 MB)
                        </span>
                      </div>
                    )}
                  </div>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-foreground">Tavsif</span>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="Mulk va uning atrofidagi infratuzilma haqida batafsil ma'lumot..."
                      className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground"
                    />
                  </label>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="flex flex-col gap-5 animate-in fade-in">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-foreground">
                        Umumiy Narxi (so&apos;mda) <span className="text-destructive">*</span>
                      </span>
                      <input
                        type="number"
                        min={0}
                        step={1_000_000}
                        value={formData.price}
                        onChange={(e) => updateField('price', Number(e.target.value))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-bold text-primary"
                      />
                      <span className="text-[11px] text-muted-foreground">
                        Format: {formatPrice(formData.price)}
                      </span>
                    </label>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-foreground">1 m² narxi</span>
                      <div className="h-9 flex items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-semibold text-foreground">
                        {formatPrice(formData.pricePerM2)} / m²
                      </div>
                    </div>
                  </div>

                  {/* Rent to Own Options */}
                  <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="text-xs font-bold text-foreground">Rent-to-Own taklifi</p>
                        <p className="text-[11px] text-muted-foreground">
                          Xaridorga ijara to&apos;lovi orqali sotib olish imkoniyatini taqdim etish
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.rentToOwn}
                        onChange={(e) => updateField('rentToOwn', e.target.checked)}
                        className="size-4 accent-primary"
                      />
                    </label>

                    {formData.rentToOwn && (
                      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3 pt-3 border-t border-border">
                        <label className="flex flex-col gap-1">
                          <span className="text-[11px] font-medium text-muted-foreground">
                            Oylik to&apos;lov (so&apos;m)
                          </span>
                          <input
                            type="number"
                            value={formData.monthlyPayment}
                            onChange={(e) => updateField('monthlyPayment', Number(e.target.value))}
                            className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                          />
                        </label>

                        <label className="flex flex-col gap-1">
                          <span className="text-[11px] font-medium text-muted-foreground">
                            Min muddat (oy)
                          </span>
                          <input
                            type="number"
                            value={formData.minPeriodMonths}
                            onChange={(e) => updateField('minPeriodMonths', Number(e.target.value))}
                            className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                          />
                        </label>

                        <label className="flex flex-col gap-1">
                          <span className="text-[11px] font-medium text-muted-foreground">
                            Price-Lock yili
                          </span>
                          <input
                            type="number"
                            value={formData.priceLockYear}
                            onChange={(e) => updateField('priceLockYear', Number(e.target.value))}
                            className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  <label className="flex items-center justify-between rounded-xl border border-border bg-card p-4 cursor-pointer">
                    <div>
                      <p className="text-xs font-bold text-foreground">Bank ipoteka dasturiga kiritish</p>
                      <p className="text-[11px] text-muted-foreground">
                        Hamkor banklar orqali subsidiyalangan ipoteka rasmiylashtirish
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.mortgageOffer}
                      onChange={(e) => updateField('mortgageOffer', e.target.checked)}
                      className="size-4 accent-primary"
                    />
                  </label>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div className="flex flex-col gap-4 animate-in fade-in">
                  <h3 className="text-sm font-bold text-foreground">
                    Ma&apos;lumotlarni yakuniy ko&apos;rib chiqish:
                  </h3>

                  <div className="rounded-xl border border-border bg-muted/20 p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-block rounded-md bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                          {PROPERTY_TYPE_LABELS[formData.type]}
                        </span>
                        <h4 className="mt-1 text-base font-bold text-foreground">{formData.title}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="size-3.5 text-primary" />
                          {formData.address}, {formData.district}, {formData.region}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-primary">{formatPrice(formData.price)}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border-t border-border pt-3">
                      <div>
                        <span className="text-muted-foreground">Maydoni:</span>{' '}
                        <span className="font-semibold">{formData.area} m²</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Xonalar:</span>{' '}
                        <span className="font-semibold">{formData.rooms} xona</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Qavat:</span>{' '}
                        <span className="font-semibold">
                          {formData.floor}/{formData.totalFloors}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">1 m²:</span>{' '}
                        <span className="font-semibold">{formatPrice(formData.pricePerM2)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {formData.has3DModel && (
                        <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          <Box className="size-3" aria-hidden="true" /> 3D Model Tayyor
                        </span>
                      )}
                      {formData.rentToOwn && (
                        <span className="inline-flex items-center gap-1 rounded bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
                          Rent-to-Own Mavjud
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!isSuccess && (
          <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-card">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-40 transition-opacity"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              <span>Orqaga</span>
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <span>Keyingisi</span>
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-1.5 rounded-lg bg-accent px-6 py-2 text-xs font-bold text-accent-foreground hover:opacity-90 transition-opacity shadow-md"
              >
                <Check className="size-4" aria-hidden="true" />
                <span>E&apos;lonni chop etish</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
