import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PlantAlly - Cuide da sua Selva Urbana",
    template: "%s | PlantAlly"
  },
  description: "O assistente inteligente de cuidados com plantas que rastreia horários de rega, necessidades de luz solar e progresso do crescimento.",
  icons: {
    icon: "/plantally-logo.png",
    apple: "/plantally-logo.png",
  },
  manifest: "/manifest.json",
  keywords: ["plantas", "cuidados com plantas", "rega", "jardinagem", "assistente de plantas"],
  authors: [{ name: "PlantAlly Team" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://plantally.com",
    title: "PlantAlly - Cuide da sua Selva Urbana",
    description: "Nunca mais mate uma suculenta. Acompanhe a rega e a saúde das suas plantas.",
    siteName: "PlantAlly",
    images: ["/plantally-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
