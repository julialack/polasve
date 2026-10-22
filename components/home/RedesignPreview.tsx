'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  Heart,
  Home,
  MapPin,
  Menu,
  MessageCircle,
  Plus,
  Search,
  ShoppingBag,
  Users,
  X,
} from 'lucide-react'
import { useTranslation } from '@/utils/translations'

const previewCopy = {
  sv: {
    preview: 'Designskiss · endast förhandsvisning',
    greeting: 'Hej, välkommen till',
    tagline: 'Community, jobb, bostad och bazar — samlat på ett ställe.',
    join: 'Gå med i communityt',
    createPost: 'Skapa ett inlägg',
    sections: 'Utforska',
    market: 'Bazar',
    community: 'Community',
    info: 'Information',
    housing: 'Bostad',
    services: 'Tjänster',
    institutions: 'Institutioner',
    more: 'Mer',
    support: 'Stöd vårt community',
    supportText: 'Hjälp oss att hålla Polasve levande och växande.',
    donate: 'Läs mer',
    active: 'Aktuellt just nu',
    event: 'Kommande event',
    eventName: 'Svensk-polsk fikaträff',
    eventDate: 'Lördag · Stockholm',
    featured: 'Utvalda annonser',
    seeAll: 'Visa alla',
    noResults: 'Inga annonser matchar sökningen.',
    searchPlaceholder: 'Sök bland annonser...',
    products: [
      { title: 'Vintage fåtölj i fint skick', price: '1 200 kr', place: 'Uppsala', icon: '🪑', color: 'from-amber-100 to-orange-50' },
      { title: 'Barncykel, 20 tum', price: '600 kr', place: 'Stockholm', icon: '🚲', color: 'from-sky-100 to-blue-50' },
      { title: 'Kaffeservis med 6 koppar', price: '350 kr', place: 'Göteborg', icon: '☕', color: 'from-rose-100 to-pink-50' },
    ],
    postName: 'Anna Kowalska',
    postLocation: 'Stockholm · för 24 min sedan',
    postText: 'Är det någon som kan rekommendera en bra polsktalande tandläkare i Stockholm? Dela gärna era tips! 😊',
    likes: 'Gilla',
    comments: 'Kommentarer',
    feedFilters: ['För dig', 'Frågor', 'Tips'],
    quick: 'Hitta snabbt',
    joinNews: 'Se alla nyheter',
    profile: 'Min profil',
    messages: 'Meddelanden',
    alerts: 'Notiser',
    close: 'Stäng',
  },
  pl: {
    preview: 'Projekt redesignu · podgląd',
    greeting: 'Cześć, witaj na',
    tagline: 'Społeczność, praca, mieszkania i bazar — wszystko w jednym miejscu.',
    join: 'Dołącz do społeczności',
    createPost: 'Utwórz post',
    sections: 'Odkrywaj',
    market: 'Bazar',
    community: 'Społeczność',
    info: 'Informacje',
    housing: 'Mieszkania',
    services: 'Usługi',
    institutions: 'Instytucje',
    more: 'Więcej',
    support: 'Wesprzyj społeczność',
    supportText: 'Pomóż nam rozwijać Polasve.',
    donate: 'Dowiedz się więcej',
    active: 'Teraz na Polasve',
    event: 'Nadchodzące wydarzenia',
    eventName: 'Polsko-szwedzkie spotkanie',
    eventDate: 'Sobota · Sztokholm',
    featured: 'Wybrane ogłoszenia',
    seeAll: 'Zobacz wszystkie',
    noResults: 'Brak ogłoszeń pasujących do wyszukiwania.',
    searchPlaceholder: 'Szukaj ogłoszeń...',
    products: [
      { title: 'Fotel vintage w dobrym stanie', price: '1 200 kr', place: 'Uppsala', icon: '🪑', color: 'from-amber-100 to-orange-50' },
      { title: 'Rower dziecięcy, 20 cali', price: '600 kr', place: 'Sztokholm', icon: '🚲', color: 'from-sky-100 to-blue-50' },
      { title: 'Serwis kawowy, 6 filiżanek', price: '350 kr', place: 'Göteborg', icon: '☕', color: 'from-rose-100 to-pink-50' },
    ],
    postName: 'Anna Kowalska',
    postLocation: 'Sztokholm · 24 min temu',
    postText: 'Czy ktoś może polecić dobrego polskojęzycznego dentystę w Sztokholmie? Chętnie poznam Wasze wskazówki! 😊',
    likes: 'Lubię to',
    comments: 'Komentarze',
    feedFilters: ['Dla Ciebie', 'Pytania', 'Porady'],
    quick: 'Znajdź szybko',
    joinNews: 'Zobacz wszystkie aktualności',
    profile: 'Mój profil',
    messages: 'Wiadomości',
    alerts: 'Powiadomienia',
    close: 'Zamknij',
  },
  ua: {
    preview: 'Дизайн-макет · лише попередній перегляд',
    greeting: 'Вітаємо на',
    tagline: 'Спільнота, робота, житло та базар — усе в одному місці.',
    join: 'Приєднатися до спільноти',
    createPost: 'Створити допис',
    sections: 'Огляд',
    market: 'Базар',
    community: 'Спільнота',
    info: 'Інформація',
    housing: 'Житло',
    services: 'Послуги',
    institutions: 'Установи',
    more: 'Ще',
    support: 'Підтримайте спільноту',
    supportText: 'Допоможіть нам розвивати Polasve.',
    donate: 'Дізнатися більше',
    active: 'Зараз на Polasve',
    event: 'Найближчі події',
    eventName: 'Шведсько-польська зустріч',
    eventDate: 'Субота · Стокгольм',
    featured: 'Вибрані оголошення',
    seeAll: 'Переглянути всі',
    noResults: 'За вашим запитом оголошень не знайдено.',
    searchPlaceholder: 'Пошук оголошень...',
    products: [
      { title: 'Вінтажне крісло в гарному стані', price: '1 200 kr', place: 'Уппсала', icon: '🪑', color: 'from-amber-100 to-orange-50' },
      { title: 'Дитячий велосипед, 20 дюймів', price: '600 kr', place: 'Стокгольм', icon: '🚲', color: 'from-sky-100 to-blue-50' },
      { title: 'Кавовий сервіз, 6 чашок', price: '350 kr', place: 'Гетеборг', icon: '☕', color: 'from-rose-100 to-pink-50' },
    ],
    postName: 'Anna Kowalska',
    postLocation: 'Стокгольм · 24 хв тому',
    postText: 'Хтось може порадити хорошого стоматолога, який розмовляє польською у Стокгольмі? Буду вдячна за поради! 😊',
    likes: 'Подобається',
    comments: 'Коментарі',
    feedFilters: ['Для вас', 'Запитання', 'Поради'],
    quick: 'Швидкий пошук',
    joinNews: 'Усі новини',
    profile: 'Мій профіль',
    messages: 'Повідомлення',
    alerts: 'Сповіщення',
    close: 'Закрити',
  },
  en: {
    preview: 'Design concept · preview only',
    greeting: 'Hello, welcome to',
    tagline: 'Community, jobs, housing and marketplace — all in one place.',
    join: 'Join the community',
    createPost: 'Create a post',
    sections: 'Explore',
    market: 'Marketplace',
    community: 'Community',
    info: 'Information',
    housing: 'Housing',
    services: 'Services',
    institutions: 'Institutions',
    more: 'More',
    support: 'Support our community',
    supportText: 'Help us keep Polasve growing.',
    donate: 'Learn more',
    active: 'What’s happening',
    event: 'Upcoming event',
    eventName: 'Swedish-Polish coffee meetup',
    eventDate: 'Saturday · Stockholm',
    featured: 'Featured listings',
    seeAll: 'See all',
    noResults: 'No listings match your search.',
    searchPlaceholder: 'Search listings...',
    products: [
      { title: 'Vintage armchair in great condition', price: '1,200 kr', place: 'Uppsala', icon: '🪑', color: 'from-amber-100 to-orange-50' },
      { title: 'Kids bike, 20 inch', price: '600 kr', place: 'Stockholm', icon: '🚲', color: 'from-sky-100 to-blue-50' },
      { title: 'Coffee set with 6 cups', price: '350 kr', place: 'Gothenburg', icon: '☕', color: 'from-rose-100 to-pink-50' },
    ],
    postName: 'Anna Kowalska',
    postLocation: 'Stockholm · 24 min ago',
    postText: 'Can anyone recommend a good Polish-speaking dentist in Stockholm? Please share your tips! 😊',
    likes: 'Like',
    comments: 'Comments',
    feedFilters: ['For you', 'Questions', 'Tips'],
    quick: 'Quick links',
    joinNews: 'See all news',
    profile: 'My profile',
    messages: 'Messages',
    alerts: 'Notifications',
    close: 'Close',
  },
} as const

