import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Mail, Phone, MapPin, ShieldCheck, Calendar, User, Edit3 } from 'lucide-react'
import ContactForm from '@/components/ads/ContactForm'
import AdActions from '@/components/ads/AdActions'
import HomeHero from '@/components/HomeHero'

export default async function AnnonsDetaljPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch the ad first
  const { data: ad, error: adError } = await supabase
    .from('ads')
    .select('*')
    .eq('id', id)
    .single()

  if (adError || !ad) {
    notFound()
  }

  // 2. Fetch the seller's profile separately to avoid relationship errors
  const { data: seller } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', ad.user_id)
    .single()

  // 3. Get current user to check ownership
  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === ad.user_id

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-left">
      <HomeHero />

      <main className="max-w-7xl mx-auto w-full px-0 md:px-6 py-4 md:py-12">
        <div className="bg-white border-y md:border border-zinc-200 shadow-sm md:shadow-xl md:rounded-sm overflow-hidden">

          {/* Ad Image Header */}
          {ad.image_url && (
            <div className="w-full h-[250px] md:h-[500px] relative bg-zinc-100 border-b border-zinc-100">
              <img
                src={ad.image_url}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 md:top-6 md:left-6 flex gap-2 md:gap-3">
                <span className="bg-[#a11a2d] text-white px-3 py-1 md:px-4 md:py-1.5 rounded-sm text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-xl">
                  {ad.category}
                </span>
                {ad.is_premium && (
                  <span className="bg-[#003366] text-white px-3 py-1 md:px-4 md:py-1.5 rounded-sm text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1 md:gap-2">
                    <ShieldCheck size={12} /> Premium
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="p-4 md:p-12">
            <div className="grid lg:grid-cols-12 gap-6 md:gap-12">

              {/* LEFT: Ad Content */}
              <div className="lg:col-span-8 space-y-8 md:space-y-10 text-left">
                <div className="text-left">
                  {ad.status === 'finished' && (
                    <div className="mb-4 md:mb-6 bg-red-600 text-white px-4 py-2 rounded-sm font-black uppercase text-[10px] md:text-xs tracking-widest text-center animate-in zoom-in-95 duration-300">
                      Denna annons är avslutad (SÅLD / TILLSATT)
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 mb-4">
                    <div className="flex items-center gap-2 md:gap-3 text-zinc-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                      <Calendar size={14} className="text-[#a11a2d]" /> Publicerad {new Date(ad.created_at).toLocaleDateString()}
                    </div>
                    {isOwner && (
                      <Link
                        href={`/annonser/${id}/redigera`}
                        className="inline-flex items-center gap-2 bg-zinc-900 text-white px-3 py-1 md:px-4 md:py-1.5 rounded-sm text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:bg-[#003366] transition-all w-fit"
                      >
                        <Edit3 size={12} /> Redigera Min Annons
                      </Link>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-5xl font-black text-[#003366] uppercase tracking-tighter italic mb-4 md:mb-6 leading-tight">
                    {ad.title}
                  </h1>
                  <div className="flex flex-wrap items-center justify-between gap-6 border-y border-zinc-50 py-4 md:py-6">
                    <div className="flex flex-wrap items-center gap-4 md:gap-8">
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-[#a11a2d]" />
                        <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">{ad.location}</span>
                      </div>
                      <div className="text-xl md:text-2xl font-black text-zinc-900">{ad.price || 'Bud'}</div>
                    </div>
                    <AdActions adId={ad.id} adTitle={ad.title} currentUserId={user?.id} />
                  </div>
                </div>

                <div className="text-left">
                  <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-4 md:mb-6 flex items-center gap-4">
                    Beskrivning <div className="h-px flex-1 bg-zinc-50"></div>
                  </h3>
                  <p className="text-zinc-600 font-medium text-sm md:text-lg leading-relaxed whitespace-pre-wrap px-1 mb-6 md:mb-10">
                    {ad.description}
                  </p>

                  {ad.extra_images && ad.extra_images.length > 0 && (
                    <div className="space-y-4 md:space-y-6">
                       <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-4 md:mb-6 flex items-center gap-4">
                        Fler Bilder <div className="h-px flex-1 bg-zinc-50"></div>
                      </h3>
                      <div className="grid grid-cols-2 gap-2 md:gap-4">
                        {ad.extra_images.map((img: string, idx: number) => (
                          <div key={idx} className="relative aspect-video rounded-sm overflow-hidden border border-zinc-100 shadow-sm group cursor-zoom-in">
                            <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Seller & Contact */}
              <div className="lg:col-span-4 space-y-8">

                {/* Seller Info Box */}
                <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-sm text-left">
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 text-[#003366] border-b border-zinc-200 pb-2">Om Säljaren</h4>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center overflow-hidden shadow-sm">
                      {seller?.avatar_url ? (
                        <img src={seller.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-zinc-300" />
                      )}
                    </div>
                    <div>
                      <p className="font-black text-[#003366] uppercase text-xs italic">{seller?.full_name || 'Anonym medlem'}</p>
                      <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter">{seller?.city || 'Sverige'}</p>
                    </div>
                  </div>

                  {/* Public Contact Details */}
                  <div className="space-y-4">
                    {seller?.show_email_publicly && (
                      <div className="flex items-center gap-3 p-3 bg-white border border-zinc-100 rounded-sm">
                        <Mail size={16} className="text-[#a11a2d]" />
                        <span className="text-xs font-bold text-zinc-800 lowercase">{seller.email}</span>
                      </div>
                    )}
                    {seller?.show_phone_publicly && seller?.phone && (
                      <div className="flex items-center gap-3 p-3 bg-white border border-zinc-100 rounded-sm">
                        <Phone size={16} className="text-[#a11a2d]" />
                        <span className="text-xs font-bold text-zinc-800">{seller.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Internal Messaging */}
                <ContactForm
                  receiverId={ad.user_id}
                  adId={ad.id}
                  adTitle={ad.title}
                />

                <div className="p-8 border border-zinc-100 rounded-sm italic bg-white shadow-sm">
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 text-zinc-300">Säkerhetstips</h4>
                  <p className="text-[10px] text-zinc-400 leading-relaxed mb-4">"Träffas alltid på en offentlig plats vid affärer. Betala aldrig i förskott."</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
