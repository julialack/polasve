import type { LanguageCode } from "@/utils/translations";

type CategoryLandingCopy = {
  title: string;
  description: string;
};

const CATEGORY_COPY: Record<string, Record<LanguageCode, CategoryLandingCopy>> = {
  "Leta jobb": {
    pl: { title: "Szukam pracy", description: "Znajdź swoją kolejną możliwość zawodową w Szwecji." },
    sv: { title: "Leta jobb", description: "Hitta din nästa karriärmöjlighet i Sverige." },
    ua: { title: "Пошук роботи", description: "Знайдіть свою наступну кар'єрну можливість у Швеції." },
    en: { title: "Find a job", description: "Find your next career opportunity in Sweden." },
  },
  "Jobb & Bostad": {
    pl: { title: "Praca i mieszkania", description: "Znajdź pracę, mieszkanie lub lokal w jednym miejscu." },
    sv: { title: "Jobb & Bostad", description: "Hitta jobb, lägenheter och lokaler på ett ställe." },
    ua: { title: "Робота та житло", description: "Знайдіть роботу, житло та приміщення в одному місці." },
    en: { title: "Jobs & Housing", description: "Find jobs, homes, and business premises in one place." },
  },
  "Bostad - Sökes": {
    pl: { title: "Szukam mieszkania", description: "Członkowie społeczności poszukujący mieszkania." },
    sv: { title: "Bostad - Sökes", description: "Medlemmar som letar efter ett hem." },
    ua: { title: "Шукаю житло", description: "Учасники спільноти, які шукають житло." },
    en: { title: "Housing wanted", description: "Community members looking for a home." },
  },
  "Bostad - Hyra ut": {
    pl: { title: "Mieszkania do wynajęcia", description: "Dostępne mieszkania i pokoje do wynajęcia." },
    sv: { title: "Bostad - Hyra ut", description: "Lediga hem och rum för uthyrning." },
    ua: { title: "Житло в оренду", description: "Вільне житло та кімнати в оренду." },
    en: { title: "Housing for rent", description: "Available homes and rooms for rent." },
  },
  Lokaler: {
    pl: { title: "Lokale", description: "Biura, magazyny i lokale handlowe." },
    sv: { title: "Lokaler", description: "Kontor, lager och affärslokaler." },
    ua: { title: "Приміщення", description: "Офіси, склади та торгові приміщення." },
    en: { title: "Premises", description: "Offices, warehouses, and commercial premises." },
  },
  "Köp / Acceptera": {
    pl: { title: "Kupię / Przyjmę", description: "Znajdź to, czego szukasz w naszej społeczności." },
    sv: { title: "Köp / Acceptera", description: "Hitta det du letar efter i vårt community." },
    ua: { title: "Куплю / Прийму", description: "Знайдіть те, що шукаєте, у нашій спільноті." },
    en: { title: "Wanted / Free items", description: "Find what you are looking for in our community." },
  },
  "Sälj / Bortskänkes": {
    pl: { title: "Sprzedam / Oddam", description: "Przedmioty sprzedawane lub oddawane przez członków społeczności." },
    sv: { title: "Sälj / Bortskänkes", description: "Saker som ges bort eller säljs av medlemmar." },
    ua: { title: "Продам / Віддам", description: "Речі, які учасники спільноти продають або віддають." },
    en: { title: "For sale / Free", description: "Items offered for sale or for free by community members." },
  },
  Bytes: {
    pl: { title: "Wymiana", description: "Wymieniaj przedmioty i usługi z innymi." },
    sv: { title: "Bytes", description: "Byt prylar och tjänster med andra." },
    ua: { title: "Обмін", description: "Обмінюйтеся речами та послугами з іншими." },
    en: { title: "Exchange", description: "Trade items and services with others." },
  },
  Tjänster: {
    pl: { title: "Usługi", description: "Profesjonalna pomoc i usługi na co dzień." },
    sv: { title: "Tjänster", description: "Proffshjälp och tjänster i vardagen." },
    ua: { title: "Послуги", description: "Професійна допомога та послуги на кожен день." },
    en: { title: "Services", description: "Professional help and everyday services." },
  },
  Transport: {
    pl: { title: "Transport", description: "Przeprowadzki, przewóz towarów i logistyka." },
    sv: { title: "Transport", description: "Flytthjälp, frakt och logistik." },
    ua: { title: "Транспорт", description: "Допомога з переїздом, перевезення вантажів і логістика." },
    en: { title: "Transport", description: "Moving assistance, freight, and logistics." },
  },
  "Meeting Place": {
    pl: { title: "Miejsce spotkań", description: "Nawiązuj kontakty, spotykaj się i poznawaj nowych ludzi w Szwecji." },
    sv: { title: "Mötesplats", description: "Nätverk, sociala möten och nya kontakter i Sverige." },
    ua: { title: "Місце зустрічей", description: "Знайомтеся, спілкуйтеся та знаходьте нові контакти у Швеції." },
    en: { title: "Meeting Place", description: "Connect, meet, and make new friends in Sweden." },
  },
  Marketplace: {
    pl: { title: "Bazar", description: "Wszystko, co jest kupowane, sprzedawane i wymieniane w społeczności." },
    sv: { title: "Marketplace", description: "Allt som köps, säljs och bytes i communityt." },
    ua: { title: "Маркетплейс", description: "Усе, що купують, продають і обмінюють у спільноті." },
    en: { title: "Marketplace", description: "Everything bought, sold, and exchanged in the community." },
  },
  "Community Hub": {
    pl: { title: "Centrum społeczności", description: "Porady, wskazówki i miejsca spotkań dla członków." },
    sv: { title: "Community Hub", description: "Tips, trick och mötesplatser för medlemmar." },
    ua: { title: "Центр спільноти", description: "Поради, підказки та місця зустрічей для учасників." },
    en: { title: "Community Hub", description: "Tips, advice, and meeting places for members." },
  },
  "Tips & Trick": {
    pl: { title: "Porady i wskazówki", description: "Praktyczne wskazówki dotyczące życia w Szwecji." },
    sv: { title: "Tips & Trick", description: "Smarta råd för livet i Sverige." },
    ua: { title: "Поради та підказки", description: "Корисні поради для життя у Швеції." },
    en: { title: "Tips & Tricks", description: "Practical advice for life in Sweden." },
  },
};

