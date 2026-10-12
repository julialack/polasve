import type { LanguageCode } from "@/utils/translations";

type MenuPageCopy = {
  common: {
    online: string;
    welcome: string;
  };
  news: {
    polandLive: string;
    officialUpdates: string;
    automaticSources: string;
    newsLabel: string;
    linkCopied: string;
  };
  events: {
    upcoming: string;
    empty: string;
  };
  about: {
    section: string;
    heading: string;
    intro: string;
    features: { title: string; description: string }[];
    visitPage: string;
  };
  faq: {
    section: string;
    heading: string;
    questions: { question: string; answer: string }[];
    notFound: string;
    personalHelp: string;
    contact: string;
  };
  terms: {
    section: string;
    heading: string;
    sections: { title: string; text: string }[];
    updated: string;
  };
  directory: {
    heading: string;
    tagline: string;
    title: string;
    intro: string;
    businessList: string;
    register: string;
    verified: string;
    authorities: string;
    schools: string;
    regions: string;
    promoteHeading: string;
    promoteText: string;
    promoteAction: string;
  };
  listings: {
    all: string;
    allAds: string;
    filteredBy: string;
    clear: string;
    noAds: string;
    completed: string;
    viewInfo: string;
    bid: string;
    welcome: string;
    listingPrefix: string;
  };
};

