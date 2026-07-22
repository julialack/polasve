'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Camera, Save, ArrowLeft, Loader2, User as UserIcon } from 'lucide-react'

export default function InstallningarPage() {
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/logga-in')
        return
      }
      setUser(user)
      setFullName(user.user_metadata?.full_name || '')
      setAvatarUrl(user.user_metadata?.avatar_url || null)
    }
    getUser()
  }, [])

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = e.target.files?.[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setAvatarUrl(publicUrl)
      setMessage({ type: 'success', text: 'Bilden har laddats upp! Glöm inte att spara ändringarna.' })
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Kunde inte ladda upp bilden: ' + error.message })
    } finally {
      setUploading(false)
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          avatar_url: avatarUrl
        }
      })

      if (error) throw error

      setMessage({ type: 'success', text: 'Dina uppgifter har uppdaterats!' })
      router.refresh()
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Kunde inte spara: ' + error.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/profil"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#003366] transition-colors mb-8 text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Tillbaka till profil
        </Link>

        <div className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#003366] p-8 text-white">
            <h1 className="text-2xl font-bold uppercase tracking-tight italic">Profilinställningar</h1>
            <p className="text-blue-100/60 text-xs mt-1 font-medium">Uppdatera din personliga information och profilbild.</p>
          </div>

          <div className="p-8 md:p-12">
            {message && (
              <div className={`mb-8 p-4 rounded-sm text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-10">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-6 pb-10 border-b border-zinc-50">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-28 h-28 bg-zinc-100 rounded-full overflow-hidden border-4 border-white shadow-xl relative">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300">
                        <UserIcon size={40} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="text-white" size={24} />
                    </div>
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
                      <Loader2 className="animate-spin text-[#003366]" size={24} />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleUploadAvatar}
                  />
                  <p className="text-[10px] font-black uppercase text-[#003366] tracking-[0.1em]">Klicka för att byta profilbild</p>
                </div>
              </div>

              {/* Personal Info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2">Ditt Namn</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Förnamn Efternamn"
                    className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-sm text-sm font-bold text-zinc-900 outline-none focus:border-[#003366] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2">E-postadress (kan ej ändras)</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-zinc-50/50 border border-zinc-100 p-4 rounded-sm text-sm font-medium text-zinc-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || uploading}
                className="w-full bg-[#003366] text-white py-4 rounded-sm font-black uppercase tracking-[0.2em] text-xs hover:bg-[#a11a2d] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Spara ändringar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
