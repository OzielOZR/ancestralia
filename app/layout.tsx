import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Lato } from "next/font/google";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ancestralia — Seu Mapa Numerológico Pessoal",
  description:
    "Descubra os segredos que os números guardam sobre sua alma. Leitura numerológica pitagórica e cabalística personalizada com mais de 20 anos de experiência.",
  keywords: [
    "numerologia",
    "numerologia pitagórica",
    "numerologia cabalística",
    "mapa numerológico",
    "leitura numerológica",
    "destino",
    "alma",
    "espiritualidade",
  ],
  openGraph: {
    title: "Ancestralia — Seu Mapa Numerológico Pessoal",
    description:
      "Descubra os segredos que os números guardam sobre sua alma. Leitura profunda e personalizada.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0812",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${cormorantGaramond.variable} ${lato.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
