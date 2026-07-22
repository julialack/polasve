'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Save,
  ArrowLeft,
  Loader2,
  User as UserIcon,
  Bell,
  MapPin,
  Check,
  RefreshCw,
  Smile,
  Shirt,
  Scissors,
  Mars,
  Venus,
  Palette
} from 'lucide-react'
import { toast } from 'sonner'
import HomeHero from '@/components/HomeHero'

const CATEGORIES = [
  { id: 'top', label: 'Hår', icon: <Scissors size={18} /> },
  { id: 'face', label: 'Ansikte', icon: <Smile size={18} /> },
  { id: 'clothing', label: 'Kläder', icon: <Shirt size={18} /> },
  { id: 'skin', label: 'Hud', icon: <Palette size={18} /> },
]

const OPTIONS = {
  // Verified parameters for Dicebear Avataaars v7
  top: ['shortFlat', 'longHair', 'bob', 'curly', 'dreads', 'bigHair', 'frizzle', 'shaggy', 'shavedSides', 'noHair', 'hijab', 'turban', 'winterHat1'],
  hairColor: ['2c1b18', '4a312c', '724130', 'a55728', 'b58143', 'd6b370', 'e8e1e1', 'f59797', 'ecdcbf'],
  eyes: ['default', 'happy', 'surprised', 'closed', 'wink', 'side', 'squint', 'hearts', 'eyeRoll'],
  mouth: ['default', 'smile', 'serious', 'tongue', 'grimace', 'disbelief', 'twinkle', 'concerned'],
  clothing: ['blazerAndShirt', 'blazerAndSweater', 'collarAndSweater', 'graphicShirt', 'hoodie', 'overall', 'shirtVNeck', 'shirtCrewNeck'],
  clothingColor: ['262e33', '5199e4', '25557c', 'a7ca50', 'e6e6e6', 'ff4830', 'ff5c5c'],
  skinColor: ['ffdbb4', 'edb98a', 'd08b5b', 'ae5d29', '614335', 'f8d25c'],
  facialHair: ['none', 'beardMedium', 'beardLight', 'beardMajestic', 'moustachesFancy'],
}

