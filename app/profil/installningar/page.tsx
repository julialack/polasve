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
  Glasses,
  Lock,
  CheckCircle,
  RotateCcw
} from 'lucide-react'
import { toast } from 'sonner'
import HomeHero from '@/components/HomeHero'

const CATEGORIES = [
  { id: 'topType', label: 'Hår', icon: <Scissors size={16} /> },
  { id: 'facialHairType', label: 'Skägg', icon: <Smile size={16} /> },
  { id: 'eyeType', label: 'Ögon', icon: <UserIcon size={16} /> },
  { id: 'mouthType', label: 'Mun', icon: <Smile size={16} /> },
  { id: 'accessoriesType', label: 'Tillbehör', icon: <Glasses size={16} /> },
  { id: 'clotheType', label: 'Kläder', icon: <Shirt size={16} /> },
  { id: 'skinColor', label: 'Hud', icon: <Palette size={16} /> },
  { id: 'circleColor', label: 'Bakgrund', icon: <Palette size={16} /> },
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
  circleColor: string
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
  circleColor: ['#65C9FF', '#a11a2d', '#003366', '#D4AF37', '#ffffff', 'transparent'],
}

const AVAILABLE_LANGUAGES = [
  { id: 'sv', label: 'Svenska' },
  { id: 'pl', label: 'Polski' },
  { id: 'en', label: 'English' },
]

const HAIR_COLOR_MAP: Record<string, string> = {
  Auburn: '#A55728',
  Black: '#2C1B18',
  Blonde: '#B58143',
  BlondeGolden: '#D6B370',
  Brown: '#724133',
  BrownDark: '#4A312C',
  PastelPink: '#F59797',
  Platinum: '#ECDCBF',
  Red: '#C93305',
  SilverGray: '#E8E1E1',
}

