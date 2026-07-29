'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Camera, X, Loader2, Save, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import HomeHero from '@/components/HomeHero'
import Link from 'next/link'

export default function RedigeraAnnonsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [ad, setAd] = useState<any>(null)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [extraImages, setExtraImages] = useState<string[]>([])
  const [selectedLangs, setSelectedLangs] = useState<string[]>([])

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchAd = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/logga-in')
        return
      }

      const { data, error } = await supabase.from('ads').select('*').eq('id', id).single()

      if (error || !data) {
        toast.error('Kunde inte hitta annonsen')
        router.push('/annonser')
        return
      }

      if (data.user_id !== user.id) {
        toast.error('Du har inte behörighet att redigera denna annons')
        router.push(`/annonser/${id}`)
        return
      }

      setAd(data)
      setTitle(data.title)
      setCategory(data.category)
      setPrice(data.price || '')
      setLocation(data.location)
      setDescription(data.description)
      setImageUrl(data.image_url)
      setExtraImages(data.extra_images || [])
      setSelectedLangs(data.languages || [])
      setLoading(false)
    }

    fetchAd()
  }, [id, supabase, router])

  const toggleLanguage = (lang: string) => {
    setSelectedLangs(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    )
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Create history entry
      const historyEntry = {
        updated_at: new Date().toISOString(),
        old_data: {
          title: ad.title,
          price: ad.price,
          description: ad.description,
          category: ad.category,
          location: ad.location
        }
      }

      const newHistory = [...(ad.edit_history || []), historyEntry]

      const updateData = {
        title,
        category,
        price,
        location,
        description,
        languages: selectedLangs,
        edited: true,
        edit_history: newHistory
      }

      const { error } = await supabase
        .from('ads')
        .update(updateData)
        .eq('id', id)

      if (error) {
        toast.error(`Kunde inte spara ändringarna: ${error.message}`)
        console.error("Supabase error:", error)
        throw error
      }

      toast.success('Annonsen har uppdaterats!')
      router.push(`/annonser/${id}`)
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error('Kunde inte spara ändringarna')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center italic text-zinc-400">Laddar annonsdata...</div>

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20">
      <HomeHero />

      <div className="max-w-4xl mx-auto px-4 md:px-6 mt-12">
        <Link href={`/annonser/${id}`} className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#003366] transition-colors mb-8 text-[10px] font-black uppercase tracking-widest">
          <ArrowLeft size={14} /> Avbryt redigering
        </Link>

        <div className="bg-white rounded-sm shadow-xl p-8 md:p-12 border border-zinc-100">
          <div className="flex items-center gap-4 mb-10 border-b pb-6">
            <div className="bg-[#003366] p-3 rounded-sm text-white">
              <Save size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#003366] uppercase tracking-tighter italic">Redigera Annons</h2>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ändra dina uppgifter och spara</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-8">
            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Titel</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-sm focus:border-[#003366] focus:bg-white outline-none font-bold text-zinc-900 text-lg" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Kategori</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-sm focus:border-[#003366] focus:bg-white outline-none font-bold text-zinc-900">
                    <option value="Jobb">Jobb</option>
                    <option value="Bostad">Bostad</option>
                    <option value="Tjänster">Tjänster</option>
                    <option value="Övrigt">Övrigt</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Pris</label>
                  <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Bud" className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-sm focus:border-[#003366] focus:bg-white outline-none font-bold text-zinc-900" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Plats</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-sm focus:border-[#003366] focus:bg-white outline-none font-bold text-zinc-900" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Språk</label>
                <div className="flex flex-wrap gap-2">
                  {['Svenska', 'Polska', 'Engelska'].map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                        selectedLangs.includes(lang)
                        ? 'bg-[#003366] border-[#003366] text-white'
                        : 'bg-white border-zinc-100 text-zinc-500'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Beskrivning</label>
                <textarea rows={8} value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-sm focus:border-[#003366] focus:bg-white outline-none font-bold text-zinc-900 resize-none" />
              </div>
            </div>

            <button type="submit" disabled={saving} className="w-full bg-[#003366] text-white py-6 rounded-sm font-black uppercase tracking-[0.3em] hover:bg-[#a11a2d] transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
              {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Save size={20} /> Spara ändringar</>}
            </button>
          </form>

          <p className="mt-8 text-[9px] text-zinc-400 italic text-center">
            * Vid ändring sparas en kopia av den tidigare versionen för admin-granskning.
          </p>
        </div>
      </div>
    </div>
  )
}
