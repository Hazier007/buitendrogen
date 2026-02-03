import type { Metadata } from "next";
import CookieBanner from "./components/CookieBanner";
import LegalBar from "./components/LegalBar";
import Analytics from "./components/Analytics";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import FloatingShare from "./components/FloatingShare";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"],
});
export const metadata: Metadata = { title: "Buiten Drogen Calculator | Bereken de droogtijd van je was", description: "Bereken hoe lang je was nodig heeft om buiten te drogen. Gratis tool die rekening houdt met temperatuur, luchtvochtigheid, wind en bewolking.", keywords: "buiten drogen, was drogen, droogtijd berekenen, wasgoed drogen, was buiten, droogweer, wasdroger alternatief", openGraph: { title: "Buiten Drogen Calculator | Buitendrogen.be", description: "Bereken hoe lang je was nodig heeft om buiten te drogen op basis van het actuele weer.", type: "website", locale: "nl_BE", },
};
export default function RootLayout({ children,
}: Readonly<{ children: React.ReactNode }>) { return ( <html lang="nl"> {" "} <head> {" "} <meta name="google-adsense-account" content="ca-pub-1772283634325864" />{" "} <Analytics gaId="G-G9KPQS152Y" />{" "} </head>{" "} <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} > {" "} {children} <CookieBanner /> <LegalBar /> <FloatingShare />{" "} </body>{" "} </html> );
} 
