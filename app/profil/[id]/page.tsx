import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Mail, Phone, MapPin, Info, Globe, Package, MessageSquare, ChevronLeft } from 'lucide-react'
import HomeHero from '@/components/HomeHero'
import UserAvatar from '@/components/ui/UserAvatar'
import { formatDisplayName } from '@/utils/formatName'

// Force dynamic rendering to ensure the ID is always read correctly
export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function UserProfilePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!profile) {
    return notFound()
  }

  // 2. Fetch ads
  const { data: ads } = await supabase
    .from('ads')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false })

  const meta = profile
  const displayName = formatDisplayName(meta.full_name || 'Medlem')

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-left font-sans">
      <HomeHero />

      <main className="max-w-6xl mx-auto w-full px-4 md:px-6 py-8 md:py-12 flex-1">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#003366] transition-colors mb-8 text-[10px] font-black uppercase tracking-widest"
        >
          <ChevronLeft size={14} /> Tillbaka till flödet
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-sm shadow-xl overflow-hidden">
              <div className="h-32 relative bg-gradient-to-r from-[#a11a2d] to-[#003366]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10"></div>
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                  <div className="w-32 h-32 bg-white p-1 rounded-full shadow-2xl overflow-hidden border-4 border-white relative flex items-center justify-center">
                    <UserAvatar userId={id} size="xl" />
                  </div>
                </div>
              </div>

              <div className="pt-20 pb-10 px-8 text-center">
                <h2 className="text-3xl font-pacifico text-sve-blue italic mb-4">
                  {displayName}
                </h2>

                <div className="flex flex-col items-center gap-3 mb-8">
                  {meta.show_email_publicly && meta.email && (
                    <div className="flex items-center gap-2 text-zinc-600 text-xs font-bold bg-zinc-50 px-4 py-2 rounded-full border border-zinc-100">
                      <Mail size={14} className="text-[#a11a2d]" /> {meta.email}
                    </div>
                  )}
                  {meta.show_phone_publicly && meta.phone && (
                    <div className="flex items-center gap-2 text-zinc-600 text-xs font-bold bg-zinc-50 px-4 py-2 rounded-full border border-zinc-100">
                      <Phone size={14} className="text-[#003366]" /> {meta.phone}
                    </div>
                  )}
                  {meta.city && (
                    <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                      <MapPin size={12} /> {meta.city}
                    </div>
                  )}
                </div>

                <div className="space-y-6 text-left border-y border-zinc-50 py-8">
                  {meta.bio ? (
                    <div>
                      <div className="flex items-center gap-2 text-[8px] font-black uppercase text-zinc-300 mb-3 tracking-widest">
                        <Info size={10} /> Om mig
                      </div>
                      <p className="text-sm text-zinc-600 font-medium leading-relaxed italic">&quot;{meta.bio}&quot;</p>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-300 italic text-center">Användaren har inte skrivit någon bio än.</p>
                  )}

                  <div>
                    <div className="flex items-center gap-2 text-[8px] font-black uppercase text-zinc-300 mb-3 tracking-widest">
                      <Globe size={10} /> Språk
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {meta.languages && (meta.languages as any).length > 0 ? (
                        (meta.languages as string[]).map((l: string) => (
                          <span key={l} className="bg-zinc-50 text-[10px] font-bold text-[#003366] px-3 py-1 rounded-full border border-zinc-100 uppercase">
                            {l}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-zinc-300 italic">Inga språk angivna</span>
                      )}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/profil?view=chat&otherId=${id}`}
                  className="mt-8 w-full flex items-center justify-center gap-3 bg-[#a11a2d] text-white py-4 rounded-sm font-black uppercase text-xs tracking-widest hover:bg-[#003366] transition-all shadow-lg active:scale-95"
                >
                  <MessageSquare size={16} /> Skicka Meddelande
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <section className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden min-h-[600px]">
              <div className="bg-[#003366] text-white px-8 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-3">
                <Package size={18} /> Aktiva Annonser ({(ads as any)?.length || 0})
              </div>

              <div className="p-6 md:p-10">
                {!ads || ads.length === 0 ? (
                  <div className="py-20 text-center opacity-30">
                    <Package size={48} className="mx-auto mb-4 text-[#003366]" />
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Inga aktiva annonser just nu</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {ads.map((ad) => (
                      <Link
                        key={ad.id}
                        href={`/annonser/${ad.id}`}
                        className="group flex flex-col md:flex-row gap-6 p-4 border border-zinc-50 rounded-sm hover:border-[#003366]/20 hover:bg-zinc-50/50 transition-all"
                      >
                        <div className="w-full md:w-32 h-32 bg-zinc-100 flex-shrink-0 rounded-sm overflow-hidden border">
                          {ad.image_url ? (
                            <img src={ad.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-300 text-[10px] font-black uppercase">Ingen bild</div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <span className="text-[8px] font-black text-[#a11a2d] uppercase tracking-widest mb-1">{ad.category}</span>
                          <h4 className="text-lg font-black text-[#003366] uppercase tracking-tighter italic group-hover:underline mb-2">{ad.title}</h4>
                          <p className="text-xl font-black text-zinc-900">{ad.price || 'Bud'}</p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-[10px] font-black uppercase text-zinc-400 border border-zinc-200 px-3 py-1 rounded-full group-hover:bg-[#003366] group-hover:text-white transition-all">Visa info &raquo;</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