export const MENU_PAGE_COPY: Record<LanguageCode, MenuPageCopy> = {
  pl: {
    common: { online: "online", welcome: "Witamy!" },
    news: {
      polandLive: "Najnowsze wiadomości z Polski (na żywo)",
      officialUpdates: "Oficjalne aktualności",
      automaticSources: "Automatyczne aktualizacje z TVN24, Rzeczpospolitej, Interii, Onetu i Polsat News",
      newsLabel: "Wiadomość",
      linkCopied: "Link skopiowany!",
    },
    events: { upcoming: "Nadchodzące wydarzenia", empty: "Brak nadchodzących wydarzeń." },
    about: {
      section: "Informacje o Polakach w Szwecji",
      heading: "Twoja społeczność, twoja sieć kontaktów",
      intro: "Polasve to miejsce spotkań dla Polaków mieszkających, pracujących lub planujących przeprowadzkę do Szwecji. Łączymy ludzi, firmy i organizacje w bezpiecznej, aktywnej społeczności, w której pomagamy sobie nawzajem.",
      features: [
        { title: "Oferty pracy i rekrutacja", description: "Pracodawcy mogą publikować oferty i znajdować polskich kandydatów. Członkowie mogą szukać pracy, prezentować swój profil i kontaktować się z firmami." },
        { title: "Wydarzenia i spotkania", description: "Odkrywaj lokalne wydarzenia, spotkania kulturalne, warsztaty i spotkania towarzyskie dla Polaków w całej Szwecji." },
        { title: "Praktyczna pomoc na co dzień", description: "Informacje i poradniki dotyczące wszystkiego — od ubezpieczeń po kontakt z urzędami." },
        { title: "Społeczność i wiadomości", description: "Utwórz profil, rozmawiaj z innymi członkami i rozwijaj swoją sieć kontaktów." },
      ],
      visitPage: "Przejdź do strony »",
    },
    faq: {
      section: "Pytania i odpowiedzi",
      heading: "Często zadawane pytania",
      questions: [
        { question: "Jak utworzyć ogłoszenie?", answer: "Kliknij czerwony przycisk dodawania ogłoszenia w menu lub na swoim profilu. Następnie wybierz pakiet i uzupełnij szczegóły." },
        { question: "Czy korzystanie z Polasve jest bezpłatne?", answer: "Tak. Rejestracja i dodanie zwykłego ogłoszenia są bezpłatne. Dostępne są również pakiety premium zwiększające widoczność." },
        { question: "Jak zmienić swoje imię i nazwisko?", answer: "Przejdź do ustawień profilu. Drobne zmiany są wprowadzane od razu, a większe wymagają zatwierdzenia przez administratora." },
        { question: "Co zrobić, jeśli padnę ofiarą oszustwa?", answer: "Skontaktuj się z nami przez formularz wsparcia i zgłoś ogłoszenie. Zalecamy również zgłoszenie sprawy na policję." },
      ],
      notFound: "Nie możesz znaleźć tego, czego szukasz?",
      personalHelp: "Chętnie pomożemy Ci osobiście.",
      contact: "Skontaktuj się z pomocą",
    },
    terms: {
      section: "Warunki korzystania",
      heading: "Warunki korzystania z Polasve",
      sections: [
        { title: "1. Postanowienia ogólne", text: "Witamy w Polasve. Korzystając z naszej platformy, akceptujesz niniejsze warunki. Chcemy tworzyć bezpieczne miejsce spotkań dla polskiej społeczności w Szwecji." },
        { title: "2. Ogłoszenia", text: "Użytkownik odpowiada za prawdziwość treści swoich ogłoszeń oraz ich zgodność z prawem szwedzkim. Zastrzegamy sobie prawo do usuwania treści obraźliwych lub niezgodnych z prawem." },
        { title: "3. Odpowiedzialność", text: "Polasve jest platformą pośredniczącą i nie odpowiada za transakcje między członkami. Podczas kupna i sprzedaży spotykaj się w bezpiecznych miejscach." },
      ],
      updated: "Ostatnia aktualizacja: 24 lipca 2026 r.",
    },
    directory: {
      heading: "Polskie firmy i instytucje",
      tagline: "Polasve — żółte strony",
      title: "Polskie zasoby i firmy w Szwecji",
      intro: "Znajdziesz tu polskie urzędy, szkoły, stowarzyszenia oraz zweryfikowane polskie firmy i fachowców w Szwecji.",
      businessList: "Katalog firm (żółte strony)",
      register: "Zarejestruj swoją firmę",
      verified: "Zweryfikowano",
      authorities: "Urzędy",
      schools: "Instytucje i szkoły",
      regions: "Regiony",
      promoteHeading: "Chcesz się tu zaprezentować?",
      promoteText: "Chcesz dodać firmę lub stowarzyszenie do naszego katalogu? Skontaktuj się z nami w sprawie reklamy.",
      promoteAction: "Zarejestruj firmę",
    },
    listings: {
      all: "Wszystkie",
      allAds: "Bazar / Forum - wszystkie ogłoszenia",
      filteredBy: "Filtrowane według",
      clear: "Wyczyść",
      noAds: "Nie znaleziono ogłoszeń",
      completed: "Zakończone transakcje",
      viewInfo: "Zobacz szczegóły",
      bid: "Oferta",
      welcome: "Witamy!",
      listingPrefix: "Bazar -",
    },
  },
  sv: {
    common: { online: "online", welcome: "Välkommen!" },
    news: {
      polandLive: "Senaste nytt från Polen (realtid)",
      officialUpdates: "Officiella uppdateringar",
      automaticSources: "Automatiskt uppdaterat från TVN24, Rzeczpospolita, Interia, Onet & Polsat News",
      newsLabel: "Nyhet",
      linkCopied: "Länk kopierad!",
    },
    events: { upcoming: "Kommande evenemang", empty: "Inga kommande evenemang." },
    about: {
      section: "Information om polacker i Sverige",
      heading: "Ditt community, ditt nätverk",
      intro: "Polasve är en mötesplats för polacker som bor, arbetar eller planerar att flytta till Sverige. Här möts människor, företag och föreningar i ett tryggt och aktivt community där vi hjälper varandra.",
      features: [
        { title: "Jobbannonser & rekrytering", description: "Arbetsgivare kan lägga upp annonser och hitta polska talanger. Medlemmar kan söka jobb, visa sin profil och komma i kontakt med företag." },
        { title: "Event och möten", description: "Upptäck lokala evenemang, kulturträffar, workshops och sociala möten för polacker runt om i Sverige." },
        { title: "Praktisk hjälp i vardagen", description: "Information och guider om allt från försäkringsärenden till myndighetskontakter." },
        { title: "Community & meddelanden", description: "Skapa din egen profil, chatta med andra medlemmar och bygg ett nätverk." },
      ],
      visitPage: "Gå till sida »",
    },
    faq: {
      section: "Frågor & svar",
      heading: "Vanliga frågor",
      questions: [
        { question: "Hur skapar jag en annons?", answer: "Klicka på den röda knappen för att lägga till en annons i menyn eller på din profil. Välj sedan ett paket och fyll i detaljerna." },
        { question: "Är det gratis att använda Polasve?", answer: "Ja, det är gratis att registrera sig och lägga upp en enkel annons. Vi erbjuder även premiumpaket för ökad synlighet." },
        { question: "Hur ändrar jag mitt namn?", answer: "Gå till inställningar i din profil. Mindre ändringar uppdateras direkt, medan större ändringar behöver godkännas av en administratör." },
        { question: "Vad gör jag om jag blir lurad?", answer: "Kontakta oss via supportformuläret och anmäl annonsen. Vi rekommenderar även att du gör en polisanmälan." },
      ],
      notFound: "Hittar du inte det du söker?",
      personalHelp: "Vi hjälper dig gärna personligen.",
      contact: "Kontakta support",
    },
    terms: {
      section: "Användarvillkor",
      heading: "Villkor för Polasve",
      sections: [
        { title: "1. Allmänt", text: "Välkommen till Polasve. Genom att använda vår plattform godkänner du dessa villkor. Vi strävar efter att skapa en trygg mötesplats för det polska communityt i Sverige." },
        { title: "2. Annonsering", text: "Som användare ansvarar du för att innehållet i dina annonser är korrekt och följer svensk lag. Vi förbehåller oss rätten att ta bort stötande eller olagligt innehåll." },
        { title: "3. Ansvar", text: "Polasve är en förmedlingstjänst. Vi tar inte ansvar för affärer som görs mellan medlemmar. Träffas alltid på säkra platser vid köp och sälj." },
      ],
      updated: "Senast uppdaterad: 24 juli 2026",
    },
    directory: {
      heading: "Polska företag & institutioner",
      tagline: "Polasve Gula Sidorna",
      title: "Polska resurser & företag i Sverige",
      intro: "Här hittar du polska myndigheter, skolor, föreningar samt verifierade polska företag och hantverkare i Sverige.",
      businessList: "Företagskatalog (Gula Sidorna)",
      register: "Registrera ditt företag",
      verified: "Verifierat",
      authorities: "Myndigheter",
      schools: "Institutioner & skolor",
      regions: "Regioner",
      promoteHeading: "Vill du synas här?",
      promoteText: "Vill du registrera ditt företag eller din förening i vår katalog? Kontakta oss för annonsering.",
      promoteAction: "Registrera företag",
    },
    listings: {
      all: "Alla",
      allAds: "Bazar / Forum - alla annonser",
      filteredBy: "Filtrerat på",
      clear: "Rensa",
      noAds: "Inga annonser hittades",
      completed: "Avslutade affärer",
      viewInfo: "Visa info",
      bid: "Bud",
      welcome: "Välkommen!",
      listingPrefix: "Bazar -",
    },
  },
  ua: {
    common: { online: "онлайн", welcome: "Ласкаво просимо!" },
    news: {
      polandLive: "Останні новини з Польщі (наживо)",
      officialUpdates: "Офіційні оновлення",
      automaticSources: "Автоматичні оновлення з TVN24, Rzeczpospolita, Interia, Onet і Polsat News",
      newsLabel: "Новина",
      linkCopied: "Посилання скопійовано!",
    },
    events: { upcoming: "Найближчі події", empty: "Найближчих подій немає." },
    about: {
      section: "Інформація про поляків у Швеції",
      heading: "Ваша спільнота, ваша мережа контактів",
      intro: "Polasve — місце зустрічі для поляків, які живуть, працюють або планують переїхати до Швеції. Тут люди, компанії та організації об'єднуються у безпечній активній спільноті та допомагають одне одному.",
      features: [
        { title: "Вакансії та працевлаштування", description: "Роботодавці можуть публікувати вакансії та знаходити польських фахівців. Учасники можуть шукати роботу, створювати профіль і зв'язуватися з компаніями." },
        { title: "Події та зустрічі", description: "Дізнавайтеся про місцеві події, культурні зустрічі, майстер-класи та спілкування поляків у Швеції." },
        { title: "Практична допомога щодня", description: "Інформація та поради з питань від страхування до взаємодії з державними установами." },
        { title: "Спільнота та повідомлення", description: "Створіть профіль, спілкуйтеся з учасниками та розширюйте коло знайомств." },
      ],
      visitPage: "Перейти на сторінку »",
    },
    faq: {
      section: "Запитання та відповіді",
      heading: "Поширені запитання",
      questions: [
        { question: "Як створити оголошення?", answer: "Натисніть червону кнопку додавання оголошення в меню або профілі. Потім виберіть пакет і заповніть деталі." },
        { question: "Чи безкоштовно користуватися Polasve?", answer: "Так, реєстрація та публікація звичайного оголошення безкоштовні. Також доступні преміумпакети для більшої видимості." },
        { question: "Як змінити ім'я?", answer: "Перейдіть до налаштувань профілю. Невеликі зміни оновлюються відразу, а значні потребують схвалення адміністратора." },
        { question: "Що робити, якщо мене ошукали?", answer: "Зв'яжіться з нами через форму підтримки та повідомте про оголошення. Також рекомендуємо звернутися до поліції." },
      ],
      notFound: "Не знайшли те, що шукали?",
      personalHelp: "Ми радо допоможемо особисто.",
      contact: "Звернутися до підтримки",
    },
    terms: {
      section: "Умови користування",
      heading: "Умови користування Polasve",
      sections: [
        { title: "1. Загальні положення", text: "Вітаємо в Polasve. Користуючись платформою, ви погоджуєтеся з цими умовами. Ми прагнемо створити безпечне місце зустрічей для польської спільноти у Швеції." },
        { title: "2. Оголошення", text: "Користувач відповідає за достовірність оголошень і їх відповідність законодавству Швеції. Ми залишаємо за собою право видаляти образливий або незаконний вміст." },
        { title: "3. Відповідальність", text: "Polasve є посередницькою платформою і не відповідає за угоди між учасниками. Під час купівлі та продажу завжди зустрічайтеся у безпечних місцях." },
      ],
      updated: "Останнє оновлення: 24 липня 2026 р.",
    },
    directory: {
      heading: "Польські компанії та установи",
      tagline: "Polasve — жовті сторінки",
      title: "Польські ресурси та компанії у Швеції",
      intro: "Тут ви знайдете польські установи, школи, об'єднання, а також перевірені польські компанії та майстрів у Швеції.",
      businessList: "Каталог компаній (жовті сторінки)",
      register: "Зареєструвати компанію",
      verified: "Перевірено",
      authorities: "Державні установи",
      schools: "Установи та школи",
      regions: "Регіони",
      promoteHeading: "Хочете розмістити тут інформацію?",
      promoteText: "Бажаєте додати компанію або організацію до нашого каталогу? Зв'яжіться з нами щодо реклами.",
      promoteAction: "Зареєструвати компанію",
    },
    listings: {
      all: "Усі",
      allAds: "Базар / Форум — усі оголошення",
      filteredBy: "Фільтр за",
      clear: "Очистити",
      noAds: "Оголошень не знайдено",
      completed: "Завершені угоди",
      viewInfo: "Переглянути інформацію",
      bid: "Пропозиція",
      welcome: "Ласкаво просимо!",
      listingPrefix: "Базар —",
    },
  },
  en: {
    common: { online: "online", welcome: "Welcome!" },
    news: {
      polandLive: "Latest news from Poland (live)",
      officialUpdates: "Official updates",
      automaticSources: "Automatically updated from TVN24, Rzeczpospolita, Interia, Onet & Polsat News",
      newsLabel: "News",
      linkCopied: "Link copied!",
    },
    events: { upcoming: "Upcoming events", empty: "There are no upcoming events." },
    about: {
      section: "Information about Poles in Sweden",
      heading: "Your community, your network",
      intro: "Polasve is a meeting place for Poles who live, work, or plan to move to Sweden. People, businesses, and organizations come together in a safe, active community where we help one another.",
      features: [
        { title: "Job listings & recruitment", description: "Employers can post listings and find Polish talent. Members can search for jobs, showcase their profile, and connect with companies." },
        { title: "Events and meetups", description: "Discover local events, cultural gatherings, workshops, and social meetups for Poles across Sweden." },
        { title: "Practical everyday help", description: "Information and guides on everything from insurance matters to contacting authorities." },
        { title: "Community & messaging", description: "Create a profile, chat with other members, and build your network." },
      ],
      visitPage: "Visit page »",
    },
    faq: {
      section: "Questions & answers",
      heading: "Frequently asked questions",
      questions: [
        { question: "How do I create a listing?", answer: "Click the red add-listing button in the menu or on your profile. Then choose a package and fill in the details." },
        { question: "Is Polasve free to use?", answer: "Yes, registration and posting a basic listing are free. Premium packages are also available for increased visibility." },
        { question: "How do I change my name?", answer: "Go to Settings in your profile. Small changes are updated immediately; larger changes need administrator approval." },
        { question: "What should I do if I am scammed?", answer: "Contact us through the support form and report the listing. We also recommend filing a police report." },
      ],
      notFound: "Can't find what you're looking for?",
      personalHelp: "We are happy to help you personally.",
      contact: "Contact support",
    },
    terms: {
      section: "Terms of use",
      heading: "Terms and conditions for Polasve",
      sections: [
        { title: "1. General", text: "Welcome to Polasve. By using our platform, you agree to these terms. We aim to create a safe meeting place for the Polish community in Sweden." },
        { title: "2. Listings", text: "Users are responsible for ensuring their listings are accurate and comply with Swedish law. We reserve the right to remove offensive or unlawful content." },
        { title: "3. Liability", text: "Polasve is an intermediary service and is not responsible for transactions between members. Always meet in safe places when buying or selling." },
      ],
      updated: "Last updated: 24 July 2026",
    },
    directory: {
      heading: "Polish businesses & institutions",
      tagline: "Polasve Yellow Pages",
      title: "Polish resources & businesses in Sweden",
      intro: "Find Polish authorities, schools, associations, and verified Polish businesses and tradespeople in Sweden.",
      businessList: "Business directory (Yellow Pages)",
      register: "Register your business",
      verified: "Verified",
      authorities: "Authorities",
      schools: "Institutions & schools",
      regions: "Regions",
      promoteHeading: "Would you like to be featured here?",
      promoteText: "Would you like to add your business or association to our directory? Contact us about advertising.",
      promoteAction: "Register a business",
    },
    listings: {
      all: "All",
      allAds: "Marketplace / Forum - all listings",
      filteredBy: "Filtered by",
      clear: "Clear",
      noAds: "No listings found",
      completed: "Completed transactions",
      viewInfo: "View details",
      bid: "Offer",
      welcome: "Welcome!",
      listingPrefix: "Marketplace -",
    },
  },
};

export function getMenuPageCopy(lang: LanguageCode): MenuPageCopy {
  return MENU_PAGE_COPY[lang];
}
