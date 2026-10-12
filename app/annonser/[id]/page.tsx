import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Mail, Phone, MapPin, ShieldCheck, Calendar, User, Edit3, CheckCircle2, Box, ArrowRight } from 'lucide-react'
import ContactForm from '@/components/ads/ContactForm'
import AdActions from '@/components/ads/AdActions'
import HomeHero from '@/components/HomeHero'
import AdImageGallery from '@/components/ads/AdImageGallery'
import SafeImage from '@/components/ui/SafeImage'
import { capitalizeFirst } from '@/utils/capitalize'

export default async function AnnonsDetaljPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch the ad
  const { data: ad, error: adError } = await supabase
    .from('ads')
    .select('*')
    .eq('id', id)
    .single()

  if (adError || !ad) {
    notFound()
  }

  // 2. Fetch the seller's profile
  const { data: seller } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', ad.user_id)
    .single()

  // 3. Get current user
  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === ad.user_id

  // 4. Fetch related ads in same category
  const { data: relatedAdsData } = await supabase
    .from('ads')
    .select('id, title, image_url, price, location, category, is_premium')
    .eq('category', ad.category)
    .neq('id', ad.id)
    .not('status', 'eq', 'finished')
    .limit(4)

  const relatedAds = relatedAdsData || []
  const memberYear = new Date(seller?.created_at || ad.created_at || Date.now()).getFullYear()

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-left font-sans">
      <HomeHero />

      <main className="max-w-7xl mx-auto w-full px-0 md:px-6 py-4 md:py-12">
        <div className="bg-white border-y md:border border-zinc-200 shadow-sm md:shadow-xl md:rounded-sm overflow-hidden">

          {/* Ad Interactive Image Gallery Slider */}
          <AdImageGallery
            mainImage={ad.image_url}
            extraImages={ad.extra_images}
            title={ad.title}
            category={ad.category}
            isPremium={ad.is_premium}
          />

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
                      <Calendar size={14} className="text-[#a11a2d]" /> Publicerad {new Date(ad.created_at).toLocaleDateString('sv-SE')}
                      {ad.edited && (
                        <span className="italic font-normal lowercase tracking-normal text-zinc-400 ml-1">(redigerad)</span>
                      )}
                    </div>
                    {isOwner && (
                      <Link
                        href={`/annonser/${id}/redigera`}
                        className="inline-flex items-center gap-2 bg-zinc-900 text-white px-3 py-1 md:px-4 md:py-1.5 rounded-sm text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:bg-[#003366] transition-all w-fit shadow-sm"
                      >
                        <Edit3 size={12} /> Redigera Min Annons
                      </Link>
                    )}
                  </div>

                  <h1 className="text-2xl md:text-5xl font-black text-[#003366] uppercase tracking-tighter italic mb-4 md:mb-6 leading-tight">
                    {capitalizeFirst(ad.title)}
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
                    {capitalizeFirst(ad.description)}
                  </p>
                </div>
              </div>

              {/* RIGHT: Seller & Verification Badges */}
              <div className="lg:col-span-4 space-y-8 text-left">

                {/* Seller Info & Verification Box */}
                <div className="bg-zinc-50 border border-zinc-100 p-6 md:p-8 rounded-sm text-left shadow-sm">
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 text-[#003366] border-b border-zinc-200 pb-2">Om Säljaren</h4>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                      {seller?.avatar_url ? (
                        <img src={seller.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-zinc-300" />
                      )}
                    </div>
                    <div>
                      <Link href={`/profil/${ad.user_id}`} className="hover:underline group">
                        <p className="font-black text-[#003366] uppercase text-xs italic group-hover:text-[#a11a2d] transition-colors">{seller?.full_name || 'Anonym medlem'}</p>
                      </Link>
                      <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter">{seller?.city || 'Sverige'}</p>
                    </div>
                  </div>

                  {/* Verification Badges */}
                  <div className="space-y-2.5 bg-white p-4 border border-zinc-100 rounded-sm mb-6">
                    <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest mb-2">Trygghet & Verifiering</p>

                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-700 bg-emerald-50/60 p-2 rounded-sm border border-emerald-100">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                      <span>Verifierad E-post</span>
                    </div>

                    {seller?.phone && (
                      <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-700 bg-emerald-50/60 p-2 rounded-sm border border-emerald-100">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span>Verifierat Telefonnummer</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-[10px] font-bold text-blue-800 bg-blue-50/60 p-2 rounded-sm border border-blue-100">
                      <ShieldCheck size={14} className="text-[#003366] shrink-0" />
                      <span>Medlem på Polasve sedan {memberYear}</span>
                    </div>
                  </div>

                  {/* Public Contact Details */}
                  <div className="space-y-3">
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

                <div className="p-6 border border-zinc-100 rounded-sm italic bg-white shadow-sm">
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 text-zinc-400">Säkerhetstips</h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">"Träffas alltid på en offentlig plats vid affärer. Betala aldrig i förskott."</p>
                </div>
              </div>

            </div>

            {/* Feature 2: Liknande Annonser i samma kategori */}
            {relatedAds.length > 0 && (
              <div className="mt-12 pt-10 border-t border-zinc-100 text-left">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#003366] text-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm flex items-center gap-2">
                    <Box size={14} /> Liknande Annonser i {ad.category}
                  </div>
                  <div className="h-px flex-1 bg-zinc-100"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedAds.map((item) => (
                    <Link
                      href={`/annonser/${item.id}`}
                      key={item.id}
                      className="group bg-white border border-zinc-200 rounded-sm overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="aspect-video bg-zinc-100 relative overflow-hidden">
                        <SafeImage
                          src={item.image_url || ''}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {item.is_premium && (
                          <span className="absolute top-2 left-2 bg-amber-500 text-white text-[7px] font-black uppercase px-2 py-0.5 rounded-sm">
                            Premium
                          </span>
                        )}
                      </div>

                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[8px] font-black uppercase text-[#a11a2d] tracking-widest mb-1">{item.category}</p>
                          <h4 className="text-xs font-bold text-[#003366] italic line-clamp-2 leading-snug group-hover:underline mb-2">
                            {capitalizeFirst(item.title)}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-50">
                          <span className="text-xs font-black text-zinc-900">{item.price || 'Bud'}</span>
                          <span className="text-[8px] font-black uppercase text-[#003366] group-hover:text-[#a11a2d] flex items-center gap-1">
                            Visa <ArrowRight size={10} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}
