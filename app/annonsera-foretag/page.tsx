'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import {
  Building2,
  Send,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Clock,
  CreditCard,
  Camera,
  X
} from 'lucide-react'
import { toast } from 'sonner'
import HomeHero from '@/components/HomeHero'
import Link from 'next/link'
import Image from 'next/image'

const PRICING = [
  { days: "7 dagar", price: "249 kr", desc: "Perfekt för korta kampanjer." },
  { days: "30 dagar", price: "799 kr", desc: "Mest populär för långsiktig synlighet.", featured: true },
  { days: "90 dagar", price: "1999 kr", desc: "Maximal effekt för etablerade företag." },
]

export default function AnnonseraForetagPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [companyName, setCompanyName] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [email, setEmail] = useState('')
  const [duration, setDuration] = useState('30 dagar')
  const [message, setMessage] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const supabase = createClient()
  const router = useRouter()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = null
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `business-${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('ad-images')
          .upload(fileName, imageFile)

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('ad-images')
            .getPublicUrl(fileName)
          imageUrl = publicUrl
        }
      }

      const { error } = await supabase
        .from('business_ad_requests')
        .insert([{
          company_name: companyName,
          contact_person: contactPerson,
          email,
          duration,
          message,
          image_url: imageUrl,
          status: 'pending'
        }])

      if (error) throw error

      setSubmitted(true)
      toast.success('Din förfrågan har skickats!')
    } catch (err: any) {
      console.error("Business ad request error:", err)
      const errorMsg = err.message || err.details || "Okänt fel uppstod"
      toast.error(`Kunde inte skicka förfrågan: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] pb-20">
        <HomeHero />
        <div className="max-w-2xl mx-auto px-4 mt-20 text-center">
          <div className="bg-white p-12 rounded-sm shadow-xl border border-zinc-100">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-black text-[#003366] uppercase italic mb-4">Tack för din förfrågan!</h2>
            <p className="text-zinc-500 font-medium leading-relaxed mb-8">
              Vi har tagit emot dina uppgifter. En administratör kommer att granska din förfrågan och återkomma till dig via e-post inom kort.
            </p>
            <Link href="/" className="inline-block bg-[#003366] text-white px-10 py-4 rounded-sm font-black uppercase text-[11px] tracking-widest hover:bg-[#a11a2d] transition-all">
              Tillbaka till startsidan
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20">
      <HomeHero />

      <main className="max-w-7xl mx-auto px-4 md:px-6 mt-8 md:mt-16">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#003366] transition-colors mb-6 text-[10px] font-black uppercase tracking-widest">
          <ArrowLeft size={14} /> Tillbaka
        </Link>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* LEFT: Info & Pricing */}
          <div className="w-full lg:w-[40%] space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#003366] uppercase tracking-tighter italic leading-[1.1] mb-4">
                Nå hela det polska <span className="text-[#a11a2d]">nätverket i Sverige</span>
              </h1>
              <p className="text-zinc-500 font-medium leading-relaxed text-base md:text-lg italic">
                Visa upp ditt företag på vår mest sedda plats. Vi hjälper dig att växa i communityt genom personliga samarbeten.
              </p>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 p-6 md:p-8 rounded-sm shadow-md">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-800 mb-6 flex items-center gap-4">
                Personligt samarbete <div className="h-px flex-1 bg-amber-200"></div>
              </h3>
              <p className="text-sm font-bold text-amber-900 leading-relaxed italic mb-4">
                Vi tror på skräddarsydda lösningar.
              </p>
              <p className="text-xs text-amber-800 leading-relaxed mb-6 font-medium">
                Istället för fasta prispaket vill vi förstå dina behov och mål. Fyll i intresseanmälan till höger så bokar vi ett möte för att diskutera ett upplägg och pris som passar just din verksamhet.
              </p>
              <div className="flex items-center gap-3 text-amber-600 font-black uppercase text-[9px] tracking-widest">
                <ShieldCheck size={16} /> Garanterad synlighet
              </div>
            </div>

            <div className="bg-[#003366] p-6 md:p-8 rounded-sm text-white shadow-xl">
              <ShieldCheck className="mb-4 opacity-50" size={32} />
              <h4 className="font-black uppercase tracking-widest text-xs md:text-sm mb-3 italic">Varför annonsera?</h4>
              <ul className="space-y-3">
                {["Synlighet för 1000+ besökare dagligen", "Riktad reklam mot polsktalande i Sverige", "Proffsig presentation av ditt varumärke"].map((item, i) => (
                  <li key={i} className="flex gap-3 text-[10px] font-medium opacity-90 italic">
                    <CheckCircle2 size={14} className="text-amber-400 shrink-0 mt-0.5" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="w-full lg:w-[60%]">
            <div className="bg-white p-6 md:p-10 lg:p-12 rounded-sm shadow-2xl border border-zinc-100">
              <div className="flex items-center gap-4 mb-10 border-b pb-6">
                <div className="bg-amber-400 p-3 rounded-sm text-white shadow-lg shadow-amber-200/50">
                  <Building2 size={24} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-[#003366] uppercase tracking-tighter italic">Intresseanmälan</h2>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Vi återkommer till dig inom 24 timmar</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Ladda upp annonsbild / Logotyp</label>
                  <div className="flex items-center justify-center w-full">
                    {imagePreview ? (
                      <div className="relative w-full aspect-video rounded-sm overflow-hidden border-2 border-zinc-100 shadow-lg">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                        <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-zinc-900 hover:text-red-800 transition-colors shadow-md z-10">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-zinc-200 rounded-sm bg-zinc-50 hover:bg-zinc-100 transition-all cursor-pointer group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Camera className="w-8 h-8 text-zinc-300 group-hover:text-[#003366] transition-colors mb-2" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-600">Välj bild</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Företagsnamn</label>
                  <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-sm focus:border-[#003366] focus:bg-white outline-none font-bold text-zinc-950" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Kontaktperson</label>
                  <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-sm focus:border-[#003366] focus:bg-white outline-none font-bold text-zinc-950" />
                </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">E-postadress</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-sm focus:border-[#003366] focus:bg-white outline-none font-bold text-zinc-950" />
                </div>

                {/* Hidden pricing selection - defaults to personal contact */}
                <input type="hidden" value="Personligt" />

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Meddelande / Önskemål</label>
                  <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Berätta gärna kort om din verksamhet och vad ni hoppas uppnå med er annonsering..." className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-sm focus:border-[#003366] focus:bg-white outline-none font-bold text-zinc-950 resize-none placeholder:text-zinc-300" />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-[#a11a2d] text-white py-6 rounded-sm font-black uppercase tracking-[0.3em] hover:bg-[#003366] transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send size={20} /> Skicka förfrågan</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
