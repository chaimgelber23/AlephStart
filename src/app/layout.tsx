import type { Metadata, Viewport } from "next";
import { Inter, Noto_Serif_Hebrew, Noto_Sans_Hebrew, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const notoSerifHebrew = Noto_Serif_Hebrew({
  variable: "--font-hebrew-serif",
  subsets: ["hebrew"],
  weight: ["400", "700"],
});

const notoSansHebrew = Noto_Sans_Hebrew({
  variable: "--font-hebrew-sans",
  subsets: ["hebrew"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AlephStart — Learn to Read Hebrew",
  description:
    "Learn to read Hebrew and daven with confidence. From the Aleph-Bet to the Siddur — at your own pace, with warmth and encouragement.",
  keywords: ["Hebrew", "learn Hebrew", "daven", "siddur", "Jewish", "prayer", "aleph-bet", "kiruv"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: 'var(--primary)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${inter.variable}
          ${playfair.variable}
          ${notoSerifHebrew.variable}
          ${notoSansHebrew.variable}
          font-sans antialiased bg-[#FAF9F6] text-foreground min-h-screen
        `}
      >
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
