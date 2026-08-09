'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Check, Camera, X, Loader2, PlusCircle } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import HomeHero from '@/components/HomeHero'

const PACKAGES = [
  {
    id: 'free',
    name: 'Gratis Annons',
    color: 'bg-[#2d8a44]',
    price: '0 kr',
    features: ['1 bild', '7 dagar synlighet', 'Syns i vanlig lista', 'Perfekt för enstaka annonser'],
    buttonText: 'Skapa gratis annonx',
    buttonColor: 'bg-[#ff3b3b]'
  },
  {
    id: 'standard',
    name: 'Standard Annons',
    color: 'bg-[#c1272d]',
    price: '49 kr',
    features: ['3 bilder', '30 dagar synlighet', 'Bättre placering', 'För prioriterade'],
    buttonText: 'Välj Standard',
    buttonColor: 'bg-gradient-to-b from-[#fbb03b] to-[#f7931e]'
  },
  {
    id: 'premium',
    name: 'Premium Annons',
    color: 'bg-[#8a2be2]',
    price: '149 kr',
    features: ['5-10 bilder', 'Premium-badge', 'I "Populära annonser"', 'Hög synlighet'],
    buttonText: 'Välj Premium',
    buttonColor: 'bg-gradient-to-b from-[#0071bc] to-[#29abe2]'
  },
  {
    id: 'featured',
    name: 'Featured / Topplistad',
    color: 'bg-[#fbb03b]',
    price: '299 kr',
    features: ['Alltid överst', 'Stor bild', 'Syns på startsidan', 'Maximal synlighet'],
    buttonText: 'Välj Featured',
    buttonColor: 'bg-gradient-to-b from-[#003366] to-[#0071bc]'
  }
]

