import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    template: "%s | RENTABLE",
    default: "RENTABLE | Rent what you need. When you need it.",
  },
  description: "A premium product rental marketplace connecting product owners with borrowers. Rent bikes, cameras, electronics, and more.",
  openGraph: {
    title: "RENTABLE | Rent what you need. When you need it.",
    description: "A premium product rental marketplace connecting product owners with borrowers.",
    url: "https://rentable.example.com",
    siteName: "RENTABLE",
    images: [
      {
        url: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "RENTABLE Premium Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RENTABLE | Premium Product Rentals",
    description: "A premium product rental marketplace.",
    images: ["https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1200&q=80"],
  },
};

import { StoreProvider } from "@/components/providers/StoreProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { RealtimeProvider } from "@/lib/providers/RealtimeProvider";
import { Toaster } from "react-hot-toast";

import { MobileNav } from "@/components/layout/MobileNav";
import { ExtensionSuppressor } from "@/components/layout/ExtensionSuppressor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col relative pb-16 md:pb-0">
        <ExtensionSuppressor />
        <StoreProvider>
          <QueryProvider>
            <AuthProvider>
              <RealtimeProvider>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <MobileNav />
                <Toaster position="top-right" />
              </RealtimeProvider>
            </AuthProvider>
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