const CATEGORY_LABELS: Record<LanguageCode, Record<string, string>> = {
  pl: {
    "Köp / Acceptera": "Kupię / Przyjmę",
    "Sälj / Bortskänkes": "Sprzedam / Oddam",
    Bytes: "Wymiana",
    "Leta jobb": "Szukam pracy",
    Jobb: "Praca",
    Sökes: "Szukam",
    Hyra: "Do wynajęcia",
    Lokaler: "Lokale",
    Bostad: "Mieszkania",
    Tjänster: "Usługi",
    Transport: "Transport",
    Marketplace: "Bazar",
    "Tips & Trick": "Porady i wskazówki",
    "Meeting Place": "Miejsce spotkań",
    Övrigt: "Pozostałe",
  },
  sv: {},
  ua: {
    "Köp / Acceptera": "Куплю / Прийму",
    "Sälj / Bortskänkes": "Продам / Віддам",
    Bytes: "Обмін",
    "Leta jobb": "Пошук роботи",
    Jobb: "Робота",
    Sökes: "Шукаю",
    Hyra: "Оренда",
    Lokaler: "Приміщення",
    Bostad: "Житло",
    Tjänster: "Послуги",
    Transport: "Транспорт",
    Marketplace: "Маркетплейс",
    "Tips & Trick": "Поради та підказки",
    "Meeting Place": "Місце зустрічей",
    Övrigt: "Інше",
  },
  en: {
    "Köp / Acceptera": "Wanted / Free items",
    "Sälj / Bortskänkes": "For sale / Free",
    Bytes: "Exchange",
    "Leta jobb": "Find a job",
    Jobb: "Jobs",
    Sökes: "Wanted",
    Hyra: "For rent",
    Lokaler: "Premises",
    Bostad: "Housing",
    Tjänster: "Services",
    Transport: "Transport",
    Marketplace: "Marketplace",
    "Tips & Trick": "Tips & Tricks",
    "Meeting Place": "Meeting Place",
    Övrigt: "Other",
  },
};

