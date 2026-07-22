'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Loader2,
  User as UserIcon,
  Smile,
  Shirt,
  Scissors,
  Mars,
  Venus,
  Palette,
  Glasses
} from 'lucide-react'
import { toast } from 'sonner'
import HomeHero from '@/components/HomeHero'

const CATEGORIES = [
  { id: 'topType', label: 'Hår', icon: <Scissors size={18} /> },
  { id: 'facialHairType', label: 'Skägg', icon: <Smile size={18} /> },
  { id: 'eyeType', label: 'Ögon', icon: <UserIcon size={18} /> },
  { id: 'mouthType', label: 'Mun', icon: <Smile size={18} /> },
  { id: 'accessoriesType', label: 'Tillbehör', icon: <Glasses size={18} /> },
  { id: 'clotheType', label: 'Kläder', icon: <Shirt size={18} /> },
  { id: 'skinColor', label: 'Hud', icon: <Palette size={18} /> },
]

interface AvatarConfig {
  avatarStyle: string
  topType: string
  hairColor: string
  facialHairType: string
  eyeType: string
  eyebrowType: string
  mouthType: string
  accessoriesType: string
  clotheType: string
  clotheColor: string
  skinColor: string
  [key: string]: string
}

const OPTIONS = {
  topType: ['NoHair', 'Hat', 'Hijab', 'Turban', 'WinterHat1', 'WinterHat2', 'LongHairBigHair', 'LongHairBob', 'LongHairBun', 'LongHairCurly', 'LongHairCurvy', 'LongHairDreads', 'LongHairFrida', 'LongHairFro', 'LongHairFroBand', 'LongHairNotTooLong', 'LongHairShavedSides', 'LongHairMiaWallace', 'LongHairStraight', 'LongHairStraight2', 'ShortHairDreads01', 'ShortHairFrizzle', 'ShortHairShaggyMullet', 'ShortHairShortCurly', 'ShortHairShortFlat', 'ShortHairShortRound', 'ShortHairShortWaved', 'ShortHairSides', 'ShortHairTheCaesar'],
  hairColor: ['Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'PastelPink', 'Platinum', 'Red', 'SilverGray'],
  facialHairType: ['Blank', 'BeardMedium', 'BeardLight', 'BeardMajestic', 'MoustacheFancy', 'MoustacheMagnum'],
  eyeType: ['Default', 'Close', 'Cry', 'Dizzy', 'EyeRoll', 'Hearts', 'Side', 'Squint', 'Surprised', 'Wink', 'WinkWacky'],
  mouthType: ['Default', 'Concerned', 'Disbelief', 'Eating', 'Grimace', 'Sad', 'ScreamOpen', 'Serious', 'Smile', 'Tongue', 'Twinkle', 'Vomit'],
  accessoriesType: ['Blank', 'Kurt', 'Prescription01', 'Prescription02', 'Round', 'Sunglasses', 'Wayfarers'],
  clotheType: ['BlazerShirt', 'BlazerSweater', 'CollarSweater', 'GraphicShirt', 'Hoodie', 'Overall', 'ShirtCrewNeck', 'ShirtScoopNeck', 'ShirtVNeck'],
  clotheColor: ['Black', 'Blue01', 'Blue02', 'Blue03', 'Gray01', 'Gray02', 'Heather', 'PastelBlue', 'PastelGreen', 'PastelOrange', 'PastelRed', 'PastelYellow', 'Pink', 'Red', 'White'],
  skinColor: ['Tanned', 'Yellow', 'Pale', 'Light', 'Brown', 'DarkBrown', 'Black'],
}

const AVAILABLE_LANGUAGES = [
  { id: 'sv', label: 'Svenska' },
  { id: 'pl', label: 'Polski' },
  { id: 'en', label: 'English' },
]

export default function InstallningarPage() {
  const [activeTab, setActiveTab] = useState('topType')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [avatarSvg, setAvatarSvg] = useState<string>('')
  const [imageLoading, setImageLoading] = useState(false)

  const [fullName, setFullName] = useState('')
  const [city, setCity] = useState('')
  const [bio, setBio] = useState('')
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [showEmail, setShowEmail] = useState(false)
  const [showNameRequest, setShowNameRequest] = useState(false)
  const [requestedName, setRequestedName] = useState('')

  const [config, setConfig] = useState<AvatarConfig>({
    avatarStyle: 'Circle',
    topType: 'ShortHairShortFlat',
    hairColor: 'BrownDark',
    facialHairType: 'Blank',
    eyeType: 'Default',
    eyebrowType: 'Default',
    mouthType: 'Smile',
    accessoriesType: 'Blank',
    clotheType: 'ShirtCrewNeck',
    clotheColor: 'Gray01',
    skinColor: 'Light'
  })

  const supabase = createClient()
  const router = useRouter()

  const refreshAvatarMarkup = useCallback(async (currentConfig: AvatarConfig) => {
    setImageLoading(true)
    try {
      const params = new URLSearchParams(currentConfig as any).toString()
      const res = await fetch(`/api/avatar?${params}`)
      const svg = await res.text()
      if (svg.startsWith('<svg')) {
        setAvatarSvg(svg)
      }
    } catch (e) {
      console.error("Failed to load avatar", e)
    } finally {
      setImageLoading(false)
    }
  }, [])

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser()
      if (error || !currentUser) {
        router.push('/logga-in')
        return
      }
      setUser(currentUser)
      setFullName(currentUser.user_metadata?.full_name || '')
      setCity(currentUser.user_metadata?.city || '')
      setBio(currentUser.user_metadata?.bio || '')
      setSelectedLanguages(currentUser.user_metadata?.languages || [])
      setShowEmail(currentUser.user_metadata?.show_email_publicly || false)

      const savedUrl = currentUser.user_metadata?.avatar_url || ''
      let finalConfig = { ...config }
      if (savedUrl.includes('api/avatar')) {
        try {
          const url = new URL(savedUrl, window.location.origin)
          url.searchParams.forEach((val, key) => { if (key in finalConfig) finalConfig[key] = val })
        } catch (e) {}
      }
      setConfig(finalConfig)
      refreshAvatarMarkup(finalConfig)
      setLoading(false)
    }
    getUserData()
  }, [supabase, router, refreshAvatarMarkup])

  const updateConfig = (key: string, value: string) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    refreshAvatarMarkup(newConfig)
  }

  const toggleLanguage = (langId: string) => {
    setSelectedLanguages(prev =>
      prev.includes(langId) ? prev.filter(id => id !== langId) : [...prev, langId]
    )
  }

  const setPreset = (gender: 'm' | 'f') => {
    const newConfig = gender === 'm'
      ? { ...config, topType: 'ShortHairShortFlat', hairColor: 'BrownDark', facialHairType: 'Blank', eyeType: 'Default', mouthType: 'Smile', clotheType: 'ShirtCrewNeck' }
      : { ...config, topType: 'LongHairStraight', hairColor: 'BlondeGolden', facialHairType: 'Blank', eyeType: 'Default', mouthType: 'Smile', clotheType: 'ShirtVNeck' }
    setConfig(newConfig)
    refreshAvatarMarkup(newConfig)
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const params = new URLSearchParams(config as any).toString()
      const avatarUrl = `/api/avatar?${params}`

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          avatar_url: avatarUrl,
          avatar_config: config,
          city,
          bio,
          languages: selectedLanguages,
          show_email_publicly: showEmail,
        }
      })
      if (error) throw error
      toast.success('Dina inställningar har sparats!')
      router.refresh()
    } catch (err) {
      toast.error('Kunde inte spara inställningarna')
    } finally {
      setSaving(false)
    }
  }

  const handleRequestNameChange = async () => {
    if (!requestedName.trim() || !user) return
    const { error } = await supabase.from('name_change_requests').insert([{
      user_id: user.id, current_name: fullName, requested_name: requestedName, status: 'pending'
    }])
    if (!error) {
      toast.success('Namnförfrågan skickad!')
      setShowNameRequest(false)
      setRequestedName('')
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center italic text-zinc-400 font-sans text-center">Öppnar Studio...</div>

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-left font-sans text-left">
      <HomeHero />

      <div className="flex-1 py-8 px-4 md:px-6 text-left">
        <div className="max-w-5xl mx-auto text-left">
          <Link href="/profil" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#003366] transition-colors mb-6 text-[10px] font-black uppercase tracking-widest text-left">
            <ArrowLeft size={14} /> Tillbaka
          </Link>

          <div className="bg-white border border-zinc-200 rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px] text-left">

            {/* LEFT: PREVIEW */}
            <div className="w-full md:w-[350px] bg-zinc-50 border-r border-zinc-100 p-8 flex flex-col items-center justify-center sticky top-0 text-left">
               <div className="w-56 h-56 bg-white rounded-full overflow-hidden border-8 border-white shadow-2xl mb-8 flex items-center justify-center relative text-left">
                  {avatarSvg ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: avatarSvg }}
                      className={`w-full h-full transition-opacity duration-300 [&_svg]:w-full [&_svg]:h-full ${imageLoading ? 'opacity-30' : 'opacity-100'}`}
                    />
                  ) : (
                    <Loader2 className="animate-spin text-[#003366]" />
                  )}
                  {imageLoading && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-[#003366]" size={30} /></div>}
               </div>

               <div className="flex gap-3 w-full max-w-[240px] text-left">
                  <button type="button" onClick={() => setPreset('m')} className="flex-1 bg-white border border-zinc-200 py-2.5 rounded-full flex items-center justify-center gap-2 text-[10px] font-black uppercase text-blue-600 hover:border-blue-600 transition-all shadow-sm active:scale-95 text-left text-left">Man</button>
                  <button type="button" onClick={() => setPreset('f')} className="flex-1 bg-white border border-zinc-200 py-2.5 rounded-full flex items-center justify-center gap-2 text-[10px] font-black uppercase text-pink-600 hover:border-pink-600 transition-all shadow-sm active:scale-95 text-left text-left">Kvinna</button>
               </div>
            </div>

            {/* RIGHT: EDITOR */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden text-left">
               <div className="flex border-b border-zinc-100 bg-white text-left">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id)}
                      className={`flex-1 p-5 flex flex-col items-center gap-2 transition-all text-left text-left ${activeTab === cat.id ? 'text-[#003366] bg-zinc-50/50 border-b-4 border-[#003366]' : 'text-zinc-300 hover:text-zinc-400'}`}
                    >
                      {cat.icon}
                      <span className="text-[9px] font-black uppercase tracking-widest text-left text-left">{cat.label}</span>
                    </button>
                  ))}
               </div>

               <div className="p-8 flex-1 overflow-y-auto max-h-[480px] text-left text-left">
                  {activeTab === 'topType' && (
                    <div className="space-y-10 text-left text-left">
                       <div className="text-left text-left">
                         <label className="block text-[10px] font-black uppercase text-zinc-300 mb-6 tracking-widest text-left text-left">Välj frisyr</label>
                         <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4 text-left text-left">
                           {OPTIONS.topType.map(opt => (
                             <button
                                key={opt}
                                onClick={() => updateConfig('topType', opt)}
                                className={`aspect-square rounded-full border-2 overflow-hidden bg-zinc-50 transition-all flex items-center justify-center p-1 text-left text-left ${config.topType === opt ? 'border-[#003366] ring-4 ring-[#003366]/10 shadow-lg' : 'border-zinc-100 hover:border-zinc-300'}`}
                             >
                                <img src={`/api/avatar?topType=${opt}&hairColor=${config.hairColor}&skinColor=${config.skinColor}&clotheType=ShirtCrewNeck&clotheColor=Gray01`} className="w-full h-full object-cover" alt="" />
                             </button>
                           ))}
                         </div>
                       </div>
                       <div className="text-left text-left">
                         <label className="block text-[10px] font-black uppercase text-zinc-300 mb-6 tracking-widest text-left text-left">Hårfärg</label>
                         <div className="grid grid-cols-5 sm:grid-cols-9 gap-3 text-left text-left">
                           {OPTIONS.hairColor.map(color => (
                             <button key={color} onClick={() => updateConfig('hairColor', color)} className={`aspect-square rounded-full border-2 transition-all text-left text-left ${config.hairColor === color ? 'border-[#003366] scale-110 shadow-lg' : 'border-white shadow-sm'}`} style={{ backgroundColor: color }} title={color} />
                           ))}
                         </div>
                       </div>
                    </div>
                  )}

                  {/* Categories facialHairType, eyeType, mouthType, accessoriesType, clotheType, skinColor would follow the same pattern... */}
                  {/* (For brevity and safety, ensuring all path rendering uses SVG/API logic) */}

                  {activeTab === 'facialHairType' && (
                    <div className="space-y-10 text-left text-left">
                       <label className="block text-[10px] font-black uppercase text-zinc-300 mb-6 tracking-widest text-left text-left">Skägg & Mustasch</label>
                       <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4 text-left text-left">
                         {OPTIONS.facialHairType.map(opt => (
                           <button
                              key={opt}
                              onClick={() => updateConfig('facialHairType', opt)}
                              className={`aspect-square rounded-full border-2 overflow-hidden bg-zinc-100 transition-all flex items-center justify-center p-1 text-left text-left ${config.facialHairType === opt ? 'border-[#003366] ring-4 ring-[#003366]/10 shadow-lg' : 'border-zinc-100 hover:border-zinc-300'}`}
                           >
                              <img src={`/api/avatar?facialHairType=${opt}&topType=NoHair&skinColor=${config.skinColor}&clotheType=ShirtCrewNeck&clotheColor=Gray01`} className="w-full h-full object-contain" alt="" />
                           </button>
                         ))}
                       </div>
                    </div>
                  )}

                  {activeTab === 'eyeType' && (
                    <div className="space-y-10 text-left text-left">
                       <label className="block text-[10px] font-black uppercase text-zinc-300 mb-6 tracking-widest text-left text-left">Blick & Ögon</label>
                       <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4 text-left text-left text-left">
                         {OPTIONS.eyeType.map(opt => (
                           <button
                              key={opt}
                              onClick={() => updateConfig('eyeType', opt)}
                              className={`aspect-square rounded-full border-2 overflow-hidden bg-zinc-100 transition-all flex items-center justify-center p-1 text-left text-left ${config.eyeType === opt ? 'border-[#003366] ring-4 ring-[#003366]/10' : 'border-zinc-100 hover:border-zinc-300'}`}
                           >
                              <img src={`/api/avatar?eyeType=${opt}&topType=NoHair&skinColor=${config.skinColor}&clotheType=ShirtCrewNeck&clotheColor=Gray01`} className="w-full h-full object-contain" alt="" />
                           </button>
                         ))}
                       </div>
                    </div>
                  )}

                  {activeTab === 'mouthType' && (
                    <div className="space-y-10 text-left text-left">
                       <label className="block text-[10px] font-black uppercase text-zinc-300 mb-6 tracking-widest text-left text-left">Mun & Uttryck</label>
                       <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4 text-left text-left">
                         {OPTIONS.mouthType.map(opt => (
                           <button
                              key={opt}
                              onClick={() => updateConfig('mouthType', opt)}
                              className={`aspect-square rounded-full border-2 overflow-hidden bg-zinc-100 transition-all flex items-center justify-center p-1 text-left text-left ${config.mouthType === opt ? 'border-[#003366] ring-4 ring-[#003366]/10' : 'border-zinc-100 hover:border-zinc-300'}`}
                           >
                              <img src={`/api/avatar?mouthType=${opt}&topType=NoHair&skinColor=${config.skinColor}&clotheType=ShirtCrewNeck&clotheColor=Gray01`} className="w-full h-full object-contain" alt="" />
                           </button>
                         ))}
                       </div>
                    </div>
                  )}

                  {activeTab === 'accessoriesType' && (
                    <div className="space-y-10 text-left text-left">
                       <label className="block text-[10px] font-black uppercase text-zinc-300 mb-6 tracking-widest text-left text-left text-left">Glasögon & Accessoarer</label>
                       <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4 text-left text-left">
                         {OPTIONS.accessoriesType.map(opt => (
                           <button
                              key={opt}
                              onClick={() => updateConfig('accessoriesType', opt)}
                              className={`aspect-square rounded-full border-2 overflow-hidden bg-zinc-100 transition-all flex items-center justify-center p-1 text-left text-left ${config.accessoriesType === opt ? 'border-[#003366] ring-4 ring-[#003366]/10 shadow-lg' : 'border-zinc-100 hover:border-zinc-300'}`}
                           >
                              <img src={`/api/avatar?accessoriesType=${opt}&topType=NoHair&skinColor=${config.skinColor}&clotheType=ShirtCrewNeck&clotheColor=Gray01`} className="w-full h-full object-contain" alt="" />
                           </button>
                         ))}
                       </div>
                    </div>
                  )}

                  {activeTab === 'clotheType' && (
                    <div className="space-y-12 text-left text-left">
                       <div className="text-left text-left">
                         <label className="block text-[10px] font-black uppercase text-zinc-300 mb-6 tracking-widest text-left">Klädstil</label>
                         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-left text-left">
                           {OPTIONS.clotheType.map(opt => (
                             <button
                                key={opt}
                                onClick={() => updateConfig('clotheType', opt)}
                                className={`aspect-[4/3] rounded-sm border-2 overflow-hidden bg-zinc-50 transition-all flex items-center justify-center p-2 text-left text-left ${config.clotheType === opt ? 'border-[#003366] ring-4 ring-[#003366]/10 shadow-lg' : 'border-zinc-100 hover:border-zinc-300'}`}
                             >
                                <img src={`/api/avatar?clotheType=${opt}&topType=NoHair&skinColor=${config.skinColor}&clotheColor=${config.clotheColor}`} className="w-full h-full object-contain translate-y-4" alt="" />
                             </button>
                           ))}
                         </div>
                       </div>
                       <div className="text-left text-left">
                         <label className="block text-[10px] font-black uppercase text-zinc-300 mb-6 tracking-widest text-left">Färg</label>
                         <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 text-left">
                           {OPTIONS.clotheColor.map(color => (
                             <button key={color} onClick={() => updateConfig('clotheColor', color)} className={`aspect-square rounded-full border-2 transition-all text-left ${config.clotheColor === color ? 'border-[#003366] scale-110 shadow-lg' : 'border-white shadow-sm'}`} style={{ backgroundColor: color }} title={color} />
                           ))}
                         </div>
                       </div>
                    </div>
                  )}

                  {activeTab === 'skinColor' && (
                    <div className="text-left">
                       <label className="block text-[10px] font-black uppercase text-zinc-300 mb-6 tracking-widest text-left text-left">Hudtoner</label>
                       <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 text-left text-left">
                         {OPTIONS.skinColor.map(color => (
                           <button
                            key={color}
                            onClick={() => updateConfig('skinColor', color)}
                            className={`aspect-square rounded-full border-2 overflow-hidden bg-zinc-50 transition-all flex items-center justify-center p-1 text-left text-left ${config.skinColor === color ? 'border-[#003366] ring-4 ring-[#003366]/10 shadow-lg' : 'border-zinc-100 hover:border-zinc-300'}`}
                           >
                            <img src={`/api/avatar?skinColor=${color}&topType=NoHair&clotheType=ShirtCrewNeck&clotheColor=Gray01`} className="w-full h-full object-cover" alt="" />
                           </button>
                         ))}
                       </div>
                    </div>
                  )}
               </div>

               <div className="p-8 border-t border-zinc-100 bg-zinc-50 flex justify-end text-left text-left">
                  <button onClick={handleSaveSettings} disabled={saving} className="bg-[#003366] text-white px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#a11a2d] transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 text-left text-left">
                    {saving && <Loader2 className="animate-spin" size={14} />} Spara Design
                  </button>
               </div>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6 text-left text-left">
             <div className="bg-white p-8 border border-zinc-200 rounded-sm shadow-sm text-left text-left">
                <h3 className="text-[10px] font-black uppercase text-[#a11a2d] mb-6 tracking-widest border-b pb-2">Namn & Region</h3>
                <div className="space-y-6">
                  <div className="text-left">
                    <label htmlFor="user-fullname-settings" className="block text-[8px] font-black uppercase text-zinc-300 mb-1">Ditt Namn</label>
                    <div className="flex gap-2">
                      <input id="user-fullname-settings" name="full-name" type="text" readOnly value={fullName} className="flex-1 bg-zinc-50 p-4 rounded-sm text-sm font-bold text-zinc-900 outline-none" />
                      <button type="button" onClick={() => setShowNameRequest(true)} className="bg-[#003366] text-white px-6 py-2 rounded-sm text-[9px] font-black uppercase self-end">Ändra</button>
                    </div>
                  </div>
                  {showNameRequest && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 text-left text-left">
                      <label htmlFor="new-name-settings" className="block text-[8px] font-black text-[#003366] uppercase mb-1">Nytt Namn</label>
                      <input id="new-name-settings" name="new-name" type="text" value={requestedName} onChange={(e) => setRequestedName(e.target.value)} placeholder="Nytt namn..." className="w-full p-4 border rounded-sm text-xs font-bold mb-2 text-zinc-900" />
                      <div className="flex gap-2">
                        <button type="button" onClick={handleRequestNameChange} className="bg-[#a11a2d] text-white px-4 py-2 rounded-sm text-[9px] font-black uppercase">Skicka</button>
                        <button type="button" onClick={() => setShowNameRequest(false)} className="text-zinc-400 text-[9px] font-black uppercase">Avbryt</button>
                      </div>
                    </div>
                  )}
                  <div className="text-left">
                    <label htmlFor="user-city-settings" className="block text-[8px] font-black uppercase text-zinc-300 mb-1">Stad / Region</label>
                    <input id="user-city-settings" name="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Stad / Region" className="w-full bg-zinc-50 p-4 rounded-sm text-sm font-bold text-zinc-900 outline-none focus:border-[#003366]" />
                  </div>
                </div>
             </div>

             <div className="bg-white p-8 border border-zinc-200 rounded-sm shadow-sm text-left text-left">
                <h3 className="text-[10px] font-black uppercase text-[#003366] mb-6 tracking-widest border-b pb-2">Profil & Språk</h3>
                <div className="space-y-6">
                  <div className="text-left">
                    <label htmlFor="user-bio-settings" className="block text-[8px] font-black uppercase text-zinc-300 mb-1">Om mig</label>
                    <textarea id="user-bio-settings" name="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Berätta lite om dig själv..." className="w-full bg-zinc-50 p-4 rounded-sm text-sm font-bold text-zinc-900 outline-none focus:border-[#003366] h-24 resize-none" />
                  </div>

                  <div className="text-left">
                    <label className="block text-[8px] font-black uppercase text-zinc-300 mb-3">Språk jag pratar</label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_LANGUAGES.map(lang => (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() => toggleLanguage(lang.id)}
                          className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all ${
                            selectedLanguages.includes(lang.id)
                              ? 'bg-[#003366] text-white shadow-lg'
                              : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label htmlFor="show-email-toggle-settings" className="flex items-center justify-between p-4 bg-zinc-50 rounded-sm cursor-pointer hover:bg-zinc-100 transition-all text-left border border-zinc-100 text-left">
                    <span className="text-[9px] font-black uppercase text-zinc-600 text-left">Visa e-post offentligt</span>
                    <input id="show-email-toggle-settings" name="show-email" type="checkbox" checked={showEmail} onChange={(e) => setShowEmail(e.target.checked)} className="w-4 h-4 rounded border-zinc-300 text-[#003366]" />
                  </label>
                </div>
             </div>
          </div>

          <div className="mt-12 flex justify-center pb-20 text-left">
             <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="w-full max-w-md bg-[#003366] text-white py-6 rounded-sm font-black uppercase tracking-[0.4em] text-xs hover:bg-[#a11a2d] transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
             >
               {saving ? <Loader2 className="animate-spin" size={20} /> : "Spara Allt"}
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}
