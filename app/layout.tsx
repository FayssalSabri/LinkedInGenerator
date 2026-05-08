import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Impalia Forge | LinkedIn Content Generator',
  description: 'Générez des posts LinkedIn impactants avec l\'IA stratégique d\'Impalia.',
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth overflow-x-hidden`}>
      <body className="font-sans text-slate-900 overflow-x-hidden bg-[#F9FAFB]">
        {children}
      </body>
    </html>
  );
}