export default function SkapaAnnonsPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [extraFiles, setExtraFiles] = useState<(File | null)[]>([null, null])
  const [extraPreviews, setExtraPreviews] = useState<(string | null)[]>([null, null])

  const router = useRouter()
  const supabase = createClient()

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

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error('Du måste vara inloggad')
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

    const { data: adData, error } = await supabase.from('ads').insert([{
      title,
      category,
      price,
      location,
      description,
      is_premium: selectedPackage !== 'free',
      user_id: user.id,
      image_url: imageUrl,
      extra_images: extraUrls.length > 0 ? extraUrls : null,
      payment_status: selectedPackage === 'free' ? 'paid' : 'pending_payment'
    }]).select().single()

    if (error) {
      toast.error('Kunde inte skapa annons')
    } else {
      if (selectedPackage === 'free') {
        toast.success('Annonsen har publicerats!')
        router.push('/annonser')
      } else {
        // Redirect to Stripe for paid packages
        try {
          const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              adId: adData.id,
              packageId: selectedPackage,
              adTitle: title
            })
          })

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Kunde inte läsa svar från servern' }));
            throw new Error(errorData.error || `Serverfel: ${res.status}`);
          }

          const { url } = await res.json()
          if (url) {
            window.location.href = url
          } else {
            throw new Error('Ingen betalnings-URL mottogs')
          }
        } catch (err: any) {
          toast.error(`Betalningen kunde inte startas: ${err.message}`)
          console.error("Payment flow error:", err)
        }
      }
    }
    setLoading(false)
  }

  const showExtraImages = ['Köp / Acceptera', 'Sälj / Bortskänkes', 'Bytes', 'Hyra', 'Sökes'].includes(category)

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20">
      <HomeHero />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-50 mt-6 md:mt-10">
        <div className="bg-white rounded-sm shadow-xl p-4 md:p-8 text-center border border-zinc-200">
          <div className="mb-6 md:mb-10">
            <h2 className="text-xl md:text-3xl font-black text-[#003366] uppercase tracking-tighter italic">Välj annonsnivå</h2>
            <p className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">
              Hitta rätt synlighet för din annons på <span className="text-[#a11a2d]">Polasve</span>
            </p>
          </div>

          {/* Compact Pricing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`flex flex-col cursor-pointer bg-white rounded-sm overflow-hidden border-2 transition-all hover:shadow-md ${
                  selectedPackage === pkg.id
                  ? 'border-[#003366] ring-2 ring-[#003366]/10 bg-zinc-50/50'
                  : 'border-zinc-100 hover:border-zinc-300'
                }`}
              >
                <div className={`${pkg.color} py-2 px-4 text-white flex items-center justify-between`}>
                  <h3 className="font-black text-[10px] md:text-xs uppercase tracking-wider">{pkg.name}</h3>
                  <span className="font-black text-[10px]">{pkg.price}</span>
                </div>
                <div className="p-3 md:p-4 flex-1 flex flex-col text-left">
                  <ul className="space-y-1.5 mb-4">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-[9px] md:text-[10px] text-zinc-600 font-bold leading-tight">
                        <Check size={12} className="text-[#2d8a44] shrink-0 mt-0.5" strokeWidth={4} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={`mt-auto w-full py-2 rounded-sm font-black uppercase text-[9px] tracking-widest transition-all ${
                      selectedPackage === pkg.id
                      ? 'bg-[#003366] text-white'
                      : 'bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200'
                    }`}
                  >
                    {selectedPackage === pkg.id ? 'Vald' : 'Välj'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Ad Form - Visible after selecting a package */}
          {selectedPackage && (
            <div className="mt-10 pt-10 border-t border-zinc-100 text-left max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-[#a11a2d] p-2 rounded-sm text-white">
                  <PlusCircle size={20} />
                </div>
                <h3 className="text-xl font-black text-[#003366] uppercase tracking-tighter italic">Fyll i annonsuppgifter</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-center w-full">
                    {imagePreview ? (
                      <div className="relative w-full aspect-video rounded-sm overflow-hidden border-4 border-zinc-100 shadow-lg">
                        <Image src={imagePreview} alt="Preview" fill sizes="(max-width: 768px) 100vw, 600px" className="object-cover" />
                        <button type="button" onClick={() => setImagePreview(null)} className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-zinc-900 hover:text-red-800 transition-colors shadow-lg z-10"><X size={20} /></button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-zinc-300 rounded-sm bg-zinc-50 hover:bg-zinc-100 transition-all cursor-pointer group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Camera className="w-10 h-10 text-zinc-300 group-hover:text-[#003366] transition-colors mb-3" />
                          <p className="font-black uppercase tracking-widest text-[10px] text-zinc-400 group-hover:text-zinc-600">Ladda upp huvudbild</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>

                  <div className="grid gap-5">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-zinc-400 tracking-widest ml-1">Annonsens titel</label>
                      <input
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
                        <label className="text-[9px] font-black uppercase text-zinc-400 tracking-widest ml-1">Kategori</label>
                        <select
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
                        <label className="text-[9px] font-black uppercase text-zinc-400 tracking-widest ml-1">Pris / Ersättning</label>
                        <input
                          type="text"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="t.ex. 500 kr eller Bud"
                          className="w-full p-4 bg-white border-2 border-zinc-200 rounded-sm focus:border-[#003366] outline-none font-bold text-zinc-950 text-sm placeholder:text-zinc-300"
                        />
                      </div>
                    </div>

                    {showExtraImages && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                        <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest ml-1">Extra bilder (max 2)</p>
                        <div className="grid grid-cols-2 gap-4">
                          {[0, 1].map((idx) => (
                            <div key={idx} className="relative aspect-video">
                              {extraPreviews[idx] ? (
                                <div className="relative w-full h-full rounded-sm overflow-hidden border-2 border-zinc-200">
                                  <Image src={extraPreviews[idx]!} alt="Extra Preview" fill className="object-cover" />
                                  <button type="button" onClick={() => {
                                    const newF = [...extraFiles]; const newP = [...extraPreviews];
                                    newF[idx] = null; newP[idx] = null;
                                    setExtraFiles(newF); setExtraPreviews(newP);
                                  }} className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-zinc-900 shadow-sm z-10"><X size={12} /></button>
                                </div>
                              ) : (
                                <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-zinc-200 rounded-sm bg-zinc-50 hover:bg-zinc-100 transition-all cursor-pointer">
                                  <Camera className="w-5 h-5 text-zinc-300 mb-1" />
                                  <span className="text-[8px] font-black uppercase text-zinc-400">Bild {idx + 1}</span>
                                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleExtraImageChange(e, idx)} />
                                </label>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-zinc-400 tracking-widest ml-1">Stad / Plats</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Var finns varan/tjänsten?"
                        required
                        className="w-full p-4 bg-white border-2 border-zinc-200 rounded-sm focus:border-[#003366] outline-none font-bold text-zinc-950 text-sm placeholder:text-zinc-300"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-zinc-400 tracking-widest ml-1">Beskrivning</label>
                      <textarea
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
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Publicera Annons Nu"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
