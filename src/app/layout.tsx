import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TennisForecast - Advanced Tennis Analytics & Projections",
    template: "%s | TennisForecast",
  },
  description:
    "Advanced tennis stats, projections, and analytics. Match predictions, tournament simulations, and betting tools powered by data-driven models.",
  keywords: [
    "tennis",
    "projections",
    "analytics",
    "predictions",
    "player ratings",
    "tennis betting",
    "match projections",
    "tournament simulations",
  ],
  openGraph: {
    title: "TennisForecast",
    description: "Advanced Tennis Analytics & Projections",
    url: "https://tennisforecast.net",
    siteName: "TennisForecast",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TennisForecast",
    description: "Advanced Tennis Analytics & Projections",
  },
};

const GA_ID = "G-XR96KL2HCL";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
