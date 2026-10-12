'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type LanguageCode = 'pl' | 'sv' | 'ua' | 'en'

export interface TranslationDict {
  // Navigation & Menus
  heroTitle: string
  heroSubtitle: string
  navHome: string
  navForum: string
  navNews: string
  navEvents: string
  navMarketplace: string
  navJobs: string
  navHousing: string
  navServices: string
  navTransport: string
  navMeetingPlace: string
  navInfo: string
  navAbout: string
  navLogin: string
  navLogout: string
  navProfile: string
  navMessages: string
  navAdmin: string
  menuTitle: string

  // Mobile Menu & Sidebar Sections
  mainMenu: string
  jobAndHousing: string
  servicesAndTransport: string
  communityAndMeeting: string
  information: string
  buyAccept: string
  sellGiveaway: string
  exchange: string
  findJob: string
  housingWanted: string
  housingRent: string
  commercialLocales: string
  tipsTricks: string
  institutions: string
  faq: string
  terms: string
  navigationHeader: string
  currentNow: string

  // Actions & Buttons
  createAdBtn: string
  searchPlaceholder: string
  searchBtn: string
  advertiseBtn: string
  contactBtn: string
  loginRegisterBtn: string

  // Home & Feed Sections
  bazarTitle: string
  seeAll: string
  seeWholeBazar: string
  sold: string
  finished: string
  auction: string
  livePolandNews: string
  topNews: string
  noNews: string
  seeMoreNews: string
  swedenMapTitle: string

  // Support & Donations
  supportUsTitle: string
  supportUsSubtitle: string
  supportUsBtn: string
  selectAmount: string
  customAmountPlaceholder: string
  donateViaStripe: string
  securePayment: string

  // Categories
  catJobs: string
  catHousing: string
  catSell: string
  catBuy: string
  catServices: string
  catMeetingPlace: string
  communityFeed: string

  // Posts & Comments
  postPlaceholder: string
  postMeetingPlaceholder: string
  publishPostBtn: string
  like: string
  comment: string
  share: string
  report: string
  edit: string
  delete: string
  cancel: string
  save: string
  reply: string
  sendComment: string
  writeReply: string
  edited: string
  linkCopied: string

  // Categories for Feed
  feedGeneral: string
  feedQuestion: string
  feedTips: string
  feedWarning: string
  feedHelp: string
  feedMeetingPlace: string