const CLOTHE_COLOR_MAP: Record<string, string> = {
  Black: '#262E33',
  Blue01: '#65C9FF',
  Blue02: '#5199E4',
  Blue03: '#25557C',
  Gray01: '#E6E6E6',
  Gray02: '#929598',
  Heather: '#3C4A4D',
  PastelBlue: '#B1E1FF',
  PastelGreen: '#A7FFC4',
  PastelOrange: '#FFD28E',
  PastelRed: '#FF9090',
  PastelYellow: '#FFF070',
  Pink: '#FF488E',
  Red: '#FF5C5C',
  White: '#FFFFFF',
}

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
  const [phone, setPhone] = useState('')
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [showEmail, setShowEmail] = useState(false)
  const [showPhone, setShowPhone] = useState(false)
  const [showNameRequest, setShowNameRequest] = useState(false)
  const [requestedName, setRequestedName] = useState('')

  // Password change states
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  // Verification states
  const [otpCode, setOtpCode] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [verifying, setVerifying] = useState(false)

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
    skinColor: 'Light',
    circleColor: '#65C9FF'
  })

  const [history, setHistory] = useState<AvatarConfig[]>([])

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
      setPhone(currentUser.user_metadata?.phone || '')
      setSelectedLanguages(currentUser.user_metadata?.languages || [])
      setShowEmail(currentUser.user_metadata?.show_email_publicly || false)
      setShowPhone(currentUser.user_metadata?.show_phone_publicly || false)

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
    setHistory(prev => [config, ...prev.slice(0, 19)])
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    refreshAvatarMarkup(newConfig)
  }

  const handleUndo = () => {
    if (history.length === 0) return
    const [lastState, ...rest] = history
    setConfig(lastState)
    setHistory(rest)
    refreshAvatarMarkup(lastState)
  }

  const toggleLanguage = (langId: string) => {
    setSelectedLanguages(prev =>
      prev.includes(langId) ? prev.filter(id => id !== langId) : [...prev, langId]
    )
  }

  const setPreset = (gender: 'm' | 'f') => {
    setHistory(prev => [config, ...prev.slice(0, 19)])
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
          phone,
          languages: selectedLanguages,
          show_email_publicly: showEmail,
          show_phone_publicly: showPhone,
        }
      })
      if (error) throw error

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
          city,
          bio,
          phone,
          show_email_publicly: showEmail,
          show_phone_publicly: showPhone,
        })
        .eq('id', user.id)

      if (profileError) {
        console.warn('Kunde inte uppdatera publika profilen:', profileError)
      }

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

  const handleChangePassword = async () => {
    if (!oldPassword) {
      toast.error('Du måste ange ditt nuvarande lösenord')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Det nya lösenordet måste vara minst 8 tecken')
      return
    }

    setChangingPassword(true)
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword,
      })

      if (loginError) {
        throw new Error('Ditt nuvarande lösenord är felaktigt')
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
      if (updateError) throw updateError

      toast.success('Ditt lösenord har uppdaterats!')
      setOldPassword('')
      setNewPassword('')
      setShowPasswordChange(false)
    } catch (err: any) {
      toast.error(err.message || 'Kunde inte byta lösenord')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleVerifyEmail = async () => {
    if (!user?.email) return
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
    })
    if (error) toast.error(error.message)
    else toast.success('Verifieringsmail har skickats på nytt!')
  }

  const handleSendPhoneOtp = async () => {
    if (!phone) return toast.error('Ange ett telefonnummer först')
    setVerifying(true)
    const { error } = await supabase.auth.updateUser({ phone })
    if (error) {
      toast.error(error.message)
    } else {
      setShowOtpInput(true)
      toast.success('En verifieringskod har skickats till din mobil!')
    }
    setVerifying(false)
  }

  const handleConfirmPhoneOtp = async () => {
    if (!otpCode) return
    setVerifying(true)
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otpCode,
      type: 'phone_change'
    })
    if (error) {
      toast.error('Felaktig kod. Försök igen.')
    } else {
      toast.success('Ditt telefonnummer är nu verifierat!')
      setShowOtpInput(false)
      setOtpCode('')
      router.refresh()
    }
    setVerifying(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center italic text-zinc-600 font-sans text-center">Laddar studio...</div>

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <HomeHero />

      <div className="flex-1 py-4 md:py-8 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/profil" className="inline-flex items-center gap-2 text-zinc-600 hover:text-sve-blue transition-colors mb-4 md:mb-6 text-[10px] font-black uppercase tracking-widest">
            <ArrowLeft size={14} /> Tillbaka till profil
          </Link>

          {/* AVATAR STUDIO CONTAINER */}
          <div className="bg-white border border-zinc-200 rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row md:min-h-[700px]">

            {/* AVATAR PREVIEW (TOP ON MOBILE, LEFT ON DESKTOP) */}
            <div className="w-full md:w-[350px] bg-zinc-50 border-b md:border-b-0 md:border-r border-zinc-100 p-6 md:p-8 flex flex-col items-center justify-center md:sticky md:top-0">
               <div className="w-40 h-40 md:w-56 md:h-56 bg-white rounded-full overflow-hidden border-4 md:border-8 border-white shadow-xl mb-6 md:mb-8 flex items-center justify-center relative">
                  {avatarSvg ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: avatarSvg }}
                      className={`w-full h-full transition-opacity duration-300 [&_svg]:w-full [&_svg]:h-full ${imageLoading ? 'opacity-30' : 'opacity-100'}`}
                    />
                  ) : (
                    <Loader2 className="animate-spin text-sve-blue" />
                  )}
                  {imageLoading && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-sve-blue" size={24} /></div>}
               </div>

               <div className="grid grid-cols-2 gap-3 w-full max-w-[280px]">
                  <button type="button" onClick={() => setPreset('m')} className="bg-white border border-zinc-200 py-2.5 rounded-full flex items-center justify-center gap-2 text-[10px] font-black uppercase text-sve-blue hover:border-sve-blue transition-all shadow-sm active:scale-95">Man</button>
                  <button type="button" onClick={() => setPreset('f')} className="bg-white border border-zinc-200 py-2.5 rounded-full flex items-center justify-center gap-2 text-[10px] font-black uppercase text-pink-600 hover:border-pink-600 transition-all shadow-sm active:scale-95">Kvinna</button>
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={history.length === 0}
                    className="col-span-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                  >
                    <RotateCcw size={14} /> Ångra ändring
                  </button>
               </div>
            </div>

            {/* EDITOR CONTROLS (BOTTOM ON MOBILE, RIGHT ON DESKTOP) */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
               {/* CATEGORY BAR - Wrap on mobile for easy access */}
               <div className="flex flex-wrap border-b border-zinc-100 bg-white p-2 md:p-0">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id)}
                      className={`flex-1 min-w-[25%] md:min-w-0 md:flex-1 p-3 md:p-5 flex flex-col items-center gap-1 transition-all ${activeTab === cat.id ? 'text-sve-blue md:bg-zinc-50/50 md:border-b-4 md:border-sve-blue scale-110 md:scale-100' : 'text-zinc-400 hover:text-zinc-800'}`}
                    >
                      <div className="p-1.5 rounded-full bg-zinc-50 md:bg-transparent">{cat.icon}</div>
                      <span className="text-[7px] md:text-[9px] font-black uppercase tracking-tight md:tracking-widest">{cat.label}</span>
                    </button>
                  ))}
               </div>

               {/* OPTIONS GRID */}
               <div className="p-6 md:p-8 flex-1 overflow-y-auto max-h-[500px]">
                  {activeTab === 'topType' && (
                    <div className="space-y-8">
                       <div>
                         <label className="block text-[10px] font-black uppercase text-zinc-600 mb-4 tracking-widest">Välj frisyr</label>
                         <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                           {OPTIONS.topType.map(opt => (
                             <button
                                key={opt}
                                onClick={() => updateConfig('topType', opt)}
                                className={`aspect-square rounded-full border-2 overflow-hidden bg-zinc-50 transition-all flex items-center justify-center p-1 ${config.topType === opt ? 'border-sve-blue shadow-lg scale-105' : 'border-zinc-100 hover:border-zinc-300'}`}
                             >
                                <img src={`/api/avatar?topType=${opt}&hairColor=${config.hairColor}&skinColor=${config.skinColor}&circleColor=${encodeURIComponent(config.circleColor)}&clotheType=ShirtCrewNeck&clotheColor=Gray01`} className="w-full h-full object-cover" alt="" />
                             </button>
                           ))}
                         </div>
                       </div>
                       <div>
                         <label className="block text-[10px] font-black uppercase text-zinc-600 mb-4 tracking-widest">Hårfärg</label>
                         <div className="grid grid-cols-6 sm:grid-cols-9 gap-3">
                           {OPTIONS.hairColor.map(color => (
                             <button key={color} onClick={() => updateConfig('hairColor', color)} className={`aspect-square rounded-full border-2 transition-all ${config.hairColor === color ? 'border-sve-blue scale-110 shadow-lg' : 'border-white shadow-sm'}`} style={{ backgroundColor: HAIR_COLOR_MAP[color] || color }} title={color} />
                           ))}
                         </div>
                       </div>
                    </div>
                  )}

                  {activeTab === 'facialHairType' && (
                    <div className="space-y-6">
                       <label className="block text-[10px] font-black uppercase text-zinc-600 mb-4 tracking-widest">Skägg & Mustasch</label>
                       <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                         {OPTIONS.facialHairType.map(opt => (
                           <button
                              key={opt}
                              onClick={() => updateConfig('facialHairType', opt)}
                              className={`aspect-square rounded-full border-2 overflow-hidden bg-zinc-50 transition-all flex items-center justify-center p-1 ${config.facialHairType === opt ? 'border-sve-blue shadow-lg scale-105' : 'border-zinc-100 hover:border-zinc-300'}`}
                           >
                              <img src={`/api/avatar?facialHairType=${opt}&topType=NoHair&skinColor=${config.skinColor}&circleColor=${encodeURIComponent(config.circleColor)}&clotheType=ShirtCrewNeck&clotheColor=Gray01`} className="w-full h-full object-contain" alt="" />
                           </button>
                         ))}
                       </div>
                    </div>
                  )}

                  {activeTab === 'eyeType' && (
                    <div className="space-y-6">
                       <label className="block text-[10px] font-black uppercase text-zinc-600 mb-4 tracking-widest">Blick & Ögon</label>
                       <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                         {OPTIONS.eyeType.map(opt => (
                           <button
                              key={opt}
                              onClick={() => updateConfig('eyeType', opt)}
                              className={`aspect-square rounded-full border-2 overflow-hidden bg-zinc-50 transition-all flex items-center justify-center p-1 ${config.eyeType === opt ? 'border-sve-blue shadow-lg scale-105' : 'border-zinc-100 hover:border-zinc-300'}`}
                           >
                              <img src={`/api/avatar?eyeType=${opt}&topType=NoHair&skinColor=${config.skinColor}&circleColor=${encodeURIComponent(config.circleColor)}&clotheType=ShirtCrewNeck&clotheColor=Gray01`} className="w-full h-full object-contain" alt="" />
                           </button>
                         ))}
                       </div>
                    </div>
                  )}

                  {activeTab === 'mouthType' && (
                    <div className="space-y-6">
                       <label className="block text-[10px] font-black uppercase text-zinc-600 mb-4 tracking-widest">Mun & Uttryck</label>
                       <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                         {OPTIONS.mouthType.map(opt => (
                           <button
                              key={opt}
                              onClick={() => updateConfig('mouthType', opt)}
                              className={`aspect-square rounded-full border-2 overflow-hidden bg-zinc-50 transition-all flex items-center justify-center p-1 ${config.mouthType === opt ? 'border-sve-blue shadow-lg scale-105' : 'border-zinc-100 hover:border-zinc-300'}`}
                           >
                              <img src={`/api/avatar?mouthType=${opt}&topType=NoHair&skinColor=${config.skinColor}&circleColor=${encodeURIComponent(config.circleColor)}&clotheType=ShirtCrewNeck&clotheColor=Gray01`} className="w-full h-full object-contain" alt="" />
                           </button>
                         ))}
                       </div>
                    </div>
                  )}

                  {activeTab === 'accessoriesType' && (
                    <div className="space-y-6">
                       <label className="block text-[10px] font-black uppercase text-zinc-600 mb-4 tracking-widest">Glasögon & Accessoarer</label>
                       <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                         {OPTIONS.accessoriesType.map(opt => (
                           <button
                              key={opt}
                              onClick={() => updateConfig('accessoriesType', opt)}
                              className={`aspect-square rounded-full border-2 overflow-hidden bg-zinc-50 transition-all flex items-center justify-center p-1 ${config.accessoriesType === opt ? 'border-sve-blue shadow-lg scale-105' : 'border-zinc-100 hover:border-zinc-300'}`}
                           >
                              <img src={`/api/avatar?accessoriesType=${opt}&topType=NoHair&skinColor=${config.skinColor}&circleColor=${encodeURIComponent(config.circleColor)}&clotheType=ShirtCrewNeck&clotheColor=Gray01`} className="w-full h-full object-contain" alt="" />
                           </button>
                         ))}
                       </div>
                    </div>
                  )}

                  {activeTab === 'clotheType' && (
                    <div className="space-y-8">
                       <div>
                         <label className="block text-[10px] font-black uppercase text-zinc-600 mb-4 tracking-widest">Klädstil</label>
                         <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                           {OPTIONS.clotheType.map(opt => (
                             <button
                                key={opt}
                                onClick={() => updateConfig('clotheType', opt)}
                                className={`aspect-square rounded-sm border-2 overflow-hidden bg-zinc-50 transition-all flex items-center justify-center p-2 ${config.clotheType === opt ? 'border-sve-blue shadow-lg scale-105' : 'border-zinc-100 hover:border-zinc-300'}`}
                             >
                                <img src={`/api/avatar?clotheType=${opt}&topType=NoHair&skinColor=${config.skinColor}&clotheColor=${config.clotheColor}&circleColor=${encodeURIComponent(config.circleColor)}`} className="w-full h-full object-contain translate-y-3" alt="" />
                             </button>
                           ))}
                         </div>
                       </div>
                       <div>
                         <label className="block text-[10px] font-black uppercase text-zinc-600 mb-4 tracking-widest">Färg</label>
                         <div className="grid grid-cols-6 sm:grid-cols-10 gap-3">
                           {OPTIONS.clotheColor.map(color => (
                             <button key={color} onClick={() => updateConfig('clotheColor', color)} className={`aspect-square rounded-full border-2 transition-all ${config.clotheColor === color ? 'border-[#003366] scale-110 shadow-lg' : 'border-white shadow-sm'}`} style={{ backgroundColor: CLOTHE_COLOR_MAP[color] || color }} title={color} />
                           ))}
                         </div>
                       </div>
                    </div>
                  )}

                  {activeTab === 'skinColor' && (
                    <div>
                       <label className="block text-[10px] font-black uppercase text-zinc-600 mb-4 tracking-widest">Hudtoner</label>
                       <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                         {OPTIONS.skinColor.map(color => (
                           <button
                            key={color}
                            onClick={() => updateConfig('skinColor', color)}
                            className={`aspect-square rounded-full border-2 overflow-hidden bg-zinc-50 transition-all flex items-center justify-center p-1 ${config.skinColor === color ? 'border-sve-blue shadow-lg scale-105' : 'border-zinc-100 hover:border-zinc-300'}`}
                           >
                            <img src={`/api/avatar?skinColor=${color}&topType=NoHair&circleColor=${encodeURIComponent(config.circleColor)}&clotheType=ShirtCrewNeck&clotheColor=Gray01`} className="w-full h-full object-cover" alt="" />
                           </button>
                         ))}
                       </div>
                    </div>
                  )}

                  {activeTab === 'circleColor' && (
                    <div>
                       <label className="block text-[10px] font-black uppercase text-zinc-600 mb-4 tracking-widest">Bakgrundsfärg</label>
                       <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                         {OPTIONS.circleColor.map(color => (
                           <button
                            key={color}
                            onClick={() => updateConfig('circleColor', color)}
                            className={`aspect-square rounded-full border-2 transition-all flex items-center justify-center shadow-sm ${config.circleColor === color ? 'border-sve-blue scale-110 shadow-lg' : 'border-white'}`}
                            style={{
                              backgroundColor: color === 'transparent' ? '#f0f0f0' : color,
                              backgroundImage: color === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)' : 'none',
                              backgroundSize: color === 'transparent' ? '10px 10px' : 'auto',
                              backgroundPosition: color === 'transparent' ? '0 0, 5px 5px' : '0 0'
                            }}
                            title={color}
                           >
                             {color === 'transparent' && <span className="text-[8px] font-black text-zinc-600 uppercase">Ingen</span>}
                           </button>
                         ))}
                       </div>
                    </div>
                  )}
               </div>

               <div className="p-6 md:p-8 border-t border-zinc-100 bg-zinc-50 flex justify-end">
                  <button onClick={handleSaveSettings} disabled={saving} className="w-full md:w-auto bg-sve-blue text-white px-12 py-4 rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-pola-red transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                    {saving && <Loader2 className="animate-spin" size={16} />} Spara Design
                  </button>
               </div>
            </div>
          </div>

          {/* OTHER SETTINGS SECTIONS */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
             <div className="bg-white p-6 md:p-8 border border-zinc-200 rounded-sm shadow-sm">
                <div className="flex justify-between items-start mb-6 border-b pb-2">
                  <h3 className="text-[10px] font-black uppercase text-pola-red tracking-widest">Namn & Region</h3>
                  {!user?.email_confirmed_at ? (
                    <button onClick={handleVerifyEmail} className="text-[8px] font-black uppercase text-pola-red border border-pola-red/20 px-2 py-1 rounded-sm hover:bg-pola-red hover:text-white transition-all">
                      Verifiera E-post
                    </button>
                  ) : (
                    <span className="text-[8px] font-black uppercase text-green-600 flex items-center gap-1">
                      <CheckCircle size={10} /> E-post verifierad
                    </span>
                  )}
                </div>
                <div className="space-y-6">
                  <div className="text-left">
                    <label htmlFor="user-fullname-settings" className="block text-[8px] font-black uppercase text-zinc-600 mb-1">Ditt Namn</label>
                    <div className="flex gap-2">
                      <input id="user-fullname-settings" name="full-name" type="text" readOnly value={fullName} className="flex-1 bg-zinc-50 p-4 rounded-sm text-sm font-bold text-zinc-900 outline-none" />
                      <button type="button" onClick={() => setShowNameRequest(true)} className="bg-sve-blue text-white px-6 py-2 rounded-sm text-[9px] font-black uppercase self-end">Ändra</button>
                    </div>
                  </div>
                  {showNameRequest && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                      <label htmlFor="new-name-settings" className="block text-[8px] font-black text-sve-blue uppercase mb-1">Nytt Namn</label>
                      <input id="new-name-settings" name="new-name" type="text" value={requestedName} onChange={(e) => setRequestedName(e.target.value)} placeholder="Nytt namn..." className="w-full p-4 border rounded-sm text-xs font-bold mb-2 text-zinc-900" />
                      <div className="flex gap-2">
                        <button type="button" onClick={handleRequestNameChange} className="bg-pola-red text-white px-4 py-2 rounded-sm text-[9px] font-black uppercase">Skicka</button>
                        <button type="button" onClick={() => setShowNameRequest(false)} className="text-zinc-500 text-[9px] font-black uppercase">Avbryt</button>
                      </div>
                    </div>
                  )}
                  <div className="text-left">
                    <label htmlFor="user-city-settings" className="block text-[8px] font-black uppercase text-zinc-600 mb-1">Stad / Region</label>
                    <input id="user-city-settings" name="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Stad / Region" className="w-full bg-zinc-50 p-4 rounded-sm text-sm font-bold text-zinc-900 outline-none focus:border-sve-blue" />
                  </div>
                  <div className="text-left">
                    <label htmlFor="user-phone-settings" className="block text-[8px] font-black uppercase text-zinc-600 mb-1">Telefonnummer</label>
                    <div className="flex gap-2">
                      <input id="user-phone-settings" name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+46 70 000 00 00" className="flex-1 bg-zinc-50 p-4 rounded-sm text-sm font-bold text-zinc-900 outline-none focus:border-sve-blue" />
                      {!user?.phone_confirmed_at ? (
                        <button type="button" onClick={handleSendPhoneOtp} disabled={verifying} className="bg-pola-red text-white px-4 py-2 rounded-sm text-[9px] font-black uppercase self-end shadow-md hover:bg-sve-blue transition-all">Verifiera</button>
                      ) : (
                        <div className="flex items-center gap-1 text-green-600 self-end mb-3">
                           <CheckCircle size={14} /> <span className="text-[8px] font-black uppercase">Verifierad</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {showOtpInput && (
                    <div className="mt-4 p-4 bg-zinc-50 border border-zinc-100 rounded-sm animate-in zoom-in-95">
                      <label className="block text-[8px] font-black uppercase text-sve-blue mb-2">Ange SMS-kod</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="6 siffror..."
                          className="flex-1 p-3 border rounded-sm text-center font-black tracking-[0.5em] text-lg outline-none focus:border-pola-red"
                        />
                        <button onClick={handleConfirmPhoneOtp} disabled={verifying} className="bg-sve-blue text-white px-6 py-2 rounded-sm text-[10px] font-black uppercase">Bekräfta</button>
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => setShowPasswordChange(!showPasswordChange)}
                      className="text-[9px] font-black uppercase tracking-widest text-sve-blue hover:text-pola-red transition-colors flex items-center gap-2"
                    >
                      <Lock size={12} /> {showPasswordChange ? 'Avbryt lösenordsbyte' : 'Byt lösenord'}
                    </button>

                    {showPasswordChange && (
                      <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[8px] font-black uppercase text-zinc-500 mb-1">Nuvarande lösenord</label>
                            <input
                              type="password"
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              placeholder="Ditt nuvarande lösenord..."
                              className="w-full bg-zinc-50 p-3 rounded-sm text-xs font-bold text-zinc-900 outline-none border border-transparent focus:border-sve-blue"
                            />
                          </div>

                          <div>
                            <label className="block text-[8px] font-black uppercase text-zinc-500 mb-1">Nytt lösenord</label>
                            <div className="flex gap-2">
                              <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Minst 8 tecken..."
                                className="flex-1 bg-zinc-50 p-3 rounded-sm text-xs font-bold text-zinc-900 outline-none border border-transparent focus:border-pola-red"
                              />
                              <button
                                type="button"
                                onClick={handleChangePassword}
                                disabled={changingPassword || !oldPassword || newPassword.length < 8}
                                className="bg-sve-blue text-white px-6 py-2 rounded-sm text-[9px] font-black uppercase hover:bg-pola-red transition-all disabled:opacity-50 flex items-center gap-2"
                              >
                                {changingPassword ? <Loader2 size={12} className="animate-spin" /> : 'Uppdatera'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
             </div>

             <div className="bg-white p-6 md:p-8 border border-zinc-200 rounded-sm shadow-sm">
                <h3 className="text-[10px] font-black uppercase text-sve-blue mb-6 tracking-widest border-b pb-2">Profil & Språk</h3>
                <div className="space-y-6">
                  <div className="text-left">
                    <label htmlFor="user-bio-settings" className="block text-[8px] font-black uppercase text-zinc-600 mb-1">Om mig</label>
                    <textarea id="user-bio-settings" name="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Berätta lite om dig själv..." className="w-full bg-zinc-50 p-4 rounded-sm text-sm font-bold text-zinc-900 outline-none focus:border-sve-blue h-24 resize-none" />
                  </div>

                  <div className="text-left">
                    <label className="block text-[8px] font-black uppercase text-zinc-600 mb-3">Språk jag pratar</label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_LANGUAGES.map(lang => (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() => toggleLanguage(lang.id)}
                          className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all ${
                            selectedLanguages.includes(lang.id)
                              ? 'bg-sve-blue text-white shadow-lg'
                              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label htmlFor="show-email-toggle-settings" className="flex items-center justify-between p-4 bg-zinc-50 rounded-sm cursor-pointer hover:bg-zinc-100 transition-all text-left border border-zinc-100">
                    <span className="text-[9px] font-black uppercase text-zinc-700">Visa e-post offentligt</span>
                    <input id="show-email-toggle-settings" name="show-email" type="checkbox" checked={showEmail} onChange={(e) => setShowEmail(e.target.checked)} className="w-4 h-4 rounded border-zinc-300 text-sve-blue" />
                  </label>

                  <label htmlFor="show-phone-toggle-settings" className="flex items-center justify-between p-4 bg-zinc-50 rounded-sm cursor-pointer hover:bg-zinc-100 transition-all text-left border border-zinc-100">
                    <span className="text-[9px] font-black uppercase text-zinc-700">Visa telefonnummer offentligt</span>
                    <input id="show-phone-toggle-settings" name="show-phone" type="checkbox" checked={showPhone} onChange={(e) => setShowPhone(e.target.checked)} className="w-4 h-4 rounded border-zinc-300 text-sve-blue" />
                  </label>
                </div>
             </div>
          </div>

          <div className="mt-12 flex justify-center pb-20">
             <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="w-full max-w-md bg-sve-blue text-white py-6 rounded-sm font-black uppercase tracking-[0.4em] text-xs hover:bg-pola-red transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
             >
               {saving ? <Loader2 className="animate-spin" size={20} /> : "Spara Allt"}
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}
