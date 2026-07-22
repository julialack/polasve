'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface AvatarUploadProps {
  currentUser: any
  onUploaded?: () => void
}

export default function AvatarUpload({ currentUser, onUploaded }: AvatarUploadProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]
    if (!file) return
    if (!currentUser) return setError('Logga in för att ladda upp en bild')

    const ext = file.name.split('.').pop() || 'png'
    const path = `${currentUser.id}.${ext}`

    try {
      setLoading(true)
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (uploadError) {
        setError(uploadError.message)
      } else {
        onUploaded?.()
      }
    } catch (e: any) {
      setError(e?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium">
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <span className="cursor-pointer text-[#003366] underline">Ladda upp profilbild</span>
      </label>
      {loading && <span className="text-[10px] text-zinc-400"> laddar…</span>}
      {error && <span className="text-[10px] text-red-600">{error}</span>}
    </div>
  )
}
