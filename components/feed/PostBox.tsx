'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Camera, X, Loader2 } from 'lucide-react'

export default function PostBox() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()
  const router = useRouter()

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
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handlePost = async () => {
    if (!content.trim() && !imageFile) return

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('Du måste vara inloggad för att posta.')
      router.push('/logga-in')
      return
    }

    let imageUrl = null

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('feed-images')
        .upload(filePath, imageFile)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        alert('Kunde inte ladda upp bilden: ' + uploadError.message)
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('feed-images')
          .getPublicUrl(filePath)
        imageUrl = publicUrl
      }
    }

    const { error } = await supabase
      .from('posts')
      .insert([
        {
          content,
          user_id: user.id,
          user_name: user.user_metadata?.full_name || user.email?.split('@')[0],
          image_url: imageUrl
        }
      ])

    if (error) {
      alert('Kunde inte publicera: ' + error.message)
    } else {
      setContent('')
      removeImage()
    }
    setLoading(false)
  }

  return (
    <div className="bg-white border border-zinc-100 rounded-sm p-6 md:p-8 mb-12 shadow-sm">
      <div className="flex gap-4 md:gap-6">
        <div className="hidden sm:flex w-12 h-12 rounded-full border border-zinc-200 items-center justify-center text-xs font-bold text-zinc-400">
          DU
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Dela något med communityt..."
            className="w-full bg-transparent border-none focus:ring-0 resize-none font-light text-zinc-600 placeholder:text-zinc-300 py-2 text-base md:text-lg"
            rows={2}
            disabled={loading}
          ></textarea>

          {imagePreview && (
            <div className="relative mt-4 mb-2 w-full max-h-80 overflow-hidden rounded-sm border border-zinc-100 bg-zinc-50">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-contain mx-auto" />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-white/90 p-1 rounded-full text-zinc-900 hover:text-red-800 transition-colors shadow-sm"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="flex justify-between items-center mt-6 pt-6 border-t border-zinc-100">
            <div className="flex gap-2 md:gap-4">
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-zinc-400 hover:text-red-800 transition-colors text-xl p-2"
                title="Lägg till bild"
              >
                <Camera size={20} />
              </button>
            </div>
            <button
              onClick={handlePost}
              disabled={loading || (!content.trim() && !imageFile)}
              className="bg-zinc-900 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-red-800 transition-all active:scale-95 disabled:bg-zinc-300 flex items-center gap-2"
            >
              {loading && <Loader2 size={12} className="animate-spin" />}
              {loading ? 'Publicerar...' : 'Publicera'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
