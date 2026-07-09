import type { Metadata } from "next";
import { Inter, Lora, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
});

const SITE_URL = "https://trendledgers.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Trend Ledgers — Market News, Trends & What's-Next Analysis",
    template: "%s | Trend Ledgers",
  },
  description:
    "Trend Ledgers is a market & finance journal covering the latest news, trends and what's-next analysis across markets, business, lifestyle and sport.",
  applicationName: "Trend Ledgers",
  keywords: [
    "market trends",
    "business news",
    "finance",
    "market analysis",
    "trending stories",
    "markets",
    "what's next",
    "stock market",
    "economy",
  ],
  authors: [{ name: "Trend Ledgers" }],
  creator: "Trend Ledgers",
  publisher: "Trend Ledgers",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Trend Ledgers",
    url: SITE_URL,
    locale: "en_US",
    title: "Trend Ledgers — Market News, Trends & What's-Next Analysis",
    description:
      "A market & finance journal covering the latest news, trends and what's-next analysis across markets, business, lifestyle and sport.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Trend Ledgers — Market news, trends & what's-next analysis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trend Ledgers — Market News, Trends & What's-Next Analysis",
    description:
      "A market & finance journal covering the latest news, trends and what's-next analysis across markets, business, lifestyle and sport.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
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
      lang="en"
      className={`${inter.variable} ${lora.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header>
          <Header />
          <Navbar />
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
