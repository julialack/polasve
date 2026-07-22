'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Check, Camera, X, Loader2 } from 'lucide-react'
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

  const router = useRouter()
  const supabase = createClient()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
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

    let imageUrl = null
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('ad-images').upload(fileName, imageFile)
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('ad-images').getPublicUrl(fileName)
        imageUrl = publicUrl
      }
    }

    const { error } = await supabase.from('ads').insert([{
      title,
      category,
      price,
      location,
      description,
      is_premium: selectedPackage !== 'free',
      user_id: user.id,
      image_url: imageUrl
    }])

    if (error) {
      toast.error('Kunde inte skapa annons')
    } else {
      toast.success('Annonsen har publicerats!')
      router.push('/annonser')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20">
      <HomeHero />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-50 mt-12 md:mt-20">
        <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12 text-center border border-zinc-100">
          <h2 className="text-3xl md:text-5xl font-black text-[#003366] mb-4">Annonsnivåer</h2>
          <p className="text-zinc-500 mb-12 text-lg italic">
            Välj hur synlig du vill vara på <span className="font-bold text-[#003366]">Polacker i Sverige</span>.
          </p>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {PACKAGES.map((pkg) => (
              <div key={pkg.id} className={`flex flex-col bg-white rounded-xl overflow-hidden shadow-lg border border-zinc-100 transition-all hover:scale-[1.02] ${selectedPackage === pkg.id ? 'ring-4 ring-[#003366] ring-offset-2' : ''}`}>
                <div className={`${pkg.color} py-4 px-6 text-white flex items-center justify-center gap-2`}>
                  {pkg.id === 'free' && <div className="bg-white rounded-full p-1"><Check size={14} className="text-[#2d8a44]" strokeWidth={4} /></div>}
                  <h3 className="font-black text-sm md:text-base uppercase tracking-wider">{pkg.name}</h3>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <ul className="space-y-4 mb-8 text-left">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-zinc-600 font-medium">
                        <Check size={16} className="text-[#2d8a44] shrink-0 mt-0.5" strokeWidth={3} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6 border-t border-zinc-50 text-center">
                    <p className="text-zinc-400 text-sm mb-4">Pris: <span className="text-xl font-black text-zinc-900">{pkg.price}</span></p>
                    <button
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`w-full ${pkg.buttonColor} text-white py-3 rounded-md font-black uppercase text-[10px] md:text-xs tracking-widest shadow-md transition-all active:scale-95`}
                    >
                      {pkg.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ad Form - Visible after selecting a package */}
          {selectedPackage && (
            <div className="mt-20 pt-20 border-t border-zinc-100 text-left max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-10">
              <h3 className="text-2xl font-black text-[#003366] mb-8 uppercase tracking-tighter italic">Fyll i annonsuppgifter</h3>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-center w-full">
                    {imagePreview ? (
                      <div className="relative w-full aspect-video rounded-md overflow-hidden border-4 border-zinc-100 shadow-xl">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                        <button type="button" onClick={() => setImagePreview(null)} className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-zinc-900 hover:text-red-800 transition-colors shadow-lg z-10"><X size={20} /></button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full aspect-video border-4 border-dashed border-zinc-200 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-all cursor-pointer group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Camera className="w-12 h-12 text-zinc-300 group-hover:text-[#003366] transition-colors mb-4" />
                          <p className="font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-600">Ladda upp huvudbild</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                  <div className="grid gap-6">
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Annonsens titel" required className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-md focus:border-[#003366] focus:bg-white outline-none font-bold text-lg" />
                    <div className="grid md:grid-cols-2 gap-6">
                      <select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-md focus:border-[#003366] focus:bg-white outline-none font-bold">
                        <option value="">Välj kategori</option>
                        <option value="Jobb">Jobb</option>
                        <option value="Bostad">Bostad</option>
                        <option value="Tjänster">Tjänster</option>
                        <option value="Övrigt">Övrigt</option>
                      </select>
                      <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Pris (t.ex. 500 kr)" className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-md focus:border-[#003366] focus:bg-white outline-none font-bold" />
                    </div>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Stad / Plats" required className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-md focus:border-[#003366] focus:bg-white outline-none font-bold" />
                    <textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Beskrivning av vad du erbjuder..." required className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-md focus:border-[#003366] focus:bg-white outline-none font-bold resize-none" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#003366] text-white py-6 rounded-md font-black uppercase tracking-[0.3em] hover:bg-[#a11a2d] transition-all shadow-2xl shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
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
