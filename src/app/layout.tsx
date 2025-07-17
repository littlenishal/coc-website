import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UserProvider } from '@auth0/nextjs-auth0/client';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Captains of Commerce Arlington | Northern Virginia Community Support & Events",
  description: "Join Captains of Commerce Arlington for community events, fundraisers, and networking opportunities. Supporting families in need across Arlington County and Northern Virginia.",
  keywords: "Arlington community events, Northern Virginia fundraisers, community support, networking events, Arlington County, Virginia nonprofit",
  authors: [{ name: "Captains of Commerce Arlington" }],
  creator: "Captains of Commerce Arlington",
  publisher: "Captains of Commerce Arlington",
  openGraph: {
    title: "Captains of Commerce Arlington | Community Support & Events",
    description: "Join our community events and support local families in Arlington County and Northern Virginia.",
    type: "website",
    locale: "en_US",
    siteName: "Captains of Commerce Arlington",
  },
  twitter: {
    card: "summary_large_image",
    title: "Captains of Commerce Arlington | Community Support & Events",
    description: "Join our community events and support local families in Arlington County and Northern Virginia.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${geistSans.className} flex min-h-full flex-col antialiased`} suppressHydrationWarning>
        <UserProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}