export function translateCategoryLabel(lang: LanguageCode, category: string): string {
  return CATEGORY_LABELS[lang][category] ?? category;
}

export function getCategoryLandingCopy(
  lang: LanguageCode,
  originalTitle: string,
  fallback: CategoryLandingCopy,
): CategoryLandingCopy {
  return CATEGORY_COPY[originalTitle]?.[lang] ?? fallback;
}

export const CATEGORY_LANDING_UI: Record<LanguageCode, {
  housingPrompt: string;
  generalPrompt: string;
  housingPremium: string;
  generalPremium: string;
  startHere: string;
  currentAds: string;
  region: string;
  clear: string;
  noAds: string;
  edited: string;
  bid: string;
  viewInfo: string;
  completed: string;
  sold: string;
  communityDiscussion: string;
  discussPrefix: string;
}> = {
  pl: {
    housingPrompt: "Szukasz mieszkania?",
    generalPrompt: "Chcesz być na górze listy?",
    housingPremium: "Dodaj ogłoszenie Premium, aby dotrzeć do większej liczby osób.",
    generalPremium: "Dodaj ogłoszenie Premium i wyświetlaj się jako pierwsza/y.",
    startHere: "Zacznij tutaj",
    currentAds: "Aktualne ogłoszenia",
    region: "Region",
    clear: "Wyczyść",
    noAds: "Brak ogłoszeń w tej kategorii.",
    edited: "(edytowano)",
    bid: "Oferta",
    viewInfo: "Zobacz szczegóły",
    completed: "Zakończone",
    sold: "SPRZEDANE",
    communityDiscussion: "Dyskusja społeczności",
    discussPrefix: "Porozmawiaj o",
  },
  sv: {
    housingPrompt: "Leta eller sök lägenhet?",
    generalPrompt: "Vill du synas längst upp?",
    housingPremium: "Lägg en Premium-annons för att nå fler.",
    generalPremium: "Lägg en Premium-annons och hamna först.",
    startHere: "Börja här",
    currentAds: "Aktuella annonser",
    region: "Region",
    clear: "Rensa",
    noAds: "Inga annonser i denna kategori ännu.",
    edited: "(redigerad)",
    bid: "Bud",
    viewInfo: "Visa info",
    completed: "Avslutade",
    sold: "SÅLD",
    communityDiscussion: "Community-diskussion",
    discussPrefix: "Prata fritt om",
  },
  ua: {
    housingPrompt: "Шукаєте житло?",
    generalPrompt: "Бажаєте бути на початку списку?",
    housingPremium: "Розмістіть Premium-оголошення, щоб охопити більше людей.",
    generalPremium: "Розмістіть Premium-оголошення та будьте першими.",
    startHere: "Почати тут",
    currentAds: "Актуальні оголошення",
    region: "Регіон",
    clear: "Очистити",
    noAds: "У цій категорії поки немає оголошень.",
    edited: "(відредаговано)",
    bid: "Пропозиція",
    viewInfo: "Переглянути інформацію",
    completed: "Завершені",
    sold: "ПРОДАНО",
    communityDiscussion: "Обговорення спільноти",
    discussPrefix: "Обговорюйте тему:",
  },
  en: {
    housingPrompt: "Looking for a home?",
    generalPrompt: "Would you like to appear at the top?",
    housingPremium: "Place a Premium ad to reach more people.",
    generalPremium: "Place a Premium ad and appear first.",
    startHere: "Start here",
    currentAds: "Current listings",
    region: "Region",
    clear: "Clear",
    noAds: "There are no listings in this category yet.",
    edited: "(edited)",
    bid: "Offer",
    viewInfo: "View details",
    completed: "Completed",
    sold: "SOLD",
    communityDiscussion: "Community discussion",
    discussPrefix: "Discuss",
  },
};
