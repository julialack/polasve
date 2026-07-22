import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Mail, Phone, MapPin, ShieldCheck, Calendar } from 'lucide-react'
import ContactForm from '@/components/ads/ContactForm'
import HomeHero from '@/components/HomeHero'

export default async function AnnonsDetaljPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch ad with seller profile info
  const { data: ad, error } = await supabase
    .from('ads')
    .select('*, profiles:user_id (*)')
    .eq('id', id)
    .single()

  if (error || !ad) {
    notFound()
  }

  const seller = ad.profiles;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-left">
      <HomeHero />

      <main className="max-w-7xl mx-auto w-full px-4 md:px-6 py-12">
        <div className="bg-white border border-zinc-200 rounded-sm shadow-xl overflow-hidden">

          {/* Ad Image Header */}
          {ad.image_url && (
            <div className="w-full h-[300px] md:h-[500px] relative bg-zinc-100 border-b border-zinc-100">
              <img
                src={ad.image_url}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6 flex gap-3">
                <span className="bg-[#a11a2d] text-white px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-xl">
                  {ad.category}
                </span>
                {ad.is_premium && (
                  <span className="bg-[#003366] text-white px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                    <ShieldCheck size={12} /> Premium
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="p-6 md:p-12">
            <div className="grid lg:grid-cols-12 gap-12">

              {/* LEFT: Ad Content */}
              <div className="lg:col-span-8 space-y-10 text-left">
                <div className="text-left">
                  <div className="flex items-center gap-3 text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                    <Calendar size={14} className="text-[#a11a2d]" /> Publicerad {new Date(ad.created_at).toLocaleDateString()}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-[#003366] uppercase tracking-tighter italic mb-6 leading-tight">
                    {ad.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-8 border-y border-zinc-50 py-6">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-[#a11a2d]" />
                      <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">{ad.location}</span>
                    </div>
                    <div className="text-2xl font-black text-zinc-900">{ad.price || 'Bud'}</div>
                  </div>
                </div>

                <div className="text-left">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-6 flex items-center gap-4">
                    Beskrivning <div className="h-px flex-1 bg-zinc-50"></div>
                  </h3>
                  <p className="text-zinc-600 font-medium text-base md:text-lg leading-relaxed whitespace-pre-wrap px-1">
                    {ad.description}
                  </p>
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
