'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Check, Camera, X, Loader2, PlusCircle, Building2, ArrowRight, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import HomeHero from '@/components/HomeHero'
import { capitalizeFirst } from '@/utils/capitalize'

const PACKAGES = [
  {
    id: 'standard',
    name: 'Standard Annons',
    color: 'bg-[#c1272d]',
    price: '49 kr',
    features: ['2 bilder (1 huvudbild + 1 extra)', '7 dagar synlighet', 'Standard placering i flödet'],
    buttonText: 'Välj Standard (49 kr)',
    buttonColor: 'bg-gradient-to-b from-[#fbb03b] to-[#f7931e]'
  },
  {
    id: 'premium',
    name: 'Premium Annons',
    color: 'bg-[#8a2be2]',
    price: '149 kr',
    features: ['3 bilder (1 huvudbild + 2 extra)', '14 dagar synlighet', 'Premium-badge & Främst i listan'],
    buttonText: 'Välj Premium (149 kr)',
    buttonColor: 'bg-gradient-to-b from-[#0071bc] to-[#29abe2]'
  },
  {
    id: 'featured',
    name: 'Prioriterad / Topplistad',
    color: 'bg-[#fbb03b]',
    price: '499 kr',
    features: ['30 dagar synlighet', 'Obegränsade bilder', 'Topplacering på startsidan', 'Maximal räckvidd & synlighet'],
    buttonText: 'Välj Prioriterad (499 kr)',
    buttonColor: 'bg-gradient-to-b from-[#003366] to-[#0071bc]'
  }
]

