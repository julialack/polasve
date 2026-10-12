import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/utils/translations";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  weight: "400",
  variable: "--font-pacifico",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Polasve | Polacker i Sverige - Jobb, Annonser & Community",
    template: "%s | Polasve - Polacker i Sverige",
  },
  description: "Portal och samlingsplats för polacker i Sverige. Hitta jobb, lägenheter, köp & sälj annonser, nyheter från Polen och nätverka i vårt community.",
  keywords: [
    "Polacker i Sverige",
    "Polasve",
    "Jobb i Sverige",
    "Praca w Szwecji",
    "Ogłoszenia Szwecja",
    "Bostad i Sverige",
    "Mieszkania Szwecja",
    "Polska społeczność w Szwecji",
    "Polska w Szwecji",
    "Bazar Szwecja",
    "Marketplace Sverige",
    "Svensk-polska mötesplatsen"
  ],
  authors: [{ name: "Polasve" }],
  creator: "Polasve",
  publisher: "Polasve Portal",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://polasve.se'),
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: "Polasve | Din portal för jobb, annonser & möten i Sverige",
    description: "Samlingsplatsen för polacker i Sverige. Sök jobb, bostäder, köp & sälj prylar samt läs färska nyheter från Polen.",
    url: 'https://polasve.se',
    siteName: 'Polasve',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Polasve - Polacker i Sverige Portal',
      },
    ],
    locale: 'sv_SE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Polasve | Polacker i Sverige",
    description: "Portal för jobb, annonser och nyheter för polacker i Sverige.",
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sv"
      className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1 w-full text-base md:text-lg">
            {children}
          </main>
          <Toaster position="top-center" richColors />
        </LanguageProvider>
      </body>
    </html>
  );
}