  // Footer
  footerTitle: string
  footerDesc: string
  footerLinks: string
  newsArchive: string
  rightsReserved: string
  communityTrustQuality: string
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDict> = {
  pl: {
    heroTitle: 'Polacy w Szwecji',
    heroSubtitle: 'Twój portal z pracą, mieszkaniami i społecznością',
    navHome: 'Strona Główna',
    navForum: 'Forum / Bazar',
    navNews: 'Wiadomości',
    navEvents: 'Wydarzenia',
    navMarketplace: 'Rynek / Bazar',
    navJobs: 'Praca',
    navHousing: 'Mieszkania',
    navServices: 'Usługi',
    navTransport: 'Transport',
    navMeetingPlace: 'Spotkania',
    navInfo: 'Informacje',
    navAbout: 'O nas',
    navLogin: 'Zaloguj się / Rejestracja',
    navLogout: 'Wyloguj się',
    navProfile: 'Mój Profil',
    navMessages: 'Wiadomości',
    navAdmin: 'Portal Admina',
    menuTitle: 'Menu',

    mainMenu: 'Główne Menu',
    jobAndHousing: 'Praca & Mieszkanie',
    servicesAndTransport: 'Usługi & Transport',
    communityAndMeeting: 'Społeczność & Spotkania',
    information: 'Informacje',
    buyAccept: 'Kupię / Przyjmę',
    sellGiveaway: 'Sprzedam / Oddam',
    exchange: 'Zamiana',
    findJob: 'Szukam pracy',
    housingWanted: 'Mieszkanie - Szukam',
    housingRent: 'Mieszkanie - Wynajmę',
    commercialLocales: 'Lokale',
    tipsTricks: 'Porady & Poradniki',
    institutions: 'Instytucje',
    faq: 'Pytania & Odpowiedzi',
    terms: 'Warunki serwisu',
    navigationHeader: 'Nawigacja',
    currentNow: 'Aktualne Teraz',

    createAdBtn: 'Dodaj ogłoszenie',
    searchPlaceholder: 'Szukaj pracy, mieszkań, usług i ogłoszeń...',
    searchBtn: 'Szukaj',
    advertiseBtn: 'Dodaj reklamę',
    contactBtn: 'Pytania? Napisz do nas!',
    loginRegisterBtn: 'Zaloguj się / Rejestracja',

    bazarTitle: 'Bazar - Ogłoszenia Premium',
    seeAll: 'Wszystkie »',
    seeWholeBazar: 'Zobacz cały bazar >>',
    sold: 'SPRZEDANE',
    finished: 'Zakończone',
    auction: 'Aukcja',
    livePolandNews: 'Na żywo z Polski',
    topNews: 'Najważniejsze wiadomości',
    noNews: 'Brak wiadomości...',
    seeMoreNews: 'Zobacz więcej wiadomości »',
    swedenMapTitle: 'Mapa Szwecji',

    supportUsTitle: 'Wesprzyj naszą społeczność!',
    supportUsSubtitle: 'Dobrowolny datek od 5 kr na rozwój serwisu',
    supportUsBtn: 'Wesprzyj nas',
    selectAmount: 'Wybierz kwotę (kr):',
    customAmountPlaceholder: 'LUB wpisz własną kwotę (min 5 kr)...',
    donateViaStripe: 'Przekaż datek via Stripe',
    securePayment: '🔒 Bezpieczna płatność kartą via Stripe',

    catJobs: 'Praca',
    catHousing: 'Mieszkania',
    catSell: 'Sprzedam',
    catBuy: 'Kupię',
    catServices: 'Usługi',
    catMeetingPlace: 'Spotkania',
    communityFeed: 'Społeczność - Na żywo',

    postPlaceholder: 'Podziel się czymś ze społecznością...',
    postMeetingPlaceholder: 'Napisz wpis na Spotkania...',
    publishPostBtn: 'Opublikuj wpis',
    like: 'Polub',
    comment: 'Komentarz',
    share: 'Udostępnij',
    report: 'Zgłoś',
    edit: 'Edytuj',
    delete: 'Usuń',
    cancel: 'Anuluj',
    save: 'Zapisz',
    reply: 'Odpowiedz',
    sendComment: 'Wyślij',
    writeReply: 'Napisz odpowiedź...',
    edited: '(edytowano)',
    linkCopied: 'Link skopiowany do schowka!',

    feedGeneral: 'Ogólne',
    feedQuestion: 'Pytanie',
    feedTips: 'Porada',
    feedWarning: 'Ostrzeżenie',
    feedHelp: 'Pomoc',
    feedMeetingPlace: '🤝 Spotkania',

    footerTitle: 'Polacy w Szwecji',
    footerDesc: 'Twój oficjalny portal z wiadomościami, pracą i społecznością. Łączymy polską społeczność w Szwecji od 2026 roku.',
    footerLinks: 'Linki',
    newsArchive: 'Archiwum wiadomości',
    rightsReserved: 'Wszelkie prawa zastrzeżone',
    communityTrustQuality: 'Społeczność • Zaufanie • Jakość',
  },
  sv: {
    heroTitle: 'Polacker i Sverige',
    heroSubtitle: 'Din portal för jobb, bostäder och community',
    navHome: 'Hem',
    navForum: 'Forum / Bazar',
    navNews: 'Nyheter',
    navEvents: 'Event',
    navMarketplace: 'Marketplace',
    navJobs: 'Jobb',
    navHousing: 'Bostad',
    navServices: 'Tjänster',
    navTransport: 'Transport',
    navMeetingPlace: 'Mötesplats',
    navInfo: 'Information',
    navAbout: 'Om oss',
    navLogin: 'Logga in / Registrera',
    navLogout: 'Logga ut',
    navProfile: 'Min Profil',
    navMessages: 'Meddelanden',
    navAdmin: 'Adminportal',
    menuTitle: 'Meny',

    mainMenu: 'Huvudmeny',
    jobAndHousing: 'Jobb & Bostad',
    servicesAndTransport: 'Tjänster & Transport',
    communityAndMeeting: 'Community & Mötesplats',
    information: 'Information',
    buyAccept: 'Köp / Acceptera',
    sellGiveaway: 'Sälj / Bortskänkes',
    exchange: 'Bytes',
    findJob: 'Leta jobb',
    housingWanted: 'Mieszkanie - Sökes',
    housingRent: 'Mieszkanie - Uthyres',
    commercialLocales: 'Lokaler',
    tipsTricks: 'Tips & Guider',
    institutions: 'Institutioner',
    faq: 'Frågor & Svar',
    terms: 'Användarvillkor',
    navigationHeader: 'Navigering',
    currentNow: 'Aktuellt Just Nu',

    createAdBtn: 'Skapa Annons',
    searchPlaceholder: 'Sök jobb, bostäder, tjänster och prylannonser...',
    searchBtn: 'Sök',
    advertiseBtn: 'Lägg reklam',
    contactBtn: 'Frågor? Kontakta oss!',
    loginRegisterBtn: 'Bli medlem / Logga in',

    bazarTitle: 'Bazar - Premium Annonser',
    seeAll: 'Alla »',
    seeWholeBazar: 'Se hela bazaren >>',
    sold: 'SÅLD',
    finished: 'Avslutad',
    auction: 'Budgivning',
    livePolandNews: 'Live från Polen',
    topNews: 'Toppnyheter',
    noNews: 'Inga nyheter...',
    seeMoreNews: 'Visa fler nyheter »',
    swedenMapTitle: 'Sverigekartan',

    supportUsTitle: 'Stöd vårt community!',
    supportUsSubtitle: 'Frivilligt bidrag från 5 kr för utveckling av tjänsten',
    supportUsBtn: 'Stöd oss',
    selectAmount: 'Välj belopp (kr):',
    customAmountPlaceholder: 'ELLER skriv valfritt belopp (min 5 kr)...',
    donateViaStripe: 'Donera via Stripe',
    securePayment: '🔒 Säker kortbetalning via Stripe',

    catJobs: 'Jobb',
    catHousing: 'Bostad',
    catSell: 'Säljes',
    catBuy: 'Köpes',
    catServices: 'Tjänster',
    catMeetingPlace: 'Mötesplats',
    communityFeed: 'Community Flöde - Realtid',

    postPlaceholder: 'Dela något med communityt...',
    postMeetingPlaceholder: 'Skriv ett inlägg för Mötesplats...',
    publishPostBtn: 'Publicera inlägg',
    like: 'Gilla',
    comment: 'Kommentar',
    share: 'Dela',
    report: 'Anmäl',
    edit: 'Redigera',
    delete: 'Ta bort',
    cancel: 'Avbryt',
    save: 'Spara',
    reply: 'Svara',
    sendComment: 'Skicka',
    writeReply: 'Skriv ett svar...',
    edited: '(redigerad)',
    linkCopied: 'Länk kopierad till urklipp!',

    feedGeneral: 'Allmänt',
    feedQuestion: 'Fråga',
    feedTips: 'Tips',
    feedWarning: 'Varning',
    feedHelp: 'Hjälp',
    feedMeetingPlace: '🤝 Mötesplats',

    footerTitle: 'Polacker i Sverige',
    footerDesc: 'Din officiella portal för nyheter, karriär och gemenskap. Vi sammanför det polska communityt i Sverige sedan 2026.',
    footerLinks: 'Länkar',
    newsArchive: 'Nyhetsarkiv',
    rightsReserved: 'Alla rättigheter förbehållna',
    communityTrustQuality: 'Gemenskap • Förtroende • Kvalitet',
  },
  ua: {
    heroTitle: 'Поляки в Швеції',
    heroSubtitle: 'Ваш портал для роботи, житла та спільноти',
    navHome: 'Головна',
    navForum: 'Форум / Базар',
    navNews: 'Новини',
    navEvents: 'Події',
    navMarketplace: 'Маркетплейс',
    navJobs: 'Робота',
    navHousing: 'Житло',
    navServices: 'Послуги',
    navTransport: 'Транспорт',
    navMeetingPlace: 'Зустрічі',
    navInfo: 'Інформація',
    navAbout: 'Про нас',
    navLogin: 'Увійти / Реєстрація',
    navLogout: 'Вийти',
    navProfile: 'Мій Профіль',
    navMessages: 'Повідомлення',
    navAdmin: 'Адмін-панель',
    menuTitle: 'Меню',

    mainMenu: 'Головне Меню',
    jobAndHousing: 'Робота та Житло',
    servicesAndTransport: 'Послуги та Транспорт',
    communityAndMeeting: 'Спільнота та Зустрічі',
    information: 'Інформація',
    buyAccept: 'Куплю / Прийму',
    sellGiveaway: 'Продам / Віддам',
    exchange: 'Обмін',
    findJob: 'Шукаю роботу',
    housingWanted: 'Шукаю житло',
    housingRent: 'Здам житло',
    commercialLocales: 'Приміщення',
    tipsTricks: 'Поради та Посібники',
    institutions: 'Інституції',
    faq: 'Питання та Відповіді',
    terms: 'Умови користування',
    navigationHeader: 'Навігація',
    currentNow: 'Актуально Зараз',

    createAdBtn: 'Створити оголошення',
    searchPlaceholder: 'Шукати роботу, житло, послуги...',
    searchBtn: 'Пошук',
    advertiseBtn: 'Додати рекламу',
    contactBtn: 'Питання? Напишіть нам!',
    loginRegisterBtn: 'Увійти / Реєстрація',

    bazarTitle: 'Базар - Преміум Оголошення',
    seeAll: 'Усі »',
    seeWholeBazar: 'Переглянути весь базар >>',
    sold: 'ПРОДАНО',
    finished: 'Завершено',
    auction: 'Аукціон',
    livePolandNews: 'Наживо з Польщі',
    topNews: 'Головні новини',
    noNews: 'Немає новин...',
    seeMoreNews: 'Дивіться більше новин »',
    swedenMapTitle: 'Карта Швеції',

    supportUsTitle: 'Підтримайте нашу спільноту!',
    supportUsSubtitle: 'Добровільний внесок від 5 kr на розвиток',
    supportUsBtn: 'Підтримати',
    selectAmount: 'Оберіть суму (kr):',
    customAmountPlaceholder: 'АБО введіть власну суму (мін 5 kr)...',
    donateViaStripe: 'Підтримати через Stripe',
    securePayment: '🔒 Безпечна оплата карткою через Stripe',

    catJobs: 'Робота',
    catHousing: 'Житло',
    catSell: 'Продам',
    catBuy: 'Куплю',
    catServices: 'Послуги',
    catMeetingPlace: 'Зустрічі',
    communityFeed: 'Спільнота - Наживо',

    postPlaceholder: 'Поділіться чимось зі спільнотою...',
    postMeetingPlaceholder: 'Напишіть допис для Зустрічей...',
    publishPostBtn: 'Опублікувати',
    like: 'Вподобати',
    comment: 'Коментар',
    share: 'Поділитися',
    report: 'Поскаржитися',
    edit: 'Редагувати',
    delete: 'Видалити',
    cancel: 'Скасувати',
    save: 'Зберегти',
    reply: 'Відповісти',
    sendComment: 'Надіслати',
    writeReply: 'Напишіть відповідь...',
    edited: '(відредаговано)',
    linkCopied: 'Посилання скопійовано!',

    feedGeneral: 'Загальне',
    feedQuestion: 'Питання',
    feedTips: 'Порада',
    feedWarning: 'Попередження',
    feedHelp: 'Допомога',
    feedMeetingPlace: '🤝 Зустрічі',

    footerTitle: 'Поляки в Швеції',
    footerDesc: 'Ваш офіційний портал для новин, кар’єри та спільноти.',
    footerLinks: 'Посилання',
    newsArchive: 'Архів новин',
    rightsReserved: 'Усі права захищені',
    communityTrustQuality: 'Спільнота • Довіра • Якість',
  },
  en: {
    heroTitle: 'Poles in Sweden',
    heroSubtitle: 'Your portal for jobs, housing, and community',
    navHome: 'Home',
    navForum: 'Forum / Marketplace',
    navNews: 'News',
    navEvents: 'Events',
    navMarketplace: 'Marketplace',
    navJobs: 'Jobs',
    navHousing: 'Housing',
    navServices: 'Services',
    navTransport: 'Transport',
    navMeetingPlace: 'Meeting Place',
    navInfo: 'Information',
    navAbout: 'About us',
    navLogin: 'Log In / Register',
    navLogout: 'Log Out',
    navProfile: 'My Profile',
    navMessages: 'Messages',
    navAdmin: 'Admin Portal',
    menuTitle: 'Menu',

    mainMenu: 'Main Menu',
    jobAndHousing: 'Jobs & Housing',
    servicesAndTransport: 'Services & Transport',
    communityAndMeeting: 'Community & Meetings',
    information: 'Information',
    buyAccept: 'Buy / Accept',
    sellGiveaway: 'Sell / Giveaway',
    exchange: 'Exchange',
    findJob: 'Find a job',
    housingWanted: 'Housing - Wanted',
    housingRent: 'Housing - For Rent',
    commercialLocales: 'Commercial Spaces',
    tipsTricks: 'Tips & Guides',
    institutions: 'Institutions',
    faq: 'FAQ',
    terms: 'Terms of Service',
    navigationHeader: 'Navigation',
    currentNow: 'Current Now',

    createAdBtn: 'Post Ad',
    searchPlaceholder: 'Search jobs, housing, services, and ads...',
    searchBtn: 'Search',
    advertiseBtn: 'Advertise',
    contactBtn: 'Questions? Contact us!',
    loginRegisterBtn: 'Sign In / Register',

    bazarTitle: 'Marketplace - Premium Ads',
    seeAll: 'All »',
    seeWholeBazar: 'See whole marketplace >>',
    sold: 'SOLD',
    finished: 'Finished',
    auction: 'Auction',
    livePolandNews: 'Live from Poland',
    topNews: 'Top News',
    noNews: 'No news...',
    seeMoreNews: 'See more news »',
    swedenMapTitle: 'Sweden Map',

    supportUsTitle: 'Support our community!',
    supportUsSubtitle: 'Voluntary donation from 5 SEK to support development',
    supportUsBtn: 'Donate',
    selectAmount: 'Select amount (SEK):',
    customAmountPlaceholder: 'OR enter custom amount (min 5 SEK)...',
    donateViaStripe: 'Donate via Stripe',
    securePayment: '🔒 Secure card payment via Stripe',

    catJobs: 'Jobs',
    catHousing: 'Housing',
    catSell: 'Selling',
    catBuy: 'Buying',
    catServices: 'Services',
    catMeetingPlace: 'Meeting Place',
    communityFeed: 'Community Feed - Live',

    postPlaceholder: 'Share something with the community...',
    postMeetingPlaceholder: 'Write a post for Meeting Place...',
    publishPostBtn: 'Publish Post',
    like: 'Like',
    comment: 'Comment',
    share: 'Share',
    report: 'Report',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    save: 'Save',
    reply: 'Reply',
    sendComment: 'Send',
    writeReply: 'Write a reply...',
    edited: '(edited)',
    linkCopied: 'Link copied to clipboard!',

    feedGeneral: 'General',
    feedQuestion: 'Question',
    feedTips: 'Tip',
    feedWarning: 'Warning',
    feedHelp: 'Help',
    feedMeetingPlace: '🤝 Meeting Place',

    footerTitle: 'Poles in Sweden',
    footerDesc: 'Your official portal for news, jobs, and community in Sweden.',
    footerLinks: 'Links',
    newsArchive: 'News archive',
    rightsReserved: 'All rights reserved',
    communityTrustQuality: 'Community • Trust • Quality',
  }
}

interface LanguageContextType {
  lang: LanguageCode
  setLang: (code: LanguageCode) => void
  t: TranslationDict
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>('pl')

