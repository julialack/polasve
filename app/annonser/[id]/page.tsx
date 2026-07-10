import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ContactForm from '@/components/ads/ContactForm'

export default async function AnnonsDetaljPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: ad, error } = await supabase
    .from('ads')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !ad) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header / Breadcrumbs */}
      <div className="bg-zinc-50/50 border-b border-zinc-100 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 gap-4">
            <Link href="/" className="hover:text-red-800 transition-colors">Hem</Link>
            <span>/</span>
            <Link href="/annonser" className="hover:text-red-800 transition-colors">Marknadsplats</Link>
            <span>/</span>
            <span className="text-zinc-900">{ad.category}</span>
          </nav>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Main Ad Image - Big & Elegant */}
        {ad.image_url && (
          <div className="mb-20 w-full aspect-[21/9] bg-zinc-100 overflow-hidden rounded-sm shadow-2xl shadow-zinc-100">
            <img
              src={ad.image_url}
              alt={ad.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-20">
          {/* Left: Content */}
          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-800 border border-red-800/20 px-4 py-1.5 rounded-full">
                  {ad.category}
                </span>
                {ad.is_premium && (
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-red-800 text-white px-4 py-1.5 rounded-full shadow-lg shadow-red-900/10">
                    Premium
                  </span>
                )}
                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                  Publicerad {new Date(ad.created_at).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-light tracking-tight text-zinc-900 mb-6 leading-tight">
                {ad.title}
              </h1>
              <div className="flex items-center gap-6 text-zinc-500 font-serif italic text-lg">
                <span>📍 {ad.location}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-800"></span>
                <span className="text-zinc-900 font-sans font-bold not-italic">{ad.price || 'Pris på förfrågan'}</span>
              </div>
            </div>

            <div className="prose prose-zinc max-w-none">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-300 mb-6 border-b border-zinc-100 pb-4">Beskrivning</h3>
              <p className="text-zinc-600 font-light text-lg leading-relaxed whitespace-pre-wrap">
                {ad.description}
              </p>
            </div>
          </div>

          {/* Right: Actions & Sidebar */}
          <div className="space-y-12">
            {/* Contact Box Component */}
            <ContactForm
              receiverId={ad.user_id}
              adId={ad.id}
              adTitle={ad.title}
            />

            {/* Safety Tips */}
            <div className="p-8 border border-zinc-100 rounded-sm">
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-zinc-900">Säkerhetstips</h4>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start text-xs text-zinc-500 font-light">
                  <span className="text-red-800 font-serif italic">01.</span>
                  Träffas alltid på en offentlig plats vid affärer.
                </li>
                <li className="flex gap-4 items-start text-xs text-zinc-500 font-light">
                  <span className="text-red-800 font-serif italic">02.</span>
                  Betala aldrig i förskott utan att ha sett varan eller tjänsten.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