export default function RedesignPreview() {
  const { t, lang } = useTranslation()
  const copy = previewCopy[lang]
  const [search, setSearch] = useState('')
  const [liked, setLiked] = useState(false)
  const [activeFilter, setActiveFilter] = useState(0)
  const [moreOpen, setMoreOpen] = useState(false)

  const products = useMemo(
    () => copy.products.filter(product => `${product.title} ${product.place}`.toLowerCase().includes(search.toLowerCase())),
    [copy.products, search],
  )

  const exploreLinks = [
    { label: t.navForum, href: '/community', icon: <MessageCircle size={17} />, color: 'bg-rose-50 text-rose-600' },
    { label: copy.market, href: '/marketplace', icon: <ShoppingBag size={17} />, color: 'bg-amber-50 text-amber-600' },
    { label: t.navJobs, href: '/jobb', icon: <BriefcaseBusiness size={17} />, color: 'bg-sky-50 text-sky-700' },
    { label: copy.housing, href: '/bostad', icon: <Home size={17} />, color: 'bg-emerald-50 text-emerald-700' },
    { label: t.navEvents, href: '/evenemang', icon: <CalendarDays size={17} />, color: 'bg-violet-50 text-violet-700' },
    { label: copy.institutions, href: '/institutioner', icon: <Users size={17} />, color: 'bg-slate-100 text-slate-600' },
  ]

  const moreLinks = [
    { label: t.navNews, href: '/nyheter' },
    { label: copy.services, href: '/tjanster' },
    { label: t.navTransport, href: '/transport' },
    { label: t.navMeetingPlace, href: '/meeting-place' },
    { label: copy.profile, href: '/profil' },
    { label: copy.messages, href: '/meddelanden' },
  ]

  return (
    <div className="min-h-screen bg-[#f4f6fa] pb-24 text-slate-900 md:pb-8">
      <div className="bg-[#003366] px-4 py-1.5 text-center text-[11px] font-medium text-white">
        {copy.preview}
      </div>
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link href="/redesign-preview" className="flex shrink-0 items-center gap-2" aria-label="Polasve">
            <span className="grid size-9 place-items-center rounded-xl bg-[#003366] text-sm font-black text-white">P</span>
            <span className="text-lg font-extrabold tracking-tight text-[#003366]">Polasve</span>
          </Link>
          <label className="mx-auto hidden w-full max-w-md items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-slate-400 sm:flex">
            <Search size={16} />
            <span className="text-sm">{t.searchPlaceholder}</span>
          </label>
          <div className="ml-auto flex items-center gap-1.5">
            <Link href="/sok" className="grid size-10 place-items-center rounded-full text-slate-600 hover:bg-slate-100 sm:hidden" aria-label={t.searchBtn}>
              <Search size={19} />
            </Link>
            <Link href="/meddelanden" className="hidden size-10 place-items-center rounded-full text-slate-600 hover:bg-slate-100 sm:grid" aria-label={copy.messages}>
              <MessageCircle size={19} />
            </Link>
            <Link href="/profil" className="grid size-10 place-items-center rounded-full text-slate-600 hover:bg-slate-100" aria-label={copy.alerts}>
              <Bell size={19} />
            </Link>
            <Link href="/profil" className="grid size-9 place-items-center rounded-full bg-rose-100 text-sm font-bold text-rose-800" aria-label={copy.profile}>
              AK
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-5 px-3 py-5 sm:px-5 md:gap-6 md:px-6 md:py-8 lg:grid-cols-[220px_minmax(0,1fr)_270px]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">{copy.sections}</h2>
              <nav className="space-y-1">
                {exploreLinks.map((item, index) => (
                  <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${index === 0 ? 'bg-blue-50 text-[#003366]' : 'text-slate-600 hover:bg-slate-50'}`}>
                    <span className={`grid size-8 place-items-center rounded-lg ${item.color}`}>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
              <button onClick={() => setMoreOpen(!moreOpen)} className="mt-2 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50">
                <span className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-slate-100"><Menu size={17} /></span>{copy.more}</span>
                <ChevronDown size={15} className={moreOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>
              {moreOpen && <div className="ml-11 mt-1 space-y-1">{moreLinks.map(item => <Link key={item.href} href={item.href} className="block rounded-lg px-2 py-2 text-sm text-slate-500 hover:bg-slate-50">{item.label}</Link>)}</div>}
            </section>
            <Link href="/reklam" className="flex items-center justify-between rounded-2xl bg-gradient-to-br from-[#003366] to-[#1763a5] p-4 text-white shadow-sm">
              <span><span className="block text-sm font-bold">{t.advertiseBtn}</span><span className="mt-1 block text-xs text-blue-100">{t.createAdBtn}</span></span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </aside>

        <div className="min-w-0 space-y-5 md:space-y-6">
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#eaf2ff] via-white to-[#fff2f0] p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">
            <div className="absolute -right-8 -top-12 size-48 rounded-full bg-blue-100/60 blur-2xl" />
            <div className="relative max-w-xl">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a11a2d]">
                <span className="inline-flex overflow-hidden rounded-sm shadow-sm"><span className="h-3 w-3 bg-white" /><span className="h-3 w-3 bg-[#a11a2d]" /></span>
                <span className="inline-flex overflow-hidden rounded-sm shadow-sm"><span className="h-3 w-3 bg-[#006aa7]" /><span className="h-3 w-3 bg-[#fecc00]" /></span>
                {copy.greeting}
              </div>
              <h1 className="text-3xl font-black tracking-tight text-[#003366] sm:text-4xl">Polasve</h1>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">{copy.tagline}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/registrera" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#003366] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-900">
                  {copy.join}<ArrowRight size={16} />
                </Link>
                <Link href="/community" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-white">
                  <Plus size={16} />{copy.createPost}
                </Link>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{copy.quick}</p><h2 className="mt-1 text-lg font-bold text-slate-900">{copy.sections}</h2></div>
              <Link href="/annonser" className="text-sm font-semibold text-[#003366] hover:underline">{copy.seeAll}</Link>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {exploreLinks.map(item => (
                <Link key={item.href} href={item.href} className="group flex min-w-0 flex-col items-center gap-2 rounded-xl p-2 text-center hover:bg-slate-50 sm:p-3">
                  <span className={`grid size-11 place-items-center rounded-2xl transition-transform group-hover:-translate-y-0.5 ${item.color}`}>{item.icon}</span>
                  <span className="w-full truncate text-xs font-semibold text-slate-600">{item.label}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 sm:px-5">
              <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{copy.market}</p><h2 className="mt-1 text-lg font-bold">{copy.featured}</h2></div>
              <Link href="/marketplace" className="inline-flex items-center gap-1 text-sm font-bold text-[#003366] hover:underline">{copy.seeAll}<ArrowRight size={15} /></Link>
            </div>
            <div className="px-4 pt-3 sm:px-5">
              <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-400 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
                <Search size={16} />
                <input value={search} onChange={event => setSearch(event.target.value)} placeholder={copy.searchPlaceholder} className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400" />
                {search && <button onClick={() => setSearch('')} aria-label={copy.close}><X size={16} /></button>}
              </label>
            </div>
            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
              {products.map(product => (
                <Link key={product.title} href="/marketplace" className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className={`grid aspect-[16/9] place-items-center bg-gradient-to-br ${product.color} text-5xl transition-transform group-hover:scale-[1.02]`} aria-hidden="true">{product.icon}</div>
                  <div className="p-3">
                    <h3 className="line-clamp-1 text-sm font-bold text-slate-800">{product.title}</h3>
                    <p className="mt-1 text-base font-extrabold text-[#003366]">{product.price}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin size={13} />{product.place}</p>
                  </div>
                </Link>
              ))}
              {products.length === 0 && <p className="col-span-full py-8 text-center text-sm text-slate-500">{copy.noResults}</p>}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
              <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{copy.community}</p><h2 className="mt-1 text-lg font-bold">{t.communityFeed}</h2></div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"><span className="size-1.5 rounded-full bg-emerald-500" />142 {t.online}</span>
            </div>
            <div className="flex gap-2 overflow-x-auto border-b border-slate-100 px-4 py-3 sm:px-5">
              {copy.feedFilters.map((filter, index) => <button key={filter} onClick={() => setActiveFilter(index)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition ${activeFilter === index ? 'bg-[#003366] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{filter}</button>)}
            </div>
            <div className="p-4 sm:p-5">
              <Link href="/community" className="mb-4 flex min-h-14 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 hover:bg-slate-100">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-rose-100 text-xs font-bold text-rose-800">AK</span>
                {copy.createPost}
                <Plus className="ml-auto" size={18} />
              </Link>
              <article className="rounded-xl border border-slate-200 p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-rose-100 text-sm font-bold text-rose-800">AK</span>
                  <div className="min-w-0"><h3 className="text-sm font-bold">{copy.postName}</h3><p className="mt-0.5 text-xs text-slate-500">{copy.postLocation}</p></div>
                  <button className="ml-auto rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label={copy.more}><Menu size={17} /></button>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">{copy.postText}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <button onClick={() => setLiked(!liked)} aria-pressed={liked} className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${liked ? 'bg-rose-50 text-rose-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <Heart size={17} className={liked ? 'fill-rose-600' : ''} />{liked ? '13' : '12'} · {copy.likes}
                  </button>
                  <Link href="/community" className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-500 hover:bg-slate-50"><MessageCircle size={17} />3 · {copy.comments}</Link>
                  <button className="min-h-10 rounded-lg px-3 text-sm font-semibold text-slate-500 hover:bg-slate-50">{t.share}</button>
                </div>
              </article>
            </div>
          </section>
        </div>

        <aside className="hidden space-y-5 md:block">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2"><span className="grid size-9 place-items-center rounded-xl bg-violet-50 text-violet-700"><CalendarDays size={18} /></span><h2 className="font-bold">{copy.event}</h2></div>
            <div className="rounded-xl bg-violet-50/70 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-violet-700">{copy.eventDate}</p>
              <h3 className="mt-2 font-bold text-slate-800">{copy.eventName}</h3>
              <Link href="/evenemang" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-violet-800">{copy.seeAll}<ArrowRight size={14} /></Link>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2"><span className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-700"><Check size={18} /></span><h2 className="font-bold">{copy.active}</h2></div>
            <Link href="/annonser" className="flex items-start gap-3 rounded-xl p-2 hover:bg-slate-50">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-lg">✨</span>
              <span><span className="block text-sm font-semibold text-slate-800">{t.bazarTitle}</span><span className="mt-1 block text-xs text-slate-500">{copy.featured}</span></span>
            </Link>
            <Link href="/institutioner" className="flex items-start gap-3 rounded-xl p-2 hover:bg-slate-50">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600"><Users size={18} /></span>
              <span><span className="block text-sm font-semibold text-slate-800">{copy.institutions}</span><span className="mt-1 block text-xs text-slate-500">{copy.info}</span></span>
            </Link>
          </section>

          <section className="rounded-2xl bg-gradient-to-br from-rose-50 to-white p-5 shadow-sm ring-1 ring-rose-100">
            <span className="grid size-10 place-items-center rounded-xl bg-white text-rose-600 shadow-sm"><Heart size={19} /></span>
            <h2 className="mt-3 font-bold">{copy.support}</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{copy.supportText}</p>
            <Link href="/stod-oss" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#a11a2d] px-3.5 text-sm font-bold text-white hover:bg-rose-900">{copy.donate}<ArrowRight size={15} /></Link>
          </section>
          <Link href="/nyheter" className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-600 shadow-sm hover:text-[#003366]">{copy.joinNews}<ArrowRight size={16} /></Link>
        </aside>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 shadow-[0_-5px_20px_rgba(15,23,42,0.06)] backdrop-blur md:hidden" aria-label={copy.sections}>
        <div className="mx-auto grid max-w-lg grid-cols-5">
          <Link href="/community" className="flex min-h-14 flex-col items-center justify-center gap-1 text-[#003366]"><MessageCircle size={19} /><span className="text-[10px] font-semibold">{copy.community}</span></Link>
          <Link href="/marketplace" className="flex min-h-14 flex-col items-center justify-center gap-1 text-slate-500"><ShoppingBag size={19} /><span className="text-[10px] font-semibold">{copy.market}</span></Link>
          <Link href="/jobb" className="flex min-h-14 flex-col items-center justify-center gap-1 text-slate-500"><BriefcaseBusiness size={19} /><span className="text-[10px] font-semibold">{t.navJobs}</span></Link>
          <Link href="/evenemang" className="flex min-h-14 flex-col items-center justify-center gap-1 text-slate-500"><CalendarDays size={19} /><span className="text-[10px] font-semibold">{t.navEvents}</span></Link>
          <button onClick={() => setMoreOpen(!moreOpen)} aria-expanded={moreOpen} className="flex min-h-14 flex-col items-center justify-center gap-1 text-slate-500"><Menu size={19} /><span className="text-[10px] font-semibold">{copy.more}</span></button>
        </div>
      </nav>
      {moreOpen && <div className="fixed inset-x-3 bottom-20 z-50 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl md:hidden">
        <div className="mb-2 flex items-center justify-between px-2"><p className="text-sm font-bold">{copy.more}</p><button onClick={() => setMoreOpen(false)} aria-label={copy.close} className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X size={17} /></button></div>
        <div className="grid grid-cols-2 gap-1">{moreLinks.map(item => <Link key={item.href} href={item.href} onClick={() => setMoreOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">{item.label}</Link>)}</div>
      </div>}
    </div>
  )
}
