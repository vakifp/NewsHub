import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.krymoz.com"),
  title: {
    default: "Krymoz – Premier AI Research, Tech Strategy & Global Tech Trends",
    template: "%s | Krymoz Editorial",
  },
  description: "Krymoz is a leading digital publication dedicated to high-impact AI research, future-tech strategy, and deep-dive editorial guides for the modern innovator.",
  keywords: [
    "AI research 2026", 
    "generative AI strategy", 
    "advanced tech trends", 
    "digital sovereignty", 
    "future of machine learning", 
    "Krymoz editorial",
    "technical troubleshooting guides"
  ],
  authors: [{ name: "Krymoz Editorial Board" }],
  openGraph: {
    title: "Krymoz – Premier AI Research & Future Tech Strategy",
    description: "Deep-dive analysis into the architecture of tomorrow's intelligence.",
    url: "https://www.krymoz.com",
    siteName: "Krymoz",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krymoz – High-Impact AI Research & Tech Trends",
    description: "Deep-dive analysis into the architecture of tomorrow's intelligence.",
    creator: "@krymoz_editorial",
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
  icons: {
    icon: "/favicon.png",
    apple: "/logo.png",
  },
  verification: {
    google: "OTqEIe9DJQdn36STFcbkvaFI3QmTPOU2RGQ7vfiOMew",
  },
};

import BottomNav from "@/components/BottomNav";
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-blue-500/30 pb-24 md:pb-0`}>
        <StoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <BottomNav />
          </ThemeProvider>
        </StoreProvider>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5290024709923218"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}