export default function SkapaAnnonsPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedPackage, setSelectedPackage] = useState<string>('standard')
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const maxExtraCount = selectedPackage === 'standard' ? 1 : selectedPackage === 'premium' ? 2 : 4
  const [extraFiles, setExtraFiles] = useState<(File | null)[]>([null, null, null, null])
  const [extraPreviews, setExtraPreviews] = useState<(string | null)[]>([null, null, null, null])

  const router = useRouter()
  const supabase = createClient()

  const handleSelectPackage = (pkgId: string) => {
    const count = pkgId === 'standard' ? 1 : pkgId === 'premium' ? 2 : 4
    setSelectedPackage(pkgId)
    setExtraFiles(new Array(count).fill(null))
    setExtraPreviews(new Array(count).fill(null))
    setStep(2)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 200, behavior: 'smooth' })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleExtraImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (file) {
      const newFiles = [...extraFiles]
      const newPreviews = [...extraPreviews]
      newFiles[index] = file
      newPreviews[index] = URL.createObjectURL(file)
      setExtraFiles(newFiles)
      setExtraPreviews(newPreviews)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPackage) return toast.error('Välj en annonsnivå först')

    if (!imageFile) {
      toast.error('Vänligen ladda upp en huvudbild för din annons')
      return
    }
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Du måste vara inloggad för att skapa en annons')
        router.push('/logga-in')
        return
      }

      // 1. Upload Main Image
      let imageUrl = null
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}-main.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('ad-images').upload(fileName, imageFile)
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('ad-images').getPublicUrl(fileName)
          imageUrl = publicUrl
        }
      }

      // 2. Upload Extra Images
      const extraUrls: string[] = []
      for (let i = 0; i < extraFiles.length; i++) {
        const file = extraFiles[i]
        if (file) {
          const fileExt = file.name.split('.').pop()
          const fileName = `${user.id}-${Date.now()}-extra-${i}.${fileExt}`
          const { error: err } = await supabase.storage.from('ad-images').upload(fileName, file)
          if (!err) {
            const { data: { publicUrl } } = supabase.storage.from('ad-images').getPublicUrl(fileName)
            extraUrls.push(publicUrl)
          }
        }
      }

      const capitalizedTitle = capitalizeFirst(title)
      const capitalizedDesc = capitalizeFirst(description)
      const capitalizedLocation = capitalizeFirst(location)

      const { data: adData, error } = await supabase.from('ads').insert([{
        title: capitalizedTitle,
        category,
        price,
        location: capitalizedLocation,
        description: capitalizedDesc,
        is_premium: selectedPackage !== 'standard',
        user_id: user.id,
        image_url: imageUrl,
        extra_images: extraUrls.length > 0 ? extraUrls : null,
        payment_status: 'pending_payment'
      }]).select().single()

      if (error) {
        toast.error('Kunde inte skapa annons: ' + error.message)
        return
      }

      // 3. Request Checkout Session
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adId: adData.id,
          packageId: selectedPackage,
          adTitle: title
        })
      })

      const checkoutData = await res.json().catch(() => null)

      if (checkoutData && checkoutData.url) {
        window.location.href = checkoutData.url
      } else {
        toast.error(checkoutData?.error || 'Betalningen kunde inte startas')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Okänt fel'
      toast.error(`Kunde inte skapa annons: ${message}`)
      console.error("Payment flow error:", err)
    } finally {
      setLoading(false)
    }
  }

  const activePkg = PACKAGES.find(p => p.id === selectedPackage) || PACKAGES[0]

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 text-left">
      <HomeHero />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-50 mt-6 md:mt-10">
        <div className="bg-white rounded-sm shadow-xl p-4 md:p-8 text-center border border-zinc-200">

          {/* Wizard Progress Bar */}
          <div className="flex items-center justify-center gap-3 mb-8 border-b pb-6 max-w-xl mx-auto">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full transition-all ${
                step === 1 ? 'bg-[#003366] text-white shadow-md' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
              }`}
            >
              <span>1. Välj Paket</span>
            </button>
            <span className="text-zinc-300 font-bold">→</span>
            <button
              onClick={() => { if (selectedPackage) setStep(2) }}
              disabled={!selectedPackage}
              className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full transition-all ${
                step === 2 ? 'bg-[#a11a2d] text-white shadow-md' : 'bg-zinc-100 text-zinc-400'
              }`}
            >
              <span>2. Annonsuppgifter</span>
            </button>
          </div>

          {/* STEP 1: Select Package */}
          {step === 1 && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-6 md:mb-10 text-center">
                <h2 className="text-xl md:text-3xl font-black text-[#003366] uppercase tracking-tighter italic">Steg 1: Välj annonsnivå</h2>
                <p className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">
                  Klicka på paketet som passar dig för att gå vidare till formuläret
                </p>
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto">
                {PACKAGES.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => handleSelectPackage(pkg.id)}
                    className="flex flex-col cursor-pointer bg-white rounded-sm overflow-hidden border-2 border-zinc-200 hover:border-[#003366] hover:shadow-xl transition-all group active:scale-95 text-left"
                  >
                    <div className={`${pkg.color} py-3 px-4 text-white flex items-center justify-between`}>
                      <h3 className="font-black text-xs uppercase tracking-wider">{pkg.name}</h3>
                      <span className="font-black text-xs bg-white/20 px-2 py-0.5 rounded-sm">{pkg.price}</span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <ul className="space-y-2.5 mb-6">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-zinc-700 font-bold leading-snug">
                            <Check size={14} className="text-[#2d8a44] shrink-0 mt-0.5" strokeWidth={3} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        className="w-full py-3 bg-[#003366] text-white rounded-sm font-black uppercase text-[10px] tracking-widest group-hover:bg-[#a11a2d] transition-colors shadow-md flex items-center justify-center gap-2"
                      >
                        Välj & Fortsätt <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* More Durable Banner */}
              <div className="bg-amber-50 border-2 border-dashed border-amber-300 p-4 md:p-6 rounded-sm text-center flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto shadow-sm">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 bg-amber-400 text-white rounded-full flex items-center justify-center shrink-0 shadow-md">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-[#003366] uppercase text-xs md:text-sm tracking-wider">Mer varaktig reklam för ditt företag?</h4>
                    <p className="text-[10px] md:text-xs text-zinc-600 font-medium">Vill du ha långsiktig synlighet, företagskonto eller skräddarsydd exponering?</p>
                  </div>
                </div>
                <Link
                  href="/reklam"
                  className="bg-[#003366] hover:bg-[#a11a2d] text-white px-6 py-2.5 rounded-sm font-black text-[10px] uppercase tracking-widest transition-all shadow-md shrink-0 flex items-center gap-2"
                >
                  Kontakta Oss <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}

          {/* STEP 2: Fill Form */}
          {step === 2 && (
            <div className="animate-in fade-in duration-300 text-left max-w-3xl mx-auto">
              {/* Active Selected Package Header Bar */}
              <div className="bg-zinc-900 text-white p-4 rounded-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-[#003366]">
                <div className="flex items-center gap-3 text-left">
                  <div className="bg-emerald-500 text-white p-2 rounded-full shrink-0">
                    <Check size={18} strokeWidth={3} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-emerald-400 tracking-widest">Valt Annonspaket</p>
                    <h4 className="text-base font-black text-white uppercase italic">
                      {activePkg.name} ({activePkg.price})
                    </h4>
                    <p className="text-[10px] text-zinc-400 font-bold">{activePkg.features.join(' • ')}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-white/10 hover:bg-white/20 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-sm border border-white/20 transition-all shrink-0 flex items-center gap-1.5"
                >
                  <ArrowLeft size={12} /> Byt Paket
                </button>
              </div>

              <div className="flex items-center gap-3 mb-8">
                <div className="bg-[#a11a2d] p-2 rounded-sm text-white">
                  <PlusCircle size={20} />
                </div>
                <h3 className="text-xl font-black text-[#003366] uppercase tracking-tighter italic">Steg 2: Fyll i annonsuppgifter</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-6">
                  {/* Main Image */}
                  <div className="flex items-center justify-center w-full">
                    {imagePreview ? (
                      <div className="relative w-full aspect-video rounded-sm overflow-hidden border-4 border-zinc-100 shadow-lg bg-zinc-900 flex items-center justify-center">
                        <Image src={imagePreview} alt="Preview" fill sizes="(max-width: 768px) 100vw, 600px" className="object-contain" />
                        <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-zinc-900 hover:text-red-800 transition-colors shadow-lg z-10"><X size={20} /></button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-zinc-300 rounded-sm bg-zinc-50 hover:bg-zinc-100 transition-all cursor-pointer group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Camera className="w-10 h-10 text-zinc-300 group-hover:text-[#003366] transition-colors mb-3" />
                          <p className="font-black uppercase tracking-widest text-[10px] text-zinc-400 group-hover:text-zinc-600">Ladda upp huvudbild (Bild 1)</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>

                  {/* Extra Images */}
                  <div className="space-y-3 bg-zinc-50 p-4 border border-zinc-200 rounded-sm">
                    <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest flex items-center gap-2">
                      <Camera size={14} className="text-[#a11a2d]" /> Extra bilder för {activePkg.name} (upp till {maxExtraCount} st)
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                      {Array.from({ length: maxExtraCount }).map((_, idx) => (
                        <div key={idx} className="relative aspect-video">
                          {extraPreviews[idx] ? (
                            <div className="relative w-full h-full rounded-sm overflow-hidden border-2 border-zinc-200 bg-zinc-900 flex items-center justify-center">
                              <Image src={extraPreviews[idx]!} alt="Extra Preview" fill className="object-contain" />
                              <button type="button" onClick={() => {
                                const newF = [...extraFiles]; const newP = [...extraPreviews];
                                newF[idx] = null; newP[idx] = null;
                                setExtraFiles(newF); setExtraPreviews(newP);
                              }} className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-zinc-900 shadow-sm z-10"><X size={12} /></button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-zinc-200 rounded-sm bg-white hover:bg-zinc-100 transition-all cursor-pointer">
                              <Camera className="w-5 h-5 text-zinc-300 mb-1" />
                              <span className="text-[8px] font-black uppercase text-zinc-400">Extra Bild {idx + 2}</span>
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleExtraImageChange(e, idx)} />
                            </label>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-5">
                    <div className="space-y-1">
                      <label htmlFor="create-ad-title" className="text-[9px] font-black uppercase text-zinc-400 tracking-widest ml-1">Annonsens titel</label>
                      <input
                        id="create-ad-title"
                        name="title"
                        autoComplete="off"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Vad erbjuder du?"
                        required
                        className="w-full p-4 bg-white border-2 border-zinc-200 rounded-sm focus:border-[#003366] outline-none font-bold text-zinc-950 text-base md:text-lg placeholder:text-zinc-300"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label htmlFor="create-ad-category" className="text-[9px] font-black uppercase text-zinc-400 tracking-widest ml-1">Kategori</label>
                        <select
                          id="create-ad-category"
                          name="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          required
                          className="w-full p-4 bg-white border-2 border-zinc-200 rounded-sm focus:border-[#003366] outline-none font-bold text-zinc-950 text-sm"
                        >
                          <option value="">Välj kategori</option>
                          <option value="Leta jobb">Jobb - Sökes</option>
                          <option value="Jobb">Jobb - Finns</option>
                          <option value="Bostad">Bostad - Övrigt</option>
                          <option value="Hyra">Bostad - Hyra ut</option>
                          <option value="Sökes">Bostad - Sökes</option>
                          <option value="Lokaler">Bostad - Lokaler</option>
                          <option value="Köp / Acceptera">Marketplace - Köpes</option>
                          <option value="Sälj / Bortskänkes">Marketplace - Säljes</option>
                          <option value="Bytes">Marketplace - Bytes</option>
                          <option value="Tjänster">Tjänster</option>
                          <option value="Transport">Transport</option>
                          <option value="Övrigt">Övrigt</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="create-ad-price" className="text-[9px] font-black uppercase text-zinc-400 tracking-widest ml-1">Pris / Ersättning</label>
                        <input
                          id="create-ad-price"
                          name="price"
                          inputMode="numeric"
                          type="text"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="t.ex. 500 kr eller Bud"
                          className="w-full p-4 bg-white border-2 border-zinc-200 rounded-sm focus:border-[#003366] outline-none font-bold text-zinc-950 text-sm placeholder:text-zinc-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="create-ad-location" className="text-[9px] font-black uppercase text-zinc-400 tracking-widest ml-1">Stad / Plats</label>
                      <input
                        id="create-ad-location"
                        name="address-level2"
                        autoComplete="address-level2"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Var finns varan/tjänsten?"
                        required
                        className="w-full p-4 bg-white border-2 border-zinc-200 rounded-sm focus:border-[#003366] outline-none font-bold text-zinc-950 text-sm placeholder:text-zinc-300"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="create-ad-desc" className="text-[9px] font-black uppercase text-zinc-400 tracking-widest ml-1">Beskrivning</label>
                      <textarea
                        id="create-ad-desc"
                        name="description"
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Berätta mer..."
                        required
                        className="w-full p-4 bg-white border-2 border-zinc-200 rounded-sm focus:border-[#003366] outline-none font-bold text-zinc-950 text-sm resize-none placeholder:text-zinc-300"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-[#003366] text-white py-5 rounded-sm font-black uppercase tracking-[0.2em] hover:bg-[#a11a2d] transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : `Gå till betalning (${activePkg.price})`}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
