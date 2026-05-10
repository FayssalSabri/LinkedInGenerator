import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Forge Studio | Générateur de Contenus LinkedIn',
  description: 'Générez des publications LinkedIn percutantes avec l\'IA stratégique de Forge Studio. Posts optimisés, note d\'intention, copie en un clic.',
  icons: {
    icon: '/logo.svg',
  },
  openGraph: {
    title: 'Forge Studio — LinkedIn Content Generator',
    description: 'Générateur de publications LinkedIn propulsé par IA.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth overflow-x-hidden`}>
      <body className="font-sans text-slate-900 overflow-x-hidden bg-[var(--color-bg)]">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