export default function InstallningarPage() {
  const [activeTab, setActiveTab] = useState('top')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)

  const [fullName, setFullName] = useState('')
  const [city, setCity] = useState('')
  const [showEmail, setShowEmail] = useState(false)
  const [notifyMessages, setNotifyMessages] = useState(true)
  const [languages, setLanguages] = useState<string[]>(['sv'])
  const [showNameRequest, setShowNameRequest] = useState(false)
  const [requestedName, setRequestedName] = useState('')
  const [requestLoading, setRequestLoading] = useState(false)

  // Core Config
  const [config, setConfig] = useState<any>({
    top: 'shortFlat',
    hairColor: '2c1b18',
    eyes: 'default',
    mouth: 'smile',
    clothing: 'shirtCrewNeck',
    clothingColor: '262e33',
    skinColor: 'ffdbb4',
    facialHair: 'none'
  })

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        router.push('/logga-in')
        return
      }
      setUser(user)
      setFullName(user.user_metadata?.full_name || '')
      setCity(user.user_metadata?.city || '')
      setNotifyMessages(user.user_metadata?.notify_messages !== false)
      setLanguages(user.user_metadata?.languages || ['sv'])

      const savedUrl = user.user_metadata?.avatar_url || ''
      if (savedUrl.includes('dicebear.com')) {
        try {
          const url = new URL(savedUrl)
          const newConfig = { ...config }
          url.searchParams.forEach((val, key) => { (newConfig as any)[key] = val })
          setConfig(newConfig)
        } catch (e) {}
      }
      setLoading(false)
    }
    getUserData()
  }, [])

  const updateConfig = (key: string, value: string) => {
    setImageLoading(true)
    setConfig((prev: any) => ({ ...prev, [key]: value }))
  }

  const setPreset = (gender: 'm' | 'f') => {
    setImageLoading(true)
    if (gender === 'm') {
      setConfig({ skinColor: 'ffdbb4', top: 'shortFlat', hairColor: '2c1b18', eyes: 'default', mouth: 'smile', clothing: 'shirtCrewNeck', clothingColor: '262e33', facialHair: 'none' })
    } else {
      setConfig({ skinColor: 'ffdbb4', top: 'longHair', hairColor: 'a55728', eyes: 'happy', mouth: 'smile', clothing: 'shirtVNeck', clothingColor: 'ff5c5c', facialHair: 'none' })
    }
  }

  // Stable URL Construction (using PNG for reliability)
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/png?${new URLSearchParams(config).toString()}`

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          avatar_url: avatarUrl,
          city,
          show_email_publicly: showEmail,
          notify_messages: notifyMessages,
          languages
        }
      })
      if (error) throw error
      toast.success('Dina inställningar har sparats!')
      router.refresh()
    } catch (error) {
      toast.error('Kunde inte spara')
    } finally {
      setSaving(false)
    }
  }

  const handleRequestNameChange = async () => {
    if (!requestedName.trim()) return
    setRequestLoading(true)
    const { error } = await supabase.from('name_change_requests').insert([{
      user_id: user.id, current_name: fullName, requested_name: requestedName, status: 'pending'
    }])
    if (!error) {
      toast.success('Skickat!')
      setShowNameRequest(false)
      setRequestedName('')
    }
    setRequestLoading(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center italic text-zinc-400 font-sans">Öppnar studio...</div>

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-left font-sans">
      <HomeHero />

      <div className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/profil" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#003366] transition-colors mb-6 text-[10px] font-black uppercase tracking-widest">
            <ArrowLeft size={14} /> Tillbaka
          </Link>

          <div className="bg-white border border-zinc-200 rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

            {/* PREVIEW PANEL */}
            <div className="w-full md:w-[380px] bg-zinc-50 border-r border-zinc-100 p-8 flex flex-col items-center justify-center sticky top-0 h-fit md:h-auto">
               <div className="w-56 h-56 bg-white rounded-full overflow-hidden border-8 border-white shadow-2xl mb-8 flex items-center justify-center relative">
                  <img
                    key={avatarUrl}
                    src={avatarUrl}
                    alt=""
                    className={`w-full h-full object-cover transition-opacity duration-200 ${imageLoading ? 'opacity-30' : 'opacity-100'}`}
                    onLoad={() => setImageLoading(false)}
                  />
                  {imageLoading && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-[#003366]" size={30} /></div>}
               </div>

               <div className="flex gap-3 w-full max-w-[240px]">
                  <button type="button" onClick={() => setPreset('m')} className="flex-1 bg-white border border-zinc-200 py-2.5 rounded-full flex items-center justify-center gap-2 text-[10px] font-black uppercase text-blue-600 hover:border-blue-600 transition-all shadow-sm active:scale-95"><Mars size={14} /> Kille</button>
                  <button type="button" onClick={() => setPreset('f')} className="flex-1 bg-white border border-zinc-200 py-2.5 rounded-full flex items-center justify-center gap-2 text-[10px] font-black uppercase text-pink-600 hover:border-pink-600 transition-all shadow-sm active:scale-95"><Venus size={14} /> Tjej</button>
               </div>
            </div>

            {/* EDITOR PANEL */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
               <div className="flex border-b border-zinc-100 bg-white">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id)}
                      className={`flex-1 p-5 flex flex-col items-center gap-2 transition-all ${activeTab === cat.id ? 'text-[#003366] bg-zinc-50/50 border-b-4 border-[#003366]' : 'text-zinc-300 hover:text-zinc-400'}`}
                    >
                      {cat.icon}
                      <span className="text-[9px] font-black uppercase tracking-widest">{cat.label}</span>
                    </button>
                  ))}
               </div>

               <div className="p-8 flex-1 overflow-y-auto max-h-[480px]">
                  {activeTab === 'top' && (
                    <div className="space-y-10">
                       <div>
                         <label className="block text-[10px] font-black uppercase text-zinc-300 mb-4 tracking-widest">Frisyr</label>
                         <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                           {OPTIONS.top.map(opt => (
                             <button
                                key={opt}
                                onClick={() => updateConfig('top', opt)}
                                className={`aspect-square rounded-full border-2 overflow-hidden bg-zinc-50 transition-all flex items-center justify-center p-1 ${config.top === opt ? 'border-[#003366] ring-4 ring-[#003366]/10' : 'border-zinc-100 hover:border-zinc-300'}`}
                             >
                                <img src={`https://api.dicebear.com/7.x/avataaars/png?top=${opt}&hairColor=${config.hairColor}&skinColor=${config.skinColor}&clothing=shirtCrewNeck&clothingColor=transparent`} className="w-full h-full object-cover" alt="" />
                             </button>
                           ))}
                         </div>
                       </div>
                       <div>
                         <label className="block text-[10px] font-black uppercase text-zinc-300 mb-4 tracking-widest">Hårfärg</label>
                         <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
                           {OPTIONS.hairColor.map(color => (
                             <button key={color} onClick={() => updateConfig('hairColor', color)} className={`aspect-square rounded-full border-2 transition-all ${config.hairColor === color ? 'border-[#003366] ring-2 ring-[#003366] ring-offset-1' : 'border-white shadow-sm'}`} style={{ backgroundColor: `#${color}` }} />
                           ))}
                         </div>
                       </div>
                    </div>
                  )}

                  {activeTab === 'face' && (
                    <div className="space-y-10">
                       <div>
                         <label className="block text-[10px] font-black uppercase text-zinc-300 mb-4 tracking-widest">Ögon</label>
                         <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4 text-left">
                           {OPTIONS.eyes.map(opt => (
                             <button
                                key={opt}
                                onClick={() => updateConfig('eyes', opt)}
                                className={`aspect-square rounded-full border-2 overflow-hidden bg-zinc-100 transition-all flex items-center justify-center p-1 ${config.eyes === opt ? 'border-[#003366] ring-4 ring-[#003366]/10' : 'border-zinc-100 hover:border-zinc-300'}`}
                             >
                                <img src={`https://api.dicebear.com/7.x/avataaars/png?eyes=${opt}&top=noHair&skinColor=${config.skinColor}&clothing=shirtCrewNeck&clothingColor=transparent`} className="w-full h-full object-contain" alt="" />
                             </button>
                           ))}
                         </div>
                       </div>
                       <div>
                         <label className="block text-[10px] font-black uppercase text-zinc-300 mb-4 tracking-widest">Mun</label>
                         <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                           {OPTIONS.mouth.map(opt => (
                             <button
                                key={opt}
                                onClick={() => updateConfig('mouth', opt)}
                                className={`aspect-square rounded-full border-2 overflow-hidden bg-zinc-100 transition-all flex items-center justify-center p-1 ${config.mouth === opt ? 'border-[#003366] ring-4 ring-[#003366]/10' : 'border-zinc-100 hover:border-zinc-300'}`}
                             >
                                <img src={`https://api.dicebear.com/7.x/avataaars/png?mouth=${opt}&top=noHair&skinColor=${config.skinColor}&clothing=shirtCrewNeck&clothingColor=transparent`} className="w-full h-full object-contain" alt="" />
                             </button>
                           ))}
                         </div>
                       </div>
                       <div>
                         <label className="block text-[10px] font-black uppercase text-zinc-300 mb-4 tracking-widest">Skägg & Mustasch</label>
                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                           {OPTIONS.facialHair.map(opt => (
                             <button
                                key={opt}
                                onClick={() => updateConfig('facialHair', opt)}
                                className={`p-3 rounded-sm border-2 text-[10px] font-black uppercase transition-all ${config.facialHair === opt ? 'border-[#003366] bg-[#003366] text-white' : 'bg-zinc-50 text-zinc-400 border-zinc-100 hover:border-zinc-300'}`}
                             >
                                {opt === 'none' ? 'Inget' : opt.replace('beard', 'Skägg ').replace('moustaches', 'Mustasch ')}
                             </button>
                           ))}
                         </div>
                       </div>
                    </div>
                  )}

                  {activeTab === 'clothing' && (
                    <div className="space-y-10">
                       <div>
                         <label className="block text-[10px] font-black uppercase text-zinc-300 mb-4 tracking-widest">Klädstil</label>
                         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                           {OPTIONS.clothing.map(opt => (
                             <button
                                key={opt}
                                onClick={() => updateConfig('clothing', opt)}
                                className={`aspect-[4/3] rounded-sm border-2 overflow-hidden bg-zinc-50 transition-all flex items-center justify-center p-2 ${config.clothing === opt ? 'border-[#003366] ring-4 ring-[#003366]/10 shadow-lg' : 'border-zinc-100 hover:border-zinc-300'}`}
                             >
                                <img src={`https://api.dicebear.com/7.x/avataaars/png?clothing=${opt}&top=noHair&skinColor=${config.skinColor}&clothingColor=${config.clothingColor}`} className="w-full h-full object-contain translate-y-4" alt="" />
                             </button>
                           ))}
                         </div>
                       </div>
                       <div>
                         <label className="block text-[10px] font-black uppercase text-zinc-300 mb-4 tracking-widest">Färg</label>
                         <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                           {OPTIONS.clothingColor.map(color => (
                             <button key={color} onClick={() => updateConfig('clothingColor', color)} className={`aspect-square rounded-full border-2 transition-all ${config.clothingColor === color ? 'border-[#003366] ring-2 ring-[#003366] ring-offset-1' : 'border-white shadow-sm'}`} style={{ backgroundColor: `#${color}` }} />
                           ))}
                         </div>
                       </div>
                    </div>
                  )}

                  {activeTab === 'skin' && (
                    <div>
                       <label className="block text-[10px] font-black uppercase text-zinc-300 mb-4 tracking-widest text-left">Hudton</label>
                       <div className="grid grid-cols-6 gap-3">
                         {OPTIONS.skinColor.map(color => (
                           <button key={color} onClick={() => updateConfig('skinColor', color)} className={`aspect-square rounded-full border-4 transition-all ${config.skinColor === color ? 'border-[#003366] ring-2 ring-[#003366] ring-offset-2 shadow-lg' : 'border-white shadow-md'}`} style={{ backgroundColor: `#${color}` }} />
                         ))}
                       </div>
                    </div>
                  )}
               </div>

               <div className="p-8 border-t border-zinc-100 bg-zinc-50/30 flex justify-end">
                  <button onClick={handleSaveSettings} disabled={saving} className="bg-[#003366] text-white px-12 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#a11a2d] transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
                    {saving && <Loader2 className="animate-spin" size={14} />} Spara Design
                  </button>
               </div>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6 text-left">
             <div className="bg-white p-6 border border-zinc-100 rounded-sm shadow-sm">
                <h3 className="text-[10px] font-black uppercase text-[#a11a2d] mb-4 tracking-widest border-b pb-2">Namnändring</h3>
                <div className="flex gap-2"><input type="text" readOnly value={fullName} className="flex-1 bg-zinc-50 p-3 rounded-sm text-xs font-bold text-zinc-900 outline-none" /><button onClick={() => setShowNameRequest(true)} className="bg-[#003366] text-white px-4 py-2 rounded-sm text-[9px] font-black uppercase">Ändra</button></div>
                {showNameRequest && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2"><input type="text" value={requestedName} onChange={(e) => setRequestedName(e.target.value)} placeholder="Nytt namn..." className="w-full p-3 border rounded-sm text-xs font-bold mb-2 text-zinc-900" /><div className="flex gap-2"><button onClick={handleRequestNameChange} className="bg-[#a11a2d] text-white px-4 py-2 rounded-sm text-[9px] font-black uppercase">Skicka</button><button onClick={() => setShowNameRequest(false)} className="text-zinc-400 text-[9px] font-black uppercase">Avbryt</button></div></div>
                )}
             </div>
             <div className="bg-white p-6 border border-zinc-100 rounded-sm shadow-sm">
                <h3 className="text-[10px] font-black uppercase text-[#003366] mb-4 tracking-widest border-b pb-2">Information</h3>
                <div className="space-y-4"><input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Stad / Region" className="w-full bg-zinc-50 p-3 rounded-sm text-xs font-bold text-zinc-900 outline-none focus:border-[#003366]" /><label className="flex items-center justify-between p-3 bg-zinc-50 rounded-sm cursor-pointer hover:bg-zinc-100 transition-colors text-left"><span className="text-[9px] font-black uppercase text-zinc-600">Visa e-post i annonser</span><input type="checkbox" checked={showEmail} onChange={(e) => setShowEmail(e.target.checked)} className="w-4 h-4 rounded border-zinc-300 text-[#003366]" /></label></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
