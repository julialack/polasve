'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Camera, X, Loader2 } from 'lucide-react'

export default function SkapaAnnonsPage() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(false)
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

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('Du måste vara inloggad för att skapa en annons.')
      router.push('/logga-in')
      return
    }

    let imageUrl = null

    // Ladda upp bild om en sådan valts
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('ad-images')
        .upload(filePath, imageFile)

      if (uploadError) {
        alert('Kunde inte ladda upp bilden: ' + uploadError.message)
        setLoading(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('ad-images')
        .getPublicUrl(filePath)

      imageUrl = publicUrl
    }

    const { error } = await supabase
      .from('ads')
      .insert([
        {
          title,
          category,
          price,
          location,
          description,
          is_premium: isPremium,
          user_id: user.id,
          image_url: imageUrl
        }
      ])

    if (error) {
      alert('Kunde inte skapa annons: ' + error.message)
    } else {
      router.push('/annonser')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light uppercase tracking-tighter italic text-zinc-900">Skapa <span className="font-bold">Annons</span></h1>
          <div className="h-px w-20 bg-red-800 mx-auto mt-4"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-50/50 p-10 rounded-sm border border-zinc-100 shadow-xl shadow-zinc-100/50">
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-800">Bilder & Media</h3>

            <div className="flex items-center justify-center w-full">
              {imagePreview ? (
                <div className="relative w-full aspect-video rounded-sm overflow-hidden border border-zinc-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-zinc-900 hover:text-red-800 transition-colors shadow-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-zinc-200 rounded-sm bg-white hover:bg-zinc-50 transition-colors cursor-pointer group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera className="w-10 h-10 text-zinc-300 group-hover:text-red-800 transition-colors mb-4" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-600 transition-colors">Klicka för att ladda upp huvudbild</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-zinc-100">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-800">Information</h3>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Titel</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Vad erbjuder du?"
                required
                className="w-full py-4 bg-transparent border-b border-zinc-200 focus:border-red-800 outline-none transition-colors font-light text-zinc-900 text-lg placeholder:text-zinc-200"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full py-4 bg-transparent border-b border-zinc-200 focus:border-red-800 outline-none transition-colors font-light text-zinc-900 text-lg"
                >
                  <option value="">Välj kategori</option>
                  <option value="Jobb">Jobb</option>
                  <option value="Bostad">Bostad</option>
                  <option value="Event">Event</option>
                  <option value="Tjänster">Tjänster</option>
                  <option value="Övrigt">Övrigt</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Pris / Lön</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="T.ex. 500 kr"
                  className="w-full py-4 bg-transparent border-b border-zinc-200 focus:border-red-800 outline-none transition-colors font-light text-zinc-900 text-lg placeholder:text-zinc-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Stad / Plats</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="T.ex. Stockholm"
                required
                className="w-full py-4 bg-transparent border-b border-zinc-200 focus:border-red-800 outline-none transition-colors font-light text-zinc-900 text-lg placeholder:text-zinc-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Beskrivning</label>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Berätta mer om vad du erbjuder..."
                required
                className="w-full py-4 bg-transparent border-b border-zinc-200 focus:border-red-800 outline-none transition-colors font-light text-zinc-900 text-lg placeholder:text-zinc-200 resize-none"
              />
            </div>
          </div>

          <div className="relative overflow-hidden p-8 rounded-sm bg-zinc-900 text-white shadow-2xl">
            <div className="absolute top-0 right-0 p-4">
               <span className="bg-red-800 text-[8px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">Rekommenderas</span>
            </div>
            <h4 className="font-serif italic text-xl mb-1">Premium-annons</h4>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-8">Synas högst upp i 14 dagar och få en exklusiv markering.</p>
            <label className="flex items-center gap-4 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-zinc-800 rounded-full peer-checked:bg-red-800 transition-colors border border-zinc-700"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Uppgradera för 49 kr</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-800 text-white py-6 rounded-full font-bold uppercase tracking-[0.3em] hover:bg-red-900 transition-all shadow-2xl shadow-red-900/20 active:scale-[0.98] text-xs disabled:bg-zinc-300 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Publicerar..." : "Publicera Annons"}
          </button>
        </form>
      </div>
    </div>
  )
}