  useEffect(() => {
    // Check localStorage. If no language was saved, DEFAULT to 'pl' (Polish)
    const saved = localStorage.getItem('polasve_lang') as LanguageCode
    if (saved && TRANSLATIONS[saved]) {
      setLangState(saved)
    } else {
      // Always start with PL if no preference stored
      setLangState('pl')
      localStorage.setItem('polasve_lang', 'pl')
    }

    const handleLangChange = () => {
      const updated = localStorage.getItem('polasve_lang') as LanguageCode
      if (updated && TRANSLATIONS[updated]) {
        setLangState(updated)
      }
    }

    window.addEventListener('polasve_lang_changed', handleLangChange)
    return () => window.removeEventListener('polasve_lang_changed', handleLangChange)
  }, [])

  const setLang = (code: LanguageCode) => {
    if (TRANSLATIONS[code]) {
      setLangState(code)
      localStorage.setItem('polasve_lang', code)
      window.dispatchEvent(new Event('polasve_lang_changed'))
    }
  }

  const t = TRANSLATIONS[lang] || TRANSLATIONS.pl

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (!context) {
    // Fallback if component is outside LanguageProvider
    const [fallbackLang, setFallbackLang] = useState<LanguageCode>('pl')

    useEffect(() => {
      const saved = localStorage.getItem('polasve_lang') as LanguageCode
      if (saved && TRANSLATIONS[saved]) {
        setFallbackLang(saved)
      }
    }, [])

    const setLang = (code: LanguageCode) => {
      if (TRANSLATIONS[code]) {
        setFallbackLang(code)
        localStorage.setItem('polasve_lang', code)
        window.dispatchEvent(new Event('polasve_lang_changed'))
      }
    }

    return {
      lang: fallbackLang,
      setLang,
      t: TRANSLATIONS[fallbackLang] || TRANSLATIONS.pl,
    }
  }
  return context
}
