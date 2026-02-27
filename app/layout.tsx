import type { Metadata } from "next";
import { Inter, Playfair_Display, DM_Mono } from 'next/font/google'
import "./globals.css";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const dmMono = DM_Mono({
  subsets: ['latin'], variable: '--font-mono',
  weight: "300"
})


export const metadata: Metadata = {
  title: 'ATELIER — Horological Excellence',
  description: 'Configure your perfect timepiece',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body
        className={`${inter.variable} ${playfair.variable} ${dmMono.variable} bg-black text-white antialiased overflow-x-hidden`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
